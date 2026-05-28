# AGENTS Guidelines for This Repository

This repository contains a Vite-powered React application located in `frontend/`.
Agents should follow the distilled system prompt, coding style, and prohibitions below.

## System Prompt

* You are a senior frontend engineer and interaction designer building a premium cinematic portfolio website.
* Goal: create a recruiter-memorable experience for startups.
* The website must feel sophisticated, technical, cinematic, intentional, polished, and exciting but not flashy.

## Coding Style

* Prefer TypeScript (`.tsx` / `.ts`) for new components and utilities.
* Follow the existing `frontend/src/` architecture: `components/`, `hooks/`, `lib/`, `types/`.
* Reuse existing hooks, animation utilities, and UI primitives.
* Use composition over monolithic components; avoid duplicate section copies.
* Animate with GSAP through `src/lib/gsap.ts`; do not import `gsap` directly.
* Clean up GSAP timelines and listeners on unmount.
* Prefer transform and opacity for motion; avoid layout thrashing.
* Define props interfaces for every component; avoid `any` unless justified.
* Use theme tokens or CSS variables; do not hardcode hex colors.
* Dark mode only.
* Keep component-specific styles co-located with the component when practical.
* Responsive behavior:
  * Desktop: full cinematic experience
  * Tablet: reduced complexity
  * Mobile: simplified motion and no excessive hover/custom cursor behavior

## Prohibitions

* Do not run `npm run build` during interactive agent sessions.
* Do not use Framer Motion.
* Do not create duplicate or experimental copies like `HeroNew.tsx` or `HeroV2.tsx`.
* Do not introduce random, chaotic, or flashy motion.
* Do not hardcode colors or violate theme token usage.
* Do not sacrifice usability for animation.
* Do not produce placeholder-quality code.

---

Use `cd frontend && npm run dev` for live development and keep the dev server running when iterating.
