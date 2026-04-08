import { RESTAURANTS } from "@/lib/data/restaurants";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Restaurant } from "@/types/recommendation";

type RestaurantRow = {
  id: number;
  name: string;
  category: Restaurant["category"];
  address: string | null;
  lat: number;
  lng: number;
  price_min: number | null;
  price_max: number | null;
  group_min: number | null;
  group_max: number | null;
  baseline_seatability: number | null;
  is_active: boolean;
};

export async function listRestaurants(): Promise<Restaurant[]> {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    return RESTAURANTS;
  }

  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "id, name, category, address, lat, lng, price_min, price_max, group_min, group_max, baseline_seatability, is_active",
    )
    .eq("is_active", true);

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("restaurants query failed", error.message);
    }
    return RESTAURANTS;
  }

  return (data as RestaurantRow[]).map(mapRestaurantRow);
}

function mapRestaurantRow(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: toCategoryLabel(row.category),
    address: row.address ?? "",
    lat: row.lat,
    lng: row.lng,
    priceMin: row.price_min,
    priceMax: row.price_max,
    groupMin: row.group_min ?? 1,
    groupMax: row.group_max ?? 4,
    baselineSeatability: row.baseline_seatability ?? 60,
  };
}

function toCategoryLabel(category: Restaurant["category"]) {
  if (category === "korean") {
    return "한식";
  }
  if (category === "japanese") {
    return "일식";
  }
  if (category === "chinese") {
    return "중식";
  }
  return "양식";
}
