import { listRestaurants } from "@/lib/data/restaurants-repository";
import { getDistanceMeters } from "@/lib/recommend/distance";

export async function getNearbyRestaurants(
  lat: number,
  lng: number,
  radiusMeters = 1200,
) {
  const restaurants = await listRestaurants();

  return restaurants
    .map((restaurant) => ({
    ...restaurant,
    distanceMeters: getDistanceMeters(lat, lng, restaurant.lat, restaurant.lng),
    }))
    .filter((restaurant) => restaurant.distanceMeters <= radiusMeters);
}
