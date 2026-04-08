import React from "react";
import { computeLineTotal, type CartItem, type RankedCombo } from "@/lib/kiosk/combo-stats";
import { formatPrice, type OrderType } from "@/lib/kiosk/menu-data";

type CartPanelProps = {
  cartItems: CartItem[];
  total: number;
  orderType: OrderType | null;
  topCombo?: RankedCombo;
  ctaLabel: string;
  onCtaClick: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  disabled?: boolean;
};

export function CartPanel({
  cartItems,
  total,
  orderType,
  topCombo,
  ctaLabel,
  onCtaClick,
  onChangeQuantity,
  onRemoveItem,
  disabled = false,
}: CartPanelProps) {
  return (
    <aside className="cart-panel">
      <div className="cart-panel-head">
        <div>
          <span className="section-label section-label-light">Cart</span>
          <h2>장바구니</h2>
        </div>
        {orderType ? (
          <span className="order-mode-pill">
            {orderType === "dine-in" ? "매장 식사" : "포장"}
          </span>
        ) : null}
      </div>

      <div className="cart-lines">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <article className="cart-line-card" key={item.id}>
              <div className="cart-line-head">
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    수량 {item.quantity}
                    {item.toppings.length > 0
                      ? ` · ${item.toppings.map((topping) => topping.name).join(", ")}`
                      : ""}
                  </p>
                </div>
                <span>{formatPrice(computeLineTotal(item))}</span>
              </div>

              <div className="cart-line-actions">
                <div className="quantity-stepper quantity-stepper-light">
                  <button onClick={() => onChangeQuantity(item.id, -1)} type="button">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onChangeQuantity(item.id, 1)} type="button">
                    +
                  </button>
                </div>
                <button className="cart-remove-button" onClick={() => onRemoveItem(item.id)} type="button">
                  삭제
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="cart-empty">
            <strong>아직 담긴 메뉴가 없습니다</strong>
            <p>메뉴 카드에서 담기를 누르면 이곳에 주문 내역이 쌓입니다.</p>
          </div>
        )}
      </div>

      {topCombo ? (
        <section className="cart-highlight">
          <span className="section-label section-label-light">추천</span>
          <strong>{topCombo.toppings.map((topping) => topping.name).join(" + ")}</strong>
          <p>{topCombo.count}명이 선택한 현재 1위 조합</p>
        </section>
      ) : null}

      <div className="cart-total-block">
        <span>총 결제 금액</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <button className="primary-button primary-button-dark" disabled={disabled} onClick={onCtaClick} type="button">
        {ctaLabel}
      </button>
    </aside>
  );
}
