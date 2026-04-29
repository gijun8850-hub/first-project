import React from "react";
import {
  buildCoachSummary,
  buildHistoryRows,
  buildMetricSnapshots,
  buildTrendPoints,
} from "@/lib/body-composition/coach-engine";
import { TrendChart } from "@/components/body-composition/trend-chart";
import type { CheckInRecord } from "@/types/body-composition";

type DashboardScreenProps = {
  checkIns: CheckInRecord[];
  onAddCheckIn: () => void;
  onOpenHistory: () => void;
};

export function DashboardScreen({
  checkIns,
  onAddCheckIn,
  onOpenHistory,
}: DashboardScreenProps) {
  if (checkIns.length === 0) {
    return (
      <section className="coach-panel coach-empty-state">
        <span className="coach-section-label">주간 코치 시작</span>
        <h1>첫 주간 체크인을 추가해 기준선을 만드세요.</h1>
        <p>
          첫 기록을 남기면 다음 주부터 체중, 골격근량, 체지방률 흐름을 읽어서
          이번 주 운동 방향을 제안합니다.
        </p>
        <button className="coach-primary-button" onClick={onAddCheckIn} type="button">
          체크인 추가
        </button>
      </section>
    );
  }

  const summary = buildCoachSummary(checkIns);
  const metrics = buildMetricSnapshots(checkIns);
  const points = buildTrendPoints(checkIns);
  const recentRows = buildHistoryRows(checkIns).slice(0, 3);

  return (
    <section className="coach-dashboard">
      <div className="coach-panel coach-summary-card">
        <div className="coach-summary-head">
          <span className="coach-section-label">이번 주 코치</span>
          <button className="coach-secondary-button" onClick={onAddCheckIn} type="button">
            체크인 추가
          </button>
        </div>

        <h1>{summary.headline}</h1>
        <p className="coach-summary-copy">{summary.subline}</p>

        <ul className="coach-action-list">
          {summary.actionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="coach-metrics-grid">
        {metrics.map((metric) => (
          <article className="coach-panel coach-metric-card" key={metric.label}>
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

          <ul className="coach-history-preview">
            {recentRows.map((row) => (
              <li key={row.id}>
                <strong>{row.measuredAtLabel}</strong>
                <span>{row.weightText}</span>
                <span>{row.skeletalMuscleText}</span>
                <span>{row.bodyFatText}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
