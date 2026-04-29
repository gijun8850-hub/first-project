import React from "react";
import { buildHistoryRows } from "@/lib/body-composition/coach-engine";
import type { CheckInRecord } from "@/types/body-composition";

type HistoryScreenProps = {
  checkIns: CheckInRecord[];
  onBack: () => void;
  onSelectCheckIn?: (id: string) => void;
};

export function HistoryScreen({
  checkIns,
  onBack,
  onSelectCheckIn,
}: HistoryScreenProps) {
  const rows = buildHistoryRows(checkIns);

  return (
    <section className="coach-panel coach-history-screen">
      <div className="coach-section-head">
        <div>
          <span className="coach-section-label">기록 보기</span>
          <h1>전체 체크인 기록</h1>
        </div>

        <button className="coach-secondary-button" onClick={onBack} type="button">
          홈으로
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="coach-muted">아직 저장된 체크인이 없습니다.</p>
      ) : (
        <ul className="coach-history-list" data-history-list="true">
          {rows.map((row) => (
            <li className="coach-history-card" data-history-row={row.id} key={row.id}>
              <button
                className="coach-history-trigger"
                data-history-trigger={row.id}
                onClick={() => onSelectCheckIn?.(row.id)}
                type="button"
              >
                <div className="coach-history-card-head">
                  <strong>{row.measuredAtLabel}</strong>
                  <span>{row.deltaSummary}</span>
                </div>
                <div className="coach-history-metrics">
                  <span>{row.weightText}</span>
                  <span>{row.skeletalMuscleText}</span>
                  <span>{row.bodyFatText}</span>
                </div>
                {row.note ? <p>{row.note}</p> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
