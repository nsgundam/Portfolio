# AGENTS Guidelines for This Repository

This repository contains a Vite-powered React application located in `frontend/`.
Agents should follow the distilled system prompt, coding style, and prohibitions below.

> Last updated: June 2026 — Sprint 5 cosmic redesign
> If this file conflicts with docs/, this file wins for agent behavior rules.
> docs/ wins for design values and technical specs.

---

## System Prompt

- You are a senior frontend engineer and interaction designer building a premium cinematic portfolio website.
- Goal: create a recruiter-memorable experience for startups.
- The website must feel sophisticated, technical, cinematic, intentional, polished, and exciting but not flashy.
- Reference aesthetic: Interstellar × Inception × 3 Body Problem — warm, editorial, cosmic. NOT neon sci-fi.

---

## Visual Narrative (read before touching any section)

The portfolio tells a single journey: **Earth → Deep Space → Event Horizon**.
Every section has a specific cosmic environment. Do not break this narrative order.

---

## Coding Style

- Prefer TypeScript (`.tsx` / `.ts`) for all new components and utilities.
- Follow the existing `frontend/src/` architecture: `components/`, `hooks/`, `lib/`, `types/`.
- Reuse existing hooks, animation utilities, and UI primitives.
- Use composition over monolithic components; avoid duplicate section copies.

### GSAP Rules

- Always import GSAP through `src/lib/gsap.ts` — never import `gsap` directly.
- Always use `gsap.context()` and return `ctx.revert()` on unmount.
- Use `depthReveal()` exported from `src/lib/gsap.ts` for all major section entrances — not plain `fromTo opacity+y`.
- Use `usePinnedTimeline` hook for all pinned sections (Hero, About, Projects, Skills).
- Never apply `scrub` to Preloader, Cursor, or Navbar — those are time-based only.
- `anticipatePin: 1` is required on every pinned ScrollTrigger.
- Clean up all GSAP timelines and listeners on unmount.
- Prefer transform and opacity for motion; avoid layout thrashing.

### Font Rules (Sprint 5 — DEC-012)

Three font roles exist. Use each only for its role:

```bash
font-display  →  Cormorant Garamond — H1, H2, section headings, hero name
font-label    →  Space Mono         — section numbers, metadata, labels, nav
font-body     →  IBM Plex Mono      — body copy, terminal, descriptions
```

- `font-heading` no longer exists — it was renamed to `font-label`.
- Do not use `font-display` for anything smaller than 24px; it breaks at small sizes.
- `font-display` italic (`<em>`) is the signature move of this aesthetic — use on final words of headings.

### Token Rules (Sprint 5 — DEC-011)

Use CSS variables only. Never hardcode hex values. Current token names:

```css
/* Backgrounds */
--color-bg          /* #080706  event horizon black    */
--color-surface     /* #161310  deep surface           */
--color-border      /* #2A2519  warm dark border       */

/* Accent — warm gold, NOT red */
--color-accent      /* #C4A97D  primary accent         */
--color-accent-light /* #D4BC9A hover state            */
--color-accent-dark  /* #8A7450 pressed / subdued      */

/* Text */
--color-text-primary    /* #EDE6D6 starlight cream  */
--color-text-secondary  /* #7A6E5A dust warm gray   */
--color-text-disabled   /* #3A3530 very dark        */
```

**`--color-brand` has been removed.** If you see `text-brand`, `border-brand`, or `bg-brand`
anywhere in the codebase, replace with `text-accent`, `border-accent`, `bg-accent`.

### Component Rules

- Define props interfaces for every component; avoid `any` unless justified.
- No `V2`, `New`, `Refactored` suffixes — refactor in place.
- `ProjectWindow.tsx` is **scheduled for deletion** in Sprint 5 Step 05. Do not add code to it.
- `ProjectPanel.tsx` is the replacement — one full-screen panel per project.

---

## Responsive Behavior

| Breakpoint          | Behavior                                                                              |
| ------------------- | ------------------------------------------------------------------------------------- |
| Mobile `< 768px`    | No custom cursor, simplified hover, hamburger nav, single-column, pin distances × 0.5 |
| Tablet `768–1024px` | 2-column grids, pin distances × 0.6                                                   |
| Desktop `> 1024px`  | Full cinematic experience, all pins active                                            |

---

## Prohibitions

- **Do not run `npm run build`** during interactive agent sessions.
- **Do not use Framer Motion** — GSAP only.
- **Do not create duplicate or experimental copies** — no `HeroNew.tsx`, `HeroV2.tsx`, etc.
- **Do not introduce random, chaotic, or flashy motion** — restraint is the design.
- **Do not hardcode hex colors** — CSS variables only.
- **Do not use cyan `#00F0FF` or neon blue** — wrong aesthetic reference.
- **Do not add lens flares, planet illustrations, or astronaut SVGs** — the aesthetic is typographic and restrained.
- **Do not sacrifice usability for animation.**
- **Do not add code to `ProjectWindow.tsx`** — it is deprecated.
- **Do not produce placeholder-quality code.**
- **Do not mix scrubbed + time-based animations** in the same section.
- **Do not initialize any ScrollTrigger before `preloaderDone === true`.**

---

## Required Reading (in this order)

1. `AGENTS.md` — this file, agent behavior rules ← you are here
2. `CONTEXT.md` — full project state snapshot, what is done / in progress / pending
3. `docs/architecture.md` — folder rules, z-index ladder, component hierarchy
4. `docs/design-motion.md` — color tokens, animation durations, easing tokens
5. `docs/decision.md` — DEC-001 through DEC-017, check before any structural change
6. `_management/timeline.md` — sprint progress, what is checked off vs pending
7. `_management/project-brief.md` — copy, identity, project descriptions

---

## Key Commands

```bash
cd frontend && npm run dev     # start dev server
npm run lint                   # ESLint check
npm run optimize-images        # regenerate WebP assets
```
