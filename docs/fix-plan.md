# Fix Plan — Portfolio Codebase Audit
> Created: May 2026 | Applied in one pass after Sprint 3 animation audit.

---

## 🔴 Critical

### FIX-001 — `Contact.tsx`: `[EMAIL_ADDRESS]` placeholder never replaced
**Problem:** Big CTA link displayed literal text `[EMAIL_ADDRESS]` on screen.  
**Fix:** Replaced with `snarunat.99@gmail.com`.

### FIX-002 — `index.css`: `--color-text-secondary` identical to primary
**Problem:** Both tokens = `#F5F3F4`. Zero visual hierarchy across the entire site.  
**Fix:** Set `--color-text-secondary: #6B7280` per Agent.md Quick Reference.  
**Impact:** All body text, nav links, descriptions, subtitles become correctly muted.

### FIX-003 — `Hero.tsx`: All visible content `aria-hidden`
**Problem:** `<span>`, `<h1>`, and `<p>` all had `aria-hidden="true"` — screen readers saw a blank page.  
**Fix:** Removed `aria-hidden` from containers. Added `aria-label` to h1/p for Splitting.js compatibility (split chars should not be read aloud).

---

## 🟠 High

### FIX-004 — `index.css`: Malformed `cursor: url( auto)` declaration
**Problem:** `cursor: url( auto)` is invalid CSS (space inside url()). Redundant anyway since `* { cursor: none }` handles everything.  
**Fix:** Line removed entirely.

### FIX-005 — `index.css`: Dead scrollbar `display: none` inside `@layer base`
**Problem:** Non-layered CSS always wins over `@layer base` styles. The `display: none` inside the layer was immediately overridden by the custom scrollbar styles below it. Dead code.  
**Fix:** Removed dead rule from `@layer base`.

### FIX-006 — `Navbar.tsx`: Wrong constants + transition jank
**Problem:**
- `GLASS_OPACITY = 0.01` → almost invisible. Design system says `0.08`.
- `TRANSITION = '3s'` → painfully slow. Should be `~0.7s`.
- `transition-all` Tailwind class + inline styles conflict.
- `max-width: none` → `max-width: 42rem` doesn't interpolate in CSS (keyword → px).
- `backdrop-filter: none` → `blur(20px)` doesn't interpolate (none keyword).

**Fix:**
- All animated properties moved exclusively to inline styles.
- `transition-all` removed from className.
- `none` replaced with zero-value equivalents: `blur(0px)`, `rgba(..., 0)`, etc. for smooth interpolation.
- Constants corrected: opacity `0.65`, duration `0.7s`.

### FIX-007 — `Preloader.tsx`: Wrong easing direction
**Problem:** `power2.out` (fast→slow) used for counter. Design system specifies `power2.in` (slow→fast — builds tension as counter approaches 100). Duration was also `2.5s` vs spec `2.3s`.  
**Fix:** Changed to `power2.in`, duration `2.3s`.

### FIX-008 — `useScrollReveal.ts`: No `preloaderDone` guard
**Problem:** All section ScrollTriggers initialized immediately on mount. Agent.md rule: "ทุก ScrollTrigger ต้องรอ preloaderDone === true ก่อน init".  
**Fix:** Added `enabled: boolean = true` parameter. Effect re-runs when `enabled` flips to `true`. All four section components updated to accept and forward `preloaderDone`.

---

## 🟡 Medium

### FIX-009 — Filename typos
**Problem:** `CustomCurer.tsx` (missing 's'), `ScollProgress.tsx` (missing 'r').  
**Fix:** Renamed to `CustomCursor.tsx` and `ScrollProgress.tsx`. Imports in `App.tsx` updated.

### FIX-010 — `main.tsx`: `AmbientBackground` rendered outside `App`
**Problem:** It was a sibling to `<App>` in the React tree, outside of App's scope.  
**Fix:** Moved into `App.tsx` alongside `CustomCursor` and `ScrollProgress`.

### FIX-011 — `AmbientBackground.tsx`: Hardcoded hex color
**Problem:** `bg-[#0B090A]` violates project rule — no raw hex in components.  
**Fix:** Replaced with `bg-bg`.

### FIX-012 — `CustomCursor.tsx`: Jerky hover/leave transitions
**Problem:**
- `onMove` spawned a new `gsap.to` tween on every mousemove event — wasteful and can cause jitter.
- `onLeave` fired two separate `gsap.to` calls (shape restore + position follow) that could fight each other.
- `isLeavingButton` state managed via `setTimeout` — unreliable race condition.

**Fix:**
- Replaced `gsap.to` in `onMove` with `gsap.quickTo` — a reusable setter designed for rapid repeated updates (no new tween per call).
- Simplified state to single boolean `isHovering`. No timeouts.
- `onEnter`: `overwrite: true` kills all ongoing animations.
- `onLeave`: single shape-restore tween with `back.out(1.7)` spring ease + `overwrite: 'auto'` (kills only conflicting props). Position tracking via `quickTo` resumes immediately in parallel.

---

## 🟢 Low

### FIX-013 — Timeline: LinkedIn open issue already resolved in code
**Problem:** `timeline.md` listed LinkedIn URL as 🔴 High open issue, but `Contact.tsx` already has the correct URL.  
**Fix:** Closed issue in timeline.md.

### FIX-014 — `index.css`: Duplicate `--color-brand` / `--color-accent` tokens
**Note:** Both intentionally equal `#A4161A`. Added comment for clarity. Not changed.

---

## Files Changed

| File | Fixes Applied |
|---|---|
| `docs/fix-plan.md` | This file |
| `src/index.css` | FIX-002, FIX-004, FIX-005, FIX-014 |
| `src/components/preloader/Preloader.tsx` | FIX-007 |
| `src/components/AmbientBackground.tsx` | FIX-011 |
| `src/components/sections/Hero.tsx` | FIX-003 |
| `src/hooks/useScrollReveal.ts` | FIX-008 |
| `src/components/navbar/Navbar.tsx` | FIX-006 |
| `src/components/cursor/CustomCursor.tsx` | FIX-009, FIX-012 |
| `src/components/ui/ScrollProgress.tsx` | FIX-009 |
| `src/components/sections/About.tsx` | FIX-008 propagation |
| `src/components/sections/Projects.tsx` | FIX-008 propagation |
| `src/components/sections/Skills.tsx` | FIX-008 propagation |
| `src/components/sections/Contact.tsx` | FIX-001, FIX-008 propagation |
| `src/main.tsx` | FIX-010 |
| `src/App.tsx` | FIX-009, FIX-010, FIX-008 propagation |
| `docs/timeline.md` | FIX-013 |
