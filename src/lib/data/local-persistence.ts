import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CrowdLabel,
  CrowdReport,
  Recommendation,
  RecommendInput,
} from "@/types/recommendation";

type LocalRecommendationSessionRow = {
  id: string;
  lat: number;
  lng: number;
  groupSize: number;
  foodCategory: string;
  createdAt: string;
};

type LocalRecommendationResultRow = {
  sessionId: string;
  restaurantId: number;
  rank: number;
  seatabilityScore: number;
  seatabilityLabel: CrowdLabel;
  reason: string;
  createdAt: string;
};

type LocalCrowdReportRow = {
  restaurantId: number;
  sessionId: string;
  crowdLevel: CrowdLabel;
  sourceType: "user";
  createdAt: string;
};

const LOCAL_DATA_DIR = path.join(process.cwd(), ".local-data");

const LOCAL_FILES = {
  recommendationSessions: path.join(
    LOCAL_DATA_DIR,
    "recommendation-sessions.json",
  ),
  recommendationResults: path.join(
    LOCAL_DATA_DIR,
    "recommendation-results.json",
  ),
  crowdReports: path.join(LOCAL_DATA_DIR, "crowd-reports.json"),
};

export async function saveLocalRecommendationSession(input: {
  sessionId: string;
  request: RecommendInput;
  recommendations: Recommendation[];
}) {
  const createdAt = new Date().toISOString();

  await appendJsonItem<LocalRecommendationSessionRow>(
    LOCAL_FILES.recommendationSessions,
    {
      id: input.sessionId,
      lat: input.request.lat,
      lng: input.request.lng,
      groupSize: input.request.groupSize,
      foodCategory: input.request.foodCategory,
      createdAt,
    },
  );

  const currentResults = await readJsonArray<LocalRecommendationResultRow>(
    LOCAL_FILES.recommendationResults,
  );

  currentResults.push(
    ...input.recommendations.map((recommendation, index) => ({
      sessionId: input.sessionId,
      restaurantId: recommendation.restaurantId,
      rank: index + 1,
      seatabilityScore: recommendation.seatabilityScore,
      seatabilityLabel: recommendation.seatabilityLabel,
      reason: recommendation.reason,
      createdAt,
    })),
  );

  await writeJsonArray(LOCAL_FILES.recommendationResults, currentResults);

  return { persisted: true as const, backend: "local" as const };
}

export async function saveLocalCrowdReport(input: {
  restaurantId: number;
  sessionId: string;
  crowdLevel: CrowdLabel;
}) {
  await appendJsonItem<LocalCrowdReportRow>(LOCAL_FILES.crowdReports, {
    restaurantId: input.restaurantId,
    sessionId: input.sessionId,
    crowdLevel: input.crowdLevel,
    sourceType: "user",
    createdAt: new Date().toISOString(),
  });

  return { persisted: true as const, backend: "local" as const };
}

export async function listLocalCrowdReports(): Promise<CrowdReport[]> {
  const rows = await readJsonArray<LocalCrowdReportRow>(LOCAL_FILES.crowdReports);
  const cutoff = Date.now() - 60 * 60 * 1000;

  return rows
    .filter((row) => new Date(row.createdAt).getTime() >= cutoff)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .map((row) => ({
      restaurantId: row.restaurantId,
      crowdLevel: row.crowdLevel,
      minutesAgo: Math.max(
        0,
        Math.round((Date.now() - new Date(row.createdAt).getTime()) / 60000),
      ),
    }));
}

async function appendJsonItem<T>(filePath: string, item: T) {
  const currentItems = await readJsonArray<T>(filePath);
  currentItems.push(item);
  await writeJsonArray(filePath, currentItems);
}

async function writeJsonArray<T>(filePath: string, value: T[]) {
  await mkdir(LOCAL_DATA_DIR, { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
}

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    const code =
      error instanceof Error && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    if (code === "ENOENT") {
      return [];
    }

    throw error;
  }
}
