export type CheckInRecord = {
  id: string;
  measuredAt: string;
  weightKg: number;
  skeletalMuscleKg: number;
  bodyFatPercent: number;
  note: string;
};

export type CheckInDraft = {
  measuredAt: string;
  weightKg: string;
  skeletalMuscleKg: string;
  bodyFatPercent: string;
  note: string;
};

export type BodyCompositionGoal = {
  targetWeightKg: number;
  targetBodyFatPercent: number;
};

export type GoalDraft = {
  targetWeightKg: string;
  targetBodyFatPercent: string;
};

export type CoachStatus =
  | "baseline"
  | "on-track"
  | "protect-muscle"
  | "plateau"
  | "drift";

export type CoachSummary = {
  status: CoachStatus;
  headline: string;
  subline: string;
  actionItems: string[];
};

export type MetricSnapshot = {
  label: string;
  valueText: string;
  deltaText: string;
};

export type TrendPoint = {
  label: string;
  weightKg: number;
  skeletalMuscleKg: number;
  bodyFatPercent: number;
};

export type GoalProgress = {
  targetWeightText: string;
  targetBodyFatText: string;
  remainingWeightText: string;
  remainingBodyFatText: string;
  summary: string;
};

export type HistoryRow = {
  id: string;
  measuredAtLabel: string;
  weightText: string;
  skeletalMuscleText: string;
  bodyFatText: string;
  deltaSummary: string;
  note: string;
};
