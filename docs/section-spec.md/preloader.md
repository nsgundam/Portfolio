# Section Spec — Preloader
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ✅ Implemented. This spec documents the final design for reference and future changes.

---

## Purpose

The Preloader is the signature first impression. It hides asset preparation behind a cinematic loading experience. It must feel suspenseful, premium, and seamlessly hand off to the Hero reveal.

---

## Visual Design

**Layout:** Full-screen overlay, centered content.

**Background:** `var(--color-bg)` — `#0B090A` solid. No transparency.

**Counter:**
- Font: `Space Mono` (`font-heading`)
- Size: `clamp(80px, 20vw, 280px)` — fills the screen dramatically
- Color: `var(--color-text-primary)` — `#F5F3F4`
- Content: integer `0` → `100`
- Alignment: centered both axes

**No other visual elements.** No logo, no tagline, no progress bar. Typography is the entire experience.

---

## Animation Sequence

### Phase 1 — Count Up
```
target:   countObj.val (0 → 100)
duration: 2.3s
ease:     power2.in     ← starts slow, accelerates toward 100 (builds tension)
snap:     { val: 1 }    ← integers only, no decimals
onUpdate: counter.textContent = String(Math.round(val))
```

### Phase 2 — Hold
```
duration: 0.3s          ← brief pause at 100 before exit
```

### Phase 3 — Exit
```
target:   overlay element
yPercent: -100           ← slides upward off screen
duration: 1.8s
ease:     power4.out     ← fast start, decelerates smoothly
onStart:  call onComplete() → sets preloaderDone = true in App
onComplete: overlay.style.display = "none"
```

**Critical timing:** `onComplete()` fires at the START of the exit animation, not the end. This allows Hero reveal to begin while the overlay is still sliding up — creating the seamless cinematic overlap.

---

## Component Interface

```typescript
interface PreloaderProps {
  onComplete: () => void;
}
```

---

## DOM Structure

```tsx
<div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
  <span
    ref={counterRef}
    className="font-heading text-text-primary select-none"
    style={{ fontSize: "clamp(80px, 20vw, 280px)" }}
  >
    0
  </span>
</div>
```

---

## Accessibility

- `aria-live="polite"` on counter span — screen readers announce the count
- After preloader exits, focus should move to the first interactive element in Hero
- With `prefers-reduced-motion`: skip counter animation, immediately call `onComplete()` and hide overlay

---

## Responsive

No responsive changes needed — the counter fills the screen at all sizes via `clamp()`.

---

## What NOT to do

- Do not add a logo or brand mark to the preloader
- Do not add a progress bar (the number IS the progress bar)
- Do not use a spinner or loading indicator
- Do not add background animation during loading (it competes with the counter)
- Do not delay `onComplete()` until after the overlay fully exits
