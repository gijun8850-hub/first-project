import React from "react";
import { HistoryScreen } from "@/components/body-composition/history-screen";
import { LandingScreen } from "@/components/body-composition/landing-screen";
import { ScreenNavigation } from "@/components/body-composition/screen-navigation";
import { TrendChart } from "@/components/body-composition/trend-chart";
import {
  buildCoachSummary,
  buildConsistencySummary,
  buildCurrentStatusSummary,
  buildGoalProgress,
  buildHistoryRows,
  buildMetricSnapshots,
  buildTrendPoints,
  buildWeeklyProgressSummary,
} from "@/lib/body-composition/coach-engine";
import type {
  BodyCompositionGoal,
  BodyCompositionRoute,
  CheckInRecord,
} from "@/types/body-composition";

type DashboardScreenProps = {
  checkIns: CheckInRecord[];
  currentView: BodyCompositionRoute;
  goal?: BodyCompositionGoal | null;
  onAddCheckIn: () => void;
  onChangeView: (view: BodyCompositionRoute) => void;
  onCloseCheckInDetail?: () => void;
  onEditCheckIn?: (id: string) => void;
  onOpenCheckInDetail?: (id: string) => void;
  onOpenGoalSettings?: () => void;
  onOpenHistory: () => void;
  onRequestDeleteCheckIn?: (id: string) => void;
  selectedCheckInId?: string | null;
};

function getWeeklyCheckInStatus(checkIns: CheckInRecord[]) {
  const latest = [...checkIns].sort((left, right) =>
    right.measuredAt.localeCompare(left.measuredAt),
  )[0];

  if (!latest) {
    return {
      detail: "첫 체크인을 저장하면 이번 주 상태가 여기서 바로 보입니다.",
      label: "이번 주 체크인 필요",
    };
  }

  const today = new Date();
  const latestDate = new Date(`${latest.measuredAt}T00:00:00`);
  const difference = today.getTime() - latestDate.getTime();
  const daysSinceLatest = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (daysSinceLatest <= 7) {
    return {
      detail: `${latest.measuredAt} 기록까지 반영되었습니다. 지금 흐름을 유지하면 됩니다.`,
      label: "이번 주 체크인 완료",
    };
  }

  return {
    detail: `${latest.measuredAt} 이후 새 기록이 없습니다. 이번 주 체크인을 다시 이어가세요.`,
    label: "이번 주 체크인 필요",
  };
}

function renderSelectedCheckInDialog({
  checkIns,
  onCloseCheckInDetail,
  onEditCheckIn,
  onRequestDeleteCheckIn,
  selectedCheckInId,
}: {
  checkIns: CheckInRecord[];
  onCloseCheckInDetail?: () => void;
  onEditCheckIn?: (id: string) => void;
  onRequestDeleteCheckIn?: (id: string) => void;
  selectedCheckInId?: string | null;
}) {
  const selectedRow = selectedCheckInId
    ? buildHistoryRows(checkIns).find((row) => row.id === selectedCheckInId)
    : undefined;
  const selectedCheckIn = selectedCheckInId
    ? checkIns.find((checkIn) => checkIn.id === selectedCheckInId)
    : undefined;

  if (!selectedRow || !selectedCheckIn) {
    return null;
  }

  return (
    <div className="coach-modal-backdrop">
      <article
        aria-label="selected check-in details"
        aria-modal="true"
        className="coach-modal-window coach-modal-window-compact"
        data-record-dialog={selectedRow.id}
        role="dialog"
      >
        <section className="coach-panel coach-detail-modal">
          <div className="coach-section-head">
            <div>
              <span className="coach-section-label">체크인 상세</span>
              <h2>{selectedRow.measuredAtLabel}</h2>
            </div>

            <button
              className="coach-secondary-button"
              onClick={onCloseCheckInDetail}
              type="button"
            >
              닫기
            </button>
          </div>

          <p className="coach-muted">{selectedRow.deltaSummary}</p>

          <div className="coach-detail-metrics">
            <div className="coach-detail-metric">
              <span>키</span>
              <strong>
                {selectedCheckIn.heightCm === null
                  ? "미입력"
                  : `${selectedCheckIn.heightCm.toFixed(1)}cm`}
              </strong>
            </div>
            <div className="coach-detail-metric">
              <span>체중</span>
              <strong>{selectedRow.weightText}</strong>
            </div>
            <div className="coach-detail-metric">
              <span>골격근량</span>
              <strong>{selectedRow.skeletalMuscleText}</strong>
            </div>
            <div className="coach-detail-metric">
              <span>체지방률</span>
              <strong>{selectedRow.bodyFatText}</strong>
            </div>
          </div>

          <div className="coach-detail-note">
            <span className="coach-section-label">메모</span>
            <p>{selectedRow.note || "저장한 메모가 없습니다."}</p>
          </div>

          <div className="coach-detail-actions">
            <button
              className="coach-secondary-button"
              data-action="edit-check-in"
              onClick={() => onEditCheckIn?.(selectedRow.id)}
              type="button"
            >
              수정
            </button>
            <button
              className="coach-danger-button"
              data-action="delete-check-in"
              onClick={() => onRequestDeleteCheckIn?.(selectedRow.id)}
              type="button"
            >
              삭제
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}

function renderEmptyScreen(
  currentView: BodyCompositionRoute,
  onAddCheckIn: () => void,
  onChangeView: (view: BodyCompositionRoute) => void,
) {
  if (currentView === "home") {
    return (
      <LandingScreen
        currentStatusLabel="기록 시작"
        currentStatusSummary="첫 체크인을 남기면 이번 주 상태와 연속 기록이 여기서 바로 보입니다."
        goalSummary={null}
        latestMeasuredAtText="최근 체크인이 아직 없습니다."
        progressSummary="체크인을 시작하면 이번 주 진행 요약이 자동으로 정리됩니다."
        streakLabel="아직 시작 전"
        weeklyStatusDetail="측정 날짜와 체성분을 넣으면 홈이 주간 요약 화면으로 바뀝니다."
        weeklyStatusLabel="이번 주 체크인 필요"
        onAddCheckIn={onAddCheckIn}
        onChangeView={onChangeView}
      />
    );
  }

  return (
    <section className="coach-screen-layout" data-screen-panel={currentView}>
      <ScreenNavigation currentView={currentView} onChangeView={onChangeView} />

      <section
        className="coach-panel coach-empty-state coach-screen-content"
        data-dashboard="true"
        data-empty-state="true"
      >
        <span className="coach-section-label">주간 코치 시작</span>
        <h1>첫 주간 체크인을 추가하고 기준선을 만들어보세요.</h1>
        <p>
          첫 기록부터 저장되면 진행, 기록, 코치 화면이 각각의 역할에 맞게 채워집니다.
        </p>
        <button
          className="coach-primary-button"
          data-action="open-check-in"
          onClick={onAddCheckIn}
          type="button"
        >
          체크인 추가
        </button>
      </section>
    </section>
  );
}

export function DashboardScreen({
  checkIns,
  currentView,
  goal,
  onAddCheckIn,
  onChangeView,
  onCloseCheckInDetail,
  onEditCheckIn,
  onOpenCheckInDetail,
  onOpenGoalSettings,
  onOpenHistory,
  onRequestDeleteCheckIn,
  selectedCheckInId,
}: DashboardScreenProps) {
  if (checkIns.length === 0) {
    return renderEmptyScreen(currentView, onAddCheckIn, onChangeView);
  }

  const summary = buildCoachSummary(checkIns);
  const currentStatus = buildCurrentStatusSummary(checkIns);
  const consistency = buildConsistencySummary(checkIns);
  const goalProgress = buildGoalProgress(checkIns, goal ?? null);
  const metrics = buildMetricSnapshots(checkIns);
  const points = buildTrendPoints(checkIns);
  const weeklyProgress = buildWeeklyProgressSummary(checkIns, goal ?? null);
  const weeklyStatus = getWeeklyCheckInStatus(checkIns);
  const latestMeasuredAtText = consistency.supportingCopy.replace("최근 체크인 ", "최근 측정 ");

  if (currentView === "home") {
    return (
      <LandingScreen
        currentStatusLabel={currentStatus.label}
        currentStatusSummary={currentStatus.summary}
        goalSummary={goalProgress?.summary ?? null}
        latestMeasuredAtText={latestMeasuredAtText}
        progressSummary={weeklyProgress}
        streakLabel={consistency.streakLabel}
        weeklyStatusDetail={weeklyStatus.detail}
        weeklyStatusLabel={weeklyStatus.label}
        onAddCheckIn={onAddCheckIn}
        onChangeView={onChangeView}
      />
    );
  }

  if (currentView === "history") {
    return (
      <>
        <HistoryScreen
          checkIns={checkIns}
          currentView={currentView}
          onAddCheckIn={onAddCheckIn}
          onBack={() => onChangeView("home")}
          onChangeView={onChangeView}
          onSelectCheckIn={onOpenCheckInDetail}
        />
        {renderSelectedCheckInDialog({
          checkIns,
          onCloseCheckInDetail,
          onEditCheckIn,
          onRequestDeleteCheckIn,
          selectedCheckInId,
        })}
      </>
    );
  }

  if (currentView === "coach") {
    return (
      <section className="coach-screen-layout" data-screen-panel="coach">
        <ScreenNavigation currentView={currentView} onChangeView={onChangeView} />

        <div className="coach-screen-content coach-screen-stack" data-dashboard="true">
          <div className="coach-panel coach-summary-card" data-coach-summary="true">
            <div className="coach-summary-head">
              <span className="coach-section-label">이번 주 코치</span>
              <button
                className="coach-secondary-button"
                data-action="open-check-in"
                onClick={onAddCheckIn}
                type="button"
              >
                체크인 추가
              </button>
            </div>

            <div
              className={`coach-current-status coach-current-status-${currentStatus.tone}`}
              data-current-status="true"
            >
              <div className="coach-current-status-copy">
                <span className="coach-current-status-badge">{currentStatus.label}</span>
                <strong>{currentStatus.summary}</strong>
              </div>
              <p>{currentStatus.detail}</p>
            </div>

            <h1>{summary.headline}</h1>
            <p className="coach-summary-copy">{summary.subline}</p>

            <ul className="coach-action-list">
              {summary.actionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="coach-insight-grid">
            <article
              className="coach-panel coach-insight-card"
              data-consistency-summary="true"
            >
              <span className="coach-section-label">연속 체크인</span>
              <strong>{consistency.streakLabel}</strong>
              <p>{consistency.supportingCopy}</p>
            </article>

            <article
              className="coach-panel coach-insight-card"
              data-weekly-progress="true"
            >
              <span className="coach-section-label">이번 주 진행</span>
              <strong>{weeklyProgress}</strong>
              <p>지금 흐름을 다시 보고 이번 주에 무엇을 유지할지 빠르게 판단할 수 있습니다.</p>
            </article>
          </div>

          <div className="coach-panel coach-goal-card" data-goal-summary="true">
            <div className="coach-summary-head">
              <span className="coach-section-label">목표 진행</span>
              <button
                className="coach-secondary-button"
                onClick={onOpenGoalSettings}
                type="button"
              >
                목표 설정
              </button>
            </div>

            <p className="coach-summary-copy">
              {goalProgress?.summary ??
                "목표를 저장하면 현재 수치와 남은 차이를 이 화면에서 같이 확인할 수 있습니다."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="coach-screen-layout" data-screen-panel="progress">
      <ScreenNavigation currentView={currentView} onChangeView={onChangeView} />

      <div className="coach-screen-content coach-screen-stack" data-dashboard="true">
        <div className="coach-panel coach-goal-card" data-goal-summary="true">
          <div className="coach-summary-head">
            <span className="coach-section-label">목표 진행</span>
            <button className="coach-secondary-button" onClick={onOpenGoalSettings} type="button">
              목표 설정
            </button>
          </div>

          {goalProgress ? (
            <>
              <div className="coach-goal-grid">
                <div className="coach-goal-stat">
                  <span>목표 체중</span>
                  <strong>{goalProgress.targetWeightText}</strong>
                  <p>{goalProgress.remainingWeightText}</p>
                </div>
                <div className="coach-goal-stat">
                  <span>목표 체지방률</span>
                  <strong>{goalProgress.targetBodyFatText}</strong>
                  <p>{goalProgress.remainingBodyFatText}</p>
                </div>
              </div>
              <p className="coach-summary-copy">{goalProgress.summary}</p>
            </>
          ) : (
            <p className="coach-summary-copy">
              목표를 저장하면 현재 수치와 남은 차이를 바로 보여줍니다.
            </p>
          )}
        </div>

        <div className="coach-metrics-grid">
          {metrics.map((metric, index) => {
            const metricIds = ["weight", "skeletal-muscle", "body-fat"];

            return (
              <article
                className="coach-panel coach-metric-card"
                data-metric-card={metricIds[index]}
                key={metric.label}
              >
                <span className="coach-metric-label">{metric.label}</span>
                <strong>{metric.valueText}</strong>
                <p>{metric.deltaText}</p>
              </article>
            );
          })}
        </div>

        <article className="coach-panel coach-screen-content-block">
          <div className="coach-section-head">
            <div>
              <h2>4주 추이</h2>
              <p className="coach-muted">체중 / 골격근량 / 체지방률</p>
            </div>
            <button className="coach-text-button" onClick={onOpenHistory} type="button">
              기록 화면 열기
            </button>
          </div>
          <TrendChart points={points} />
        </article>
      </div>
    </section>
  );
}
