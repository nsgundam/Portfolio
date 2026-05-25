# Interaction Spec
> AI Agent: This file defines all interactive behaviors, animation hooks, and reusable UI primitives.
> Cross-reference: `design-system.md`, `architecture-spac.md`

---

## 1. Custom Cursor

**File:** `src/components/cursor/CustomCursor.tsx`
**Status:** ✅ Implemented — do not rewrite, only extend if needed.

### Structure
Two DOM elements, both `position: fixed`, `pointer-events: none`:
- **Dot** — `6px` circle, `mix-blend-mode: difference`, tracks mouse exactly via `gsap.set()`
- **Ring** — `32px` circle, `mix-blend-mode: difference`, follows with `gsap.quickTo()` lag

### Behavior States

| State | Ring behavior |
|---|---|
| Idle | Follows mouse with `duration: 0.5s, power4.out`. Stretches in direction of travel. |
| Moving fast | `scaleX` increases proportional to lag distance. `scaleY` compresses. Rotates toward travel direction. |
| Hover enter | Collapses in place: `scaleX/Y → 0`, `power4.in`, `0.35s`. Ring disappears at cursor position. |
| Hover leave | Teleports to cursor (invisible), springs back: `scaleX/Y → 1`, `back.out(2.2)`, `0.55s`. |

### Critical Implementation Notes
- `isHovering` flag must stay `true` through the entire leave-emerge animation to prevent `renderStretch` fighting the scale tween
- `ringXTo` / `ringYTo` must be `let` (not `const`) and re-created in `onLeave` after `overwrite:true` kills the backing tween (see DEC-010)
- Only visible on `(pointer: fine)` devices — initial `opacity: 0`, set to `1` by GSAP only when pointer check passes
- Attach `mouseenter`/`mouseleave` to all `a` and `button` elements

### Responsive
- Completely disabled on touch/coarse-pointer devices
- CSS `cursor: none` is scoped to `@media (pointer: fine)` in `index.css`

---

## 2. Magnetic Hover

**File:** `src/hooks/useMagneticHover.ts` + `src/components/ui/MagneticButton.tsx`
**Status:** ⬜ TODO — hook and component need to be created.

### Design Tokens
```
STRENGTH:      0.3
TRIGGER_PAD:   40px   (detection zone beyond element bounds)
SNAP_EASE:     back.out(1.4)
SNAP_DURATION: 0.8s
```

### Hook Interface
```typescript
// src/hooks/useMagneticHover.ts
export function useMagneticHover<T extends HTMLElement>(
  strength?: number,
  triggerPad?: number
): React.RefObject<T>
```

### Behavior
1. On `mousemove` within `TRIGGER_PAD` of element bounds: translate element toward cursor by `STRENGTH * offset`
2. On `mouseleave`: snap back to origin with `back.out(1.4)` over `0.8s`
3. Use `gsap.to()` with `x` and `y` transforms only — never `left`/`top`
4. Clean up event listeners on unmount

### MagneticButton Component
```typescript
// src/components/ui/MagneticButton.tsx
interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}
```

Wraps children in a `<button>` or `<a>` and applies `useMagneticHover`.
Apply ONLY to primary CTA buttons — not nav links, not tech tags.

### Usage Locations
- Hero section: primary CTA (scroll down / view work)
- Contact section: email CTA button

---

## 3. Blur Reveal Transition

**File:** `src/hooks/useBlurReveal.ts` + `src/components/ui/BlurReveal.tsx`
**Status:** ⬜ TODO — hook and component need to be created.

### Concept
Elements enter from a heavily blurred state and come into focus — like a camera lens adjusting.
Used for section reveals where `useScrollReveal` (fade+slide) would feel too generic.

### Hook Interface
```typescript
// src/hooks/useBlurReveal.ts
export function useBlurReveal<T extends HTMLElement>(
  enabled?: boolean,
  options?: {
    blurStart?: string;   // default: "20px"
    duration?: number;    // default: 0.8
    delay?: number;       // default: 0
    start?: string;       // ScrollTrigger start, default: "top 80%"
  }
): React.RefObject<T>
```

### Animation Spec
```
from: { filter: "blur(20px)", opacity: 0 }
to:   { filter: "blur(0px)",  opacity: 1 }
duration: 0.8s
ease: power4.out
scrollTrigger: { start: "top 80%", once: true }
```

### BlurReveal Component
```typescript
// src/components/ui/BlurReveal.tsx
interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  enabled?: boolean;
}
```

Wraps children in a `<div>` and applies `useBlurReveal`.

### Usage Locations
- About section: heading and bio text
- Projects section: card reveals
- Skills section: category reveals
- Contact section: terminal lines

---

## 4. Scroll Reveal (Standard)

**File:** `src/hooks/useScrollReveal.ts`
**Status:** ✅ Implemented — do not rewrite.

### Behavior
```
from: { opacity: 0, y: 60 }
to:   { opacity: 1, y: 0 }
duration: 0.8s
ease: power4.out
scrollTrigger: { start: "top 85%", once: true }
```

### Usage
Pass `preloaderDone` as the `enabled` parameter. The hook returns a `ref` to attach to the element.

```typescript
const ref = useScrollReveal<HTMLElement>(preloaderDone);
```

---

## 5. Rolling Text Hover (Nav Links)

**File:** `src/components/navbar/Navbar.tsx` — `NavLink` sub-component
**Status:** ✅ Implemented — do not rewrite.

### Behavior
Two stacked copies of the label text. On hover, the container translates `-50%` on Y axis, revealing the second (brand-colored) copy below.

```
transition: transform 0.3s ease-in-out
hover: translateY(-50%)
```

### Usage
Only on desktop nav links. Not on mobile menu items.

---

## 6. Scroll Progress Indicator

**File:** `src/components/ui/ScrollProgress.tsx`
**Status:** ✅ Implemented — horizontal bar at bottom edge.

### Behavior
- Fixed to bottom of viewport
- `scaleX` from `0` to `1` driven by `ScrollTrigger` scrub
- Color: `var(--color-accent)` (`#A4161A`)
- Height: `2px`

---

## 7. Preloader → Hero Handoff

**Files:** `Preloader.tsx`, `Hero.tsx`, `App.tsx`
**Status:** ✅ Implemented — do not change the handoff pattern.

### Sequence
1. Preloader counts `0 → 100` over `2.3s` (`power2.in`)
2. `0.3s` pause at 100
3. Exit: `yPercent: -100`, `1.8s`, `power4.out`
4. `onStart` of exit: calls `onComplete()` → sets `preloaderDone = true` in App
5. Hero `useEffect` watches `preloaderDone` — when `true`, starts reveal timeline
6. Preloader sets `display: none` on `onComplete`

**Critical:** The Hero reveal starts while the preloader is still sliding up. This overlap creates the seamless cinematic handoff. Do not add a delay between `onComplete` and Hero reveal.

---

## 8. About Section Sticky Slide-Up

**File:** `src/components/sections/About.tsx`
**Status:** ⬜ TODO — current implementation is a standard scroll section. Needs sticky panel upgrade.

### Concept
About physically rises from below and covers the Hero section. The viewer feels like a new layer of the world is emerging. After About is fully covering Hero, normal scroll resumes.

### Implementation Pattern

```
Hero:  position: sticky, top: 0, height: 100vh, z-index: 0
About: position: relative, z-index: 10
       translateY starts at 100vh, animates to 0 as user scrolls
```

Use a `ScrollTrigger` with `scrub: true` on the About section's wrapper.

### Scroll Mechanics
```
trigger: About section wrapper
start: "top bottom"        ← when About's top hits viewport bottom
end: "top top"             ← when About's top hits viewport top
scrub: true
animation: translateY(100vh) → translateY(0)
```

### Visual Treatment
- About panel uses glassmorphism: `rgba(22, 26, 29, 0.85)` + `backdrop-blur-md`
- Subtle top border: `1px solid rgba(255, 255, 255, 0.06)`
- Box shadow upward: `0 -20px 60px rgba(0, 0, 0, 0.5)`
- Rounded top corners: `border-radius: 24px 24px 0 0`

### Content Reveal
After the panel finishes sliding up (ScrollTrigger `onEnter`), trigger blur reveals on:
1. Section label
2. Heading ("Agile Technical Explorer")
3. Bio paragraphs
4. Quick info rows

---

## 9. Navbar Glassmorphism + Logo Tuck

**File:** `src/components/navbar/Navbar.tsx`
**Status:** ✅ Implemented — do not rewrite.

### Scroll Threshold: 30px

**Before scroll:**
- Full width, no background, no blur
- Logo at `scale(1)`

**After scroll > 30px:**
- Pill shape: `width: 92%`, `max-width: 42rem`, `border-radius: 1rem`
- Background: `rgba(22, 26, 29, 0.65)`
- Blur: `backdrop-filter: blur(20px) saturate(180%)`
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Logo scales to `0.85`, `duration: 0.7s`, `cubic-bezier(0.16, 1, 0.3, 1)`

---

## 10. Keyboard & Focus Management

- All interactive elements must be reachable via `Tab`
- Mobile menu must trap focus when open
- `Escape` key closes mobile menu
- Focus ring must be visible (do not `outline: none` without a replacement)
- Skip-to-content link recommended for accessibility

---

## 11. prefers-reduced-motion

**Status:** ⬜ TODO (Sprint 4, Step 03)

All GSAP animations must check `prefers-reduced-motion` before running.

```typescript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Set final state immediately, no animation
  gsap.set(element, { opacity: 1, y: 0, filter: 'blur(0px)' });
} else {
  // Full animation
  gsap.fromTo(element, { ... }, { ... });
}
```

Apply this pattern to:
- Preloader (skip counter, instant reveal)
- Hero text reveal (instant opacity)
- All ScrollTrigger reveals
- About slide-up (instant position)
- Cursor stretch effect
