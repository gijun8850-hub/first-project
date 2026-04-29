import type {
  BodyCompositionGoal,
  CheckInRecord,
  CoachStatus,
  CoachSummary,
  ConsistencySummary,
  CurrentStatusSummary,
  GoalProgress,
  HistoryRow,
  MetricSnapshot,
  TrendPoint,
} from "@/types/body-composition";

const WEIGHT_FLAT = 0.3;
const BODY_FAT_FLAT = 0.2;
const MUSCLE_STABLE = 0.2;

function sortNewestFirst(checkIns: CheckInRecord[]) {
  return [...checkIns].sort((left, right) =>
    right.measuredAt.localeCompare(left.measuredAt),
  );
}

function formatDateLabel(measuredAt: string) {
  const [, month, day] = measuredAt.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function formatLongDate(measuredAt: string) {
  const [year, month, day] = measuredAt.split("-");
  return `${year}.${month}.${day}`;
}

function getDateDifferenceInDays(later: string, earlier: string) {
  const laterDate = new Date(`${later}T00:00:00`);
  const earlierDate = new Date(`${earlier}T00:00:00`);
  const difference = laterDate.getTime() - earlierDate.getTime();
  return Math.round(difference / (1000 * 60 * 60 * 24));
}

function formatSigned(value: number, suffix: string) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${suffix}`;
}

function formatRemaining(value: number, suffix: string) {
  if (Math.abs(value) < 0.05) {
    return "목표 달성";
  }

  if (value > 0) {
    return `${value.toFixed(1)}${suffix} 남음`;
  }

  return `${Math.abs(value).toFixed(1)}${suffix} 초과 달성`;
}

function buildDelta(current: CheckInRecord, previous: CheckInRecord) {
  return {
    weightKg: current.weightKg - previous.weightKg,
    skeletalMuscleKg: current.skeletalMuscleKg - previous.skeletalMuscleKg,
    bodyFatPercent: current.bodyFatPercent - previous.bodyFatPercent,
  };
}

function mapStatusLabel(status: CoachStatus) {
  switch (status) {
    case "baseline":
      return "기록 시작";
    case "on-track":
      return "감량 진행 중";
    case "protect-muscle":
      return "근손실 주의";
    case "plateau":
      return "유지 구간";
    case "drift":
      return "조정 필요";
  }
}

export function buildCoachSummary(checkIns: CheckInRecord[]): CoachSummary {
  const [latest, previous] = sortNewestFirst(checkIns);

  if (!latest || !previous) {
    return {
      status: "baseline",
      headline: "기준선이 저장되었습니다.",
      subline: "다음 주 체크인부터 흐름을 읽고 이번 주 운동 방향을 제안합니다.",
      actionItems: [
        "같은 시간대와 비슷한 조건으로 다시 측정하세요.",
        "이번 주 운동 분할은 크게 바꾸지 마세요.",
        "메모에 수면이나 컨디션을 한 줄 남겨두세요.",
      ],
    };
  }

  const delta = buildDelta(latest, previous);
  const bodyFatDown = delta.bodyFatPercent <= -BODY_FAT_FLAT;
  const bodyFatUp = delta.bodyFatPercent >= BODY_FAT_FLAT;
  const muscleDown = delta.skeletalMuscleKg <= -MUSCLE_STABLE;
  const muscleStable = Math.abs(delta.skeletalMuscleKg) < MUSCLE_STABLE;
  const weightFlat = Math.abs(delta.weightKg) < WEIGHT_FLAT;
  const bodyFatFlat = Math.abs(delta.bodyFatPercent) < BODY_FAT_FLAT;

  if (bodyFatDown && muscleDown) {
    return {
      status: "protect-muscle",
      headline: "감량은 진행 중이지만 근육 보호가 먼저입니다.",
      subline: "이번 주는 적자를 더 키우지 말고 회복과 단백질 섭취를 먼저 지키세요.",
      actionItems: [
        "유산소 추가는 이번 주만 보류하세요.",
        "야식보다 수면과 회복 루틴을 먼저 챙기세요.",
        "주력 하체 운동 강도는 유지하세요.",
      ],
    };
  }

  if (bodyFatDown && muscleStable) {
    return {
      status: "on-track",
      headline: "감량 흐름은 안정적이고 근육도 잘 버티고 있습니다.",
      subline: "이번 주는 현재 분할을 유지하고 짧은 컨디셔닝만 소폭 추가하세요.",
      actionItems: [
        "현재 분할을 그대로 유지하세요.",
        "상체 운동 후 짧은 유산소 1~2회만 추가하세요.",
        "야식이나 외식 빈도만 가볍게 점검하세요.",
      ],
    };
  }

  if (weightFlat && bodyFatFlat) {
    return {
      status: "plateau",
      headline: "이번 주는 유지 구간에 가깝습니다.",
      subline: "루틴은 바꾸지 말고 식단이나 활동량 중 하나만 작게 조정하세요.",
      actionItems: [
        "운동 분할은 그대로 유지하세요.",
        "유산소나 걸음 수를 조금만 늘려보세요.",
        "다음 체크인까지 간식을 한 번 더 점검하세요.",
      ],
    };
  }

  if (bodyFatUp) {
    return {
      status: "drift",
      headline: "최근 흐름이 목표에서 조금 벗어났습니다.",
      subline: "이번 주는 루틴보다 생활 리듬과 식단 일관성을 먼저 조정하세요.",
      actionItems: [
        "간식과 야식 빈도를 먼저 줄이세요.",
        "짧은 유산소 2회를 다시 넣어보세요.",
        "주력 운동 중량은 무리하지 말고 유지하세요.",
      ],
    };
  }

  return {
    status: "on-track",
    headline: "숫자는 크게 흔들리지 않았고 현재 루틴이 잘 맞고 있습니다.",
    subline: "이번 주는 현재 계획을 유지하면서 다음 체크인까지 일관성을 챙기세요.",
    actionItems: [
      "주간 루틴을 그대로 유지하세요.",
      "수면과 회복을 우선순위에 두세요.",
      "다음 체크인 메모에 컨디션을 남겨두세요.",
    ],
  };
}

export function buildCurrentStatusSummary(
  checkIns: CheckInRecord[],
): CurrentStatusSummary {
  const latest = sortNewestFirst(checkIns)[0];
  const coachSummary = buildCoachSummary(checkIns);
  const label = mapStatusLabel(coachSummary.status);

  if (!latest) {
    return {
      label: "기록 시작",
      summary: "첫 체크인을 남기면 현재 상태가 여기에 나타납니다.",
      detail: "체중, 골격근량, 체지방률을 넣으면 바로 주간 해석이 시작됩니다.",
      tone: "steady",
    };
  }

  const tone =
    coachSummary.status === "on-track"
      ? "good"
      : coachSummary.status === "protect-muscle" || coachSummary.status === "drift"
        ? "alert"
        : "steady";

  const summaryMap: Record<CoachStatus, string> = {
    baseline: "첫 기록이라 아직 비교 흐름은 없지만 기준선은 잘 잡혔습니다.",
    "on-track": "체지방이 안정적으로 내려가고 있어 지금 흐름을 유지하면 됩니다.",
    "protect-muscle":
      "체지방은 내려가지만 근육 보호가 필요한 구간이라 회복을 먼저 챙겨야 합니다.",
    plateau: "체중과 체지방률이 크게 움직이지 않아 유지 구간으로 볼 수 있습니다.",
    drift: "체지방 흐름이 흔들려 이번 주는 식단과 유산소를 다시 조정할 때입니다.",
  };

  if (latest.heightCm === null) {
    return {
      label,
      summary: summaryMap[coachSummary.status],
      detail: `체중 ${latest.weightKg.toFixed(1)}kg · 키를 입력하면 BMI도 같이 보여줍니다.`,
      tone,
    };
  }

  const heightMeter = latest.heightCm / 100;
  const bmi = latest.weightKg / (heightMeter * heightMeter);

  return {
    label,
    summary: summaryMap[coachSummary.status],
    detail: `키 ${latest.heightCm.toFixed(1)}cm · BMI ${bmi.toFixed(1)} · 체지방률 ${latest.bodyFatPercent.toFixed(1)}%`,
    tone,
  };
}

export function buildMetricSnapshots(checkIns: CheckInRecord[]): MetricSnapshot[] {
  const [latest, previous] = sortNewestFirst(checkIns);

  if (!latest) {
    return [];
  }

  const delta = previous ? buildDelta(latest, previous) : null;

  return [
    {
      label: "체중",
      valueText: `${latest.weightKg.toFixed(1)}kg`,
      deltaText: delta ? `직전 대비 ${formatSigned(delta.weightKg, "kg")}` : "첫 기록",
    },
    {
      label: "골격근량",
      valueText: `${latest.skeletalMuscleKg.toFixed(1)}kg`,
      deltaText: delta
        ? `직전 대비 ${formatSigned(delta.skeletalMuscleKg, "kg")}`
        : "첫 기록",
    },
    {
      label: "체지방률",
      valueText: `${latest.bodyFatPercent.toFixed(1)}%`,
      deltaText: delta
        ? `직전 대비 ${formatSigned(delta.bodyFatPercent, "%")}`
        : "첫 기록",
    },
  ];
}

export function buildTrendPoints(checkIns: CheckInRecord[]): TrendPoint[] {
  return sortNewestFirst(checkIns)
    .slice(0, 4)
    .reverse()
    .map((checkIn) => ({
      label: formatDateLabel(checkIn.measuredAt),
      weightKg: checkIn.weightKg,
      skeletalMuscleKg: checkIn.skeletalMuscleKg,
      bodyFatPercent: checkIn.bodyFatPercent,
    }));
}

export function buildConsistencySummary(
  checkIns: CheckInRecord[],
): ConsistencySummary {
  const sorted = sortNewestFirst(checkIns);
  const latest = sorted[0];

  if (!latest) {
    return {
      streakCount: 0,
      streakLabel: "아직 체크인을 시작하지 않았습니다.",
      supportingCopy: "주 1회 체크인을 쌓으면 변화 흐름과 연속 기록이 함께 보입니다.",
    };
  }

  let streakCount = 1;

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index];
    const previous = sorted[index + 1];
    const gap = getDateDifferenceInDays(current.measuredAt, previous.measuredAt);

    if (gap >= 4 && gap <= 10) {
      streakCount += 1;
      continue;
    }

    break;
  }

  return {
    streakCount,
    streakLabel:
      streakCount > 1
        ? `${streakCount}주 연속 체크인 중`
        : "이번 주 체크인을 시작했습니다.",
    supportingCopy: `최근 체크인 ${formatLongDate(latest.measuredAt)} · 총 ${sorted.length}회 기록`,
  };
}

export function buildGoalProgress(
  checkIns: CheckInRecord[],
  goal: BodyCompositionGoal | null,
): GoalProgress | null {
  if (!goal) {
    return null;
  }

  const latest = sortNewestFirst(checkIns)[0];
  const targetWeightText = `${goal.targetWeightKg.toFixed(1)}kg`;
  const targetBodyFatText = `${goal.targetBodyFatPercent.toFixed(1)}%`;

  if (!latest) {
    return {
      targetWeightText,
      targetBodyFatText,
      remainingWeightText: "첫 체크인 후 계산",
      remainingBodyFatText: "첫 체크인 후 계산",
      summary: "목표는 저장되었고 첫 체크인을 넣으면 남은 차이를 계산합니다.",
    };
  }

  const weightGap = latest.weightKg - goal.targetWeightKg;
  const bodyFatGap = latest.bodyFatPercent - goal.targetBodyFatPercent;

  return {
    targetWeightText,
    targetBodyFatText,
    remainingWeightText: formatRemaining(weightGap, "kg"),
    remainingBodyFatText: formatRemaining(bodyFatGap, "%p"),
    summary: `체중 ${formatRemaining(weightGap, "kg")} · 체지방률 ${formatRemaining(bodyFatGap, "%p")}`,
  };
}

export function buildWeeklyProgressSummary(
  checkIns: CheckInRecord[],
  goal: BodyCompositionGoal | null,
) {
  const consistency = buildConsistencySummary(checkIns);
  const goalProgress = buildGoalProgress(checkIns, goal);

  if (goalProgress) {
    return `${consistency.streakLabel} · 체중 ${goalProgress.remainingWeightText}`;
  }

  if (checkIns.length > 0) {
    return `${consistency.streakLabel} · 이번 주 기록이 다음 제안의 기준선이 됩니다.`;
  }

  return "첫 체크인을 추가하면 이번 주 진행 요약이 여기에 표시됩니다.";
}

export function buildHistoryRows(checkIns: CheckInRecord[]): HistoryRow[] {
  const sorted = sortNewestFirst(checkIns);

  return sorted.map((checkIn, index) => {
    const previous = sorted[index + 1];
    const delta = previous ? buildDelta(checkIn, previous) : null;

    return {
      id: checkIn.id,
      measuredAtLabel: formatLongDate(checkIn.measuredAt),
      weightText: `${checkIn.weightKg.toFixed(1)}kg`,
      skeletalMuscleText: `${checkIn.skeletalMuscleKg.toFixed(1)}kg`,
      bodyFatText: `${checkIn.bodyFatPercent.toFixed(1)}%`,
      deltaSummary: delta
        ? `체지방 ${formatSigned(delta.bodyFatPercent, "%")} · 골격근량 ${formatSigned(
            delta.skeletalMuscleKg,
            "kg",
          )}`
        : "첫 체크인 기준선",
      note: checkIn.note,
    };
  });
}
