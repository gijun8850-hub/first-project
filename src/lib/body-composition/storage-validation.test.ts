import assert from "node:assert/strict";
import test from "node:test";
import {
  BODY_COMPOSITION_STORAGE_KEY,
  parseStoredCheckIns,
  readCheckInsFromStorage,
  writeCheckInsToStorage,
} from "@/lib/body-composition/storage";
import {
  isSuspiciousCheckIn,
  validateCheckInDraft,
} from "@/lib/body-composition/validation";
import type { CheckInDraft } from "@/types/body-composition";

test("parseStoredCheckIns falls back to an empty array for invalid JSON", () => {
  assert.deepEqual(parseStoredCheckIns("not-json"), []);
});

test("readCheckInsFromStorage sorts newer check-ins first", () => {
  const storage = {
    getItem() {
      return JSON.stringify([
        {
          id: "older",
          measuredAt: "2026-04-20",
          weightKg: 75.4,
          skeletalMuscleKg: 33.2,
          bodyFatPercent: 16.8,
          note: "",
        },
        {
          id: "latest",
          measuredAt: "2026-04-27",
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
      weightKg: 74.8,
      skeletalMuscleKg: 33.1,
      bodyFatPercent: 16.4,
      note: "",
    },
  ]);

  assert.equal(savedKey, BODY_COMPOSITION_STORAGE_KEY);
  assert.match(savedValue, /74.8/);
});

test("validateCheckInDraft requires date and all numeric fields", () => {
  const draft: CheckInDraft = {
    measuredAt: "",
    weightKg: "",
    skeletalMuscleKg: "",
    bodyFatPercent: "",
    note: "",
  };

  assert.deepEqual(validateCheckInDraft(draft), [
    "측정 날짜를 입력하세요.",
    "체중을 입력하세요.",
    "골격근량을 입력하세요.",
    "체지방률을 입력하세요.",
  ]);
});

test("isSuspiciousCheckIn flags obviously invalid ranges", () => {
  assert.equal(
    isSuspiciousCheckIn({
      weightKg: 74.8,
      skeletalMuscleKg: 33.1,
      bodyFatPercent: 16.4,
    }),
    false,
  );

  assert.equal(
    isSuspiciousCheckIn({
      weightKg: 12,
      skeletalMuscleKg: 3,
      bodyFatPercent: 72,
    }),
    true,
  );
});
