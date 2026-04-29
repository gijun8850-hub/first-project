"use client";

import React, { useEffect, useState } from "react";
import { CheckInScreen } from "@/components/body-composition/check-in-screen";
import { DashboardScreen } from "@/components/body-composition/dashboard-screen";
import { GoalScreen } from "@/components/body-composition/goal-screen";
import { HistoryScreen } from "@/components/body-composition/history-screen";
import { LandingScreen } from "@/components/body-composition/landing-screen";
import {
  readBodyCompositionStateFromStorage,
  writeBodyCompositionStateToStorage,
} from "@/lib/body-composition/storage";
import {
  createDraftFromRecord,
  removeCheckIn,
  upsertCheckIn,
} from "@/lib/body-composition/check-in-state";
import {
  isSuspiciousCheckIn,
  validateCheckInDraft,
  validateGoalDraft,
} from "@/lib/body-composition/validation";
import type {
  BodyCompositionGoal,
  CheckInDraft,
  CheckInRecord,
  GoalDraft,
} from "@/types/body-composition";

type Screen = "landing" | "dashboard";
type ModalView = "check-in" | "history" | "goal" | null;

function createEmptyDraft(): CheckInDraft {
  return {
    measuredAt: "",
    weightKg: "",
    skeletalMuscleKg: "",
    bodyFatPercent: "",
    note: "",
  };
}

function createEmptyGoalDraft(): GoalDraft {
  return {
    targetWeightKg: "",
    targetBodyFatPercent: "",
  };
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function BodyCompositionApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [modalView, setModalView] = useState<ModalView>(null);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [goal, setGoal] = useState<BodyCompositionGoal | null>(null);
  const [draft, setDraft] = useState<CheckInDraft>(createEmptyDraft());
  const [goalDraft, setGoalDraft] = useState<GoalDraft>(createEmptyGoalDraft());
  const [errors, setErrors] = useState<string[]>([]);
  const [goalErrors, setGoalErrors] = useState<string[]>([]);
  const [confirmSuspiciousSave, setConfirmSuspiciousSave] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [editingCheckInId, setEditingCheckInId] = useState<string | null>(null);
  const [pendingDeleteCheckInId, setPendingDeleteCheckInId] = useState<string | null>(
    null,
  );
  const [selectedCheckInId, setSelectedCheckInId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const state = readBodyCompositionStateFromStorage(window.localStorage);
    setCheckIns(state.checkIns);
    setGoal(state.goal);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
      return;
    }

    writeBodyCompositionStateToStorage(window.localStorage, {
      checkIns,
      goal,
    });
  }, [checkIns, goal, hasHydrated]);

  function goLandingHome() {
    setModalView(null);
    setGoalErrors([]);
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setEditingCheckInId(null);
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
    setScreen("landing");
  }

  function goDashboard() {
    setModalView(null);
    setGoalErrors([]);
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setEditingCheckInId(null);
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
    setScreen("dashboard");
  }

  function openCheckIn() {
    setScreen("dashboard");
    setModalView("check-in");
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setEditingCheckInId(null);
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
    setDraft({ ...createEmptyDraft(), measuredAt: todayDate() });
  }

  function openEditCheckIn(id: string) {
    const selected = checkIns.find((checkIn) => checkIn.id === id);

    if (!selected) {
      return;
    }

    setScreen("dashboard");
    setModalView("check-in");
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
    setEditingCheckInId(id);
    setDraft(createDraftFromRecord(selected));
  }

  function openHistory() {
    setScreen("dashboard");
    setModalView("history");
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
  }

  function openGoalSettings() {
    setScreen("dashboard");
    setModalView("goal");
    setGoalErrors([]);
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
    setGoalDraft(
      goal
        ? {
            targetWeightKg: String(goal.targetWeightKg),
            targetBodyFatPercent: String(goal.targetBodyFatPercent),
          }
        : createEmptyGoalDraft(),
    );
  }

  function closeOverlay() {
    setModalView(null);
    setGoalErrors([]);
    setEditingCheckInId(null);
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
  }

  function openCheckInDetail(id: string) {
    setScreen("dashboard");
    setSelectedCheckInId(id);
  }

  function handleChange(field: keyof CheckInDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors([]);
    setConfirmSuspiciousSave(false);
  }

  function handleGoalChange(field: keyof GoalDraft, value: string) {
    setGoalDraft((current) => ({ ...current, [field]: value }));
    setGoalErrors([]);
  }

  function handleSave() {
    const nextErrors = validateCheckInDraft(draft);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setConfirmSuspiciousSave(false);
      return;
    }

    const nextRecord: CheckInRecord = {
      id: editingCheckInId ?? crypto.randomUUID(),
      measuredAt: draft.measuredAt,
      weightKg: Number(draft.weightKg),
      skeletalMuscleKg: Number(draft.skeletalMuscleKg),
      bodyFatPercent: Number(draft.bodyFatPercent),
      note: draft.note.trim(),
    };

    if (isSuspiciousCheckIn(nextRecord) && !confirmSuspiciousSave) {
      setConfirmSuspiciousSave(true);
      return;
    }

    setCheckIns((current) => upsertCheckIn(current, nextRecord));
    setDraft(createEmptyDraft());
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setEditingCheckInId(null);
    setSelectedCheckInId(null);
    setModalView(null);
    setScreen("dashboard");
  }

  function handleGoalSave() {
    const nextErrors = validateGoalDraft(goalDraft);

    if (nextErrors.length > 0) {
      setGoalErrors(nextErrors);
      return;
    }

    setGoal({
      targetWeightKg: Number(goalDraft.targetWeightKg),
      targetBodyFatPercent: Number(goalDraft.targetBodyFatPercent),
    });
    setGoalErrors([]);
    setModalView(null);
    setScreen("dashboard");
  }

  function handleClearGoal() {
    setGoal(null);
    setGoalDraft(createEmptyGoalDraft());
    setGoalErrors([]);
    setModalView(null);
    setScreen("dashboard");
  }

  function requestDeleteCheckIn(id: string) {
    setPendingDeleteCheckInId(id);
  }

  function confirmDeleteCheckIn() {
    if (!pendingDeleteCheckInId) {
      return;
    }

    setCheckIns((current) => removeCheckIn(current, pendingDeleteCheckInId));
    setPendingDeleteCheckInId(null);
    setSelectedCheckInId(null);
    setEditingCheckInId(null);
    setModalView(null);
    setScreen("dashboard");
  }

  const deleteTarget = pendingDeleteCheckInId
    ? checkIns.find((checkIn) => checkIn.id === pendingDeleteCheckInId) ?? null
    : null;

  return (
    <main className="coach-shell">
      {screen === "landing" ? (
        <LandingScreen onEnterDashboard={goDashboard} />
      ) : (
        <>
          <header className="coach-header" data-screen="dashboard">
            <div>
              <div className="coach-header-nav">
                <button
                  className="coach-nav-button"
                  data-action="go-home"
                  onClick={goLandingHome}
                  type="button"
                >
                  홈
                </button>
                <button
                  className="coach-nav-button coach-nav-button-active"
                  data-action="go-dashboard"
                  onClick={goDashboard}
                  type="button"
                >
                  대시보드
                </button>
              </div>
              <strong>이번 주 숫자를 다음 행동으로 바꾸기</strong>
            </div>

            <div className="coach-header-actions">
              <button
                className="coach-secondary-button"
                data-action="open-goal-settings"
                onClick={openGoalSettings}
                type="button"
              >
                목표 설정
              </button>
              <button className="coach-secondary-button" onClick={openHistory} type="button">
                기록 보기
              </button>
              <button className="coach-primary-button" onClick={openCheckIn} type="button">
                체크인 추가
              </button>
            </div>
          </header>

          <DashboardScreen
            checkIns={checkIns}
            goal={goal}
            onAddCheckIn={openCheckIn}
            onCloseCheckInDetail={() => setSelectedCheckInId(null)}
            onEditCheckIn={openEditCheckIn}
            onOpenCheckInDetail={openCheckInDetail}
            onOpenGoalSettings={openGoalSettings}
            onOpenHistory={openHistory}
            onRequestDeleteCheckIn={requestDeleteCheckIn}
            selectedCheckInId={selectedCheckInId}
          />
        </>
      )}

      {modalView === "check-in" ? (
        <div className="coach-modal-backdrop" onClick={closeOverlay}>
          <div
            aria-label="weekly check-in"
            aria-modal="true"
            className="coach-modal-window coach-modal-window-wide"
            data-modal-view="check-in"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <CheckInScreen
              draft={draft}
              errors={errors}
              isEditing={Boolean(editingCheckInId)}
              showSuspiciousWarning={confirmSuspiciousSave}
              onBack={() => {
                setErrors([]);
                setConfirmSuspiciousSave(false);
                closeOverlay();
              }}
              onChange={handleChange}
              onSave={handleSave}
            />
          </div>
        </div>
      ) : null}

      {modalView === "goal" ? (
        <div className="coach-modal-backdrop" onClick={closeOverlay}>
          <div
            aria-label="goal settings"
            aria-modal="true"
            className="coach-modal-window coach-modal-window-compact"
            data-modal-view="goal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <GoalScreen
              draft={goalDraft}
              errors={goalErrors}
              hasSavedGoal={Boolean(goal)}
              onBack={closeOverlay}
              onChange={handleGoalChange}
              onClear={handleClearGoal}
              onSave={handleGoalSave}
            />
          </div>
        </div>
      ) : null}

      {modalView === "history" ? (
        <div className="coach-modal-backdrop" onClick={closeOverlay}>
          <div
            aria-label="check-in history"
            aria-modal="true"
            className="coach-modal-window"
            data-modal-view="history"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <HistoryScreen
              checkIns={checkIns}
              onBack={closeOverlay}
              onSelectCheckIn={openCheckInDetail}
            />
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="coach-modal-backdrop" onClick={() => setPendingDeleteCheckInId(null)}>
          <div
            aria-label="delete check-in"
            aria-modal="true"
            className="coach-modal-window coach-modal-window-compact"
            data-modal-view="delete-check-in"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <section className="coach-panel coach-detail-modal">
              <div>
                <span className="coach-section-label">삭제 확인</span>
                <h2>{deleteTarget.measuredAt} 체크인을 삭제할까요?</h2>
                <p className="coach-summary-copy coach-confirm-copy">
                  삭제하면 이 기록은 대시보드와 추이 계산에서 바로 빠집니다.
                </p>
              </div>

              <div className="coach-detail-actions">
                <button
                  className="coach-secondary-button"
                  onClick={() => setPendingDeleteCheckInId(null)}
                  type="button"
                >
                  취소
                </button>
                <button className="coach-danger-button" onClick={confirmDeleteCheckIn} type="button">
                  삭제
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </main>
  );
}
