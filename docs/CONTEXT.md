# CONTEXT.md — Project State Snapshot

> Generated: June 2026
> Purpose: Any agent (or developer) picking up this repo reads this first.
> This file describes WHAT EXISTS NOW, WHAT IS DECIDED, and WHAT IS PENDING.
> Update this file after every sprint step is completed.

---

## 1. What This Project Is

A single-page portfolio website for **Narunat Sutthibut**, a 4th-year Computer Science student
and Full Stack Developer based in Thailand. Target audience: startup recruiters and hiring managers.

**Live stack:** React 19 + Vite 8 + TypeScript ~6.0 + GSAP 3.15 + Lenis 1.3 + Tailwind CSS v4

**Deployment:** Vercel (pending Sprint 6)

**The identity sentence** (never say this literally on the page, let the work show it):

> "I build real-time systems that feel good to use."

---

## 2. Aesthetic Direction — "Dust, Gravity, and Time"

**Reference films:** Interstellar × Inception × 3 Body Problem

**NOT:** neon sci-fi, cyberpunk, cyan HUD, lens flares, planet illustrations.

**IS:** warm editorial, typographic restraint, cinematic silence before motion,
serif display font against mono body, warm gold accent on near-black.

### The Cosmic Journey Narrative

The portfolio is a single journey from Earth to the event horizon of a black hole.
Each section = one cosmic environment. The recruiter travels through the cosmos.

```bash
Hero     → Aurora Borealis      (still on Earth, looking up)
About    → Comet Encounter      (leaving atmosphere, a comet passes close)
Projects → The Sun              (flying past our star, blinding warmth)
Skills   → Nebula Field         (drifting through deep space, stars being born)
Contact  → Black Hole / Event Horizon  (pulled past the point of no return)
```

This narrative is the single most important design decision in Sprint 5.
Every canvas background, color choice, and animation must serve this journey.

---

## 3. Current File State

### ✅ Files that are DONE and should not be rewritten without strong reason

| File                                     | State    | Notes                                                           |
| ---------------------------------------- | -------- | --------------------------------------------------------------- |
| `src/main.tsx`                           | ✅ Final | No changes needed                                               |
| `src/App.tsx`                            | ✅ Final | preloaderDone + heroTransitionComplete state pattern is correct |
| `src/hooks/useLenis.ts`                  | ✅ Final | Correct Lenis setup, scroll restoration, GSAP ticker            |
| `src/hooks/useMagneticHover.ts`          | ✅ Final | Strength 0.3, triggerPad 40px                                   |
| `src/hooks/useScrollReveal.ts`           | ✅ Final | Used only for Contact section                                   |
| `src/hooks/useBlurReveal.ts`             | ✅ Final | Used for Contact terminal                                       |
| `src/lib/motion.ts`                      | ✅ Final | prefersReducedMotion + onPrefersReducedMotionChange             |
| `src/lib/gsap.ts`                        | ✅ Final | depthReveal exported, ScrollTrigger + Flip registered           |
| `src/components/cursor/CustomCursor.tsx` | ✅ Final | Suck-in collapse + spring emerge (DEC-009, DEC-010)             |
| `src/components/preloader/Preloader.tsx` | ✅ Final | Counter 2.3s + slide-up exit 1.8s                               |
| `src/components/ui/MagneticButton.tsx`   | ✅ Final | Uses useMagneticHover                                           |
| `src/components/ui/BlurReveal.tsx`       | ✅ Final | Wraps useBlurReveal                                             |
| `src/components/ui/OptimizedImage.tsx`   | ✅ Final | WebP + JPEG fallback via picture                                |
| `src/components/ui/ScrollIndicator.tsx`  | ✅ Final | Bouncing mouse wheel animation                                  |
| `src/components/ui/ScrollProgress.tsx`   | ✅ Final | Needs color token update only                                   |
| `scripts/optimize-images.mjs`            | ✅ Final | Sharp WebP pipeline                                             |

### ⚠️ Files that NEED CHANGES in Sprint 5

| File                                   | Required Change                                                                 | Sprint Step | Blocking?                       |
| -------------------------------------- | ------------------------------------------------------------------------------- | ----------- | ------------------------------- |
| `index.html`                           | Add Cormorant Garamond to Google Fonts import                                   | Step 01     | Yes — blocks font-display usage |
| `src/index.css`                        | Full token update: warm palette, font-display, font-label, remove --color-brand | Step 01     | Yes — blocks all visual changes |
| `src/components/sections/Hero.tsx`     | Typography update: font-display for name, italic on "matters."                  | Step 03     | No                              |
| `src/components/sections/About.tsx`    | Comet canvas background, remove photo placeholder grid                          | Step 03     | No                              |
| `src/components/sections/Projects.tsx` | Full rewrite: map to ProjectPanel components, remove ProjectWindow              | Step 05     | No                              |
| `src/components/sections/Skills.tsx`   | Rewrite: two groups (Shipped/Learning), nebula ambient, remove floating cards   | Step 06     | No                              |
| `src/components/sections/Contact.tsx`  | Black hole accretion canvas, font-display heading, italic "Connect."            | Step 07     | No                              |
| `src/components/navbar/Navbar.tsx`     | Warm tint update: rgba(22,26,29) → rgba(22,20,17)                               | Step 01     | No                              |
| `src/components/AmbientBackground.tsx` | Replace CSS orbs with Aurora canvas (Hero zone)                                 | Step 02     | No                              |

### 🆕 Files that NEED TO BE CREATED in Sprint 5

| File                                 | Purpose                                                                     | Sprint Step |
| ------------------------------------ | --------------------------------------------------------------------------- | ----------- |
| `src/hooks/usePinnedTimeline.ts`     | Shared pin + scrub ScrollTrigger hook used by Hero, About, Projects, Skills | Step 02     |
| `src/components/ui/ProjectPanel.tsx` | Single full-screen project component, replaces ProjectWindow.tsx            | Step 05     |

### 🗑️ Files SCHEDULED FOR DELETION

| File                                  | Reason                                 | Sprint Step |
| ------------------------------------- | -------------------------------------- | ----------- |
| `src/components/ui/ProjectWindow.tsx` | Replaced by ProjectPanel.tsx (DEC-015) | Step 05     |

---

## 4. Token Reference — Current vs Target

### Current `index.css` tokens (STALE — Sprint 4)

```css
--color-bg: #0b090a;
--color-surface: #161a1d;
--color-border: #2a2d30;
--color-brand: #a4161a;      ← DELETE THIS
--color-accent: #a4161a;     ← WRONG VALUE, update
--color-brand-light: #e5383b; ← DELETE THIS
--color-text-primary: #f5f3f4;
--color-text-secondary: #6b7280;
--color-text-disabled: #3d4147;
--font-heading: "Space Mono"; ← RENAME to font-label
--font-body: "IBM Plex Mono";
```

### Target `index.css` tokens (Sprint 5 — DEC-011, DEC-012)

```css
--color-bg: #080706;
--color-surface: #161310;
--color-surface-2: #1E1C18;
--color-border: #2A2519;
--color-border-light: #3A3732;
--color-accent: #C4A97D;       ← warm gold (NOT red)
--color-accent-light: #D4BC9A;
--color-accent-dark: #8A7450;
--color-text-primary: #EDE6D6;
--color-text-secondary: #7A776E;
--color-text-disabled: #3A3834;
--font-display: "Cormorant Garamond", Georgia, serif;  ← NEW
--font-label: "Space Mono", monospace;                 ← renamed from font-heading
--font-body: "IBM Plex Mono", monospace;
```

---

## 5. Section Cosmic Canvas Specs

Each section needs a canvas element (or updated AmbientBackground zone).
These are the exact GSAP implementation targets per section:

### Hero — Aurora Canvas

- **Technique:** 4–6 sine wave layers on GSAP ticker
- **Colors:** `#0A0818` base, `#00E87A` primary wave, `#7B4FBF` secondary, `#4FC3F7` accent, `#FF3D6E` sparse
- **Interactivity:** Scroll velocity → wave frequency (faster scroll = tighter bands)
- **Science basis:** O₂ at 100–150km (green), N₂ ionization (violet), N₂⁺ ions (blue)
- **Component:** `AmbientBackground.tsx` — replace existing CSS orbs

### About — Comet Canvas

- **Technique:** Single comet drawn on canvas, position scrubbed via ScrollTrigger
- **Ion tail:** Gaussian-blur approximation via layered circles, `#C8F0E8` cyan-green
- **Dust tail:** Warm white `#F5F0EA`, separate path at slight angle
- **Trigger:** Fires as About panel slides up from `y: 100vh`
- **Science basis:** CN radical emission (ion tail), silicate particle reflection (dust tail)

### Projects — Solar Canvas

- **Technique:** Radial gradient from bottom-center, opacity driven by ScrollTrigger scrub
- **Colors:** `#080402` → `#E8650A` → `#FFD27F` → `#FFF5D6` at center
- **Solar flare:** 10 canvas particles burst on project panel enter, `power4.out`, 0.8s fade
- **Science basis:** G-type star 5,778K blackbody radiation

### Skills — Nebula Canvas

- **Technique:** 4 slow-drifting radial gradient circles on GSAP ticker (sine offset)
- **Shipped with group:** Warm H-alpha orange `#FF8C42`, opacity max 0.10
- **Learning with group:** Cool OIII blue `#B8D4F8`, opacity max 0.12
- **Science basis:** Hydrogen-alpha emission (orange), OIII oxygen emission (blue)

### Contact — Accretion Disk Canvas

- **Technique:** Canvas ellipse with gradient stroke, slowly rotating via `gsap.ticker`
- **Colors:** Core `#080504` → disk `#E8650A` → outer `#FFB347` → lensed `#FFF5D6`
- **Opacity:** Driven by ScrollTrigger enter, max 0.35
- **Micro-interaction:** On email CTA hover: `skewX` tween on sibling text = gravitational lensing
- **Science basis:** M87\* accretion disk (Event Horizon Telescope, 2019), Gargantua (Interstellar)

---

## 6. Projects Data (final copy — use exactly this)

### Project 01 — Boardgame Online: Exploding Kittens

- **One-liner:** A synchronized card game engine — real-time state, five players, zero conflicts.
- **Stack:** Next.js · TypeScript · Socket.io · PostgreSQL · Prisma ORM · GitHub Actions
- **Link:** <https://exploding-kittens-beta.vercel.app/> (Live)
- **Solar ambient:** Warm orange — `#E8650A` tint

### Project 02 — TramTracking System

- **One-liner:** A live campus mobility platform — sub-500ms location sync, pinpoint accuracy.
- **Stack:** Next.js · TypeScript · Socket.io · PostgreSQL · PostGIS · OpenStreetMap
- **Link:** <https://github.com/nsgundam/TramTrackingSystem> (GitHub)
- **Solar ambient:** Cooler blue-white star — `#A8D8F0` tint

---

## 7. Skills Data (final copy — use exactly this)

### Group 1: "Shipped with"

Technologies in production projects or serious builds.

```bash
Next.js · React · TypeScript
Node.js · Express · Socket.io
PostgreSQL · PostGIS · Prisma ORM
Tailwind CSS · GSAP · Lenis
Git · GitHub Actions · Vercel
```

### Group 2: "Learning with"

Technologies actively being learned or used in non-production contexts.

```bash
Docker · MongoDB · MySQL
Agile / Scrum · Postman
```

**Typography rule:** comma-separated inline text, NOT pill tags.

- Group labels: `font-label`, `text-disabled`, uppercase, tracking-widest
- Group headings ("Shipped with" / "Learning with"): `font-display`, italic
- Skill names: `font-body`, `text-primary`

---

## 8. Animation Architecture Reference

### Two modes — never mix in the same section

| Mode             | Used for                           | Pattern                                  |
| ---------------- | ---------------------------------- | ---------------------------------------- |
| Pinned + Scrub   | Hero, About, Projects, Skills      | `usePinnedTimeline` hook                 |
| Triggered + Time | Contact, Navbar, Preloader, Cursor | `gsap.timeline()` in useEffect, no scrub |

### Pin distances

| Section  | Desktop           | Mobile (× 0.5) | Tablet (× 0.6) |
| -------- | ----------------- | -------------- | -------------- |
| Hero     | +=500px           | +=250px        | +=300px        |
| About    | +=900px           | +=450px        | +=540px        |
| Projects | +=700px per panel | +=350px        | +=420px        |
| Skills   | +=400px           | +=200px        | +=240px        |

### Easing tokens (from design-motion.md)

```bash
power4.out    → primary entrance
power4.in     → exits only
expo.out      → snap-back interactions
back.out(1.4) → micro-interactions with slight overshoot
none          → scrub-driven (ScrollTrigger handles it)
```

---

## 9. Contact Data

```bash
email    → snarunat.99@gmail.com
github   → github.com/nsgundam
linkedin → linkedin.com/in/narunat-sutthibut
```

---

## 10. Decisions Log Summary (DEC-001 → DEC-017)

| DEC     | Decision                                          | Impact                                                     |
| ------- | ------------------------------------------------- | ---------------------------------------------------------- |
| DEC-001 | Dark mode only                                    | No toggle, no light mode                                   |
| DEC-002 | No Framer Motion                                  | GSAP only                                                  |
| DEC-003 | Skip Figma wireframe                              | Playground-first approach                                  |
| DEC-004 | Use `"lenis"` not `"@studio-freight/lenis"`       | Deprecated package avoided                                 |
| DEC-005 | Tailwind v4 + @theme                              | No tailwind.config.js                                      |
| DEC-006 | No Fastwork link                                  | Only Email, GitHub, LinkedIn                               |
| DEC-007 | SPA only                                          | Anchor links, no router                                    |
| DEC-008 | 4 Must + 3 Should + 1 Nice effects                | Scope control                                              |
| DEC-009 | Cursor: suck-in collapse on hover                 | Ring collapses to nothing, not wraps button                |
| DEC-010 | gsap.quickTo needs re-create after overwrite:true | Use `let` not `const` for quickTo refs                     |
| DEC-011 | Palette: red → warm gold `#C4A97D`                | All `text-brand` → `text-accent`                           |
| DEC-012 | Add Cormorant Garamond as `font-display`          | `font-heading` → `font-label`, headings use `font-display` |
| DEC-013 | Aggressive pinning on all major sections          | `usePinnedTimeline` hook, `scrub: 1.5` everywhere          |
| DEC-014 | `depthReveal` replaces flat fade+slide            | scale + blur + y entrance, export from lib/gsap.ts         |
| DEC-015 | Projects: full-screen stacked panels              | Delete ProjectWindow.tsx, create ProjectPanel.tsx          |
| DEC-016 | Skills: two honest groups not floating cards      | "Shipped with" / "Learning with"                           |
| DEC-017 | About: remove photo placeholder and grid          | Typography-only layout, no bordered boxes                  |

---

## 11. What Has NOT Been Decided Yet

- Whether to add a loading state per canvas section (currently none planned)
- Whether `usePinnedTimeline` exposes an `onUpdate` progress callback (architecture.md mentions it, not yet built)
- Exact timing of Vercel deployment (Sprint 6, no date set)
- Whether to add Vercel Analytics (Sprint 6 backlog)
- Performance budget for canvas animations on mobile (to be measured after implementation)
