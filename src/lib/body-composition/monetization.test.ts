import assert from "node:assert/strict";
import test from "node:test";
import {
  BODY_COMPOSITION_AD_SLOTS,
  buildAdRailViewModel,
  getNextAdSlotIndex,
} from "@/lib/body-composition/monetization";

test("getNextAdSlotIndex wraps cleanly", () => {
  assert.equal(getNextAdSlotIndex(0, 3), 1);
  assert.equal(getNextAdSlotIndex(2, 3), 0);
  assert.equal(getNextAdSlotIndex(0, 0), 0);
});

test("buildAdRailViewModel returns the active free slot", () => {
  const freeView = buildAdRailViewModel({
    plan: "free",
    activeIndex: 0,
    slots: BODY_COMPOSITION_AD_SLOTS,
  });
  assert.equal(freeView.mode, "free");
  assert.equal(freeView.slot?.id, BODY_COMPOSITION_AD_SLOTS[0]?.id);
});

test("buildAdRailViewModel hides the ad slot for premium plans", () => {
  const premiumView = buildAdRailViewModel({
    plan: "premium",
    activeIndex: 0,
    slots: BODY_COMPOSITION_AD_SLOTS,
  });
  assert.equal(premiumView.mode, "premium");
});

test("buildAdRailViewModel falls back safely when free slots are empty", () => {
  const fallbackView = buildAdRailViewModel({
    plan: "free",
    activeIndex: 9,
    slots: [],
  });
  assert.equal(fallbackView.mode, "free");
  assert.equal(fallbackView.slot?.id, "fallback");
});
