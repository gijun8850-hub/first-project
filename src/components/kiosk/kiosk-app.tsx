"use client";

import React from "react";
import { useEffect, useState } from "react";
import { CartScreen } from "@/components/kiosk/cart-screen";
import { CompleteScreen } from "@/components/kiosk/complete-screen";
import { MenuScreen } from "@/components/kiosk/menu-screen";
import { OptionsScreen } from "@/components/kiosk/options-screen";
import { StartScreen } from "@/components/kiosk/start-screen";
import {
  buildComboKey,
  changeCartItemQuantity,
  computeCartTotal,
  createSeedComboStats,
  rankComboStats,
  removeCartItem,
  updateComboStatsFromCart,
  type CartItem,
  type ComboStatMap,
  type RankedCombo,
} from "@/lib/kiosk/combo-stats";
import {
  yakiteiMenu,
  yakiteiToppings,
  type MenuItem,
  type OrderType,
  type Topping,
} from "@/lib/kiosk/menu-data";

type Step = "start" | "menu" | "options" | "cart" | "complete";

const COMBO_STORAGE_KEY = "yakitei-combo-stats";

function createCartItemFromMenu(item: MenuItem): CartItem {
  return {
    id: crypto.randomUUID(),
    type: item.category,
    menuId: item.id,
    name: item.name,
    quantity: 1,
    basePrice: item.price,
    toppings: [],
  };
}

function sameToppings(left: Topping[], right: Topping[]) {
  return (
    buildComboKey(left.map((topping) => topping.id)) ===
    buildComboKey(right.map((topping) => topping.id))
  );
}

function mergeCartItem(existingItems: CartItem[], nextItem: CartItem) {
  const matchIndex = existingItems.findIndex((item) => {
    if (item.type !== nextItem.type || item.menuId !== nextItem.menuId) {
      return false;
    }

    if (item.type === "drink") {
      return true;
    }

    return sameToppings(item.toppings, nextItem.toppings);
  });

  if (matchIndex === -1) {
    return [...existingItems, nextItem];
  }

  return existingItems.map((item, index) =>
    index === matchIndex ? { ...item, quantity: item.quantity + nextItem.quantity } : item,
  );
}

function readComboStatsFromStorage() {
  if (typeof window === "undefined") {
    return createSeedComboStats();
  }

  try {
    const savedValue = window.localStorage.getItem(COMBO_STORAGE_KEY);

    if (!savedValue) {
      return createSeedComboStats();
    }

    return JSON.parse(savedValue) as ComboStatMap;
  } catch {
    return createSeedComboStats();
  }
}

export function KioskApp() {
  const [step, setStep] = useState<Step>("start");
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [draftItem, setDraftItem] = useState<CartItem | null>(null);
  const [comboStats, setComboStats] = useState<ComboStatMap>(createSeedComboStats());
  const [completedOrder, setCompletedOrder] = useState<CartItem[]>([]);
  const [completedOrderType, setCompletedOrderType] = useState<OrderType | null>(null);
  const [completedTotal, setCompletedTotal] = useState(0);

  useEffect(() => {
    setComboStats(readComboStatsFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify(comboStats));
    } catch {
      // localStorage unavailable, keep demo working in memory
    }
  }, [comboStats]);

  const mains = yakiteiMenu.filter((item) => item.category === "main");
  const drinks = yakiteiMenu.filter((item) => item.category === "drink");
  const recommendations = rankComboStats(comboStats);
  const total = computeCartTotal(cartItems);

  function handleSelectOrderType(nextOrderType: OrderType) {
    setOrderType(nextOrderType);
    setCartItems([]);
    setDraftItem(null);
    setCompletedOrder([]);
    setCompletedOrderType(null);
    setCompletedTotal(0);
    setStep("menu");
  }

  function handleChooseMain(item: MenuItem) {
    setDraftItem(createCartItemFromMenu(item));
    setStep("options");
  }

  function handleAddDrink(item: MenuItem) {
    setCartItems((currentItems) => mergeCartItem(currentItems, createCartItemFromMenu(item)));
  }

  function handleToggleTopping(topping: Topping) {
    setDraftItem((current) => {
      if (!current) {
        return current;
      }

      const exists = current.toppings.some((entry) => entry.id === topping.id);

      return {
        ...current,
        toppings: exists
          ? current.toppings.filter((entry) => entry.id !== topping.id)
          : [...current.toppings, topping],
      };
    });
  }

  function handleApplyRecommendation(combo: RankedCombo) {
    setDraftItem((current) => (current ? { ...current, toppings: combo.toppings } : current));
  }

  function handleAddDraftToCart() {
    if (!draftItem) {
      return;
    }

    setCartItems((currentItems) => mergeCartItem(currentItems, draftItem));
    setDraftItem(null);
    setStep("cart");
  }

  function handleChangeQuantity(id: string, delta: number) {
    setCartItems((currentItems) => changeCartItemQuantity(currentItems, id, delta));
  }

  function handleDeleteItem(id: string) {
    setCartItems((currentItems) => removeCartItem(currentItems, id));
  }

  function handleCheckout() {
    if (!orderType || cartItems.length === 0) {
      return;
    }

    setCompletedOrder(cartItems);
    setCompletedOrderType(orderType);
    setCompletedTotal(total);
    setComboStats((currentStats) => updateComboStatsFromCart(currentStats, cartItems));
    setCartItems([]);
    setDraftItem(null);
    setStep("complete");
  }

  function handleRestart() {
    setStep("start");
    setOrderType(null);
    setCartItems([]);
    setDraftItem(null);
    setCompletedOrder([]);
    setCompletedOrderType(null);
    setCompletedTotal(0);
  }

  const activeStepIndex =
    step === "options" ? 1 : step === "cart" || step === "complete" ? 2 : 0;

  return (
    <main className="kiosk-shell">
      <header className="kiosk-topbar">
        <div>
          <span className="section-label">Teppan Yakisoba Kiosk</span>
          <strong>야키테이</strong>
        </div>
        <div aria-label="주문 단계" className="step-pills">
          {["주문", "옵션", "결제"].map((label, index) => (
            <span
              className={`step-pill ${index === activeStepIndex ? "step-pill-active" : ""}`}
              key={label}
            >
              {index + 1} {label}
            </span>
          ))}
        </div>
      </header>

      {step === "start" ? (
        <StartScreen
          onSelect={handleSelectOrderType}
          recommendations={recommendations.slice(0, 3)}
        />
      ) : null}

      {step === "menu" && orderType ? (
        <MenuScreen
          cartItems={cartItems}
          drinks={drinks}
          mains={mains}
          onAddDrink={handleAddDrink}
          onChangeQuantity={handleChangeQuantity}
          onChooseMain={handleChooseMain}
          onRemoveItem={handleDeleteItem}
          onViewCart={() => setStep("cart")}
          orderType={orderType}
          topCombo={recommendations[0]}
          total={total}
        />
      ) : null}

      {step === "options" && orderType && draftItem ? (
        <OptionsScreen
          cartItems={cartItems}
          draftItem={draftItem}
          onAddToCart={handleAddDraftToCart}
          onApplyRecommendation={handleApplyRecommendation}
          onBack={() => setStep("menu")}
          onChangeQuantity={handleChangeQuantity}
          onRemoveItem={handleDeleteItem}
          onToggleTopping={handleToggleTopping}
          onViewCart={() => setStep("cart")}
          orderType={orderType}
          recommendations={recommendations.slice(0, 3)}
          toppings={yakiteiToppings}
          total={total}
        />
      ) : null}

      {step === "cart" && orderType ? (
        <CartScreen
          cartItems={cartItems}
          onBackToMenu={() => setStep("menu")}
          onChangeQuantity={handleChangeQuantity}
          onCheckout={handleCheckout}
          onRemoveItem={handleDeleteItem}
          orderType={orderType}
          recommendations={recommendations}
          total={total}
        />
      ) : null}

      {step === "complete" && completedOrderType ? (
        <CompleteScreen
          completedOrder={completedOrder}
          onRestart={handleRestart}
          orderType={completedOrderType}
          recommendations={recommendations}
          total={completedTotal}
        />
      ) : null}
    </main>
  );
}
