import React from "react";
import { ScreenNavigation } from "@/components/body-composition/screen-navigation";
import type { BodyCompositionRoute } from "@/types/body-composition";

type LandingScreenProps = {
  currentStatusLabel: string;
  currentStatusSummary: string;
  goalSummary?: string | null;
  latestMeasuredAtText: string;
  progressSummary: string;
  streakLabel: string;
  weeklyStatusDetail: string;
  weeklyStatusLabel: string;
  onAddCheckIn: () => void;
  onChangeView: (view: BodyCompositionRoute) => void;
};

export function LandingScreen({
  currentStatusLabel,
  currentStatusSummary,
  goalSummary,
  latestMeasuredAtText,
  progressSummary,
  streakLabel,
  weeklyStatusDetail,
  weeklyStatusLabel,
  onAddCheckIn,
  onChangeView,
}: LandingScreenProps) {
  return (
    <section className="coach-screen-layout" data-screen="home" data-screen-panel="home">
      <ScreenNavigation currentView="home" onChangeView={onChangeView} />

      <div className="coach-screen-content coach-home-stack">
        <section className="coach-panel coach-home-summary" data-home-summary="true">
          <span className="coach-section-label">주간체크</span>
          <h1>한 주 단위로 기록하고, 화면을 나눠서 확실하게 봅니다.</h1>
          <p className="coach-summary-copy">
            홈에서는 이번 주 체크인 흐름만 먼저 보고, 나머지는 진행 · 기록 · 코치
            화면으로 나눠서 확인합니다.
          </p>
        </section>

        <section className="coach-panel coach-home-hero">
          <div className="coach-home-streak-block">
            <span className="coach-section-label">연속 체크인</span>
            <strong className="coach-home-streak" data-home-streak="true">
              {streakLabel}
            </strong>
            <p>{latestMeasuredAtText}</p>
          </div>

          <div className="coach-home-status-block">
            <span className="coach-home-status-badge">{weeklyStatusLabel}</span>
            <strong>{currentStatusLabel}</strong>
            <p>{currentStatusSummary}</p>
            <small>{weeklyStatusDetail}</small>
          </div>
        </section>

        <section className="coach-home-quick-actions" data-home-quick-actions="true">
          <button
            className="coach-primary-button"
            data-action="open-check-in"
            onClick={onAddCheckIn}
            type="button"
          >
            체크인 추가
          </button>
          <button
            className="coach-secondary-button"
            onClick={() => onChangeView("coach")}
            type="button"
          >
            이번 주 코치 보기
          </button>
          <button
            className="coach-secondary-button"
            onClick={() => onChangeView("progress")}
            type="button"
          >
            변화 그래프 보기
          </button>
        </section>

        <section className="coach-home-card-grid">
          <article className="coach-panel coach-home-mini-card">
            <span className="coach-section-label">이번 주 진행</span>
            <strong>{progressSummary}</strong>
            <p>이번 주 해야 할 흐름을 한 줄로 다시 확인합니다.</p>
          </article>

          <article className="coach-panel coach-home-mini-card">
            <span className="coach-section-label">목표 요약</span>
            <strong>{goalSummary ?? "목표를 아직 설정하지 않았습니다."}</strong>
            <p>목표 설정을 열면 현재 수치와 남은 차이를 바로 볼 수 있습니다.</p>
          </article>
        </section>
      </div>
    </section>
  );
}
