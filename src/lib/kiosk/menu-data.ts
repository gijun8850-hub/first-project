export type MenuCategory = "main" | "drink";

export type OrderType = "dine-in" | "takeout";

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
  imageSrc: string;
};

export const yakiteiMenu: MenuItem[] = [
  {
    id: "teriyaki-yakisoba",
    name: "기본 야끼소바 (데리야끼)",
    category: "main",
    price: 11000,
    description: "달콤짭짤한 데리야끼 소스로 볶아낸 대표 야끼소바",
    imageSrc: "yakitei-teriyaki-yakisoba.png",
  },
  {
    id: "salt-yakisoba",
    name: "소금 야끼소바",
    category: "main",
    price: 11000,
    description: "담백한 소금 베이스로 철판 향을 살린 야끼소바",
    imageSrc: "yakitei-salt-yakisoba.png",
  },
  {
    id: "cola",
    name: "콜라",
    category: "drink",
    price: 2000,
    description: "얼음 가득 시원하게 즐기는 탄산 음료",
    imageSrc: "yakitei-cola.png",
  },
  {
    id: "cider",
    name: "사이다",
    category: "drink",
    price: 2000,
    description: "깔끔하게 마시기 좋은 상큼한 탄산 음료",
    imageSrc: "yakitei-cider.png",
  },
  {
    id: "draft-beer",
    name: "생맥주",
    category: "drink",
    price: 5000,
    description: "야끼소바와 잘 어울리는 차가운 생맥주",
    imageSrc: "yakitei-draft-beer.png",
  },
  {
    id: "highball",
    name: "하이볼",
    category: "drink",
    price: 7000,
    description: "레몬 향을 더한 가벼운 하이볼 한 잔",
    imageSrc: "yakitei-highball.png",
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

export function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}
