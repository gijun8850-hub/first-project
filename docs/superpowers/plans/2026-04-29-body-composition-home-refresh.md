# Body Composition Home Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 랜딩 홈, 복귀 동선, 그래프 가독성, 연속 체크인 요약을 추가해 주간 체성분 코치 앱의 첫인상과 실사용성을 끌어올린다.

**Architecture:** 단일 클라이언트 앱 안에서 `landing`과 `dashboard` 화면 상태를 분리하고, 대시보드 데이터 가공은 `coach-engine`에 모은다. 차트는 전용 컴포넌트에서 선택 상태와 정규화 렌더링을 처리한다.

**Tech Stack:** Next.js App Router, React 19, TypeScript, node:test, CSS

---

### Task 1: 요구 구조를 테스트로 고정

**Files:**
- Modify: `src/components/body-composition/body-composition-ui.test.tsx`
- Modify: `src/lib/body-composition/coach-engine.test.ts`

- [ ] 랜딩 홈과 새 대시보드 요약이 보인다는 테스트를 추가한다.
- [ ] 차트 범례/상세 정보와 연속 체크인 요약 테스트를 추가한다.

### Task 2: 데이터 가공 로직 확장

**Files:**
- Modify: `src/lib/body-composition/coach-engine.ts`
- Modify: `src/types/body-composition.ts`

- [ ] 연속 체크인, 이번 주 진행 요약, 차트 시리즈 메타데이터를 계산하는 함수를 추가한다.
- [ ] 기존 코치/목표 계산과 충돌하지 않도록 타입을 확장한다.

### Task 3: 랜딩 홈과 네비게이션 추가

**Files:**
- Create: `src/components/body-composition/landing-screen.tsx`
- Modify: `src/components/body-composition/body-composition-app.tsx`
- Modify: `src/components/body-composition/dashboard-screen.tsx`

- [ ] 첫 진입 화면을 랜딩 홈으로 바꾼다.
- [ ] 홈/대시보드 복귀 버튼과 헤더 구조를 정리한다.
- [ ] 연속 체크인/주간 진행 요약을 대시보드에 배치한다.

### Task 4: 차트와 스타일 개선

**Files:**
- Modify: `src/components/body-composition/trend-chart.tsx`
- Modify: `src/app/globals.css`

- [ ] 차트에 범례, 선택 포인트, 상세 값, 정규화 설명을 추가한다.
- [ ] 랜딩 홈과 대시보드 카드 레이아웃을 보기 좋게 다듬는다.

### Task 5: 검증

**Files:**
- Test: `src/lib/body-composition/coach-engine.test.ts`
- Test: `src/components/body-composition/body-composition-ui.test.tsx`

- [ ] `npm.cmd test` 실행
- [ ] `npm.cmd run build` 실행
