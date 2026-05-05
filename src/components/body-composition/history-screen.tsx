import React from "react";
import { ScreenNavigation } from "@/components/body-composition/screen-navigation";
import { buildHistoryRows } from "@/lib/body-composition/coach-engine";
import type {
  BodyCompositionRoute,
  CheckInRecord,
} from "@/types/body-composition";

type HistoryScreenProps = {
  checkIns: CheckInRecord[];
  currentView: BodyCompositionRoute;
  onAddCheckIn: () => void;
  onBack: () => void;
  onChangeView: (view: BodyCompositionRoute) => void;
  onSelectCheckIn?: (id: string) => void;
};

export function HistoryScreen({
  checkIns,
  currentView,
  onAddCheckIn,
  onBack,
  onChangeView,
  onSelectCheckIn,
}: HistoryScreenProps) {
  const rows = buildHistoryRows(checkIns);

  return (
    <section className="coach-screen-layout" data-screen-panel="history">
      <ScreenNavigation currentView={currentView} onChangeView={onChangeView} />

      <section className="coach-panel coach-history-screen">
        <div className="coach-section-head">
          <div>
            <span className="coach-section-label">기록 보기</span>
            <h1>전체 체크인 기록</h1>
          </div>

          <div className="coach-header-actions">
            <button className="coach-secondary-button" onClick={onBack} type="button">
              홈으로
            </button>
            <button className="coach-primary-button" onClick={onAddCheckIn} type="button">
              체크인 추가
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="coach-muted">아직 저장한 체크인이 없습니다.</p>
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
    </section>
  );
}
