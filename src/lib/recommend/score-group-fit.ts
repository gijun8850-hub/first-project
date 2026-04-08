import type { Restaurant } from "@/types/recommendation";

export function scoreGroupFit(groupSize: number, restaurant: Restaurant) {
  if (groupSize < restaurant.groupMin || groupSize > restaurant.groupMax) {
    return 0;
  }

  if (restaurant.groupMax - groupSize >= 1) {
    return 90;
  }

  return 74;
}
