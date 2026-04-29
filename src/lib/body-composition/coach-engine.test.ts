import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCoachSummary,
  buildConsistencySummary,
  buildGoalProgress,
  buildHistoryRows,
  buildMetricSnapshots,
  buildTrendPoints,
  buildWeeklyProgressSummary,
} from "@/lib/body-composition/coach-engine";
import type { CheckInRecord } from "@/types/body-composition";

const singleCheckIn: CheckInRecord[] = [
  {
    id: "checkin-1",
    measuredAt: "2026-04-27",
    weightKg: 74.8,
    skeletalMuscleKg: 33.1,
    bodyFatPercent: 16.4,
    note: "",
  },
];

const muscleDropCheckIns: CheckInRecord[] = [
  {
    id: "checkin-2",
    measuredAt: "2026-04-27",
    weightKg: 74.2,
    skeletalMuscleKg: 32.6,
    bodyFatPercent: 16.1,
    note: "유산소를 많이 늘림",
  },
  {
    id: "checkin-1",
    measuredAt: "2026-04-20",
    weightKg: 75.0,
    skeletalMuscleKg: 33.1,
    bodyFatPercent: 16.7,
    note: "",
  },
];

const onTrackCheckIns: CheckInRecord[] = [
  {
    id: "checkin-4",
    measuredAt: "2026-04-27",
    weightKg: 74.8,
    skeletalMuscleKg: 33.1,
    bodyFatPercent: 16.4,
    note: "",
  },
  {
    id: "checkin-3",
    measuredAt: "2026-04-20",
    weightKg: 75.4,
    skeletalMuscleKg: 33.2,
    bodyFatPercent: 16.8,
    note: "",
  },
  {
    id: "checkin-2",
    measuredAt: "2026-04-13",
    weightKg: 75.9,
    skeletalMuscleKg: 33.0,
    bodyFatPercent: 17.2,
    note: "",
  },
  {
    id: "checkin-1",
    measuredAt: "2026-04-06",
    weightKg: 76.1,
    skeletalMuscleKg: 32.9,
    bodyFatPercent: 17.5,
    note: "",
  },
];

test("buildCoachSummary returns baseline messaging for a single check-in", () => {
  const summary = buildCoachSummary(singleCheckIn);

  assert.equal(summary.status, "baseline");
  assert.match(summary.headline, /기준선/);
  assert.match(summary.subline, /다음 주 체크인/);
  assert.equal(summary.actionItems.length, 3);
});

test("buildCoachSummary protects muscle when both fat and muscle drop", () => {
  const summary = buildCoachSummary(muscleDropCheckIns);

  assert.equal(summary.status, "protect-muscle");
  assert.match(summary.headline, /근육 보호/);
  assert.match(summary.subline, /회복/);
  assert.match(summary.actionItems.join(" "), /유산소/);
});

test("buildMetricSnapshots formats latest values with previous deltas", () => {
  const metrics = buildMetricSnapshots(onTrackCheckIns);

  assert.deepEqual(metrics.map((metric) => metric.label), [
    "체중",
    "골격근량",
    "체지방률",
  ]);
  assert.equal(metrics[0].valueText, "74.8kg");
  assert.equal(metrics[0].deltaText, "직전 대비 -0.6kg");
  assert.equal(metrics[2].deltaText, "직전 대비 -0.4%");
});

test("buildTrendPoints returns the latest four entries in chart order", () => {
  const trendPoints = buildTrendPoints(onTrackCheckIns);

  assert.equal(trendPoints.length, 4);
  assert.deepEqual(
    trendPoints.map((point) => point.label),
    ["4/6", "4/13", "4/20", "4/27"],
  );
});

test("buildHistoryRows keeps the newest entry first with a baseline fallback", () => {
  const rows = buildHistoryRows(onTrackCheckIns);

  assert.equal(rows[0].measuredAtLabel, "2026.04.27");
  assert.match(rows[0].deltaSummary, /체지방/);
  assert.match(rows.at(-1)?.deltaSummary ?? "", /기준선/);
});

test("buildGoalProgress computes the remaining gap to the current goal", () => {
  const progress = buildGoalProgress(onTrackCheckIns, {
    targetWeightKg: 73,
    targetBodyFatPercent: 15,
  });

  assert.equal(progress?.targetWeightText, "73.0kg");
  assert.equal(progress?.targetBodyFatText, "15.0%");
  assert.match(progress?.remainingWeightText ?? "", /1.8kg/);
  assert.match(progress?.remainingBodyFatText ?? "", /1.4%p/);
});

test("buildConsistencySummary returns a weekly streak summary", () => {
  const summary = buildConsistencySummary(onTrackCheckIns);

  assert.equal(summary.streakCount, 4);
  assert.match(summary.streakLabel, /4주 연속/);
  assert.match(summary.supportingCopy, /최근 체크인/);
});

test("buildWeeklyProgressSummary blends consistency and goal progress", () => {
  const summary = buildWeeklyProgressSummary(onTrackCheckIns, {
    targetWeightKg: 73,
    targetBodyFatPercent: 15,
  });

  assert.match(summary, /4주 연속/);
  assert.match(summary, /1.8kg/);
});
