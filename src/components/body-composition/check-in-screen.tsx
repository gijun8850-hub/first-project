import React from "react";
import type { CheckInDraft } from "@/types/body-composition";

type CheckInScreenProps = {
  draft: CheckInDraft;
  errors: string[];
  showSuspiciousWarning: boolean;
  onBack: () => void;
  onChange: (field: keyof CheckInDraft, value: string) => void;
  onSave: () => void;
};

export function CheckInScreen({
  draft,
  errors,
  showSuspiciousWarning,
  onBack,
  onChange,
  onSave,
}: CheckInScreenProps) {
  return (
    <section className="coach-panel coach-form-shell">
      <div className="coach-section-head">
        <div>
          <span className="coach-section-label">주간 체크인</span>
          <h1>이번 주 체성분을 입력하세요.</h1>
        </div>

        <button className="coach-secondary-button" onClick={onBack} type="button">
          돌아가기
        </button>
      </div>

      <div className="coach-form-grid">
        <label className="coach-field">
          <span>측정 날짜</span>
          <input
            type="date"
            value={draft.measuredAt}
            onChange={(event) => onChange("measuredAt", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>체중 (kg)</span>
          <input
            inputMode="decimal"
            value={draft.weightKg}
            onChange={(event) => onChange("weightKg", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>골격근량 (kg)</span>
          <input
            inputMode="decimal"
            value={draft.skeletalMuscleKg}
            onChange={(event) => onChange("skeletalMuscleKg", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>체지방률 (%)</span>
          <input
            inputMode="decimal"
            value={draft.bodyFatPercent}
            onChange={(event) => onChange("bodyFatPercent", event.target.value)}
          />
        </label>
      </div>

      <label className="coach-field">
        <span>이번 주 메모</span>
        <textarea
          rows={4}
          value={draft.note}
          onChange={(event) => onChange("note", event.target.value)}
        />
      </label>

      {errors.length > 0 ? (
        <ul className="coach-error-list">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      {showSuspiciousWarning ? (
        <p className="coach-warning">
          입력값이 일반적인 범위를 벗어납니다. 숫자를 다시 확인한 뒤 한 번 더 저장하세요.
        </p>
      ) : null}

      <div className="coach-form-actions">
        <button className="coach-primary-button" onClick={onSave} type="button">
          체크인 저장
        </button>
      </div>
    </section>
  );
}
