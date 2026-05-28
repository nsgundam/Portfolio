# Design System & Tokens

## Cross-Reference ชัดเจนที่ด้านบน

```markdown
Cross-Reference:
- Architecture & folder structure: `@docs/architecture.md`
- Content & copy: `@docs/content.md`
- Decision log: `@docs/decisions.md`
```

---

## 1. Color Palette

```css

--color-bg:              #0C0B09; 
--color-surface:         #161411; 
--color-surface-2:       #1E1C18; 
--color-border:          #2A2721; 
--color-border-light:    #3A3732;

--color-accent:          #C4A97D; 
--color-accent-light:    #D4BC9A;   
--color-accent-dark:     #8A7450; 

--color-text-primary:    #EDE9E0;  
--color-text-secondary:  #7A776E; 
--color-text-disabled:   #3A3834;
```

---

## 2. Typography

### Font Stack

```css
--font-display: "Cormorant Garamond", Georgia, serif;
--font-label:   "Space Mono", monospace;
--font-body:    "IBM Plex Mono", monospace;
```

### Google Fonts Import (replace existing in index.html)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@400&family=Space+Mono:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

### Type Scale

```bash
Display XL:  clamp(72px, 12vw, 160px)  — Hero name, section hero text
Display LG:  clamp(48px, 7vw, 96px)    — Section headings (About, Projects)
Display MD:  clamp(32px, 4vw, 56px)    — Sub-headings, project titles
Body LG:     16px / line-height 1.8    — Primary paragraphs
Body SM:     14px / line-height 1.7    — Secondary copy, descriptions
Label:       11px / tracking 0.25em / uppercase  — Section numbers, metadata
```

---

## 3. Spacing & Layout

### Principle: Generous Emptiness

```bash
Section horizontal padding:  clamp(24px, 6vw, 120px)
Section vertical padding:    clamp(80px, 12vh, 160px)
Max content width:           900px (most sections), 1100px (projects)
```

---

## 4. Glassmorphism

```bash
background:     rgba(22, 20, 17, 0.65)   ← warmer than before (was 22,26,29)
backdrop-filter: blur(20px) saturate(160%)
border:         1px solid rgba(255, 255, 255, 0.06)
box-shadow:     inset 0 1px 1px rgba(255,255,255,0.08),
                0 8px 32px rgba(0,0,0,0.35)
```

---

## 5. Animation Principles

### The Depth Reveal (global standard entrance)

```typescript
// lib/gsap.ts — export this utility
export const depthReveal = (el: Element | Element[], delay = 0, duration = 1.2) =>
  gsap.fromTo(el,
    {
      opacity: 0,
      scale: 0.88,
      y: 60,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      ease: "power4.out",
      delay,
    }
  );
```

### Pinning Standard

```typescript
// The standard pin pattern used across all sections
ScrollTrigger.create({
  trigger: sectionEl,
  start: "top top",
  end: `+=${PIN_DISTANCE}`,
  pin: true,
  scrub: 1.5,            // ← 1.5 feels weighted, not snappy
  anticipatePin: 1,      // ← prevents jump on pin entry
});
```

### Pin Distances (extra scroll to earn each section)

| Section | Pin Distance | Reasoning |
| --- | --- | --- |
| Hero | `+=500` | Enough to reveal all text elements |
| About | `+=900` | Long — bio lines reveal one by one |
| Projects | `+=700` per project | Each project feels like a full beat |
| Skills | `+=400` | Shorter — it's a supporting section |
| Contact | no pin | Contact stays normal scroll |

### Easing Tokens

```bash
power4.out  → primary entrance (steep decel = feels weighted, confident)
power4.in   → exits only
expo.out    → snap-back interactions (magnetic, cursor emerge)
back.out(1.4) → micro-interactions with slight overshoot
none        → scrub-driven animations (ScrollTrigger handles it)
```

### Duration Scale

```bash
Micro (hover):      0.25s — 0.35s
Fast (UI feedback): 0.5s
Normal (reveal):    1.0s — 1.2s
Cinematic:          1.8s — 2.5s   ← preloader exit, section transitions
```

### Stagger Values

```bash
Text lines (scrubbed):  driven by scrub position, not time-based stagger
Text lines (triggered): 0.08s each
Cards / panels:         0.12s each
Characters (rare):      0.03s each — only for Hero name, nowhere else
```

---

## 6. Component Specific Values

### Custom Cursor

- `RING_SIZE: 32px`
- `FOLLOW_DURATION: 0.5s`
- Hover enter: `scaleX/Y → 0`, `power4.in`, `0.35s`
- Hover leave: `back.out(2.2)`, `0.55s`

### Navbar

- Scroll threshold: `30px`
- Glass pill: width `92%`, max-width `42rem`, border-radius `1rem`
- Logo scale scrolled: `0.85`
- Transition: `0.7s`, `cubic-bezier(0.16, 1, 0.3, 1)`

### Preloader

- Count duration: `2.3s`, `power2.in`
- Exit: `yPercent: -100`, `1.8s`, `power4.out`
- Typography: keep Space Mono — the counter is a label, not display

### Hero Pin Timeline

```bash
Pin: +=500px scrubbed timeline
0%   → label fades in (opacity, y: 20 → 0)
20%  → name chars bloom from blur (depthReveal, stagger edges)
55%  → tagline slides up from overflow
80%  → scroll indicator fades
100% → section releases, About begins to arrive
```

### About Pin Timeline

```bash
Pin: +=900px scrubbed timeline
0%   → panel slides up from 100vh (cover Hero)
30%  → section label appears
40%  → heading arrives (depthReveal, display font, huge)
55%  → bio line 1 reveals
65%  → bio line 2 reveals
75%  → bio line 3 reveals
85%  → facts row slides in from left
100% → section releases
```

### Projects — Full-screen Stacked

```bash
Each project: 100vh pinned, +=700px

Project panel enter (scrubbed):
  0%  → project number fades in (label font, text-disabled)
  20% → project name arrives (depthReveal, display font xl)
  45% → one-liner appears (body font, text-secondary)
  65% → stack tags stagger in (label font, border pills)
  85% → link arrow appears
  100%→ section holds for a beat, then releases to next
```

### Magnetic Button

- `STRENGTH: 0.3`, `TRIGGER_PAD: 40px`
- Snap: `back.out(1.4)`, `0.8s`

## 7. usePinnedTimeline Hook

```ts
// src/hooks/usePinnedTimeline.ts
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";

interface PinOptions {
  pinDistance: number;
  scrub?: number;
  start?: string;
  onComplete?: () => void;
}

export function usePinnedTimeline<T extends HTMLElement>(
  enabled: boolean,
  options: PinOptions,
) {
  const ref = useRef<T>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    if (prefersReducedMotion()) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const pinDistance = isMobile ? options.pinDistance * 0.5 : options.pinDistance;

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: options.scrub ?? 1.5,
        anticipatePin: 1,
        animation: tl,
        onLeave: options.onComplete,
      });
    }, el);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, [enabled]);

  return { ref, tl: tlRef.current };
}
```
