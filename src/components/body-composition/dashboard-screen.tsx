import React from "react";
import { HistoryScreen } from "@/components/body-composition/history-screen";
import { LandingScreen } from "@/components/body-composition/landing-screen";
import { PremiumLockCard } from "@/components/body-composition/premium-lock-card";
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
  BodyCompositionPlan,
  BodyCompositionRoute,
  CheckInRecord,
} from "@/types/body-composition";

type DashboardScreenProps = {
  checkIns: CheckInRecord[];
  currentView: BodyCompositionRoute;
  goal?: BodyCompositionGoal | null;
  plan: BodyCompositionPlan;
  onAddCheckIn: () => void;
  onChangeView: (view: BodyCompositionRoute) => void;
  onCloseCheckInDetail?: () => void;
  onEditCheckIn?: (id: string) => void;
  onOpenCheckInDetail?: (id: string) => void;
  onOpenGoalSettings?: () => void;
  onOpenHistory: () => void;
  onRequestDeleteCheckIn?: (id: string) => void;
  onRequestPremiumPreview: () => void;
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
      detail: `${latest.measuredAt} 기록까지 반영됐습니다. 지금 흐름을 유지하면 됩니다.`,
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
    <div className="coach-modal-backdrop" onClick={onCloseCheckInDetail}>
      <article
        aria-label="selected check-in details"
        aria-modal="true"
        className="coach-modal-window coach-modal-window-compact"
        data-record-dialog={selectedRow.id}
        onClick={(event) => event.stopPropagation()}
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
        currentStatusSummary="첫 체크인을 넣으면 몸 변화 흐름과 주간 상태가 여기에 바로 보입니다."
        goalSummary={null}
        latestMeasuredAtText="최근 체크인이 아직 없습니다."
        streakLabel="아직 시작 전"
        weeklyStatusDetail="체성분 수치를 입력하면 다음 주 운동 방향까지 이어서 정리됩니다."
        weeklyStatusLabel="이번 주 체크인 필요"
        onAddCheckIn={onAddCheckIn}
        onViewCoach={() => onChangeView("coach")}
        onViewProgress={() => onChangeView("progress")}
      />
    );
  }

  return (
    <section className="coach-screen-body" data-screen-panel={currentView}>
      <section className="coach-panel coach-empty-state" data-empty-state="true">
        <span className="coach-section-label">주간체크 시작</span>
        <h1>첫 체크인을 추가하면 이 화면이 목적에 맞게 채워집니다.</h1>
        <p>홈에서는 연속 체크인, 진행에서는 그래프, 기록에서는 목록, 코치에서는 해석이 보이게 됩니다.</p>
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
  plan,
  onAddCheckIn,
  onChangeView,
  onCloseCheckInDetail,
  onEditCheckIn,
  onOpenCheckInDetail,
  onOpenGoalSettings,
  onOpenHistory,
  onRequestDeleteCheckIn,
  onRequestPremiumPreview,
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
  const latestMeasuredAtText = consistency.supportingCopy.replace("최근 체크인", "최근 측정");

  if (currentView === "home") {
    return (
      <LandingScreen
        currentStatusLabel={currentStatus.label}
        currentStatusSummary={currentStatus.summary}
        goalSummary={goalProgress?.summary ?? null}
        latestMeasuredAtText={latestMeasuredAtText}
        streakLabel={consistency.streakLabel}
        weeklyStatusDetail={weeklyStatus.detail}
        weeklyStatusLabel={weeklyStatus.label}
        onAddCheckIn={onAddCheckIn}
        onViewCoach={() => onChangeView("coach")}
        onViewProgress={() => onChangeView("progress")}
      />
    );
  }

  if (currentView === "history") {
    return (
      <>
        <HistoryScreen
          checkIns={checkIns}
          onAddCheckIn={onAddCheckIn}
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
      <section className="coach-screen-body" data-screen-panel="coach">
        <section className="coach-panel coach-coach-primary" data-coach-primary="true">
          <span className="coach-current-status-badge">{currentStatus.label}</span>
          <h1>{summary.headline}</h1>
          <p className="coach-summary-copy">{summary.subline}</p>
          <ul className="coach-action-list">
            {summary.actionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="coach-home-meta-row coach-coach-supporting">
          <article className="coach-panel coach-home-mini-panel" data-weekly-progress="true">
            <span className="coach-section-label">이번 주 진행</span>
            <strong>{weeklyProgress}</strong>
            <p>{currentStatus.detail}</p>
          </article>

          {plan === "premium" ? (
            <article className="coach-panel coach-home-mini-panel" data-premium-active="coach">
              <span className="coach-section-label">Premium 활성화</span>
              <strong>더 긴 기간 비교와 깊은 해석이 열려 있습니다.</strong>
              <p>무료 상태보다 더 긴 흐름과 해석을 다음 단계에서 확장할 수 있습니다.</p>
            </article>
          ) : (
            <PremiumLockCard
              slotId="coach-deep-dive"
              title="더 깊은 코치 해석"
              copy="Premium에서는 기간별 비교와 더 긴 해석 문장을 함께 보여줍니다."
              onPreviewPremium={onRequestPremiumPreview}
            />
          )}
        </section>
      </section>
    );
  }

  return (
    <section className="coach-screen-body" data-screen-panel="progress">
      <section className="coach-progress-overview">
        {metrics.map((metric, index) => {
          const metricIds = ["weight", "skeletal-muscle", "body-fat"];

          return (
            <article
              className="coach-panel coach-progress-metric"
              data-metric-card={metricIds[index]}
              key={metric.label}
            >
              <span className="coach-section-label">{metric.label}</span>
              <strong>{metric.valueText}</strong>
              <p>{metric.deltaText}</p>
            </article>
          );
        })}
      </section>

      <section className="coach-panel coach-progress-primary">
        <div className="coach-section-head">
          <div>
            <span className="coach-section-label">변화 추이</span>
            <h1>최근 4주 흐름</h1>
          </div>
          <button className="coach-text-button" onClick={onOpenHistory} type="button">
            기록 보기
          </button>
        </div>
        <TrendChart points={points} />
      </section>

      <section className="coach-home-meta-row">
        <article className="coach-panel coach-home-mini-panel" data-goal-summary="true">
          <span className="coach-section-label">목표 진행</span>
          <strong>
            {goalProgress?.summary ?? "목표를 설정하면 현재 수치와 남은 차이를 바로 보여줍니다."}
          </strong>
          <p>
            {goalProgress
              ? `${goalProgress.targetWeightText} / ${goalProgress.targetBodyFatText}`
              : "목표 설정을 열어서 체중과 체지방률 목표를 저장하세요."}
          </p>
          {onOpenGoalSettings ? (
            <button className="coach-secondary-button" onClick={onOpenGoalSettings} type="button">
              목표 설정
            </button>
          ) : null}
        </article>

        {plan === "premium" ? (
          <article className="coach-panel coach-home-mini-panel" data-premium-active="progress">
            <span className="coach-section-label">Premium 활성화</span>
            <strong>긴 기간 비교와 리포트 기능을 이어서 확장할 수 있습니다.</strong>
            <p>무료 상태에서는 최근 흐름만, Premium에서는 더 긴 비교를 여는 구조입니다.</p>
          </article>
        ) : (
          <PremiumLockCard
            slotId="period-compare"
            title="긴 기간 비교와 리포트"
            copy="Premium에서는 8주 이상 비교와 PDF 리포트 슬롯을 여는 방향으로 확장됩니다."
            onPreviewPremium={onRequestPremiumPreview}
          />
        )}
      </section>
    </section>
  );
}
