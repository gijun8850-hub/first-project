import { listRecentCrowdReports } from "@/lib/data/crowd-reports-repository";
import { buildReason } from "@/lib/recommend/build-reason";
import { getNearbyRestaurants } from "@/lib/recommend/get-nearby-restaurants";
import { scoreDistance } from "@/lib/recommend/score-distance";
import { scoreGroupFit } from "@/lib/recommend/score-group-fit";
import { scoreRecentCrowdReports } from "@/lib/recommend/score-recent-crowd-reports";
import { scoreSeatability } from "@/lib/recommend/score-seatability";
import type {
  CrowdLabel,
  Recommendation,
  RecommendInput,
} from "@/types/recommendation";

type ScoredRecommendation = Recommendation & {
  totalScore: number;
};

export async function rankRestaurants(
  input: RecommendInput,
): Promise<Recommendation[]> {
  const [nearbyRestaurants, crowdReports] = await Promise.all([
    getNearbyRestaurants(input.lat, input.lng),
    listRecentCrowdReports(),
  ]);

  const candidates = nearbyRestaurants
    .filter((restaurant) => restaurant.category === input.foodCategory)
    .filter(
      (restaurant) =>
        restaurant.groupMin <= input.groupSize &&
        restaurant.groupMax >= input.groupSize,
    );

  return candidates
    .map((restaurant) => {
      const distanceScore = scoreDistance(restaurant.distanceMeters);
      const groupScore = scoreGroupFit(input.groupSize, restaurant);
      const baselineScore = restaurant.baselineSeatability;
      const recentCrowdScore = scoreRecentCrowdReports(restaurant.id, crowdReports);
      const seatabilityScore = scoreSeatability({
        baselineScore,
        recentCrowdScore,
        groupScore,
        distanceScore,
      });
      const totalScore = Math.round(
        seatabilityScore * 0.5 +
          distanceScore * 0.25 +
          baselineScore * 0.15 +
          recentCrowdScore * 0.1,
      );
      const walkMinutes = Math.max(1, Math.round(restaurant.distanceMeters / 75));

      const seatabilityLabel: CrowdLabel =
        seatabilityScore >= 72 ? "quiet" : seatabilityScore >= 45 ? "normal" : "busy";

      return {
        restaurantId: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        categoryLabel: restaurant.categoryLabel,
        walkMinutes,
        distanceMeters: restaurant.distanceMeters,
        seatabilityScore,
        seatabilityLabel,
        priceMin: restaurant.priceMin,
        priceMax: restaurant.priceMax,
        reason: buildReason({
          walkMinutes,
          groupSize: input.groupSize,
          baselineScore,
          recentCrowdScore,
        }),
        totalScore,
      };
    })
    .sort((left, right) => {
      if (right.totalScore !== left.totalScore) {
        return right.totalScore - left.totalScore;
      }

      return left.distanceMeters - right.distanceMeters;
    })
    .slice(0, 3)
    .map(stripInternalScore);
}

function stripInternalScore(item: ScoredRecommendation): Recommendation {
  const { totalScore: _totalScore, ...recommendation } = item;
  return recommendation;
}
