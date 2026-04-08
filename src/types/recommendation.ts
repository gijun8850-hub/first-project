export type CrowdLabel = "quiet" | "normal" | "busy";
export type FoodCategory = "korean" | "japanese" | "chinese" | "western";

export type RecommendInput = {
  lat: number;
  lng: number;
  groupSize: number;
  foodCategory: string;
};

export type Restaurant = {
  id: number;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  address: string;
  lat: number;
  lng: number;
  priceMin: number | null;
  priceMax: number | null;
  groupMin: number;
  groupMax: number;
  baselineSeatability: number;
};

export type Recommendation = {
  restaurantId: number;
  name: string;
  category: string;
  categoryLabel: string;
  walkMinutes: number;
  distanceMeters: number;
  seatabilityScore: number;
  seatabilityLabel: CrowdLabel;
  priceMin: number | null;
  priceMax: number | null;
  reason: string;
};

export type RecommendResponse = {
  sessionId: string;
  recommendations: Recommendation[];
  storage: "supabase" | "local";
};

export type CrowdReport = {
  restaurantId: number;
  crowdLevel: CrowdLabel;
  minutesAgo: number;
};
