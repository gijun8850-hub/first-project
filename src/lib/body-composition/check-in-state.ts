import type { CheckInDraft, CheckInRecord } from "@/types/body-composition";

function sortNewestFirst(checkIns: CheckInRecord[]) {
  return [...checkIns].sort((left, right) =>
    right.measuredAt.localeCompare(left.measuredAt),
  );
}

export function createDraftFromRecord(checkIn: CheckInRecord): CheckInDraft {
  return {
    measuredAt: checkIn.measuredAt,
    weightKg: String(checkIn.weightKg),
    skeletalMuscleKg: String(checkIn.skeletalMuscleKg),
    bodyFatPercent: String(checkIn.bodyFatPercent),
    note: checkIn.note,
  };
}

export function upsertCheckIn(
  checkIns: CheckInRecord[],
  nextRecord: CheckInRecord,
) {
  return sortNewestFirst([
    nextRecord,
    ...checkIns.filter((checkIn) => checkIn.id !== nextRecord.id),
  ]);
}

export function removeCheckIn(checkIns: CheckInRecord[], id: string) {
  return checkIns.filter((checkIn) => checkIn.id !== id);
}
