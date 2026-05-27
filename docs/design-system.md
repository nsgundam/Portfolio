# Design System & Tokens
> Refactored: May 2026 — lukebaffait.fr reference
> Agent: This file is the single source of truth for all visual and motion decisions.
> Never hardcode values that exist here. Never invent values that aren't here.

---

## 1. Color Palette

Complete palette shift from cold-dark + red → warm-dark + gold.
This matches lukebaffait's warmth and sophistication. The accent is now a muted gold,
not a hard red. Use it sparingly — it should feel like a discovery, not a brand stamp.

```css
/* index.css @theme block — replace entirely */

--color-bg:              #0C0B09;   /* warm near-black — primary canvas */
--color-surface:         #161411;   /* warm dark — cards, navbar, panels */
--color-surface-2:       #1E1C18;   /* elevated surface — modals, tooltips */
--color-border:          #2A2721;   /* warm subtle border */
--color-border-light:    #3A3732;   /* slightly visible border for hover states */

--color-accent:          #C4A97D;   /* warm gold — the new brand color */
--color-accent-light:    #D4BC9A;   /* gold on hover */
--color-accent-dark:     #8A7450;   /* gold pressed / subdued */

--color-text-primary:    #EDE9E0;   /* warm cream off-white — not pure white */
--color-text-secondary:  #7A776E;   /* warm medium gray */
--color-text-disabled:   #3A3834;   /* warm dark gray */
```

### Palette Usage Rules

| Token | Use |
|---|---|
| `bg` | Page canvas only. Never use on elements. |
| `surface` | Cards, navbar background, about panel. Max 2 visible at once. |
| `surface-2` | Only for elements that float above `surface` (tooltips, focus rings). |
| `border` | Default border. Never use raw hex. |
| `accent` | Section labels (`01 / About`), active states, key hover moments. Not decorative. |
| `text-primary` | Headings, important body copy. |
| `text-secondary` | Descriptions, nav links, supporting copy. |
| `text-disabled` | Metadata, timestamps, inactive states. |

### What the Red Was, What Gold Is

The old `#A4161A` red was energetic, loud, tech-startup aggressive.
The new `#C4A97D` gold is restrained, editorial, confident.
A recruiter should notice it without knowing why.
It appears in: section numbering, hover underlines, cursor dot, scroll progress line.
It does NOT appear in: backgrounds, large fills, decorative blobs.

---

## 2. Typography

Three-tier type system. Each tier has one job and never does another's.

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

### When To Use Each Font

| Font | Use | Never Use For |
|---|---|---|
| `font-display` (Cormorant Garamond) | H1, H2, large cinematic text, the name in Hero, section headings | Body copy, labels, nav links, code |
| `font-label` (Space Mono) | Section numbers (`01 /`), tech stack tags, stat numbers, navbar logo | Paragraph text, headings |
| `font-body` (IBM Plex Mono) | All paragraphs, nav links, descriptions, contact info, terminal lines | Headings above h3 |

### Type Scale

```
Display XL:  clamp(72px, 12vw, 160px)  — Hero name, section hero text
Display LG:  clamp(48px, 7vw, 96px)    — Section headings (About, Projects)
Display MD:  clamp(32px, 4vw, 56px)    — Sub-headings, project titles
Body LG:     16px / line-height 1.8    — Primary paragraphs
Body SM:     14px / line-height 1.7    — Secondary copy, descriptions
Label:       11px / tracking 0.25em / uppercase  — Section numbers, metadata
```

### Typography Principles (lukebaffait approach)

1. **Type is the visual.** No hero images. The words CREATE the spatial tension.
2. **Weight contrast is the hierarchy.** Cormorant 300 (thin) next to Space Mono 700 = immediate visual interest.
3. **Optical sizing.** At clamp sizes, line-height should feel loose — 1.0 to 1.15 for display, 1.7+ for body.
4. **Italic is a tool.** Cormorant Garamond italic is exceptionally beautiful. Use it for 1-3 words of emphasis within display text, never for whole paragraphs.

---

## 3. Spacing & Layout

### Principle: Generous Emptiness

lukebaffait's sections breathe. Nothing touches the edge of the viewport.
Text doesn't fill available space — it occupies the center and lets the rest be dark.

```
Section horizontal padding:  clamp(24px, 6vw, 120px)
Section vertical padding:    clamp(80px, 12vh, 160px)
Max content width:           900px (most sections), 1100px (projects)
```

### The Spatial Rule

Every element needs at minimum **one full element's worth of empty space** adjacent to it.
If something looks too close to another element, it is.

---

## 4. Glassmorphism

Used only on Navbar (scrolled state). Same values, slightly warmer tint.

```
background:     rgba(22, 20, 17, 0.65)   ← warmer than before (was 22,26,29)
backdrop-filter: blur(20px) saturate(160%)
border:         1px solid rgba(255, 255, 255, 0.06)
box-shadow:     inset 0 1px 1px rgba(255,255,255,0.08),
                0 8px 32px rgba(0,0,0,0.35)
```

**Rule:** Glassmorphism on Navbar only. No other component gets it.
The About panel uses a flat `rgba(22, 20, 17, 0.96)` — not glassmorphism.

---

## 5. Animation Principles

This is the biggest change from the previous design system.
Everything now moves with depth, not just position.

### The Depth Reveal (global standard entrance)

Every section element enters with this signature motion.
This is the lukebaffait fingerprint — things arrive from a slightly smaller, blurrier place.

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

Every major section is pinned. This is the core architecture change.

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
|---|---|---|
| Hero | `+=500` | Enough to reveal all text elements |
| About | `+=900` | Long — bio lines reveal one by one |
| Projects | `+=700` per project | Each project feels like a full beat |
| Skills | `+=400` | Shorter — it's a supporting section |
| Contact | no pin | Contact stays normal scroll |

### Easing Tokens

```
power4.out  → primary entrance (steep decel = feels weighted, confident)
power4.in   → exits only
expo.out    → snap-back interactions (magnetic, cursor emerge)
back.out(1.4) → micro-interactions with slight overshoot
none        → scrub-driven animations (ScrollTrigger handles it)
```

### Duration Scale

```
Micro (hover):      0.25s — 0.35s
Fast (UI feedback): 0.5s
Normal (reveal):    1.0s — 1.2s
Cinematic:          1.8s — 2.5s   ← preloader exit, section transitions
```

### Stagger Values

```
Text lines (scrubbed):  driven by scrub position, not time-based stagger
Text lines (triggered): 0.08s each
Cards / panels:         0.12s each
Characters (rare):      0.03s each — only for Hero name, nowhere else
```

### What Changed From Previous System

| Before | After |
|---|---|
| `from: { opacity: 0, y: 60 }` | `from: { opacity: 0, scale: 0.88, y: 60, filter: "blur(8px)" }` |
| `scrub: true` | `scrub: 1.5` (weighted feel) |
| No pinning except About | Aggressive pin on every major section |
| `duration: 0.8s` normal | `duration: 1.2s` normal |
| Red accent everywhere | Gold accent sparingly |

---

## 6. Component Specific Values

### Custom Cursor (unchanged — already polished)
- `RING_SIZE: 32px`
- `FOLLOW_DURATION: 0.5s`
- Hover enter: `scaleX/Y → 0`, `power4.in`, `0.35s`
- Hover leave: `back.out(2.2)`, `0.55s`

### Navbar
- Scroll threshold: `30px`
- Glass pill: width `92%`, max-width `42rem`, border-radius `1rem`
- Logo scale scrolled: `0.85`
- Transition: `0.7s`, `cubic-bezier(0.16, 1, 0.3, 1)`

### Preloader (unchanged)
- Count duration: `2.3s`, `power2.in`
- Exit: `yPercent: -100`, `1.8s`, `power4.out`
- Typography: keep Space Mono — the counter is a label, not display

### Hero Pin Timeline (new)
```
Pin: +=500px scrubbed timeline
0%   → label fades in (opacity, y: 20 → 0)
20%  → name chars bloom from blur (depthReveal, stagger edges)
55%  → tagline slides up from overflow
80%  → scroll indicator fades
100% → section releases, About begins to arrive
```

### About Pin Timeline (new)
```
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

### Projects — Full-screen Stacked (new)
```
Each project: 100vh pinned, +=700px

Project panel enter (scrubbed):
  0%  → project number fades in (label font, text-disabled)
  20% → project name arrives (depthReveal, display font xl)
  45% → one-liner appears (body font, text-secondary)
  65% → stack tags stagger in (label font, border pills)
  85% → link arrow appears
  100%→ section holds for a beat, then releases to next
```

### Magnetic Button (unchanged)
- `STRENGTH: 0.3`, `TRIGGER_PAD: 40px`
- Snap: `back.out(1.4)`, `0.8s`