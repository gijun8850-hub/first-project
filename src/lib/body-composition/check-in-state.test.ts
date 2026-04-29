import assert from "node:assert/strict";
import test from "node:test";
import {
  createDraftFromRecord,
  removeCheckIn,
  upsertCheckIn,
} from "@/lib/body-composition/check-in-state";
import type { CheckInRecord } from "@/types/body-composition";

const checkIns: CheckInRecord[] = [
  {
    id: "latest",
    measuredAt: "2026-04-27",
    weightKg: 74.8,
    skeletalMuscleKg: 33.1,
    bodyFatPercent: 16.4,
    note: "steady week",
  },
  {
    id: "older",
    measuredAt: "2026-04-20",
    weightKg: 75.4,
    skeletalMuscleKg: 33.2,
    bodyFatPercent: 16.8,
    note: "",
  },
];

test("createDraftFromRecord turns a saved record into editable string inputs", () => {
  const draft = createDraftFromRecord(checkIns[0]);

  assert.equal(draft.measuredAt, "2026-04-27");
  assert.equal(draft.weightKg, "74.8");
  assert.equal(draft.skeletalMuscleKg, "33.1");
  assert.equal(draft.bodyFatPercent, "16.4");
  assert.equal(draft.note, "steady week");
});

test("upsertCheckIn replaces an edited record and keeps newest-first order", () => {
  const next = upsertCheckIn(checkIns, {
    id: "older",
    measuredAt: "2026-04-29",
    weightKg: 74.6,
    skeletalMuscleKg: 33.4,
    bodyFatPercent: 16.1,
    note: "edited",
  });

  assert.equal(next[0].id, "older");
  assert.equal(next[0].note, "edited");
  assert.equal(next.length, 2);
});

test("removeCheckIn deletes only the targeted record", () => {
  const next = removeCheckIn(checkIns, "older");

  assert.deepEqual(next.map((checkIn) => checkIn.id), ["latest"]);
});
