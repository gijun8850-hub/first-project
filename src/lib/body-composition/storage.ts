import type {
  BodyCompositionGoal,
  CheckInRecord,
} from "@/types/body-composition";

export const BODY_COMPOSITION_STORAGE_KEY = "weekly-body-composition-checkins";

export type BodyCompositionStorageState = {
  checkIns: CheckInRecord[];
  goal: BodyCompositionGoal | null;
};

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

function isBodyCompositionGoal(value: unknown): value is BodyCompositionGoal {
  if (!value || typeof value !== "object") {
    return false;
  }

  const goal = value as Partial<BodyCompositionGoal>;

  return (
    typeof goal.targetWeightKg === "number" &&
    typeof goal.targetBodyFatPercent === "number"
  );
}

function sortNewestFirst(checkIns: CheckInRecord[]) {
  return [...checkIns].sort((left, right) =>
    right.measuredAt.localeCompare(left.measuredAt),
  );
}

function buildState(
  checkIns: CheckInRecord[],
  goal: BodyCompositionGoal | null,
): BodyCompositionStorageState {
  return {
    checkIns: sortNewestFirst(checkIns),
    goal,
  };
}

export function parseStoredBodyCompositionState(
  raw: string | null,
): BodyCompositionStorageState {
  if (!raw) {
    return buildState([], null);
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed)) {
      return buildState(parsed.filter(isCheckInRecord), null);
    }

    if (!parsed || typeof parsed !== "object") {
      return buildState([], null);
    }

    const state = parsed as {
      checkIns?: unknown;
      goal?: unknown;
    };

    return buildState(
      Array.isArray(state.checkIns) ? state.checkIns.filter(isCheckInRecord) : [],
      isBodyCompositionGoal(state.goal) ? state.goal : null,
    );
  } catch {
    return buildState([], null);
  }
}

export function parseStoredCheckIns(raw: string | null): CheckInRecord[] {
  return parseStoredBodyCompositionState(raw).checkIns;
}

export function readBodyCompositionStateFromStorage(storage: StorageLike) {
  return parseStoredBodyCompositionState(
    storage.getItem(BODY_COMPOSITION_STORAGE_KEY),
  );
}

export function readCheckInsFromStorage(storage: StorageLike): CheckInRecord[] {
  return readBodyCompositionStateFromStorage(storage).checkIns;
}

export function writeBodyCompositionStateToStorage(
  storage: StorageLike,
  state: BodyCompositionStorageState,
) {
  storage.setItem(
    BODY_COMPOSITION_STORAGE_KEY,
    JSON.stringify(buildState(state.checkIns, state.goal)),
  );
}

export function writeCheckInsToStorage(
  storage: StorageLike,
  checkIns: CheckInRecord[],
) {
  const currentState = readBodyCompositionStateFromStorage(storage);
  writeBodyCompositionStateToStorage(storage, {
    checkIns,
    goal: currentState.goal,
  });
}
