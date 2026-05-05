# Body Composition Streak Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the body composition app into focused `홈 / 진행 / 기록 / 코치` screens with clickable list-style navigation, while keeping check-in and goal actions available as overlays.

**Architecture:** Keep the existing `BodyCompositionApp` as the single state owner for storage, selection, and modal state. Replace the current `landing / dashboard` toggle with an app-level `route` state and render focused screen components that reuse the existing coach-engine data builders. Add a shared home navigator so every screen can move directly to the others without reopening a landing card.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Node test runner, static CSS in `src/app/globals.css`

---

### Task 1: Lock the navigation behavior with failing UI tests

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Write the failing test for the new home-first layout**

```tsx
test("BodyCompositionApp renders a home navigator with direct screen entries", () => {
  const html = renderToStaticMarkup(<BodyCompositionApp />);

  assert.match(html, /data-screen="home"/);
  assert.match(html, /data-home-nav="true"/);
  assert.match(html, /data-nav-target="progress"/);
  assert.match(html, /data-nav-target="history"/);
  assert.match(html, /data-nav-target="coach"/);
});
```

- [ ] **Step 2: Write the failing test for focused screen sections**

```tsx
test("DashboardScreen renders separate home, progress, history, and coach sections", () => {
  const html = renderToStaticMarkup(
    <DashboardScreen
      checkIns={checkIns}
      currentView="home"
      goal={{ targetWeightKg: 73, targetBodyFatPercent: 15 }}
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
      onOpenGoalSettings={() => {}}
      onOpenHistory={() => {}}
    />,
  );

  assert.match(html, /data-screen-panel="home"/);
  assert.match(html, /data-home-streak="true"/);
  assert.match(html, /data-screen-nav="true"/);
});
```

- [ ] **Step 3: Run the focused UI tests to verify they fail**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: FAIL because `BodyCompositionApp` still renders `data-screen="landing"` and `DashboardScreen` does not accept `currentView`.

### Task 2: Refactor app state to route between focused screens

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-app.tsx`
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\types\body-composition.ts`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Introduce a typed app route union**

```ts
export type BodyCompositionRoute = "home" | "progress" | "history" | "coach";
```

- [ ] **Step 2: Replace the landing/dashboard toggle with route navigation**

```tsx
const [route, setRoute] = useState<BodyCompositionRoute>("home");

function goHome() {
  resetOverlayState();
  setRoute("home");
}

function goRoute(nextRoute: BodyCompositionRoute) {
  resetOverlayState();
  setRoute(nextRoute);
}
```

- [ ] **Step 3: Keep overlays action-based instead of route-based**

```tsx
function openCheckIn() {
  setModalView("check-in");
  setErrors([]);
  setConfirmSuspiciousSave(false);
  setEditingCheckInId(null);
  setPendingDeleteCheckInId(null);
  setSelectedCheckInId(null);
  setDraft({
    ...createEmptyDraft(),
    measuredAt: todayDate(),
    heightCm: getSuggestedHeight(checkIns),
  });
}
```

- [ ] **Step 4: Render a single routed dashboard surface**

```tsx
<DashboardScreen
  checkIns={checkIns}
  currentView={route}
  goal={goal}
  onAddCheckIn={openCheckIn}
  onChangeView={goRoute}
  onGoHome={goHome}
  onOpenGoalSettings={openGoalSettings}
  onOpenHistory={openHistory}
  ...
/>
```

- [ ] **Step 5: Re-run the focused UI tests**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: still FAIL because the routed sections and navigation UI are not rendered yet.

### Task 3: Split the dashboard into home, progress, history, and coach views

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\dashboard-screen.tsx`
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\history-screen.tsx`
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\landing-screen.tsx`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Convert the old landing screen into a compact home entry section**

```tsx
type LandingScreenProps = {
  consistencyLabel: string;
  currentStatus: string;
  latestMeasuredAt: string;
  onAddCheckIn: () => void;
  onChangeView: (view: BodyCompositionRoute) => void;
};
```

- [ ] **Step 2: Add a shared list-style screen navigator**

```tsx
<nav className="coach-screen-nav" data-screen-nav="true">
  {NAV_ITEMS.map((item) => (
    <button
      key={item.view}
      className={item.view === currentView ? "coach-screen-nav-item coach-screen-nav-item-active" : "coach-screen-nav-item"}
      data-nav-target={item.view}
      onClick={() => onChangeView(item.view)}
      type="button"
    >
      <strong>{item.label}</strong>
      <span>{item.description}</span>
    </button>
  ))}
</nav>
```

- [ ] **Step 3: Render focused panels per view**

```tsx
if (currentView === "home") {
  return <section data-screen-panel="home">...</section>;
}

if (currentView === "progress") {
  return <section data-screen-panel="progress">...</section>;
}

if (currentView === "history") {
  return <section data-screen-panel="history">...</section>;
}

return <section data-screen-panel="coach">...</section>;
```

- [ ] **Step 4: Keep the record detail dialog reusable from any view**

```tsx
{selectedRow && selectedCheckIn ? (
  <div className="coach-modal-backdrop">
    <article data-record-dialog={selectedRow.id} role="dialog">...</article>
  </div>
) : null}
```

- [ ] **Step 5: Re-run the focused UI tests**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: PASS for the new navigation assertions.

### Task 4: Align the styling with the new focused-screen structure

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\app\globals.css`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Remove the oversized landing-only styles**

```css
.coach-home-screen {
  min-height: auto;
  padding: 0;
  place-items: stretch;
}
```

- [ ] **Step 2: Add the shared list navigation and focused panel layout**

```css
.coach-screen-nav {
  display: grid;
  gap: 12px;
}

.coach-screen-nav-item {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border-radius: 20px;
}
```

- [ ] **Step 3: Add home-focused summary styling**

```css
.coach-home-summary {
  display: grid;
  gap: 16px;
}

.coach-home-streak {
  font-size: clamp(42px, 7vw, 72px);
  letter-spacing: -0.06em;
}
```

- [ ] **Step 4: Run the focused UI tests again**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: PASS with no snapshot-free markup regressions.

### Task 5: Run full verification for the routed app

**Files:**
- Modify: none
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Run the full test suite**

Run:

```bash
npm.cmd test
```

Expected: PASS

- [ ] **Step 2: Run the production build**

Run:

```bash
npm.cmd run build
```

Expected: PASS

- [ ] **Step 3: Commit the feature**

```bash
git add docs/superpowers/plans/2026-05-05-body-composition-streak-navigation.md src/app/globals.css src/components/body-composition src/types/body-composition.ts
git commit -m "feat: split body composition app into focused screens"
```
