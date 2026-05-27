# Portfolio Website — Project Brief
> Refactored: May 2026 — lukebaffait.fr reference
> Deadline: 31 May 2026

---

## 01 Project Goal

| Field | Value |
|---|---|
| Role | Software Engineer / Fullstack Web Developer |
| Target | Startup (early to growth stage) |
| Deadline | 31 May 2026 |
| Feel | Editorial, spatial, quietly confident — not loud, not generic |

---

## 02 Personal Identity

| Field | Value |
|---|---|
| Tagline | Aiming high, building what matters. |
| Tone | Sophisticated, editorial, technically honest |
| Strength | Real-time systems + full-stack depth |
| Identity line | "I build real-time systems that feel good to use." |
| Color scheme | Dark mode only — warm palette (see design-system.md) |

### The Identity Line

This single sentence covers both projects and explains your value to a startup:
- "Real-time systems" → proves engineering depth (Socket.io, WebSocket, PostGIS)
- "Feel good to use" → proves you care about the product, not just the code
- Short enough to be a mental anchor after the recruiter closes the tab

Use it implicitly in the About copy. Never state it literally on the page.

---

## 03 Tech Stack (unchanged)

| Layer | Technology |
|---|---|
| Framework | React + Vite (CSR, Single Page) |
| Language | TypeScript |
| Animation | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Text Animation | Splitting.js |
| Styling | Tailwind CSS v4 |
| Code Quality | ESLint + Prettier |
| Deployment | Vercel |

---

## 04 Effect List (updated priority)

| # | Effect | Priority | Status |
|---|---|---|---|
| 01 | Cinematic Preloader (0→100) | 🔴 Must Have | ✅ Done — keep as-is |
| 02 | Custom Cursor + Spring Physics | 🔴 Must Have | ✅ Done — keep as-is |
| 03 | Glassmorphism Navbar + Logo Tuck | 🔴 Must Have | ✅ Done — warm tint update only |
| 04 | Aggressive ScrollTrigger Pinning | 🔴 Must Have | ⬜ New — replaces flat scrolling |
| 05 | Depth Reveal Entrance (scale+blur) | 🔴 Must Have | ⬜ New — replaces flat fade+slide |
| 06 | Rolling Text on Hover (Menu) | 🟡 Should Have | ✅ Done — keep as-is |
| 07 | Magnetic Hover on CTA | 🟡 Should Have | ✅ Done — keep as-is |
| 08 | Scroll Progress Line | 🟢 Nice to Have | ✅ Done — color update only |

---

## 05 Hero Section (updated)

| Field | Value |
|---|---|
| Name | Narunat Sutthibut |
| Label | Full Stack Developer |
| Tagline | Aiming high, building what matters. |
| Font | Cormorant Garamond — name in Display XL, italic on "matters" |
| Motion | Chars bloom from blur on scroll pin, tagline reveals from overflow |

### Typography Direction

The name should feel like a title card from a film — huge, warm cream,
Cormorant Garamond 300 weight. "Sutthibut" can break to a second line if needed.
The label above ("Full Stack Developer") stays Space Mono, label size, gold accent.

---

## 06 About (rewritten copy + new layout)

### Layout Change

Remove the three-column grid entirely.
New structure: full-width, generous vertical rhythm, no boxes.

```
[section number]          ← label font, accent color, top left
[giant heading]           ← display font, huge, warm cream
[bio — 3 short lines]     ← body font, text-secondary, wide measure
[facts — horizontal row]  ← label font, no borders, just spacing
```

### Copy (final — use exactly this)

**Heading (split across two lines, italic on second):**
```
Agile Technical
Explorer.
```

**Bio (three lines, each reveals separately on scroll):**
```
Line 1: A developer driven by curiosity and a problem-solving mindset.
Line 2: I work at the intersection of efficient architecture and sophisticated
        visuals — building systems that are both fast and intentional.
Line 3: Currently in my final year, looking for a team that moves with purpose.
```

**Facts row:**
```
Based in        → Thailand
Focus           → Full-Stack / Real-Time
Status          → Final year, available 2026
```

### What Was Removed
- Photo placeholder — removed entirely
- Three-column grid — removed
- All bordered boxes — removed
- "Agile Technical Explorer" repeated twice — now appears once, huge

---

## 07 Projects (full rewrite — full-screen stacked)

### Layout: Full-Screen Stacked Pinned Panels

Each project is a full viewport height section.
ScrollTrigger pins it. The content reveals on a scrubbed timeline.
After the content is fully revealed, the pin releases and the next project arrives.

### Project 01 — Boardgame Online: Exploding Kittens

**One-liner (strong, use exactly this):**
> A synchronized card game engine — real-time state, five players, zero conflicts.

**Description (body copy under the one-liner):**
> Built event-driven game logic that coordinates turn management, deck randomization,
> and card effects across concurrent players via Socket.io. Scalable room architecture
> handles up to five players with automated seating and sub-100ms sync.

**Stack:** Next.js · TypeScript · Socket.io · PostgreSQL · Prisma ORM · GitHub Actions

**Link:** https://exploding-kittens-beta.vercel.app/ (Live)

---

### Project 02 — TramTracking System

**One-liner (strong, use exactly this):**
> A live campus mobility platform — sub-500ms location sync, pinpoint accuracy.

**Description (body copy under the one-liner):**
> Full-stack real-time tracking for campus shuttle fleets. WebSocket optimization
> achieves sub-500ms location updates. PostGIS spatial indexing delivers
> precise route management and geofencing at scale.

**Stack:** Next.js · TypeScript · Socket.io · PostgreSQL · PostGIS · OpenStreetMap

**Link:** https://github.com/nsgundam/TramTrackingSystem (GitHub)

---

### Project Panel Layout (per project)

```
[project number]       ← "01" or "02", label font, text-disabled, top left
[project name]         ← display font, Display LG, warm cream
[one-liner]            ← body font, Body LG, text-secondary, italic feel
[stack tags]           ← label font, pill borders, stagger in
[link]                 ← label font, accent color, arrow →
```

---

## 08 Skills (rewritten — two honest groups)

### Layout Change

Remove all floating cards.
Two sections, side by side on desktop, stacked on mobile.
No borders. No boxes. Just type and spacing.

### Group 1: "Shipped with"

Technologies that appear in production projects or serious builds.
These have earned the right to be listed.

```
Next.js · React · TypeScript
Node.js · Express · Socket.io
PostgreSQL · PostGIS · Prisma ORM
Tailwind CSS · GSAP · Lenis
Git · GitHub Actions · Vercel
```

### Group 2: "Learning with"

Technologies actively being learned or used in non-production contexts.
The honesty here is a feature, not a weakness.

```
Docker · MongoDB · MySQL
Agile / Scrum · Postman
```

### Typography

- Group labels: `font-label`, `text-disabled`, `uppercase`, `tracking-widest`
- "Shipped with" / "Learning with": `font-display`, Display MD, `text-secondary`
- Skill names: `font-body`, Body SM, `text-primary` — comma-separated inline, not pill tags

---

## 09 Contact (unchanged structure, updated copy)

### Copy Changes

**Heading:**
```
Let's
Connect.
```
("Connect" in italic Cormorant Garamond)

**Email CTA (MagneticButton — keep):**
```
snarunat.99@gmail.com
```

**Terminal — keep the structure, update boot lines:**
```
> Initializing contact protocol...
> Loading communication channels...
> Status: READY

> Available channels:
```

**Links:**
```
email    → snarunat.99@gmail.com
github   → github.com/nsgundam
linkedin → linkedin.com/in/narunat-sutthibut
```

### Footer
```
© 2026 Narunat Sutthibut. Built with React + GSAP.
```

---

## 10 Reference

### Primary Reference
**lukebaffait.fr**
- Depth reveals: scale + blur entrance, not just fade+slide
- Pinned scroll: each section earns its content before releasing
- Typography: serif display + mono body = editorial tension
- Accent: near-invisible, discovered not announced
- Density: sparse — space is the design, not decoration

### Supporting References
- **jasminegunarto.com** — cinematic preloader (already implemented)
- **donmolinico.es** — rolling text hover, logo tuck (already implemented)
- **new.studio** — glassmorphism nav, blur reveal (already implemented)