import React from "react";
import { CartPanel } from "@/components/kiosk/cart-panel";
import type { CartItem, RankedCombo } from "@/lib/kiosk/combo-stats";
import { formatPrice, type MenuItem, type OrderType } from "@/lib/kiosk/menu-data";

type MenuScreenProps = {
  orderType: OrderType;
  mains: MenuItem[];
  drinks: MenuItem[];
  cartItems: CartItem[];
  total: number;
  topCombo?: RankedCombo;
  onChooseMain: (item: MenuItem) => void;
  onAddDrink: (item: MenuItem) => void;
  onViewCart: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
};

function getCartCountForMenu(cartItems: CartItem[], menuId: string) {
  return cartItems
    .filter((item) => item.menuId === menuId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

function getSingleDrinkLine(cartItems: CartItem[], menuId: string) {
  return cartItems.find((item) => item.menuId === menuId && item.type === "drink");
}

export function MenuScreen({
  orderType,
  mains,
  drinks,
  cartItems,
  total,
  topCombo,
  onChooseMain,
  onAddDrink,
  onViewCart,
  onChangeQuantity,
  onRemoveItem,
}: MenuScreenProps) {
  return (
    <div className="kiosk-grid">
      <section className="screen-card photo-menu-board">
        <div className="screen-head">
          <div>
            <span className="section-label">Step 1</span>
            <h1>사진으로 보고 바로 주문하세요</h1>
            <p className="screen-description">
              메인 야끼소바는 사진을 누르고 토핑을 고른 뒤 담습니다. 음료는 메뉴판에서 바로 추가할 수 있습니다.
            </p>
          </div>
          <span className="order-mode-chip">
            {orderType === "dine-in" ? "매장 식사" : "포장"}
          </span>
        </div>

        <section className="content-section">
          <div className="section-header-inline">
            <div>
              <span className="section-label">메인 메뉴</span>
              <h2>야끼소바</h2>
            </div>
          </div>

          <div className="photo-card-grid photo-card-grid-main">
            {mains.map((item) => {
              const count = getCartCountForMenu(cartItems, item.id);

              return (
                <article className="photo-menu-card photo-menu-card-main" key={item.id}>
                  <div className="photo-menu-image-wrap">
                    <img alt={item.name} className="photo-menu-image" src={item.imageSrc} />
                    <div className="photo-menu-overlay">
                      <span className="photo-menu-badge">대표 메뉴</span>
                      {count > 0 ? <span className="photo-menu-count">장바구니 {count}개</span> : null}
                    </div>
                  </div>
                  <div className="photo-menu-body">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </div>
                    <div className="photo-menu-footer">
                      <span>{formatPrice(item.price)}</span>
                      <button className="primary-button" onClick={() => onChooseMain(item)} type="button">
                        토핑 고르고 담기
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="content-section">
          <div className="section-header-inline">
            <div>
              <span className="section-label">추가 주문</span>
              <h2>음료</h2>
            </div>
          </div>

          <div className="photo-card-grid photo-card-grid-drinks">
            {drinks.map((item) => {
              const drinkLine = getSingleDrinkLine(cartItems, item.id);

              return (
                <article className="photo-menu-card photo-menu-card-drink" key={item.id}>
                  <div className="photo-menu-image-wrap photo-menu-image-wrap-square">
                    <img alt={item.name} className="photo-menu-image" src={item.imageSrc} />
                  </div>
                  <div className="photo-menu-body">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </div>
                    <div className="photo-menu-footer photo-menu-footer-drink">
                      <span>{formatPrice(item.price)}</span>
                      {drinkLine ? (
                        <div className="menu-inline-actions">
                          <div className="quantity-stepper">
                            <button onClick={() => onChangeQuantity(drinkLine.id, -1)} type="button">
                              -
                            </button>
                            <span>{drinkLine.quantity}</span>
                            <button onClick={() => onChangeQuantity(drinkLine.id, 1)} type="button">
                              +
                            </button>
                          </div>
                          <button className="text-button" onClick={() => onRemoveItem(drinkLine.id)} type="button">
                            삭제
                          </button>
                        </div>
                      ) : (
                        <button className="secondary-button" onClick={() => onAddDrink(item)} type="button">
                          담기
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>

      <CartPanel
        cartItems={cartItems}
        ctaLabel={cartItems.length > 0 ? "장바구니 확인" : "메뉴를 먼저 담아주세요"}
        disabled={cartItems.length === 0}
        onChangeQuantity={onChangeQuantity}
        onCtaClick={onViewCart}
        onRemoveItem={onRemoveItem}
        orderType={orderType}
        topCombo={topCombo}
        total={total}
      />
    </div>
  );
}
