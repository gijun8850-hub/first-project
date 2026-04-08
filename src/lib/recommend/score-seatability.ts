type SeatabilityInput = {
  baselineScore: number;
  recentCrowdScore: number;
  groupScore: number;
  distanceScore: number;
};

export function scoreSeatability({
  baselineScore,
  recentCrowdScore,
  groupScore,
  distanceScore,
}: SeatabilityInput) {
  return Math.round(
    baselineScore * 0.4 +
      recentCrowdScore * 0.3 +
      groupScore * 0.2 +
      distanceScore * 0.1,
  );
}
