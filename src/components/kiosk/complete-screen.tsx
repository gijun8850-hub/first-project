import React from "react";
import type { CartItem, RankedCombo } from "@/lib/kiosk/combo-stats";
import { formatPrice, type OrderType } from "@/lib/kiosk/menu-data";

type CompleteScreenProps = {
  orderType: OrderType;
  completedOrder: CartItem[];
  total: number;
  recommendations: RankedCombo[];
  onRestart: () => void;
};

export function CompleteScreen({
  orderType,
  completedOrder,
  total,
  recommendations,
  onRestart,
}: CompleteScreenProps) {
  return (
    <section className="screen-card screen-card-complete">
      <div className="complete-hero">
        <span className="section-label">Order Complete</span>
        <h1>주문이 접수되었습니다</h1>
        <p className="screen-description">
          {orderType === "dine-in" ? "매장 식사" : "포장"} 주문으로 저장되었고, 방금 선택한 토핑 조합이 추천 랭킹에 반영되었습니다.
        </p>
      </div>

      <div className="complete-layout">
        <section className="complete-card">
          <span className="section-label">주문 요약</span>
          {completedOrder.map((item) => (
            <article className="complete-line" key={item.id}>
              <strong>{item.name}</strong>
              <p>
                수량 {item.quantity}
                {item.toppings.length > 0 ? ` · ${item.toppings.map((topping) => topping.name).join(", ")}` : ""}
              </p>
            </article>
          ))}
          <div className="complete-total">
            <span>총 결제 금액</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </section>

        <section className="complete-card">
          <span className="section-label">업데이트된 추천 순위</span>
          {recommendations.slice(0, 3).map((combo, index) => (
            <article className="complete-line" key={combo.key}>
              <strong>
                TOP {index + 1} · {combo.toppings.map((topping) => topping.name).join(" + ")}
              </strong>
              <p>{combo.count}명이 선택했어요</p>
            </article>
          ))}
          <button className="primary-button" onClick={onRestart} type="button">
            처음으로 돌아가기
          </button>
        </section>
      </div>
    </section>
  );
}
