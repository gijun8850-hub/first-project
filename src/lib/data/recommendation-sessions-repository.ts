import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { saveLocalRecommendationSession } from "@/lib/data/local-persistence";
import type { Recommendation, RecommendInput } from "@/types/recommendation";

export async function saveRecommendationSession(input: {
  sessionId: string;
  request: RecommendInput;
  recommendations: Recommendation[];
}) {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    return saveLocalRecommendationSession(input);
  }

  const { error: sessionError } = await supabase
    .from("recommendation_sessions")
    .insert({
      id: input.sessionId,
      lat: input.request.lat,
      lng: input.request.lng,
      group_size: input.request.groupSize,
      food_category: input.request.foodCategory,
    });

  if (sessionError) {
    console.error("recommendation_sessions insert failed", sessionError.message);
    return saveLocalRecommendationSession(input);
  }

  const rows = input.recommendations.map((recommendation, index) => ({
    session_id: input.sessionId,
    restaurant_id: recommendation.restaurantId,
    rank: index + 1,
    seatability_score: recommendation.seatabilityScore,
    seatability_label: recommendation.seatabilityLabel,
    reason: recommendation.reason,
  }));

  const { error: resultsError } = await supabase
    .from("recommendation_results")
    .insert(rows);

  if (resultsError) {
    console.error("recommendation_results insert failed", resultsError.message);
    return saveLocalRecommendationSession(input);
  }

  return { persisted: true as const, backend: "supabase" as const };
}
