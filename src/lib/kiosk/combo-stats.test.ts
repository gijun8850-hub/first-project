import assert from "node:assert/strict";
import test from "node:test";
import {
  buildComboKey,
  changeCartItemQuantity,
  computeCartTotal,
  createSeedComboStats,
  rankComboStats,
  removeCartItem,
  updateComboStatsFromCart,
} from "@/lib/kiosk/combo-stats";
import { yakiteiMenu, yakiteiToppings } from "@/lib/kiosk/menu-data";

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

  assert.deepEqual(
    ranked.map((entry) => entry.key),
    ["cheese|vienna", "extra-noodles|fried-egg"],
  );
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

test("yakiteiMenu exposes a local image asset for every item", () => {
  assert.equal(yakiteiMenu.length, 6);
  assert.ok(
    yakiteiMenu.every((item) => typeof item.imageSrc === "string" && item.imageSrc.startsWith("yakitei-")),
  );
});

test("changeCartItemQuantity does not silently delete the final item on decrement", () => {
  const next = changeCartItemQuantity(
    [
      {
        id: "line-1",
        type: "drink",
        menuId: "cola",
        name: "콜라",
        quantity: 1,
        basePrice: 2000,
        toppings: [],
      },
    ],
    "line-1",
    -1,
  );

  assert.equal(next.length, 1);
  assert.equal(next[0].quantity, 1);
});

test("removeCartItem deletes only the targeted line", () => {
  const next = removeCartItem(
    [
      {
        id: "line-1",
        type: "drink",
        menuId: "cola",
        name: "콜라",
        quantity: 1,
        basePrice: 2000,
        toppings: [],
      },
      {
        id: "line-2",
        type: "drink",
        menuId: "cider",
        name: "사이다",
        quantity: 1,
        basePrice: 2000,
        toppings: [],
      },
    ],
    "line-1",
  );

  assert.equal(next.length, 1);
  assert.equal(next[0].menuId, "cider");
});
