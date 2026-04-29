import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BodyCompositionApp } from "@/components/body-composition/body-composition-app";
import { CheckInScreen } from "@/components/body-composition/check-in-screen";
import { DashboardScreen } from "@/components/body-composition/dashboard-screen";
import { HistoryScreen } from "@/components/body-composition/history-screen";
import type { CheckInDraft, CheckInRecord } from "@/types/body-composition";

const checkIns: CheckInRecord[] = [
  {
    id: "latest",
    measuredAt: "2026-04-27",
    weightKg: 74.8,
    skeletalMuscleKg: 33.1,
    bodyFatPercent: 16.4,
    note: "Run intervals after upper-body day.",
  },
  {
    id: "previous",
    measuredAt: "2026-04-20",
    weightKg: 75.4,
    skeletalMuscleKg: 33.2,
    bodyFatPercent: 16.8,
    note: "",
  },
  {
    id: "older",
    measuredAt: "2026-04-13",
    weightKg: 75.9,
    skeletalMuscleKg: 33.0,
    bodyFatPercent: 17.2,
    note: "",
  },
];

const draft: CheckInDraft = {
  measuredAt: "2026-04-27",
  weightKg: "74.8",
  skeletalMuscleKg: "33.1",
  bodyFatPercent: "16.4",
  note: "",
};

test("DashboardScreen renders the empty state with a primary action", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={[]}
      onAddCheckIn={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /data-dashboard="true"/);
  assert.match(html, /data-empty-state="true"/);
  assert.match(html, /data-action="open-check-in"/);
});

test("DashboardScreen renders summary cards and clickable history preview rows", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      onAddCheckIn={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /data-coach-summary="true"/);
  assert.match(html, /data-metric-card="weight"/);
  assert.match(html, /data-metric-card="skeletal-muscle"/);
  assert.match(html, /data-metric-card="body-fat"/);
  assert.match(html, /data-history-preview="true"/);
  assert.match(html, /data-record-trigger="latest"/);
});

test("DashboardScreen renders a record dialog when a preview row is selected", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      {...({
        checkIns,
        onAddCheckIn: () => {},
        onOpenHistory: () => {},
        onOpenCheckInDetail: () => {},
        onCloseCheckInDetail: () => {},
        selectedCheckInId: "latest",
      } as any)}
    />,
  );

  assert.match(html, /role="dialog"/);
  assert.match(html, /data-record-dialog="latest"/);
  assert.match(html, /Run intervals after upper-body day\./);
});

test("CheckInScreen renders form fields and validation feedback", () => {
  const html = renderToStaticMarkup(
    <CheckInScreen
      draft={draft}
      errors={["Weight is required."]}
      showSuspiciousWarning={false}
      onBack={() => {}}
      onChange={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(html, /data-check-in-form="true"/);
  assert.match(html, /name="measuredAt"/);
  assert.match(html, /name="weightKg"/);
  assert.match(html, /data-error-list="true"/);
});

test("HistoryScreen renders the full history list and note text", () => {
  const html = renderToStaticMarkup(
    <HistoryScreen checkIns={checkIns} onBack={() => {}} />,
  );

  assert.match(html, /data-history-list="true"/);
  assert.match(html, /data-history-row="latest"/);
  assert.match(html, /Run intervals after upper-body day\./);
});

test("BodyCompositionApp renders the dashboard shell on first load", () => {
  const html = renderToStaticMarkup(<BodyCompositionApp />);

  assert.match(html, /data-dashboard="true"/);
});
