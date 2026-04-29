"use client";

import React, { useEffect, useState } from "react";
import { CheckInScreen } from "@/components/body-composition/check-in-screen";
import { DashboardScreen } from "@/components/body-composition/dashboard-screen";
import { HistoryScreen } from "@/components/body-composition/history-screen";
import {
  readCheckInsFromStorage,
  writeCheckInsToStorage,
} from "@/lib/body-composition/storage";
import {
  isSuspiciousCheckIn,
  validateCheckInDraft,
} from "@/lib/body-composition/validation";
import type { CheckInDraft, CheckInRecord } from "@/types/body-composition";

type View = "dashboard" | "check-in" | "history";

function createEmptyDraft(): CheckInDraft {
  return {
    measuredAt: "",
    weightKg: "",
    skeletalMuscleKg: "",
    bodyFatPercent: "",
    note: "",
  };
}

function sortNewestFirst(checkIns: CheckInRecord[]) {
  return [...checkIns].sort((left, right) =>
    right.measuredAt.localeCompare(left.measuredAt),
  );
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function BodyCompositionApp() {
  const [view, setView] = useState<View>("dashboard");
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [draft, setDraft] = useState<CheckInDraft>(createEmptyDraft());
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmSuspiciousSave, setConfirmSuspiciousSave] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [selectedCheckInId, setSelectedCheckInId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setCheckIns(readCheckInsFromStorage(window.localStorage));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
      return;
    }

    writeCheckInsToStorage(window.localStorage, checkIns);
  }, [checkIns, hasHydrated]);

  function openCheckIn() {
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setSelectedCheckInId(null);
    setDraft((current) =>
      current.measuredAt ? current : { ...current, measuredAt: todayDate() },
    );
    setView("check-in");
  }

  function openHistory() {
    setSelectedCheckInId(null);
    setView("history");
  }

  function closeOverlay() {
    setView("dashboard");
    setSelectedCheckInId(null);
  }

  function openCheckInDetail(id: string) {
    setView("dashboard");
    setSelectedCheckInId(id);
  }

  function handleChange(field: keyof CheckInDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors([]);
    setConfirmSuspiciousSave(false);
  }

  function handleSave() {
    const nextErrors = validateCheckInDraft(draft);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setConfirmSuspiciousSave(false);
      return;
    }

    const nextRecord: CheckInRecord = {
      id: crypto.randomUUID(),
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

    setCheckIns((current) => sortNewestFirst([nextRecord, ...current]));
    setDraft(createEmptyDraft());
    setErrors([]);
    setConfirmSuspiciousSave(false);
    setSelectedCheckInId(null);
    setView("dashboard");
  }

  return (
    <main className="coach-shell">
      <header className="coach-header">
        <div>
          <span className="coach-section-label">주간 체성분 코치</span>
          <strong>이번 주 숫자를 다음 행동으로 바꾸기</strong>
        </div>

        <div className="coach-header-actions">
          <button
            className="coach-secondary-button"
            onClick={openHistory}
            type="button"
          >
            기록 보기
          </button>
          <button className="coach-primary-button" onClick={openCheckIn} type="button">
            체크인 추가
          </button>
        </div>
      </header>

      <DashboardScreen
        checkIns={checkIns}
        onAddCheckIn={openCheckIn}
        onCloseCheckInDetail={() => setSelectedCheckInId(null)}
        onOpenCheckInDetail={openCheckInDetail}
        onOpenHistory={openHistory}
        selectedCheckInId={selectedCheckInId}
      />

      {view === "check-in" ? (
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

      {view === "history" ? (
        <div className="coach-modal-backdrop" onClick={closeOverlay}>
          <div
            aria-label="check-in history"
            aria-modal="true"
            className="coach-modal-window"
            data-modal-view="history"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <HistoryScreen checkIns={checkIns} onBack={closeOverlay} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
