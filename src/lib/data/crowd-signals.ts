import type { CrowdReport } from "@/types/recommendation";

export const RECENT_CROWD_REPORTS: CrowdReport[] = [
  { restaurantId: 1, crowdLevel: "normal", minutesAgo: 15 },
  { restaurantId: 2, crowdLevel: "quiet", minutesAgo: 11 },
  { restaurantId: 3, crowdLevel: "normal", minutesAgo: 18 },
  { restaurantId: 4, crowdLevel: "quiet", minutesAgo: 13 },
  { restaurantId: 5, crowdLevel: "normal", minutesAgo: 14 },
  { restaurantId: 6, crowdLevel: "busy", minutesAgo: 9 },
  { restaurantId: 7, crowdLevel: "normal", minutesAgo: 10 },
  { restaurantId: 8, crowdLevel: "busy", minutesAgo: 7 },
  { restaurantId: 9, crowdLevel: "normal", minutesAgo: 12 },
  { restaurantId: 10, crowdLevel: "quiet", minutesAgo: 8 },
  { restaurantId: 11, crowdLevel: "normal", minutesAgo: 17 },
  { restaurantId: 12, crowdLevel: "quiet", minutesAgo: 21 },
  { restaurantId: 13, crowdLevel: "normal", minutesAgo: 10 },
];
