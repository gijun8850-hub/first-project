import type { CrowdLabel, RecommendInput } from "@/types/recommendation";

const VALID_CATEGORIES = new Set(["korean", "japanese", "chinese", "western"]);
const VALID_CROWD_LEVELS = new Set(["quiet", "normal", "busy"]);

export function parseRecommendInput(value: unknown): RecommendInput {
  if (!isRecord(value)) {
    throw new Error("입력 형식이 올바르지 않습니다.");
  }

  const lat = parseNumber(value.lat, "위도");
  const lng = parseNumber(value.lng, "경도");
  const groupSize = parseNumber(value.groupSize, "인원 수");
  const foodCategory = parseString(value.foodCategory, "음식 종류");

  if (!VALID_CATEGORIES.has(foodCategory)) {
    throw new Error("지원하지 않는 음식 종류입니다.");
  }

  if (groupSize < 2 || groupSize > 4) {
    throw new Error("인원 수는 2명에서 4명 사이여야 합니다.");
  }

  return {
    lat,
    lng,
    groupSize,
    foodCategory,
  };
}

export function parseFeedbackInput(value: unknown) {
  if (!isRecord(value)) {
    throw new Error("입력 형식이 올바르지 않습니다.");
  }

  const restaurantId = parseNumber(value.restaurantId, "식당 ID");
  const sessionId = parseString(value.sessionId, "세션 ID");
  const crowdLevel = parseString(value.crowdLevel, "혼잡도") as CrowdLabel;

  if (!VALID_CROWD_LEVELS.has(crowdLevel)) {
    throw new Error("지원하지 않는 혼잡도 값입니다.");
  }

  return {
    restaurantId,
    sessionId,
    crowdLevel,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNumber(value: unknown, label: string) {
  const nextValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(nextValue)) {
    throw new Error(`${label} 값이 올바르지 않습니다.`);
  }

  return nextValue;
}

function parseString(value: unknown, label: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} 값이 올바르지 않습니다.`);
  }

  return value.trim();
}
