import type {
  CheckInDraft,
  CheckInRecord,
  GoalDraft,
} from "@/types/body-composition";

function isFiniteNumber(value: string) {
  return Number.isFinite(Number(value));
}

export function validateCheckInDraft(draft: CheckInDraft) {
  const errors: string[] = [];

  if (!draft.measuredAt) {
    errors.push("측정 날짜를 입력하세요.");
  }

  if (!draft.weightKg) {
    errors.push("체중을 입력하세요.");
  } else if (!isFiniteNumber(draft.weightKg)) {
    errors.push("체중은 숫자로 입력하세요.");
  }

  if (!draft.skeletalMuscleKg) {
    errors.push("골격근량을 입력하세요.");
  } else if (!isFiniteNumber(draft.skeletalMuscleKg)) {
    errors.push("골격근량은 숫자로 입력하세요.");
  }

  if (!draft.bodyFatPercent) {
    errors.push("체지방률을 입력하세요.");
  } else if (!isFiniteNumber(draft.bodyFatPercent)) {
    errors.push("체지방률은 숫자로 입력하세요.");
  }

  return errors;
}

export function validateGoalDraft(draft: GoalDraft) {
  const errors: string[] = [];

  if (!draft.targetWeightKg) {
    errors.push("목표 체중을 입력하세요.");
  } else if (!isFiniteNumber(draft.targetWeightKg)) {
    errors.push("목표 체중은 숫자로 입력하세요.");
  }

  if (!draft.targetBodyFatPercent) {
    errors.push("목표 체지방률을 입력하세요.");
  } else if (!isFiniteNumber(draft.targetBodyFatPercent)) {
    errors.push("목표 체지방률은 숫자로 입력하세요.");
  }

  return errors;
}

export function isSuspiciousCheckIn(
  input: Pick<CheckInRecord, "weightKg" | "skeletalMuscleKg" | "bodyFatPercent">,
) {
  return (
    input.weightKg < 30 ||
    input.weightKg > 250 ||
    input.skeletalMuscleKg < 10 ||
    input.skeletalMuscleKg > 80 ||
    input.bodyFatPercent < 3 ||
    input.bodyFatPercent > 50
  );
}
