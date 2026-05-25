# Section Spec — Hero
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ✅ Implemented. This spec documents the final design for reference and future changes.

---

## Purpose

The Hero is the emotional hook. It is the world layer — the visual foundation that everything else builds on top of. It must feel immersive, confident, and cinematic. The viewer should feel they've entered a carefully crafted space, not landed on a webpage.

---

## Layout

```
section#hero
  position: relative
  min-height: 100vh
  display: flex, flex-col
  align-items: center
  justify-content: center
  text-align: center
  padding: px-5 sm:px-8
```

The Hero section is `sticky` with `top: 0` so the About panel can slide up and cover it.

---

## Content

### Role Label
```
"Full Stack Developer"
font:     IBM Plex Mono (font-body)
size:     text-xs
color:    var(--color-text-secondary)
tracking: 0.3em uppercase
margin:   mb-6
```

### Name
```
"Narunat Sutthibut"
font:     Space Mono (font-heading)
size:     clamp(48px, 8vw, 120px)
color:    var(--color-text-primary)
tracking: tight
leading:  none
margin:   mb-6
aria-label: "Narunat Sutthibut"  ← clean text for screen readers
```

### Tagline
```
"Aiming high, building what matters."
font:     IBM Plex Mono (font-body)
size:     text-sm
color:    var(--color-text-secondary)
leading:  relaxed
max-width: max-w-md
aria-label: "Aiming high, building what matters."
```

### Scroll Indicator
```
position: absolute, bottom-10, left-1/2, -translate-x-1/2
content:
  "Scroll" — font-body, text-xs, text-disabled, tracking-widest uppercase
  vertical line — h-8, w-px, bg-border
```

---

## Animation Sequence

All animations wait for `preloaderDone === true`. They run in a single GSAP timeline.

### Setup (before preloaderDone)
```typescript
Splitting({ target: nameRef.current, by: "chars" });
Splitting({ target: taglineRef.current, by: "words" });

gsap.set([label, nameChars, taglineWords, scrollHint], { opacity: 0 });
```

### Timeline (after preloaderDone)

**Step 1 — Role Label**
```
from: { opacity: 0, y: 20 }
to:   { opacity: 1, y: 0 }
duration: 0.6s
ease: power4.out
```

**Step 2 — Name (char stagger)**
```
target:   .char elements inside nameRef
from:     { filter: "blur(10px)", opacity: 0 }
to:       { filter: "blur(0px)", opacity: 1 }
duration: 1.2s
ease:     power2.out
stagger:  { each: 0.03, from: "edges" }  ← chars reveal from both ends toward center
offset:   "-=0.3" (overlaps with label)
```

**Step 3 — Tagline (word reveal)**
```
target:   .word elements inside taglineRef
from:     { y: "100%", opacity: 0 }
to:       { y: "0%", opacity: 1 }
duration: 3.5s
ease:     power4.out
stagger:  0  ← all words simultaneously
offset:   "-=0.4"
```

Note: `.word` elements in `index.css` have `overflow: hidden` — this creates the masked reveal effect where words appear to rise from below the baseline.

**Step 4 — Scroll Indicator**
```
from: { opacity: 0 }
to:   { opacity: 1 }
duration: 0.6s
ease: power4.out
offset: "-=2.5"  ← appears early since tagline takes 3.5s
```

---

## Splitting.js Setup

```typescript
import Splitting from "splitting";

// In useEffect (runs once on mount, before preloaderDone):
Splitting({ target: nameRef.current!, by: "chars" });
Splitting({ target: taglineRef.current!, by: "words" });
```

Splitting wraps each character/word in a `<span>` with class `.char` / `.word`.
The `.word` wrapper has `overflow: hidden` (set in `index.css`) to enable the masked rise effect.

---

## Background

The Hero background is provided by `AmbientBackground` (fixed, z-[-1]).
The Hero section itself has no background — it is transparent, sitting above the ambient layer.

Do not add a gradient or background to the Hero section element itself.

---

## Magnetic CTA (TODO)

A primary CTA button should be added below the tagline.
Use `MagneticButton` component when implemented.

```
Label:    "View My Work" or "↓ Scroll"
Style:    border 1px solid rgba(255,255,255,0.15)
          font-body, text-xs, tracking-widest, uppercase
          px-8 py-4
Magnetic: STRENGTH 0.3, TRIGGER_PAD 40
```

---

## Responsive

| Breakpoint | Behavior |
|---|---|
| Mobile | `clamp(48px, 8vw, 120px)` scales name naturally. Scroll indicator visible. |
| Tablet | Same as mobile — no changes needed. |
| Desktop | Full cinematic experience. |

---

## Accessibility

- `aria-label` on `<h1>` — Splitting.js char spans are `aria-hidden` implicitly via parent label
- `aria-label` on tagline `<p>`
- Scroll indicator is decorative — `aria-hidden="true"`

---

## What NOT to do

- Do not add a hero image or background photo
- Do not add social links to the Hero
- Do not add a "Download CV" button to the Hero (belongs in Contact)
- Do not animate the scroll indicator with a bouncing loop — it should fade in and stay static
- Do not use `overflow: hidden` on the section — it will clip the About slide-up
