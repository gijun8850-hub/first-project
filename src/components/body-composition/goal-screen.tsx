import React from "react";
import type { GoalDraft } from "@/types/body-composition";

type GoalScreenProps = {
  draft: GoalDraft;
  errors: string[];
  hasSavedGoal: boolean;
  onBack: () => void;
  onChange: (field: keyof GoalDraft, value: string) => void;
  onClear: () => void;
  onSave: () => void;
};

export function GoalScreen({
  draft,
  errors,
  hasSavedGoal,
  onBack,
  onChange,
  onClear,
  onSave,
}: GoalScreenProps) {
  return (
    <section className="coach-panel coach-form-shell" data-goal-form="true">
      <div className="coach-section-head">
        <div>
          <span className="coach-section-label">목표 설정</span>
          <h1>이번 사이클 목표를 정하세요.</h1>
        </div>

        <button className="coach-secondary-button" onClick={onBack} type="button">
          돌아가기
        </button>
      </div>

      <div className="coach-form-grid">
        <label className="coach-field">
          <span>목표 체중 (kg)</span>
          <input
            inputMode="decimal"
            name="targetWeightKg"
            value={draft.targetWeightKg}
            onChange={(event) => onChange("targetWeightKg", event.target.value)}
          />
        </label>

        <label className="coach-field">
          <span>목표 체지방률 (%)</span>
          <input
            inputMode="decimal"
            name="targetBodyFatPercent"
            value={draft.targetBodyFatPercent}
            onChange={(event) => onChange("targetBodyFatPercent", event.target.value)}
          />
        </label>
      </div>

      {errors.length > 0 ? (
        <ul className="coach-error-list" data-error-list="true">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      <div className="coach-form-actions">
        {hasSavedGoal ? (
          <button className="coach-danger-button" onClick={onClear} type="button">
            목표 삭제
          </button>
        ) : null}
        <button className="coach-primary-button" onClick={onSave} type="button">
          목표 저장
        </button>
      </div>
    </section>
  );
}
