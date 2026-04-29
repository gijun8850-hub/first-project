import React from "react";
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
import { TrendChart } from "@/components/body-composition/trend-chart";
import type { BodyCompositionGoal, CheckInRecord } from "@/types/body-composition";

type DashboardScreenProps = {
  checkIns: CheckInRecord[];
  goal?: BodyCompositionGoal | null;
  onAddCheckIn: () => void;
  onCloseCheckInDetail?: () => void;
  onEditCheckIn?: (id: string) => void;
  onOpenCheckInDetail?: (id: string) => void;
  onOpenGoalSettings?: () => void;
  onOpenHistory: () => void;
  onRequestDeleteCheckIn?: (id: string) => void;
  selectedCheckInId?: string | null;
};

export function DashboardScreen({
  checkIns,
  goal,
  onAddCheckIn,
  onCloseCheckInDetail,
  onEditCheckIn,
  onOpenCheckInDetail,
  onOpenGoalSettings,
  onOpenHistory,
  onRequestDeleteCheckIn,
  selectedCheckInId,
}: DashboardScreenProps) {
  if (checkIns.length === 0) {
    return (
      <section
        className="coach-panel coach-empty-state"
        data-dashboard="true"
        data-empty-state="true"
      >
        <span className="coach-section-label">주간 코치 시작</span>
        <h1>첫 주간 체크인을 추가하고 기준선을 만들어보세요.</h1>
        <p>
          첫 기록을 남기면 다음 주부터 체중, 골격근량, 체지방률 흐름을 읽고
          이번 주 운동 방향을 제안합니다.
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
    );
  }

  const metricIds = ["weight", "skeletal-muscle", "body-fat"];
  const summary = buildCoachSummary(checkIns);
  const currentStatus = buildCurrentStatusSummary(checkIns);
  const consistency = buildConsistencySummary(checkIns);
  const goalProgress = buildGoalProgress(checkIns, goal ?? null);
  const historyRows = buildHistoryRows(checkIns);
  const metrics = buildMetricSnapshots(checkIns);
  const points = buildTrendPoints(checkIns);
  const weeklyProgress = buildWeeklyProgressSummary(checkIns, goal ?? null);
  const recentRows = historyRows.slice(0, 3);
  const selectedRow = selectedCheckInId
    ? historyRows.find((row) => row.id === selectedCheckInId)
    : undefined;
  const selectedCheckIn = selectedCheckInId
    ? checkIns.find((checkIn) => checkIn.id === selectedCheckInId)
    : undefined;

  return (
    <section className="coach-dashboard" data-dashboard="true">
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
            목표를 저장하면 현재 수치와 남은 차이를 함께 보여줍니다.
          </p>
        )}
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

      <div className="coach-metrics-grid">
        {metrics.map((metric, index) => (
          <article
            className="coach-panel coach-metric-card"
            data-metric-card={metricIds[index]}
            key={metric.label}
          >
            <span className="coach-metric-label">{metric.label}</span>
            <strong>{metric.valueText}</strong>
            <p>{metric.deltaText}</p>
          </article>
        ))}
      </div>

      <div className="coach-dashboard-grid">
        <article className="coach-panel">
          <div className="coach-section-head">
            <div>
              <h2>4주 추이</h2>
              <p className="coach-muted">체중 / 골격근량 / 체지방률</p>
            </div>
          </div>
          <TrendChart points={points} />
        </article>

        <article className="coach-panel">
          <div className="coach-section-head">
            <h2>최근 체크인</h2>
            <button className="coach-text-button" onClick={onOpenHistory} type="button">
              전체 보기
            </button>
          </div>

          <ul className="coach-history-preview" data-history-preview="true">
            {recentRows.map((row) => (
              <li key={row.id}>
                <button
                  className="coach-history-trigger"
                  data-record-trigger={row.id}
                  onClick={() => onOpenCheckInDetail?.(row.id)}
                  type="button"
                >
                  <strong>{row.measuredAtLabel}</strong>
                  <span>{row.weightText}</span>
                  <span>{row.skeletalMuscleText}</span>
                  <span>{row.bodyFatText}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {selectedRow && selectedCheckIn ? (
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
                <p>{selectedRow.note || "저장된 메모가 없습니다."}</p>
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
      ) : null}
    </section>
  );
}
