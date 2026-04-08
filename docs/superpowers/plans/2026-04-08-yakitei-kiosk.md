# Yakitei Kiosk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current lunch recommendation homepage with a demo web kiosk for `야키테이` that supports dine-in/takeout, cart-based ordering, topping customization, and real-time popular topping combo recommendations.

**Architecture:** Build a single client-driven kiosk flow rendered from `src/app/page.tsx`, with data definitions and combo-ranking logic extracted into focused modules under `src/lib/kiosk`. Keep the UI split into presentational components under `src/components/kiosk`, and persist combo statistics in `localStorage` with a serverless fallback to in-memory defaults.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS in `src/app/globals.css`, Node test runner for pure logic tests

---

## File Map

- Create: `src/lib/kiosk/menu-data.ts`
  - Static menu, topping, seeded combo, and label data
- Create: `src/lib/kiosk/combo-stats.ts`
  - Combo normalization, ranking, checkout update, and total helpers
- Create: `src/lib/kiosk/combo-stats.test.ts`
  - Node tests for combo normalization and checkout updates
- Create: `src/components/kiosk/kiosk-app.tsx`
  - Main client-side kiosk state machine and screen transitions
- Create: `src/components/kiosk/start-screen.tsx`
  - Dine-in / takeout landing screen
- Create: `src/components/kiosk/menu-screen.tsx`
  - Main menu and drink selection screen
- Create: `src/components/kiosk/options-screen.tsx`
  - Topping picker and real-time combo recommendation screen
- Create: `src/components/kiosk/cart-screen.tsx`
  - Cart review, quantity controls, totals, and checkout
- Create: `src/components/kiosk/complete-screen.tsx`
  - Demo order completion screen
- Create: `src/components/kiosk/cart-panel.tsx`
  - Shared cart summary panel
- Modify: `src/app/page.tsx`
  - Replace existing lunch hero with kiosk entry
- Modify: `src/app/globals.css`
  - Replace current lunch-picker styles with kiosk styles and responsive layout
- Modify: `src/app/layout.tsx`
  - Update metadata title and description for Yakitei kiosk demo
- Modify: `package.json`
  - Add a `test` script that runs Node’s built-in test runner

## Task 1: Add kiosk data and combo logic with tests

**Files:**
- Create: `src/lib/kiosk/menu-data.ts`
- Create: `src/lib/kiosk/combo-stats.ts`
- Test: `src/lib/kiosk/combo-stats.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing tests for combo normalization and ranking**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildComboKey,
  computeCartTotal,
  createSeedComboStats,
  rankComboStats,
  updateComboStatsFromCart,
} from "@/lib/kiosk/combo-stats";
import { yakiteiToppings } from "@/lib/kiosk/menu-data";

test("buildComboKey sorts topping ids so order does not matter", () => {
  assert.equal(
    buildComboKey(["cheese", "squid-shrimp"]),
    buildComboKey(["squid-shrimp", "cheese"]),
  );
});

test("rankComboStats returns the most selected combinations first", () => {
  const ranked = rankComboStats({
    "extra-noodles|fried-egg": {
      key: "extra-noodles|fried-egg",
      toppingIds: ["extra-noodles", "fried-egg"],
      count: 3,
    },
    "cheese|vienna": {
      key: "cheese|vienna",
      toppingIds: ["cheese", "vienna"],
      count: 8,
    },
  });

  assert.deepEqual(ranked.map((entry) => entry.key), [
    "cheese|vienna",
    "extra-noodles|fried-egg",
  ]);
});

test("updateComboStatsFromCart increments counts for yakisoba items only", () => {
  const stats = createSeedComboStats();
  const updated = updateComboStatsFromCart(stats, [
    {
      id: "line-1",
      type: "main",
      menuId: "salt-yakisoba",
      name: "소금 야끼소바",
      quantity: 2,
      basePrice: 11000,
      toppings: [yakiteiToppings[0], yakiteiToppings[3]],
    },
    {
      id: "line-2",
      type: "drink",
      menuId: "highball",
      name: "하이볼",
      quantity: 1,
      basePrice: 7000,
      toppings: [],
    },
  ]);

  const key = buildComboKey(["fried-egg", "squid-shrimp"]);
  assert.equal(updated[key]?.count, stats[key].count + 2);
});

test("computeCartTotal sums quantity, base price, and toppings", () => {
  const total = computeCartTotal([
    {
      id: "line-1",
      type: "main",
      menuId: "teriyaki-yakisoba",
      name: "기본 야끼소바",
      quantity: 2,
      basePrice: 11000,
      toppings: [yakiteiToppings[2], yakiteiToppings[4]],
    },
  ]);

  assert.equal(total, 26000);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/kiosk/combo-stats.test.ts`  
Expected: FAIL because `src/lib/kiosk/combo-stats.ts` and `src/lib/kiosk/menu-data.ts` do not exist yet.

- [ ] **Step 3: Add kiosk menu data and combo helpers**

```ts
// src/lib/kiosk/menu-data.ts
export type MenuCategory = "main" | "drink";

export type Topping = {
  id: string;
  name: string;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
};

export const yakiteiMenu: MenuItem[] = [
  {
    id: "teriyaki-yakisoba",
    name: "기본 야끼소바 (데리야끼)",
    category: "main",
    price: 11000,
    description: "달콤짭짤한 데리야끼 소스로 마무리한 기본 메뉴",
  },
  {
    id: "salt-yakisoba",
    name: "소금 야끼소바",
    category: "main",
    price: 11000,
    description: "담백한 소금 베이스로 철판 향을 살린 메뉴",
  },
  {
    id: "cola",
    name: "콜라",
    category: "drink",
    price: 2000,
    description: "시원한 탄산 음료",
  },
  {
    id: "cider",
    name: "사이다",
    category: "drink",
    price: 2000,
    description: "깔끔한 탄산 음료",
  },
  {
    id: "draft-beer",
    name: "생맥주",
    category: "drink",
    price: 5000,
    description: "야끼소바와 잘 어울리는 생맥주",
  },
  {
    id: "highball",
    name: "하이볼",
    category: "drink",
    price: 7000,
    description: "가볍게 즐기는 하이볼",
  },
];

export const yakiteiToppings: Topping[] = [
  { id: "squid-shrimp", name: "오징어새우", price: 1500 },
  { id: "vienna", name: "비엔나", price: 1500 },
  { id: "extra-noodles", name: "면 추가", price: 1000 },
  { id: "fried-egg", name: "계란 프라이 추가", price: 1000 },
  { id: "cheese", name: "치즈 추가", price: 1000 },
];

export const seededCombos = [
  ["squid-shrimp", "fried-egg"],
  ["cheese", "vienna"],
  ["extra-noodles", "fried-egg"],
] as const;
```

```ts
// src/lib/kiosk/combo-stats.ts
import { seededCombos, yakiteiToppings, type Topping } from "@/lib/kiosk/menu-data";

export type CartItem = {
  id: string;
  type: "main" | "drink";
  menuId: string;
  name: string;
  quantity: number;
  basePrice: number;
  toppings: Topping[];
};

export type ComboStat = {
  key: string;
  toppingIds: string[];
  count: number;
};

export type ComboStatMap = Record<string, ComboStat>;

export function buildComboKey(toppingIds: string[]) {
  return [...toppingIds].sort().join("|");
}

export function createSeedComboStats(): ComboStatMap {
  return seededCombos.reduce<ComboStatMap>((acc, combo, index) => {
    const key = buildComboKey([...combo]);
    acc[key] = {
      key,
      toppingIds: [...combo].sort(),
      count: 12 - index * 4,
    };
    return acc;
  }, {});
}

export function updateComboStatsFromCart(
  currentStats: ComboStatMap,
  cartItems: CartItem[],
) {
  const next = { ...currentStats };

  for (const item of cartItems) {
    if (item.type !== "main" || item.toppings.length === 0) {
      continue;
    }

    const key = buildComboKey(item.toppings.map((topping) => topping.id));
    const existing = next[key];

    next[key] = {
      key,
      toppingIds: key.split("|"),
      count: (existing?.count ?? 0) + item.quantity,
    };
  }

  return next;
}

export function rankComboStats(stats: ComboStatMap) {
  const toppingsById = new Map(yakiteiToppings.map((topping) => [topping.id, topping]));

  return Object.values(stats)
    .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key))
    .map((entry) => ({
      ...entry,
      toppings: entry.toppingIds
        .map((id) => toppingsById.get(id))
        .filter((value): value is Topping => Boolean(value)),
    }));
}

export function computeCartTotal(cartItems: CartItem[]) {
  return cartItems.reduce((sum, item) => {
    const toppingTotal = item.toppings.reduce((line, topping) => line + topping.price, 0);
    return sum + (item.basePrice + toppingTotal) * item.quantity;
  }, 0);
}
```

- [ ] **Step 4: Add the Node test script**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "test": "node --import tsx --test"
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- src/lib/kiosk/combo-stats.test.ts`  
Expected: PASS with 4 passing tests.

- [ ] **Step 6: Verification checkpoint**

Run: `npm test -- src/lib/kiosk/combo-stats.test.ts`  
Expected: PASS again before moving to UI work.

## Task 2: Build the kiosk state container and landing/menu screens

**Files:**
- Create: `src/components/kiosk/kiosk-app.tsx`
- Create: `src/components/kiosk/start-screen.tsx`
- Create: `src/components/kiosk/menu-screen.tsx`
- Create: `src/components/kiosk/cart-panel.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write the failing render test for the app shell**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { KioskApp } from "@/components/kiosk/kiosk-app";

test("KioskApp renders the Yakitei start screen heading", () => {
  const html = renderToStaticMarkup(<KioskApp />);
  assert.match(html, /야키테이/);
  assert.match(html, /매장 식사/);
  assert.match(html, /포장/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/kiosk/kiosk-app.test.tsx`  
Expected: FAIL because `KioskApp` does not exist yet.

- [ ] **Step 3: Add the kiosk state container and start/menu screens**

```tsx
// src/components/kiosk/kiosk-app.tsx
"use client";

import { useEffect, useState } from "react";
import { yakiteiMenu } from "@/lib/kiosk/menu-data";
import {
  computeCartTotal,
  createSeedComboStats,
  rankComboStats,
  type CartItem,
  type ComboStatMap,
} from "@/lib/kiosk/combo-stats";
import { StartScreen } from "@/components/kiosk/start-screen";
import { MenuScreen } from "@/components/kiosk/menu-screen";

export function KioskApp() {
  const [step, setStep] = useState<"start" | "menu">("start");
  const [orderType, setOrderType] = useState<"dine-in" | "takeout" | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [comboStats, setComboStats] = useState<ComboStatMap>(createSeedComboStats());

  useEffect(() => {
    const saved = window.localStorage.getItem("yakitei-combo-stats");
    if (!saved) return;
    setComboStats(JSON.parse(saved) as ComboStatMap);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("yakitei-combo-stats", JSON.stringify(comboStats));
  }, [comboStats]);

  if (step === "start") {
    return (
      <StartScreen
        onSelect={(nextType) => {
          setOrderType(nextType);
          setStep("menu");
        }}
        recommendations={rankComboStats(comboStats).slice(0, 3)}
      />
    );
  }

  return (
    <MenuScreen
      cartItems={cartItems}
      drinks={yakiteiMenu.filter((item) => item.category === "drink")}
      mains={yakiteiMenu.filter((item) => item.category === "main")}
      onAddDrink={(drink) => {
        setCartItems((items) => [
          ...items,
          {
            id: crypto.randomUUID(),
            type: "drink",
            menuId: drink.id,
            name: drink.name,
            quantity: 1,
            basePrice: drink.price,
            toppings: [],
          },
        ]);
      }}
      onChooseMain={() => {}}
      orderType={orderType}
      total={computeCartTotal(cartItems)}
    />
  );
}
```

- [ ] **Step 4: Replace the homepage entry and metadata**

```tsx
// src/app/page.tsx
import { KioskApp } from "@/components/kiosk/kiosk-app";

export default function HomePage() {
  return <KioskApp />;
}
```

```ts
// src/app/layout.tsx metadata
export const metadata = {
  title: "야키테이 키오스크",
  description: "야키테이 야끼소바 매장을 위한 시연용 주문 키오스크",
};
```

- [ ] **Step 5: Run the render test**

Run: `npm test -- src/components/kiosk/kiosk-app.test.tsx`  
Expected: PASS with the Yakitei landing copy present.

- [ ] **Step 6: Run a build checkpoint**

Run: `npm run build`  
Expected: PASS or surface the next missing screen/component types to complete in Task 3.

## Task 3: Complete options, cart, checkout, and recommendation interactions

**Files:**
- Modify: `src/components/kiosk/kiosk-app.tsx`
- Create: `src/components/kiosk/options-screen.tsx`
- Create: `src/components/kiosk/cart-screen.tsx`
- Create: `src/components/kiosk/complete-screen.tsx`
- Create: `src/components/kiosk/cart-panel.tsx`

- [ ] **Step 1: Write the failing test for checkout updating recommendation counts**

```ts
test("checkout updates ranked combinations after a configured yakisoba order", () => {
  const stats = createSeedComboStats();
  const updated = updateComboStatsFromCart(stats, [
    {
      id: "line-1",
      type: "main",
      menuId: "salt-yakisoba",
      name: "소금 야끼소바",
      quantity: 1,
      basePrice: 11000,
      toppings: [yakiteiToppings[0], yakiteiToppings[3]],
    },
  ]);

  const ranked = rankComboStats(updated);
  assert.equal(ranked[0].key, buildComboKey(["squid-shrimp", "fried-egg"]));
  assert.match(ranked[0].toppings.map((topping) => topping.name).join(", "), /오징어새우/);
});
```

- [ ] **Step 2: Run the combo test file to verify the new test fails if needed**

Run: `npm test -- src/lib/kiosk/combo-stats.test.ts`  
Expected: FAIL if the ranking output shape does not yet include display toppings.

- [ ] **Step 3: Expand the kiosk app to handle all screens**

```tsx
// screen states in KioskApp
const [step, setStep] = useState<"start" | "menu" | "options" | "cart" | "complete">("start");
const [draftItem, setDraftItem] = useState<CartItem | null>(null);

function handleChooseMain(menuId: string) {
  const menu = yakiteiMenu.find((item) => item.id === menuId);
  if (!menu) return;

  setDraftItem({
    id: crypto.randomUUID(),
    type: "main",
    menuId: menu.id,
    name: menu.name,
    quantity: 1,
    basePrice: menu.price,
    toppings: [],
  });
  setStep("options");
}

function handleCheckout() {
  setComboStats((current) => updateComboStatsFromCart(current, cartItems));
  setCartItems([]);
  setDraftItem(null);
  setStep("complete");
}
```

- [ ] **Step 4: Add the missing screen components**

```tsx
// options-screen responsibilities
// - show selected menu
// - show topping cards
// - show top 3 ranked combo cards
// - apply combo on click
// - add configured item to cart

// cart-screen responsibilities
// - render all cart lines
// - change quantity
// - remove item
// - move to checkout

// complete-screen responsibilities
// - show completion message
// - show restart button
// - keep updated rankings for next order
```

- [ ] **Step 5: Run targeted tests and build verification**

Run: `npm test -- src/lib/kiosk/combo-stats.test.ts`  
Expected: PASS

Run: `npm run build`  
Expected: PASS with all kiosk screens wired.

- [ ] **Step 6: Manual flow verification**

Run: `npm run dev`  
Manually verify:
- `매장 식사` and `포장` both move into menu flow
- 메인 메뉴 선택 후 옵션 화면으로 이동
- 추천 조합 한 번에 적용 가능
- 토핑 개별 수정 가능
- 장바구니 총액이 정상 계산됨
- 결제 후 완료 화면과 추천 순위가 갱신됨

## Task 4: Replace styles with kiosk visual system

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing build checkpoint for style integration**

Run: `npm run build`  
Expected: FAIL or render incorrectly until kiosk-specific class names exist in the stylesheet.

- [ ] **Step 2: Replace the current global styles with Yakitei kiosk styles**

```css
:root {
  color-scheme: light;
  --yak-bg: #FFF8F0;
  --yak-accent: #C08552;
  --yak-accent-strong: #8C5A3C;
  --yak-ink: #4B2E2B;
  --yak-line: rgba(140, 90, 60, 0.18);
  --yak-panel: rgba(255, 248, 240, 0.92);
  --yak-shadow: 0 24px 60px rgba(75, 46, 43, 0.12);
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(192, 133, 82, 0.18), transparent 24%),
    linear-gradient(180deg, #fff8f0 0%, #f6ece1 100%);
  color: var(--yak-ink);
}

.kiosk-shell {
  width: min(1480px, calc(100% - 40px));
  margin: 24px auto;
}

.kiosk-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 400px;
  gap: 24px;
}

.combo-card-featured {
  background: var(--yak-ink);
  color: var(--yak-bg);
}

.cart-panel {
  position: sticky;
  top: 24px;
}

@media (max-width: 900px) {
  .kiosk-grid {
    grid-template-columns: 1fr;
  }

  .cart-panel {
    position: static;
  }
}
```

- [ ] **Step 3: Verify the app builds with the new class names**

Run: `npm run build`  
Expected: PASS

- [ ] **Step 4: Final full verification**

Run: `npm test -- src/lib/kiosk/combo-stats.test.ts`  
Expected: PASS

Run: `npm run build`  
Expected: PASS

## Self-Review

- Spec coverage check:
  - Dine-in/takeout flow: Task 2 and Task 3
  - Cart-based ordering: Task 2 and Task 3
  - Menu, toppings, drinks: Task 1 and Task 3
  - Real-time combo recommendation and local persistence: Task 1 and Task 3
  - Visual palette and kiosk layout: Task 4
- Placeholder scan:
  - No `TODO`, `TBD`, or “implement later” markers remain
  - One intentionally brief screen-responsibility section in Task 3 still maps to concrete component creation and verification
- Type consistency:
  - `CartItem`, `ComboStatMap`, and topping IDs are defined once in Task 1 and reused consistently

## Execution Notes

- No `.git` directory is present in this workspace, so commit steps are replaced with verification checkpoints.
- If `npm test -- src/components/kiosk/kiosk-app.test.tsx` cannot run JSX with the Node test runner, switch the render test to a `.ts` file and test pure helpers only, then keep `npm run build` as the UI verification gate.
