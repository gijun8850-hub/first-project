import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BodyCompositionApp } from "@/components/body-composition/body-composition-app";
import { CheckInScreen } from "@/components/body-composition/check-in-screen";
import { DashboardScreen } from "@/components/body-composition/dashboard-screen";
import { GoalScreen } from "@/components/body-composition/goal-screen";
import { HistoryScreen } from "@/components/body-composition/history-screen";
import { LandingScreen } from "@/components/body-composition/landing-screen";
import type {
  CheckInDraft,
  CheckInRecord,
  GoalDraft,
} from "@/types/body-composition";

const checkIns: CheckInRecord[] = [
  {
    id: "latest",
    measuredAt: "2026-04-27",
    heightCm: 178,
    weightKg: 74.8,
    skeletalMuscleKg: 33.1,
    bodyFatPercent: 16.4,
    note: "Run intervals after upper-body day.",
  },
  {
    id: "previous",
    measuredAt: "2026-04-20",
    heightCm: 178,
    weightKg: 75.4,
    skeletalMuscleKg: 33.2,
    bodyFatPercent: 16.8,
    note: "",
  },
  {
    id: "older",
    measuredAt: "2026-04-13",
    heightCm: 178,
    weightKg: 75.9,
    skeletalMuscleKg: 33.0,
    bodyFatPercent: 17.2,
    note: "",
  },
];

const draft: CheckInDraft = {
  measuredAt: "2026-04-27",
  heightCm: "178",
  weightKg: "74.8",
  skeletalMuscleKg: "33.1",
  bodyFatPercent: "16.4",
  note: "",
};

const goalDraft: GoalDraft = {
  targetWeightKg: "73",
  targetBodyFatPercent: "15",
};

test("DashboardScreen renders a home starter state with a primary action", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={[]}
      currentView="home"
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /data-screen-panel="home"/);
  assert.match(html, /data-home-streak="true"/);
  assert.match(html, /data-action="open-check-in"/);
});

test("BodyCompositionApp renders a single device shell with bottom tabs and a free ad rail", () => {
  const html = renderToStaticMarkup(<BodyCompositionApp />);

  assert.match(html, /data-app-shell="true"/);
  assert.match(html, /data-home-bezel="true"/);
  assert.match(html, /data-bottom-tabs="true"/);
  assert.match(html, /data-ad-rail="free"/);
  assert.doesNotMatch(html, /data-screen-nav="true"/);
});

test("DashboardScreen renders focused home and coach panels without the old card grid", () => {
  const homeHtml = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      currentView="home"
      goal={{ targetWeightKg: 73, targetBodyFatPercent: 15 }}
      plan="free"
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
      onOpenGoalSettings={() => {}}
      onOpenHistory={() => {}}
      onRequestPremiumPreview={() => {}}
    />,
  );

  assert.match(homeHtml, /data-home-primary="true"/);
  assert.doesNotMatch(homeHtml, /data-home-card-grid/);

  const coachHtml = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      currentView="coach"
      goal={{ targetWeightKg: 73, targetBodyFatPercent: 15 }}
      plan="free"
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
      onOpenGoalSettings={() => {}}
      onOpenHistory={() => {}}
      onRequestPremiumPreview={() => {}}
    />,
  );

  assert.match(coachHtml, /data-coach-primary="true"/);
  assert.match(coachHtml, /data-premium-lock="coach-deep-dive"/);
});

test("DashboardScreen renders a home view with list navigation and streak summary", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      currentView="home"
      goal={{
        targetWeightKg: 73,
        targetBodyFatPercent: 15,
      }}
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
      onOpenGoalSettings={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /data-screen-panel="home"/);
  assert.match(html, /data-screen-nav="true"/);
  assert.match(html, /data-nav-target="progress"/);
  assert.match(html, /data-nav-target="history"/);
  assert.match(html, /data-nav-target="coach"/);
  assert.match(html, /data-home-nav="true"/);
  assert.match(html, /data-home-streak="true"/);
  assert.match(html, /data-home-summary="true"/);
  assert.match(html, /data-home-quick-actions="true"/);
});

test("DashboardScreen renders a progress view with trend details", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      currentView="progress"
      goal={{
        targetWeightKg: 73,
        targetBodyFatPercent: 15,
      }}
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
      onOpenGoalSettings={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /data-screen-panel="progress"/);
  assert.match(html, /data-goal-summary="true"/);
  assert.match(html, /data-metric-card="weight"/);
  assert.match(html, /data-trend-detail="true"/);
  assert.match(html, /data-trend-series="weightKg"/);
});

test("DashboardScreen renders a record dialog when a history row is selected", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      {...({
        checkIns,
        currentView: "history",
        onAddCheckIn: () => {},
        onChangeView: () => {},
        goal: {
          targetWeightKg: 73,
          targetBodyFatPercent: 15,
        },
        onOpenGoalSettings: () => {},
        onOpenHistory: () => {},
        onOpenCheckInDetail: () => {},
        onEditCheckIn: () => {},
        onRequestDeleteCheckIn: () => {},
        onCloseCheckInDetail: () => {},
        selectedCheckInId: "latest",
      } as any)}
    />,
  );

  assert.match(html, /role="dialog"/);
  assert.match(html, /data-record-dialog="latest"/);
  assert.match(html, /Run intervals after upper-body day\./);
  assert.match(html, /data-action="edit-check-in"/);
  assert.match(html, /data-action="delete-check-in"/);
  assert.match(html, /178\.0cm/);
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
  assert.match(html, /name="heightCm"/);
  assert.match(html, /name="weightKg"/);
  assert.match(html, /data-error-list="true"/);
});

test("HistoryScreen renders the full history list and note text", () => {
  const html = renderToStaticMarkup(
    <HistoryScreen
      checkIns={checkIns}
      currentView="history"
      onAddCheckIn={() => {}}
      onBack={() => {}}
      onChangeView={() => {}}
      onSelectCheckIn={() => {}}
    />,
  );

  assert.match(html, /data-screen-panel="history"/);
  assert.match(html, /data-screen-nav="true"/);
  assert.match(html, /data-history-list="true"/);
  assert.match(html, /data-history-row="latest"/);
  assert.match(html, /data-history-trigger="latest"/);
  assert.match(html, /Run intervals after upper-body day\./);
});

test("GoalScreen renders goal form fields and action buttons", () => {
  const html = renderToStaticMarkup(
    <GoalScreen
      draft={goalDraft}
      errors={[]}
      hasSavedGoal
      onBack={() => {}}
      onChange={() => {}}
      onClear={() => {}}
      onSave={() => {}}
    />,
  );

  assert.match(html, /data-goal-form="true"/);
  assert.match(html, /name="targetWeightKg"/);
  assert.match(html, /name="targetBodyFatPercent"/);
  assert.match(html, /coach-form-actions/);
});

test("LandingScreen renders a compact home hierarchy", () => {
  const html = renderToStaticMarkup(
    <LandingScreen
      currentStatusLabel="Cutting in progress"
      currentStatusSummary="Status summary"
      goalSummary="1.8kg to goal"
      latestMeasuredAtText="Latest check-in 2026.04.27"
      progressSummary="3 week streak active"
      streakLabel="3 week streak"
      weeklyStatusDetail="This week is staying on plan."
      weeklyStatusLabel="This week check-in complete"
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
    />,
  );

  assert.match(html, /data-home-layout="compact"/);
  assert.match(html, /data-home-actions="compact"/);
});

test("BodyCompositionApp renders the simplified shell home state on first load", () => {
  const html = renderToStaticMarkup(<BodyCompositionApp />);

  assert.match(html, /data-app-shell="true"/);
  assert.match(html, /data-home-bezel="true"/);
  assert.match(html, /data-bottom-tabs="true"/);
  assert.match(html, /data-ad-rail="free"/);
  assert.doesNotMatch(html, /data-screen-nav="true"/);
  assert.match(html, /二쇨컙泥댄겕/);
  assert.match(html, /data-action="open-check-in"/);
});
