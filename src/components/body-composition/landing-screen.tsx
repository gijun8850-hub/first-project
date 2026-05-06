import React from "react";

type LandingScreenProps = {
  currentStatusLabel: string;
  currentStatusSummary: string;
  goalSummary?: string | null;
  latestMeasuredAtText: string;
  streakLabel: string;
  weeklyStatusDetail: string;
  weeklyStatusLabel: string;
  onAddCheckIn: () => void;
  onViewCoach: () => void;
  onViewProgress: () => void;
};

export function LandingScreen({
  currentStatusLabel,
  currentStatusSummary,
  goalSummary,
  latestMeasuredAtText,
  streakLabel,
  weeklyStatusDetail,
  weeklyStatusLabel,
  onAddCheckIn,
  onViewCoach,
  onViewProgress,
}: LandingScreenProps) {
  return (
    <section className="coach-screen-body coach-screen-body-home" data-screen-panel="home">
      <section className="coach-panel coach-home-primary" data-home-primary="true">
        <span className="coach-section-label">연속 체크인</span>
        <strong className="coach-home-streak" data-home-streak="true">
          {streakLabel}
        </strong>
        <p>{weeklyStatusLabel}</p>
        <small>{weeklyStatusDetail}</small>
      </section>

      <section className="coach-home-actions" data-home-actions="minimal">
        <button
          className="coach-primary-button"
          data-action="open-check-in"
          onClick={onAddCheckIn}
          type="button"
        >
          체크인 추가
        </button>
        <button className="coach-secondary-button" onClick={onViewCoach} type="button">
          이번 주 코치 보기
        </button>
        <button className="coach-secondary-button" onClick={onViewProgress} type="button">
          변화 추이 보기
        </button>
      </section>

      <section className="coach-home-meta-row">
        <article className="coach-panel coach-home-mini-panel" data-home-status="true">
          <span className="coach-section-label">현재 상태</span>
          <strong>{currentStatusLabel}</strong>
          <p>{currentStatusSummary}</p>
        </article>

        <article className="coach-panel coach-home-mini-panel" data-home-goal="true">
          <span className="coach-section-label">최근 기록</span>
          <strong>{latestMeasuredAtText}</strong>
          <p>{goalSummary ?? "목표를 설정하면 현재 수치와 남은 차이를 함께 보여줍니다."}</p>
        </article>
      </section>
    </section>
  );
}
