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

export type RankedCombo = ComboStat & {
  toppings: Topping[];
};

export type ComboStatMap = Record<string, ComboStat>;

export function buildComboKey(toppingIds: string[]) {
  return [...toppingIds].sort().join("|");
}

export function createSeedComboStats(): ComboStatMap {
  return seededCombos.reduce<ComboStatMap>((accumulator, combo, index) => {
    const key = buildComboKey([...combo]);

    accumulator[key] = {
      key,
      toppingIds: [...combo].sort(),
      count: 12 - index * 4,
    };

    return accumulator;
  }, {});
}

export function rankComboStats(stats: ComboStatMap): RankedCombo[] {
  const toppingsById = new Map(yakiteiToppings.map((topping) => [topping.id, topping]));

  return Object.values(stats)
    .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key))
    .map((entry) => ({
      ...entry,
      toppings: entry.toppingIds
        .map((id) => toppingsById.get(id))
        .filter((value): value is Topping => value !== undefined),
    }));
}

export function updateComboStatsFromCart(
  currentStats: ComboStatMap,
  cartItems: CartItem[],
): ComboStatMap {
  const nextStats = { ...currentStats };

  for (const item of cartItems) {
    if (item.type !== "main" || item.toppings.length === 0) {
      continue;
    }

    const key = buildComboKey(item.toppings.map((topping) => topping.id));
    const existing = nextStats[key];

    nextStats[key] = {
      key,
      toppingIds: item.toppings.map((topping) => topping.id).sort(),
      count: (existing?.count ?? 0) + item.quantity,
    };
  }

  return nextStats;
}

export function computeLineTotal(item: CartItem) {
  const toppingsTotal = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
  return (item.basePrice + toppingsTotal) * item.quantity;
}

export function computeCartTotal(cartItems: CartItem[]) {
  return cartItems.reduce((sum, item) => sum + computeLineTotal(item), 0);
}

export function changeCartItemQuantity(
  cartItems: CartItem[],
  id: string,
  delta: number,
) {
  return cartItems.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      quantity: Math.max(1, item.quantity + delta),
    };
  });
}

export function removeCartItem(cartItems: CartItem[], id: string) {
  return cartItems.filter((item) => item.id !== id);
}
