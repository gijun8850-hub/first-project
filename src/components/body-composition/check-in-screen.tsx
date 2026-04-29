import React from "react";
import type { CheckInDraft } from "@/types/body-composition";

type CheckInScreenProps = {
  draft: CheckInDraft;
  errors: string[];
  isEditing?: boolean;
  showSuspiciousWarning: boolean;
  onBack: () => void;
  onChange: (field: keyof CheckInDraft, value: string) => void;
  onSave: () => void;
};

export function CheckInScreen({
  draft,
  errors,
  isEditing,
  showSuspiciousWarning,
  onBack,
  onChange,
  onSave,
}: CheckInScreenProps) {
  return (
    <section className="coach-panel coach-form-shell" data-check-in-form="true">
      <div className="coach-section-head">
        <div>
          <span className="coach-section-label">주간 체크인</span>
          <h1>{isEditing ? "체크인을 수정하세요." : "이번 주 체성분을 입력하세요."}</h1>
        </div>

        <button className="coach-secondary-button" onClick={onBack} type="button">
          돌아가기
        </button>
      </div>

      <div className="coach-form-grid">
        <label className="coach-field">
          <span>측정 날짜</span>
          <input
            name="measuredAt"
            type="date"
            value={draft.measuredAt}
            onChange={(event) => onChange("measuredAt", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>키 (cm)</span>
          <input
            inputMode="decimal"
            name="heightCm"
            value={draft.heightCm}
            onChange={(event) => onChange("heightCm", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>체중 (kg)</span>
          <input
            inputMode="decimal"
            name="weightKg"
            value={draft.weightKg}
            onChange={(event) => onChange("weightKg", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>골격근량 (kg)</span>
          <input
            inputMode="decimal"
            name="skeletalMuscleKg"
            value={draft.skeletalMuscleKg}
            onChange={(event) => onChange("skeletalMuscleKg", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>체지방률 (%)</span>
          <input
            inputMode="decimal"
            name="bodyFatPercent"
            value={draft.bodyFatPercent}
            onChange={(event) => onChange("bodyFatPercent", event.target.value)}
          />
        </label>
      </div>

      <label className="coach-field">
        <span>이번 주 메모</span>
        <textarea
          name="note"
          rows={4}
          value={draft.note}
          onChange={(event) => onChange("note", event.target.value)}
        />
      </label>

      {errors.length > 0 ? (
        <ul className="coach-error-list" data-error-list="true">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      {showSuspiciousWarning ? (
        <p className="coach-warning">
          입력값이 일반적인 범위를 벗어났습니다. 숫자를 다시 확인했으면 한 번 더 저장하세요.
        </p>
      ) : null}

      <div className="coach-form-actions">
        <button className="coach-primary-button" onClick={onSave} type="button">
          {isEditing ? "수정 저장" : "체크인 저장"}
        </button>
      </div>
    </section>
  );
}
