import assert from "node:assert/strict";
import test from "node:test";
import {
  BODY_COMPOSITION_STORAGE_KEY,
  parseStoredBodyCompositionState,
  parseStoredCheckIns,
  readBodyCompositionStateFromStorage,
  readCheckInsFromStorage,
  writeBodyCompositionStateToStorage,
  writeCheckInsToStorage,
} from "@/lib/body-composition/storage";
import {
  isSuspiciousCheckIn,
  validateCheckInDraft,
  validateGoalDraft,
} from "@/lib/body-composition/validation";
import type { CheckInDraft, GoalDraft } from "@/types/body-composition";

test("parseStoredCheckIns falls back to an empty array for invalid JSON", () => {
  assert.deepEqual(parseStoredCheckIns("not-json"), []);
});

test("parseStoredBodyCompositionState supports the legacy array payload", () => {
  const state = parseStoredBodyCompositionState(
    JSON.stringify([
      {
        id: "latest",
        measuredAt: "2026-04-27",
        weightKg: 74.8,
        skeletalMuscleKg: 33.1,
        bodyFatPercent: 16.4,
        note: "",
      },
    ]),
  );

  assert.equal(state.goal, null);
  assert.equal(state.checkIns[0].id, "latest");
  assert.equal(state.checkIns[0].heightCm, null);
});

test("readCheckInsFromStorage sorts newer check-ins first", () => {
  const storage = {
    getItem() {
      return JSON.stringify([
        {
          id: "older",
          measuredAt: "2026-04-20",
          heightCm: 178,
          weightKg: 75.4,
          skeletalMuscleKg: 33.2,
          bodyFatPercent: 16.8,
          note: "",
        },
        {
          id: "latest",
          measuredAt: "2026-04-27",
          heightCm: 178,
          weightKg: 74.8,
          skeletalMuscleKg: 33.1,
          bodyFatPercent: 16.4,
          note: "",
        },
      ]);
    },
    setItem() {},
  };

  const rows = readCheckInsFromStorage(storage);
  assert.equal(rows[0].id, "latest");
});

test("writeCheckInsToStorage serializes data under the expected key", () => {
  let savedKey = "";
  let savedValue = "";

  const storage = {
    getItem() {
      return null;
    },
    setItem(key: string, value: string) {
      savedKey = key;
      savedValue = value;
    },
  };

  writeCheckInsToStorage(storage, [
    {
      id: "latest",
      measuredAt: "2026-04-27",
      heightCm: 178,
      weightKg: 74.8,
      skeletalMuscleKg: 33.1,
      bodyFatPercent: 16.4,
      note: "",
    },
  ]);

  assert.equal(savedKey, BODY_COMPOSITION_STORAGE_KEY);
  assert.match(savedValue, /74.8/);
  assert.match(savedValue, /178/);
});

test("readBodyCompositionStateFromStorage returns goal data from object payloads", () => {
  const storage = {
    getItem() {
      return JSON.stringify({
        checkIns: [
          {
            id: "latest",
            measuredAt: "2026-04-27",
            heightCm: 178,
            weightKg: 74.8,
            skeletalMuscleKg: 33.1,
            bodyFatPercent: 16.4,
            note: "",
          },
        ],
        goal: {
          targetWeightKg: 73,
          targetBodyFatPercent: 15,
        },
      });
    },
    setItem() {},
  };

  const state = readBodyCompositionStateFromStorage(storage);
  assert.equal(state.goal?.targetWeightKg, 73);
  assert.equal(state.goal?.targetBodyFatPercent, 15);
});

test("writeBodyCompositionStateToStorage serializes goal alongside check-ins", () => {
  let savedValue = "";

  const storage = {
    getItem() {
      return null;
    },
    setItem(_: string, value: string) {
      savedValue = value;
    },
  };

  writeBodyCompositionStateToStorage(storage, {
    checkIns: [
      {
        id: "latest",
        measuredAt: "2026-04-27",
        heightCm: 178,
        weightKg: 74.8,
        skeletalMuscleKg: 33.1,
        bodyFatPercent: 16.4,
        note: "",
      },
    ],
    goal: {
      targetWeightKg: 73,
      targetBodyFatPercent: 15,
    },
  });

  assert.match(savedValue, /targetWeightKg/);
  assert.match(savedValue, /73/);
  assert.match(savedValue, /heightCm/);
});

test("validateCheckInDraft requires date and all numeric fields", () => {
  const draft: CheckInDraft = {
    measuredAt: "",
    heightCm: "",
    weightKg: "",
    skeletalMuscleKg: "",
    bodyFatPercent: "",
    note: "",
  };

  assert.deepEqual(validateCheckInDraft(draft), [
    "측정 날짜를 입력하세요.",
    "키를 입력하세요.",
    "체중을 입력하세요.",
    "골격근량을 입력하세요.",
    "체지방률을 입력하세요.",
  ]);
});

test("validateGoalDraft requires both numeric target fields", () => {
  const draft: GoalDraft = {
    targetWeightKg: "",
    targetBodyFatPercent: "",
  };

  assert.deepEqual(validateGoalDraft(draft), [
    "목표 체중을 입력하세요.",
    "목표 체지방률을 입력하세요.",
  ]);
});

test("isSuspiciousCheckIn flags obviously invalid ranges", () => {
  assert.equal(
    isSuspiciousCheckIn({
      heightCm: 178,
      weightKg: 74.8,
      skeletalMuscleKg: 33.1,
      bodyFatPercent: 16.4,
    }),
    false,
  );

  assert.equal(
    isSuspiciousCheckIn({
      heightCm: 244,
      weightKg: 12,
      skeletalMuscleKg: 3,
      bodyFatPercent: 72,
    }),
    true,
  );
});
