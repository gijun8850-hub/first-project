# Body Composition Bezel Density Refine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the home-return bezel to the top of the app and simplify the body composition UI so the screens feel calmer and easier to scan.

**Architecture:** Keep the existing routed app structure and refine only the shared shell and visual hierarchy. Add one dedicated top bezel control in `BodyCompositionApp`, then reduce visual noise by tightening the navigation column, compressing the header, and simplifying the home cards in CSS and screen markup.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Node test runner, static CSS in `src/app/globals.css`

---

### Task 1: Lock the bezel and compact-layout behavior with failing tests

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Write the failing bezel test**

```tsx
test("BodyCompositionApp renders a top bezel home control", () => {
  const html = renderToStaticMarkup(<BodyCompositionApp />);

  assert.match(html, /data-home-bezel="true"/);
  assert.match(html, /data-action="go-home"/);
});
```

- [ ] **Step 2: Write the failing compact-home test**

```tsx
test("LandingScreen renders a compact home hierarchy", () => {
  const html = renderToStaticMarkup(
    <LandingScreen
      currentStatusLabel="감량 진행 중"
      currentStatusSummary="짧은 상태 요약"
      goalSummary="체중 1.8kg 남음"
      latestMeasuredAtText="최근 측정 2026.04.27"
      progressSummary="3주 연속 체크인 중"
      streakLabel="3주 연속"
      weeklyStatusDetail="이번 주는 유지를 우선합니다."
      weeklyStatusLabel="이번 주 체크인 완료"
      onAddCheckIn={() => {}}
      onChangeView={() => {}}
    />,
  );

  assert.match(html, /data-home-layout="compact"/);
  assert.match(html, /data-home-actions="compact"/);
});
```

- [ ] **Step 3: Run the focused UI tests to verify they fail**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: FAIL because the shell does not yet render a dedicated top bezel and the home markup has no compact layout markers.

### Task 2: Refine the shared shell and home markup

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-app.tsx`
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\landing-screen.tsx`
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\screen-navigation.tsx`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Add a top bezel control to the app shell**

```tsx
<div className="coach-top-bezel">
  <button
    className="coach-bezel-button"
    data-home-bezel="true"
    data-action="go-home"
    onClick={() => changeRoute("home")}
    type="button"
  >
    주간체크
  </button>
</div>
```

- [ ] **Step 2: Remove the old duplicated home button from the header**

```tsx
<div className="coach-header-actions">
  <button className="coach-secondary-button" data-action="open-goal-settings" ...>
    목표 설정
  </button>
  <button className="coach-primary-button" onClick={openCheckIn} type="button">
    체크인 추가
  </button>
</div>
```

- [ ] **Step 3: Mark the home screen as the compact layout**

```tsx
<section
  className="coach-screen-layout coach-screen-layout-home"
  data-home-layout="compact"
  data-screen="home"
  data-screen-panel="home"
>
```

- [ ] **Step 4: Trim the left navigation copy**

```tsx
const NAV_ITEMS = [
  { view: "home", label: "홈", description: "연속 체크인과 상태" },
  { view: "progress", label: "진행", description: "그래프와 목표 변화" },
  { view: "history", label: "기록", description: "체크인 목록과 수정" },
  { view: "coach", label: "코치", description: "이번 주 해석과 액션" },
];
```

- [ ] **Step 5: Re-run the focused UI tests**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: PASS for the new compact layout and top bezel assertions.

### Task 3: Rebalance the typography, spacing, and density in CSS

**Files:**
- Modify: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\app\globals.css`
- Test: `C:\Users\wgiju\OneDrive\문서\codex\.worktrees\weekly-body-coach\src\components\body-composition\body-composition-ui.test.tsx`

- [ ] **Step 1: Add bezel positioning and smaller shell spacing**

```css
.coach-top-bezel {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.coach-bezel-button {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
}
```

- [ ] **Step 2: Reduce the navigation and header visual weight**

```css
.coach-screen-nav-item {
  padding: 14px 16px;
}

.coach-screen-nav-item strong {
  font-size: 18px;
}
```

- [ ] **Step 3: Tighten home cards and raise body copy readability**

```css
.coach-home-summary h1 {
  font-size: clamp(24px, 3vw, 34px);
}

.coach-summary-copy,
.coach-home-status-block p,
.coach-home-mini-card p {
  font-size: 15px;
  line-height: 1.55;
}
```

- [ ] **Step 4: Run the focused UI tests again**

Run:

```bash
npm.cmd test -- src/components/body-composition/body-composition-ui.test.tsx
```

Expected: PASS

### Task 4: Run full verification

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
