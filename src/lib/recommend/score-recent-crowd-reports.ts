import type { CrowdReport } from "@/types/recommendation";

export function scoreRecentCrowdReports(
  restaurantId: number,
  crowdReports: CrowdReport[],
) {
  const reports = crowdReports.filter(
    (report) => report.restaurantId === restaurantId,
  );

  if (reports.length === 0) {
    return 55;
  }

  let weightedTotal = 0;
  let weightSum = 0;

  for (const report of reports) {
    const crowdValue =
      report.crowdLevel === "quiet" ? 95 : report.crowdLevel === "normal" ? 60 : 25;
    const freshnessWeight =
      report.minutesAgo <= 15 ? 1 : report.minutesAgo <= 30 ? 0.7 : 0.4;

    weightedTotal += crowdValue * freshnessWeight;
    weightSum += freshnessWeight;
  }

  return Math.round(weightedTotal / weightSum);
}
