# ROADMAP.md — Sprint 5 Implementation

> Sprint: Cosmic Journey Redesign
> Aesthetic: Interstellar × Inception × 3 Body Problem
> Narrative: Aurora → Comet → Sun → Nebula → Black Hole
> Priority: Correctness over speed — no deadline pressure

---

## How to Use This Roadmap

- Work through steps **in order**. Each step unblocks the next.
- Mark items `[x]` when done and update `_management/timeline.md` in the same commit.
- Never skip Step 01 — all visual steps depend on correct tokens.
- Each step lists: files changed, what to do, acceptance criteria.

---

## Pre-flight Checklist (before any code)

- [ ] Read `AGENTS.md` fully
- [ ] Read `CONTEXT.md` §3 (file state) and §5 (canvas specs)
- [ ] Read `docs/decision.md` DEC-011 through DEC-017
- [ ] Confirm dev server runs: `cd frontend && npm run dev`

---

## Step 01 — Tokens + Fonts

> Unblocks everything. Do this first. The site will look broken until Step 02 restores it.

**Files to change:**

- `frontend/index.html`
- `frontend/src/index.css`
- `frontend/src/components/navbar/Navbar.tsx`

### 01-A: index.html — Add Cormorant Garamond

Replace the existing Google Fonts `<link>` with:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@400&family=Space+Mono:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

### 01-B: index.css — Full token swap

Replace entire `@theme {}` block with:

```css
@theme {
  --color-bg: #080706;
  --color-surface: #161310;
  --color-surface-2: #1e1c18;
  --color-border: #2a2519;
  --color-border-light: #3a3732;
  --color-accent: #c4a97d;
  --color-accent-light: #d4bc9a;
  --color-accent-dark: #8a7450;
  --color-text-primary: #ede6d6;
  --color-text-secondary: #7a776e;
  --color-text-disabled: #3a3834;
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-label: "Space Mono", monospace;
  --font-body: "IBM Plex Mono", monospace;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);
}
```

Then do a **global find-replace** across all `.tsx` files in `src/`:

| Find               | Replace                                                                            |
| ------------------ | ---------------------------------------------------------------------------------- |
| `font-heading`     | `font-label` (for labels/numbers) OR `font-display` (for headings — check context) |
| `text-brand`       | `text-accent`                                                                      |
| `border-brand`     | `border-accent`                                                                    |
| `bg-brand`         | `bg-accent`                                                                        |
| `text-brand-light` | `text-accent-light`                                                                |

> ⚠️ When replacing `font-heading`: section H1/H2 → `font-display`. Nav, labels, numbers → `font-label`.

### 01-C: Navbar.tsx — Warm tint

Change `SCROLLED_BG` constant:

```ts
const SCROLLED_BG = "rgba(22, 20, 17, 0.65)"; // was rgba(22, 26, 29, 0.65)
```

**Acceptance criteria:**

- [ ] `npm run dev` — no TypeScript errors
- [ ] Fonts load: Cormorant Garamond visible in Hero heading
- [ ] No red accent visible anywhere — all accent is warm gold
- [ ] Navbar glass pill has warm tint, not blue-grey

---

## Step 02 — Aurora Canvas (AmbientBackground + usePinnedTimeline)

> Two files. Aurora transforms the Hero. Hook enables all pinning.

**Files to create:**

- `frontend/src/hooks/usePinnedTimeline.ts`

**Files to change:**

- `frontend/src/components/AmbientBackground.tsx`

### 02-A: Create usePinnedTimeline.ts

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
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px)",
    ).matches;
    const factor = isMobile ? 0.5 : isTablet ? 0.6 : 1;
    const pinDistance = options.pinDistance * factor;

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

### 02-B: AmbientBackground.tsx — Aurora canvas

Replace the entire component with a canvas-based aurora renderer:

- Background base: `#0A0818` deep indigo (not pure black)
- 5 sine wave layers: primary `#00E87A` (O₂), secondary `#7B4FBF` (N₂), tertiary `#4FC3F7` (N₂⁺), sparse `#FF3D6E` (high-altitude O₂), faint `#00B85E` (lower O₂)
- Each wave: different amplitude (20–80px), frequency (0.003–0.008), phase offset, opacity (0.06–0.18)
- GSAP ticker drives `time` increment — smooth, not requestAnimationFrame directly
- On scroll past Hero section: canvas hue smoothly transitions toward warm dark — use GSAP `gsap.to({ hueShift }, ...)` and apply in canvas draw loop
- `prefersReducedMotion()`: skip canvas, render static dark background

**Aurora wave draw algorithm:**

```ts
// For each wave layer i:
for (let x = 0; x <= canvas.width; x += 2) {
  const y =
    canvas.height * 0.4 +
    Math.sin(x * freq[i] + phase[i] + time * speed[i]) * amplitude[i] +
    Math.sin(x * freq[i] * 2.3 + time * speed[i] * 0.7) * amplitude[i] * 0.3;
  // draw gradient fill from y to canvas.height
}
```

**Acceptance criteria:**

- [ ] Aurora waves visible and animating in Hero section
- [ ] Wave frequency increases when user scrolls fast (velocity detection)
- [ ] Canvas is `position: fixed; inset: 0; z-index: -1`
- [ ] No visible aurora in Contact section (hue shift applied)
- [ ] prefers-reduced-motion: static dark background, no canvas animation

---

## Step 03 — Hero Typography Upgrade

> Visual polish only — no animation architecture change.

**Files to change:**

- `frontend/src/components/sections/Hero.tsx`

### Changes

- Hero name `<h1>`: change `font-heading` → `font-display`, reduce font-weight to 300

  ```tsx
  className="... font-display ..."
  style={{ fontSize: "clamp(56px, 10vw, 140px)", fontWeight: 300 }}
  ```

- Tagline: wrap "matters." in `<em>` for italic gold

  ```tsx
  // aria-label stays clean: "Aiming high, building what matters."
  <>
    Aiming high, building what{" "}
    <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
      matters.
    </em>
  </>
  ```

- Label "Full Stack Developer": change to `font-label` (was `font-body`)

**Acceptance criteria:**

- [ ] Name renders in Cormorant Garamond 300 — large, thin, cinematic
- [ ] "matters." is italic gold
- [ ] "Full Stack Developer" label is Space Mono
- [ ] Preloader → Hero handoff still works (no regression)
- [ ] Splitting.js char animation still fires correctly

---

## Step 04 — About: Comet Canvas

> Comet streaks across background as About panel slides up.

**Files to change:**

- `frontend/src/components/sections/About.tsx`

### Changes

1. Remove `photoRef` and photo div entirely (DEC-017)
2. Remove `grid grid-cols-1 md:grid-cols-3` wrapper
3. Remove border-b from info items
4. New layout: full-width typographic — label, giant heading, bio lines (individual refs), facts row
5. Add comet canvas layer inside About section:
   - Canvas `position: absolute; inset: 0; pointer-events: none; z-index: 0`
   - Comet position X: driven by ScrollTrigger `onUpdate` progress
   - Ion tail: `#C8F0E8` layered circles with blur
   - Dust tail: `#F5F0EA` at 10° divergence from ion tail
   - Nucleus: dark ellipse `#2A3040`, 8px × 5px
6. Bio lines: `line1Ref`, `line2Ref`, `line3Ref` — stagger reveal in comet's light path
7. Heading update: `font-display`, "Agile Technical / Explorer." with italic on "Explorer."

**About copy (final — from project-brief.md §06):**

```bash
Heading line 1: Agile Technical
Heading line 2: Explorer.   ← italic

Bio line 1: A developer driven by curiosity and a problem-solving mindset.
Bio line 2: I work at the intersection of efficient architecture and sophisticated
            visuals — building systems that are both fast and intentional.
Bio line 3: Currently in my final year, looking for a team that moves with purpose.

Facts:
  Based in    → Thailand
  Focus       → Full-Stack / Real-Time
  Status      → Final year, available 2026
```

**Acceptance criteria:**

- [ ] No photo placeholder visible
- [ ] Comet animates diagonally across section background on scroll
- [ ] Bio lines stagger-reveal after comet passes
- [ ] Heading uses font-display, italic on "Explorer."
- [ ] DEC-017 fully respected: no grid, no bordered boxes

---

## Step 05 — Projects: Full-Screen Stacked Panels + Sun Canvas

> Biggest structural change. Delete ProjectWindow, create ProjectPanel.

**Files to create:**

- `frontend/src/components/ui/ProjectPanel.tsx`

**Files to change:**

- `frontend/src/components/sections/Projects.tsx`

**Files to delete:**

- `frontend/src/components/ui/ProjectWindow.tsx`

### 05-A: Create ProjectPanel.tsx

Each panel is a full-viewport-height pinned section with solar ambient canvas.

Props interface:

```ts
interface ProjectPanelProps {
  project: Project; // from src/types/index.ts
  index: number; // 0-based, used for solar tint per project
  preloaderDone: boolean;
}
```

Panel structure (per design-motion.md + project-brief.md §07):

```bash
[project number]   ← font-label, text-disabled, top-left
[giant bg number]  ← font-display, opacity: 0.03, absolute centered
[project name]     ← font-display, Display LG, warm cream
[one-liner]        ← font-body, Body LG, text-secondary, italic
[stack tags]       ← font-label, pill borders, stagger in
[link arrow]       ← font-label, accent color, →
```

Solar canvas per panel:

- Project 01: warm orange radial gradient `#E8650A` from bottom center, opacity 0.12
- Project 02: cooler blue-white `#A8D8F0` from bottom center, opacity 0.08
- Both: slow solar flare particle burst on panel enter (10 particles, gold, `power4.out`, 0.8s)

Animation: `usePinnedTimeline(preloaderDone, { pinDistance: 700 })`

### 05-B: Rewrite Projects.tsx

Clean container — maps PROJECTS array → ProjectPanel components:

```tsx
export default function Projects({ preloaderDone }: ProjectsProps) {
  return (
    <div id="projects">
      {PROJECTS.map((project, index) => (
        <ProjectPanel
          key={project.number}
          project={project}
          index={index}
          preloaderDone={preloaderDone}
        />
      ))}
    </div>
  );
}
```

Update PROJECTS data to use final copy from CONTEXT.md §6.

**Acceptance criteria:**

- [ ] ProjectWindow.tsx deleted (no import errors)
- [ ] Two full-screen project panels visible
- [ ] Each panel pins for +=700px
- [ ] Solar ambient canvas visible per panel
- [ ] Solar flare burst on panel enter
- [ ] Stack tags stagger in
- [ ] Project 01 orange tint, Project 02 blue-white tint distinguishable

---

## Step 06 — Skills: Nebula + Two Groups

> Remove floating cards. Typography-only. Nebula ambient canvas.

**Files to change:**

- `frontend/src/components/sections/Skills.tsx`

### Changes

1. Delete `SKILL_GROUPS` array (5 categories)
2. Delete `FLOAT_CONFIG` array
3. Delete all floating card animation code
4. New data structure:

```ts
const SHIPPED = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "Socket.io",
  "PostgreSQL",
  "PostGIS",
  "Prisma ORM",
  "Tailwind CSS",
  "GSAP",
  "Lenis",
  "Git",
  "GitHub Actions",
  "Vercel",
];
const LEARNING = ["Docker", "MongoDB", "MySQL", "Agile / Scrum", "Postman"];
```

1. Layout: two groups stacked vertically
   - Group label: `font-label`, tracking-widest, text-disabled, uppercase
   - Group heading ("Shipped with" / "Learning with"): `font-display`, italic, Display MD
   - Skills: `font-body`, text-primary, comma-separated inline — NOT pill tags
2. Nebula canvas:
   - 4 slowly drifting radial gradient circles on GSAP ticker (sine offset per circle)
   - Shipped group zone: `#FF8C42` H-alpha orange, opacity max 0.10
   - Learning group zone: `#B8D4F8` OIII blue, opacity max 0.12
   - Drift speed: very slow (period ~8–12 seconds per cycle)
3. Attach `usePinnedTimeline(preloaderDone, { pinDistance: 400 })`

**Acceptance criteria:**

- [ ] No floating cards visible
- [ ] Skills are comma-separated inline text
- [ ] "Shipped with" has warm orange nebula ambient
- [ ] "Learning with" has cool blue nebula ambient
- [ ] depthReveal fires on both group headings
- [ ] Pin works for +=400px

---

## Step 07 — Contact: Black Hole + Event Horizon

> The journey ends. Accretion disk canvas. Gravitational lensing on hover.

**Files to change:**

- `frontend/src/components/sections/Contact.tsx`

### Changes

1. Heading: `font-display`, "Let's / Connect." with italic on "Connect."
2. Email CTA (MagneticButton): `font-display`, weight 300, larger
3. Black hole accretion disk canvas:
   - Position: `fixed` or `absolute` behind section content
   - Core: dark circle `#080504`, radius ~120px, centered
   - Accretion disk: canvas ellipse, gradient stroke `#E8650A` → `#FFB347` → `#FFF5D6`
   - Rotation: `gsap.ticker` adds 0.003 radians/frame to disk angle
   - Opacity: 0 → 0.35 driven by ScrollTrigger section enter
4. Gravitational lensing micro-interaction:
   - On email CTA `mouseenter`: `gsap.to(nearbyTextEl, { skewX: 3, duration: 0.4, ease: "power2.out" })`
   - On email CTA `mouseleave`: `gsap.to(nearbyTextEl, { skewX: 0, duration: 0.6, ease: "back.out(1.4)" })`
5. Footer: update to "© 2026 Narunat Sutthibut. Built with React + GSAP."
6. Terminal structure: keep unchanged (already good)

**Acceptance criteria:**

- [ ] Heading uses font-display, "Connect." is italic
- [ ] Accretion disk canvas visible and rotating
- [ ] Disk opacity animates in on section scroll enter
- [ ] Gravitational lensing skew fires on email hover
- [ ] Footer text updated
- [ ] Terminal boot lines still animate in on enter (no regression)

---

## Step 08 — Full QA Pass

**Desktop (> 1024px):**

- [ ] Scroll through Hero → About → Projects → Skills → Contact without jumping
- [ ] Each pin holds for correct distance before releasing
- [ ] Aurora waves animate in Hero
- [ ] Comet visible in About background
- [ ] Solar ambient visible in Projects
- [ ] Nebula ambient visible in Skills
- [ ] Accretion disk visible and rotating in Contact
- [ ] Custom cursor suck-in on all buttons/links
- [ ] MagneticButton pull on Hero CTA and Contact email
- [ ] Navbar glass pill warm tint when scrolled

**Tablet (768–1024px):**

- [ ] Pin distances are 60% of desktop (check usePinnedTimeline factor)
- [ ] No horizontal overflow
- [ ] Canvas animations still visible

**Mobile (< 768px):**

- [ ] No custom cursor (native cursor shows)
- [ ] Hamburger menu opens/closes
- [ ] Pin distances are 50% of desktop
- [ ] Canvas animations visible but simplified

**Accessibility:**

- [ ] `prefers-reduced-motion`: all GSAP skips to final state, no canvas animation
- [ ] Keyboard navigation works through all sections
- [ ] Screen reader: `aria-label` on all Splitting.js targets

**Performance:**

- [ ] `npm run build` — zero TypeScript errors
- [ ] No console errors in browser
- [ ] Canvas animations are not blocking main thread (check DevTools Performance tab)
- [ ] Run Lighthouse — target ≥ 90/95/100/100

---

## Step 09 — Sprint 6 Prep (Post-QA)

- [ ] `npm run build` clean
- [ ] `npm run optimize-images` — regenerate WebP if any images changed
- [ ] Deploy to Vercel
- [ ] Verify on Vercel URL: Chrome, Safari, Firefox
- [ ] Add Vercel Analytics (optional)
- [ ] Update `_management/timeline.md` Sprint 5 → all checked

---

## Decision Log for This Roadmap

| Item                         | Decision                        | Rationale                                         |
| ---------------------------- | ------------------------------- | ------------------------------------------------- |
| Step order                   | Tokens first                    | All visual steps depend on correct token names    |
| usePinnedTimeline in Step 02 | Before any section that uses it | Hero, About, Projects, Skills all depend on it    |
| ProjectWindow.tsx deletion   | Step 05                         | Can't delete before ProjectPanel is ready         |
| Canvas per section           | Each section owns its canvas    | Avoids AmbientBackground becoming a god component |
| No deadline pressure         | Correctness first               | Per owner's stated priority                       |

---

## Appendix: Quick Token Reference

| Token name               | Value              | Used for                   |
| ------------------------ | ------------------ | -------------------------- |
| `--color-bg`             | `#080706`          | Page background            |
| `--color-surface`        | `#161310`          | Cards, panels              |
| `--color-accent`         | `#C4A97D`          | Primary accent (warm gold) |
| `--color-text-primary`   | `#EDE6D6`          | Headings, body             |
| `--color-text-secondary` | `#7A776E`          | Subtext                    |
| `--color-text-disabled`  | `#3A3834`          | Labels, metadata           |
| `--font-display`         | Cormorant Garamond | H1, H2, section headings   |
| `--font-label`           | Space Mono         | Labels, numbers, nav       |
| `--font-body`            | IBM Plex Mono      | Body copy, terminal        |

| Section  | Accent color               | Canvas type                 |
| -------- | -------------------------- | --------------------------- |
| Hero     | `#00E87A` aurora green     | Sine wave aurora            |
| About    | `#C8F0E8` comet cyan       | Comet path canvas           |
| Projects | `#FFD27F` solar gold       | Radial gradient + particles |
| Skills   | `#FF8C42` + `#B8D4F8`      | Drifting nebula gradients   |
| Contact  | `#E8650A` accretion orange | Rotating ellipse canvas     |
