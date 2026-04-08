type ReasonInput = {
  walkMinutes: number;
  groupSize: number;
  baselineScore: number;
  recentCrowdScore: number;
};

export function buildReason({
  walkMinutes,
  groupSize,
  baselineScore,
  recentCrowdScore,
}: ReasonInput) {
  const reasons = [`도보 ${walkMinutes}분 거리입니다`];

  if (groupSize >= 3) {
    reasons.push(`${groupSize}명 가기 무난합니다`);
  } else {
    reasons.push(`${groupSize}명 점심 후보로 부담이 적습니다`);
  }

  if (recentCrowdScore >= 80) {
    reasons.push("최근 붐빔 제보가 적습니다");
  } else if (baselineScore >= 70) {
    reasons.push("이 시간대에는 비교적 회전이 빠른 편입니다");
  } else {
    reasons.push("점심 피크에는 조금 붐빌 수 있습니다");
  }

  return reasons.join(", ");
}
