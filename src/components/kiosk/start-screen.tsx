import React from "react";
import type { RankedCombo } from "@/lib/kiosk/combo-stats";
import type { OrderType } from "@/lib/kiosk/menu-data";

type StartScreenProps = {
  onSelect: (orderType: OrderType) => void;
  recommendations: RankedCombo[];
};

const orderTypeOptions: Array<{ id: OrderType; title: string; description: string }> = [
  {
    id: "dine-in",
    title: "매장 식사",
    description: "철판에서 바로 올라온 야끼소바를 따뜻하게 즐겨보세요.",
  },
  {
    id: "takeout",
    title: "포장",
    description: "빠르게 픽업하고 싶은 손님을 위한 주문 방식입니다.",
  },
];

export function StartScreen({ onSelect, recommendations }: StartScreenProps) {
  return (
    <section className="screen-card screen-card-hero">
      <div className="hero-copy-block">
        <span className="section-label">Yakitei Demo Kiosk</span>
        <h1>야키테이</h1>
        <p className="hero-description">
          철판 위에서 볶아낸 야끼소바와 인기 토핑 조합을 한 번에 고르는 시연용 키오스크입니다.
        </p>
      </div>

      <div className="order-type-grid">
        {orderTypeOptions.map((option) => (
          <button
            className="order-type-card"
            key={option.id}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            <span className="order-type-badge">{option.id === "dine-in" ? "DINE IN" : "TAKE OUT"}</span>
            <strong>{option.title}</strong>
            <p>{option.description}</p>
          </button>
        ))}
      </div>

      <section className="hero-recommend-strip">
        <div>
          <span className="section-label">실시간 인기 토핑 조합</span>
          <h2>많이 선택한 조합부터 바로 추천합니다</h2>
        </div>
        <div className="hero-recommend-list">
          {recommendations.map((combo, index) => (
            <article className="hero-recommend-card" key={combo.key}>
              <span className="hero-rank">TOP {index + 1}</span>
              <strong>{combo.toppings.map((topping) => topping.name).join(" + ")}</strong>
              <p>{combo.count}명이 선택했어요</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
