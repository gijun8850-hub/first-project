# Yakitei Photo Menu Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Yakitei kiosk with AI-generated menu photos, a photo-first menu board, and clearer add/decrease/remove cart controls.

**Architecture:** Keep the existing kiosk state machine, but enrich menu metadata with image paths and add pure cart-quantity helpers so the UI can safely support `+`, `-`, and explicit remove interactions across the menu board and cart. Persist images as local assets in `public/` and update the existing menu/cart components instead of introducing a parallel flow.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS, Node test runner, AI-generated PNG menu assets

---

## File Map

- Modify: `src/lib/kiosk/menu-data.ts`
- Modify: `src/lib/kiosk/combo-stats.ts`
- Modify: `src/lib/kiosk/combo-stats.test.ts`
- Modify: `src/components/kiosk/kiosk-app.tsx`
- Modify: `src/components/kiosk/menu-screen.tsx`
- Modify: `src/components/kiosk/cart-panel.tsx`
- Modify: `src/components/kiosk/cart-screen.tsx`
- Modify: `src/app/globals.css`
- Create assets: `public/yakitei-*.png`

## Tasks

- [ ] Add failing tests for menu image metadata and cart quantity clamping behavior
- [ ] Generate six AI menu images and save them to `public/`
- [ ] Enrich menu data with `imageSrc` and clean Korean copy
- [ ] Add pure quantity helper logic so `-` never silently deletes the last item
- [ ] Rebuild `MenuScreen` into a photo-led board with inline quantity controls
- [ ] Update cart panel and cart screen to use explicit `+`, `-`, `삭제`
- [ ] Refresh CSS for image-first cards and denser cart interactions
- [ ] Run `npm.cmd test` and `npm.cmd run build`

## Self-Review

- Spec coverage: photo-first menu cards, image assets, stronger cart controls, and explicit remove behavior are all mapped.
- Placeholder scan: no TODO/TBD markers remain.
- Type consistency: `MenuItem.imageSrc` and quantity helper outputs must be referenced consistently across menu and cart components.
