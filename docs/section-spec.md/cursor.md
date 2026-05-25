# Section Spec — Custom Cursor
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ✅ Implemented. This spec documents the final design for reference and future changes.

---

## Purpose

The custom cursor is a constant ambient signal of sophistication. It replaces the native cursor on desktop and communicates interactivity through physics-based motion. It should feel alive — not mechanical.

---

## Visual Design

### Dot
- Size: `6px × 6px`
- Shape: circle (`border-radius: 9999px`)
- Color: `white`
- Blend mode: `mix-blend-mode: difference` — inverts against background
- Tracks mouse position exactly (no lag)
- `z-index: 9999`

### Ring
- Size: `32px × 32px` (default)
- Shape: circle
- Color: `white`
- Blend mode: `mix-blend-mode: difference`
- Follows mouse with lag (spring physics feel)
- `z-index: 9998`

**Both elements start at `opacity: 0`.** GSAP sets them to `opacity: 1` only after confirming `(pointer: fine)`. This prevents ghost elements on touch devices.

---

## Behavior States

### Idle — Lag Follow
```
ringXTo / ringYTo via gsap.quickTo:
  duration: 0.5s
  ease:     power4.out
```

### Moving — Stretch Effect
Runs on every GSAP ticker frame via `gsap.ticker.add()`.
```
dx = mouse.x - ring.x
dy = mouse.y - ring.y
dist = Math.sqrt(dx² + dy²)
angle = Math.atan2(dy, dx) * (180 / Math.PI)

if dist > 2:
  scaleX = 1 + Math.min(dist * 0.012, 1.5)
  scaleY = Math.max(1 - dist * 0.0008, 0.6)
  rotation = angle
else:
  scaleX = 1, scaleY = 1, rotation = 0
```
Gated by `isHovering` flag — stretch never runs while hover animations are active.

### Hover Enter (on `a`, `button`)
```
target:   ring
scaleX:   0
scaleY:   0
duration: 0.35s
ease:     power4.in     ← near-instant collapse at the end (suck-in feel)
overwrite: true
```
Ring collapses in place at cursor position. Only the dot remains visible during hover.

### Hover Leave
```
Step 1 — Teleport (instant):
  gsap.set(ring, { x: mouse.x, y: mouse.y, scaleX: 0, scaleY: 0, rotation: 0 })

Step 2 — Spring emerge:
  target:   ring
  scaleX:   1
  scaleY:   1
  duration: 0.55s
  ease:     back.out(2.2)   ← slight overshoot for satisfying pop
  overwrite: true
  onComplete: () => {
    isHovering = false
    re-create ringXTo and ringYTo (see DEC-010)
    call ringXTo(mouse.x), ringYTo(mouse.y)
  }
```

---

## Critical Implementation Rules

### isHovering Flag
- Set to `true` on hover enter
- Stays `true` through the entire leave-emerge animation
- Set to `false` only in `onComplete` of the emerge tween
- This prevents `renderStretch` from fighting the scale tween

### quickTo Re-creation (DEC-010)
`overwrite: true` in `onEnter` kills the backing tween of `gsap.quickTo`.
A dead quickTo silently fails when called.

```typescript
// WRONG — const prevents re-creation
const ringXTo = gsap.quickTo(ring, "x", { ... });

// CORRECT — let allows re-creation in onLeave
let ringXTo = gsap.quickTo(ring, "x", { ... });
let ringYTo = gsap.quickTo(ring, "y", { ... });

// In onLeave onComplete:
ringXTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power4.out" });
ringYTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power4.out" });
```

---

## Responsive / Device Handling

```typescript
// Bail out entirely on touch/coarse-pointer devices
if (!window.matchMedia("(pointer: fine)").matches) return;
```

CSS in `index.css`:
```css
@media (pointer: fine) {
  * { cursor: none; }
}
```

---

## Cleanup

```typescript
return () => {
  gsap.ticker.remove(renderStretch);
  document.removeEventListener("mousemove", onMove);
  interactives.forEach(el => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
  });
};
```

---

## What NOT to do

- Do not change `mix-blend-mode` — it's what makes the cursor visible on both dark and light elements
- Do not add color to the cursor (brand red, etc.) — the blend mode handles contrast
- Do not make the ring larger than `32px` — it becomes distracting
- Do not add a third cursor element
- Do not use CSS transitions for cursor movement — GSAP only
