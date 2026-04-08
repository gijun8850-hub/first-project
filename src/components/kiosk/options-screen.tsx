import React from "react";
import { CartPanel } from "@/components/kiosk/cart-panel";
import type { CartItem, RankedCombo } from "@/lib/kiosk/combo-stats";
import { formatPrice, type OrderType, type Topping } from "@/lib/kiosk/menu-data";

type OptionsScreenProps = {
  draftItem: CartItem;
  orderType: OrderType;
  toppings: Topping[];
  cartItems: CartItem[];
  total: number;
  recommendations: RankedCombo[];
  onBack: () => void;
  onToggleTopping: (topping: Topping) => void;
  onApplyRecommendation: (combo: RankedCombo) => void;
  onAddToCart: () => void;
  onViewCart: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
};

export function OptionsScreen({
  draftItem,
  orderType,
  toppings,
  cartItems,
  total,
  recommendations,
  onBack,
  onToggleTopping,
  onApplyRecommendation,
  onAddToCart,
  onViewCart,
  onChangeQuantity,
  onRemoveItem,
}: OptionsScreenProps) {
  const selectedIds = new Set(draftItem.toppings.map((topping) => topping.id));

  return (
    <div className="kiosk-grid">
      <section className="screen-card">
        <div className="screen-head">
          <div>
            <span className="section-label">Step 2</span>
            <h1>토핑을 고르고 인기 조합을 빠르게 적용하세요</h1>
            <p className="screen-description">
              선택한 메뉴는 <strong>{draftItem.name}</strong>입니다. 추천 조합을 먼저 담고 세부 토핑은 다시 수정할 수 있습니다.
            </p>
          </div>
          <button className="back-button" onClick={onBack} type="button">
            메뉴로 돌아가기
          </button>
        </div>

        <section className="content-section">
          <div className="section-header-inline">
            <div>
              <span className="section-label">실시간 인기 토핑 조합</span>
              <h2>많이 주문한 조합을 한 번에 적용</h2>
            </div>
          </div>

          <div className="combo-grid">
            {recommendations.map((combo, index) => (
              <button
                className={`combo-card ${index === 0 ? "combo-card-featured" : ""}`}
                key={combo.key}
                onClick={() => onApplyRecommendation(combo)}
                type="button"
              >
                <span className="combo-rank">TOP {index + 1}</span>
                <strong>{combo.toppings.map((topping) => topping.name).join(" + ")}</strong>
                <p>{combo.count}명이 선택했어요</p>
                <span className="combo-action">이 조합 바로 적용</span>
              </button>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-header-inline">
            <div>
              <span className="section-label">토핑 선택</span>
              <h2>원하는 조합으로 직접 커스터마이징</h2>
            </div>
          </div>

          <div className="topping-grid">
            {toppings.map((topping) => {
              const selected = selectedIds.has(topping.id);

              return (
                <button
                  className={`topping-card ${selected ? "topping-card-selected" : ""}`}
                  key={topping.id}
                  onClick={() => onToggleTopping(topping)}
                  type="button"
                >
                  <strong>{topping.name}</strong>
                  <span>{formatPrice(topping.price)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="draft-summary">
          <div>
            <span className="section-label">현재 선택</span>
            <strong>
              {draftItem.toppings.length > 0
                ? draftItem.toppings.map((topping) => topping.name).join(", ")
                : "토핑 없음"}
            </strong>
          </div>
          <button className="primary-button" onClick={onAddToCart} type="button">
            선택한 토핑으로 장바구니 담기
          </button>
        </section>
      </section>

      <CartPanel
        cartItems={cartItems}
        ctaLabel={cartItems.length > 0 ? "장바구니 확인" : "메뉴 선택 중"}
        disabled={cartItems.length === 0}
        onChangeQuantity={onChangeQuantity}
        onCtaClick={onViewCart}
        onRemoveItem={onRemoveItem}
        orderType={orderType}
        topCombo={recommendations[0]}
        total={total}
      />
    </div>
  );
}
