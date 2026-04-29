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
    note: "유산소 2회",
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

test("DashboardScreen renders the empty state when no check-ins exist", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={[]}
      onAddCheckIn={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /첫 주간 체크인/);
  assert.match(html, /체크인 추가/);
});

test("DashboardScreen renders the coach summary, metrics, and recent history", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      onAddCheckIn={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /이번 주 코치/);
  assert.match(html, /체중/);
  assert.match(html, /골격근량/);
  assert.match(html, /체지방률/);
  assert.match(html, /최근 체크인/);
});

test("CheckInScreen renders field labels and validation text", () => {
  const html = renderToStaticMarkup(
    <CheckInScreen
      draft={draft}
      errors={["체중을 입력하세요."]}
      showSuspiciousWarning={false}
      onBack={() => {}}
      onChange={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(html, /측정 날짜/);
  assert.match(html, /골격근량/);
  assert.match(html, /체중을 입력하세요/);
});

test("HistoryScreen renders rows and note text", () => {
  const html = renderToStaticMarkup(
    <HistoryScreen checkIns={checkIns} onBack={() => {}} />,
  );

  assert.match(html, /기록 보기/);
  assert.match(html, /2026.04.27/);
  assert.match(html, /유산소 2회/);
});

test("BodyCompositionApp renders the dashboard shell on first load", () => {
  const html = renderToStaticMarkup(<BodyCompositionApp />);

  assert.match(html, /주간 체성분 코치/);
  assert.match(html, /첫 주간 체크인/);
});
