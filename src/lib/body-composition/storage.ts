import type { CheckInRecord } from "@/types/body-composition";

export const BODY_COMPOSITION_STORAGE_KEY = "weekly-body-composition-checkins";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function isCheckInRecord(value: unknown): value is CheckInRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as Partial<CheckInRecord>;

  return (
    typeof row.id === "string" &&
    typeof row.measuredAt === "string" &&
    typeof row.weightKg === "number" &&
    typeof row.skeletalMuscleKg === "number" &&
    typeof row.bodyFatPercent === "number" &&
    typeof row.note === "string"
  );
}

function sortNewestFirst(checkIns: CheckInRecord[]) {
  return [...checkIns].sort((left, right) =>
    right.measuredAt.localeCompare(left.measuredAt),
  );
}

export function parseStoredCheckIns(raw: string | null): CheckInRecord[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortNewestFirst(parsed.filter(isCheckInRecord));
  } catch {
    return [];
  }
}

export function readCheckInsFromStorage(storage: StorageLike): CheckInRecord[] {
  return parseStoredCheckIns(storage.getItem(BODY_COMPOSITION_STORAGE_KEY));
}

export function writeCheckInsToStorage(
  storage: StorageLike,
  checkIns: CheckInRecord[],
) {
  storage.setItem(
    BODY_COMPOSITION_STORAGE_KEY,
    JSON.stringify(sortNewestFirst(checkIns)),
  );
}
