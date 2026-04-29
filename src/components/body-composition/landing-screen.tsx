import React from "react";
import {
  buildCoachSummary,
  buildConsistencySummary,
  buildGoalProgress,
  buildMetricSnapshots,
  buildWeeklyProgressSummary,
} from "@/lib/body-composition/coach-engine";
import type { BodyCompositionGoal, CheckInRecord } from "@/types/body-composition";

type LandingScreenProps = {
  checkIns: CheckInRecord[];
  goal?: BodyCompositionGoal | null;
  onGoDashboard: () => void;
  onStartCheckIn: () => void;
};

const featureCards = [
  {
    label: "주간 체크인",
    title: "숫자를 가볍게 남기고",
    description: "체중, 골격근량, 체지방률만 입력하면 이번 주 기준선이 바로 쌓입니다.",
  },
  {
    label: "자동 해석",
    title: "변화를 한 줄로 읽어주고",
    description: "감량 유지, 정체, 근손실 위험 같은 흐름을 주간 코치 카드로 정리합니다.",
  },
  {
    label: "다음 액션",
    title: "다음 주 행동으로 연결합니다",
    description: "이번 주 운동 방향과 체크 포인트를 빠르게 다시 볼 수 있습니다.",
  },
];

export function LandingScreen({
  checkIns,
  goal,
  onGoDashboard,
  onStartCheckIn,
}: LandingScreenProps) {
  const summary = buildCoachSummary(checkIns);
  const consistency = buildConsistencySummary(checkIns);
  const goalProgress = buildGoalProgress(checkIns, goal ?? null);
  const metrics = buildMetricSnapshots(checkIns);
  const weeklyProgress = buildWeeklyProgressSummary(checkIns, goal ?? null);

  return (
    <section className="coach-landing" data-screen="landing">
      <div className="coach-landing-topbar">
        <div>
          <span className="coach-section-label">주간 체성분 코치</span>
          <strong>기록이 쌓일수록 변화가 더 또렷해집니다.</strong>
        </div>

        <button
          className="coach-secondary-button"
          data-action="go-dashboard"
          onClick={onGoDashboard}
          type="button"
        >
          대시보드 보기
        </button>
      </div>

      <section className="coach-panel coach-landing-hero">
        <div className="coach-landing-copy">
          <span className="coach-section-label">꾸준한 변화 추적</span>
          <h1>주 1회 체크인으로 몸 변화를 쌓고, 다음 주 운동 방향까지 이어가세요.</h1>
          <p>
            매주 숫자만 남기면 체중, 골격근량, 체지방률 흐름을 읽고 지금 어떤 방향으로
            가고 있는지 빠르게 다시 볼 수 있습니다.
          </p>

          <div className="coach-landing-actions">
            <button
              className="coach-primary-button"
              data-action="start-check-in"
              onClick={onStartCheckIn}
              type="button"
            >
              지금 체크인 시작
            </button>
            <button
              className="coach-secondary-button"
              onClick={onGoDashboard}
              type="button"
            >
              먼저 대시보드 보기
            </button>
          </div>

          <div className="coach-landing-progress" data-weekly-progress="true">
            <strong>{weeklyProgress}</strong>
            <span>{consistency.supportingCopy}</span>
          </div>
        </div>

        <div className="coach-landing-preview">
          <article className="coach-landing-preview-card">
            <span className="coach-section-label">이번 주 코치 예시</span>
            <h2>{summary.headline}</h2>
            <p>{summary.subline}</p>
          </article>

          <article
            className="coach-landing-preview-card"
            data-consistency-summary="true"
          >
            <span className="coach-section-label">연속 체크인</span>
            <h2>{consistency.streakLabel}</h2>
            <p>{consistency.supportingCopy}</p>
          </article>

          <article className="coach-landing-preview-card">
            <span className="coach-section-label">목표 진행</span>
            <h2>{goalProgress ? goalProgress.remainingWeightText : "목표를 정하고 시작하세요."}</h2>
            <p>
              {goalProgress
                ? `${goalProgress.remainingBodyFatText} · ${goalProgress.summary}`
                : "목표 체중과 체지방률을 넣어 두면 현재와 남은 차이를 같이 보여줍니다."}
            </p>
          </article>
        </div>
      </section>

      <section className="coach-landing-feature-grid">
        {featureCards.map((card) => (
          <article className="coach-panel coach-landing-feature-card" key={card.label}>
            <span className="coach-section-label">{card.label}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="coach-panel coach-landing-metric-strip">
        <div>
          <span className="coach-section-label">핵심 지표</span>
          <h2>변화를 보는 기준은 단순하고 선명해야 합니다.</h2>
        </div>

        <div className="coach-landing-metric-grid">
          {(metrics.length > 0
            ? metrics
            : [
                { label: "체중", valueText: "매주 기록", deltaText: "숫자 변화 확인" },
                { label: "골격근량", valueText: "근육 유지 체크", deltaText: "하락 여부 확인" },
                { label: "체지방률", valueText: "감량 흐름 확인", deltaText: "정체 여부 확인" },
              ]
          ).map((metric) => (
            <article className="coach-panel coach-metric-card" key={metric.label}>
              <span className="coach-metric-label">{metric.label}</span>
              <strong>{metric.valueText}</strong>
              <p>{metric.deltaText}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
