# Section Spec — Showcase (Projects)
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ⬜ Needs upgrade — current implementation is a basic card list. Bento grid with hover interactions required.

---

## Purpose

The Showcase section presents engineering work as case studies, not just project listings. Each card should feel engineered — with hierarchy, depth, and interactive detail. The viewer should sense that the developer thinks carefully about presentation as much as implementation.

---

## Layout — Bento Grid

Replace the current vertical card list with an asymmetric bento grid.

### Desktop Grid (≥ 1024px)
```
grid-template-columns: 2fr 1fr
grid-template-rows: auto
gap: 1.5rem (gap-6)

Card 01 (Exploding Kittens): spans full left column (featured — larger)
Card 02 (TramTracking):      right column
```

### Tablet Grid (768px–1024px)
```
grid-template-columns: 1fr 1fr
gap: 1rem
Both cards equal width
```

### Mobile (< 768px)
```
Single column, full width
Cards stacked vertically
```

---

## Section Header

```
Section label: "02 / Projects"
  font-body, text-xs, text-brand, tracking-[0.3em] uppercase, mb-4

Heading: "Showcase"
         "Of Projects"  ← second line in text-secondary
  font-heading, clamp(32px, 4vw, 64px), mb-16
```

---

## Project Data

### Project 01 — Boardgame Online: Exploding Kittens
```
number:      "01"
title:       "Boardgame Online"
subtitle:    "Exploding Kittens"
description: "Real-time multiplayer card game. Scalable room system supporting up to 5 players
              with event-driven architecture and sub-100ms sync."
stack:       ["Next.js", "Socket.io", "PostgreSQL", "TypeScript", "Prisma ORM", "GitHub Actions"]
link:        "https://exploding-kittens-beta.vercel.app/"
linkType:    "Live"
featured:    true   ← larger card in bento grid
```

### Project 02 — TramTracking System
```
number:      "02"
title:       "TramTracking"
subtitle:    "System"
description: "Full-stack real-time mobility platform for campus shuttles.
              Sub-500ms location updates via WebSocket and PostGIS spatial indexing."
stack:       ["Next.js", "Socket.io", "PostGIS", "OpenStreetMap", "PostgreSQL", "TypeScript"]
link:        "https://github.com/nsgundam/TramTrackingSystem"
linkType:    "GitHub"
featured:    false
```

---

## Card Design

### Base Card
```
background:     var(--color-surface)  (#161A1D)
border:         1px solid var(--color-border)  (#2A2D30)
border-radius:  1rem (rounded-2xl)
padding:        p-6 sm:p-8
overflow:       hidden
position:       relative
```

### Card Header
```
Row: project number (left) + link button (right)
  Number: font-body, text-xs, text-disabled, tracking-widest
  Link:   font-body, text-xs, text-secondary, tracking-widest uppercase
          hover: text-brand
          "Live ↗" or "GitHub ↗"
```

### Card Title
```
Title:    font-heading, text-2xl, text-primary, mb-1
Subtitle: font-heading, text-2xl, text-secondary, mb-6
```

### Card Description
```
font-body, text-sm, text-secondary, leading-relaxed, mb-8, max-w-xl
```

### Tech Stack Tags
```
Flex wrap, gap-2
Each tag:
  font-body, text-xs, text-disabled
  border: 1px solid var(--color-border)
  padding: px-3 py-1
  border-radius: none (sharp corners — technical aesthetic)
```

---

## Hover Interactions

### Border Glow
```
default:  border-color: var(--color-border)
hover:    border-color: var(--color-brand)
transition: border-color 0.3s ease
```

### Card Elevation
```
default:  translateY(0), box-shadow: none
hover:    translateY(-4px), box-shadow: 0 20px 40px rgba(0,0,0,0.3)
transition: transform 0.3s power4.out, box-shadow 0.3s ease
```

### Subtle Ambient Glow (Featured Card Only)
```
::before pseudo-element:
  position: absolute, inset: -1px
  background: radial-gradient(circle at 50% 0%, rgba(164,22,26,0.15), transparent 60%)
  opacity: 0 → 0.8 on hover
  transition: opacity 0.5s ease
  pointer-events: none
```

### Link Arrow Animation
```
"↗" character:
  default:  translateX(0) translateY(0)
  hover:    translateX(3px) translateY(-3px)
  transition: transform 0.3s ease
```

---

## Scroll Reveal

Cards reveal on scroll using `useScrollReveal` with staggered delay:
```
Card 01: delay 0s
Card 02: delay 0.15s
```

Or use `BlurReveal` wrapper for a more cinematic entrance.

---

## Expandable Details (Optional Enhancement)

If time permits, add an expandable detail panel inside each card:

```
Trigger: "View Details" text button at card bottom
Expand:  Animated height reveal (GSAP) showing full tech stack table
         and impact metrics
Collapse: Same trigger, reverses animation
```

This is a nice-to-have. Do not implement if it risks the deadline.

---

## Accessibility

- `<article>` element for each project card
- `<h3>` for project title
- External links have `target="_blank"` and `rel="noopener noreferrer"`
- External links have visually hidden "opens in new tab" text or `aria-label`
- Tech stack tags are in a `<ul>` with `<li>` elements

---

## Responsive

| Breakpoint | Grid | Card padding |
|---|---|---|
| Mobile < 768px | 1 column | p-5 |
| Tablet 768–1024px | 2 equal columns | p-6 |
| Desktop > 1024px | 2fr + 1fr asymmetric | p-8 |

---

## What NOT to do

- Do not add project screenshots or mockup images (no assets available)
- Do not add a "See All Projects" button — there are only 2 projects
- Do not use card flip animations — they feel gimmicky
- Do not add video previews
- Do not make the tech tags clickable — they are labels, not filters
- Do not add a "Featured" badge — the card size hierarchy communicates this
