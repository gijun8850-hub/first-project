import React from "react";
import { computeLineTotal, type CartItem, type RankedCombo } from "@/lib/kiosk/combo-stats";
import { formatPrice, type OrderType } from "@/lib/kiosk/menu-data";

type CartScreenProps = {
  cartItems: CartItem[];
  total: number;
  orderType: OrderType;
  recommendations: RankedCombo[];
  onBackToMenu: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
};

export function CartScreen({
  cartItems,
  total,
  orderType,
  recommendations,
  onBackToMenu,
  onChangeQuantity,
  onRemoveItem,
  onCheckout,
}: CartScreenProps) {
  return (
    <section className="screen-card">
      <div className="screen-head">
        <div>
          <span className="section-label">Step 3</span>
          <h1>주문 내역을 확인하고 결제를 진행하세요</h1>
          <p className="screen-description">
            {orderType === "dine-in" ? "매장 식사" : "포장"} 주문입니다. 여기서 수량을 올리거나 줄이고, 삭제도 따로 할 수 있습니다.
          </p>
        </div>
        <button className="back-button" onClick={onBackToMenu} type="button">
          메뉴 더 담기
        </button>
      </div>

      <div className="cart-review-layout">
        <div className="cart-review-list">
          {cartItems.map((item) => (
            <article className="cart-review-card" key={item.id}>
              <div className="cart-review-head">
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.toppings.length > 0
                      ? item.toppings.map((topping) => topping.name).join(", ")
                      : "옵션 없음"}
                  </p>
                </div>
                <span>{formatPrice(computeLineTotal(item))}</span>
              </div>
              <div className="cart-review-actions">
                <div className="quantity-stepper">
                  <button onClick={() => onChangeQuantity(item.id, -1)} type="button">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onChangeQuantity(item.id, 1)} type="button">
                    +
                  </button>
                </div>
                <button className="text-button" onClick={() => onRemoveItem(item.id)} type="button">
                  삭제
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="checkout-panel">
          <div className="checkout-summary">
            <span className="section-label">결제 정보</span>
            <strong>{formatPrice(total)}</strong>
            <p>결제 완료 후 인기 토핑 조합 순위가 바로 갱신됩니다.</p>
          </div>

          <div className="checkout-ranking">
            <span className="section-label">현재 인기 조합</span>
            {recommendations.slice(0, 3).map((combo, index) => (
              <div className="checkout-ranking-row" key={combo.key}>
                <span>TOP {index + 1}</span>
                <strong>{combo.toppings.map((topping) => topping.name).join(" + ")}</strong>
              </div>
            ))}
          </div>

          <button
            className="primary-button primary-button-dark"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
            type="button"
          >
            결제하기
          </button>
        </aside>
      </div>
    </section>
  );
}
