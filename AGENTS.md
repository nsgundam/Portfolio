# Repository Instructions for Agents

This repository contains a React + Vite single-page portfolio in `frontend/`.
The site is an experience-first portfolio for startup recruiters, with clarity and
accessibility taking priority over spectacle.

> Updated: 24 August 2026

## Source of truth

Read these files before changing the project:

1. `AGENTS.md` — implementation rules and prohibitions
2. `PRODUCT.md` — audience, positioning, confirmed content, and open facts
3. `DESIGN.md` — visual system, narrative, motion, and responsive behavior
4. `ROADMAP.md` — current state, next work, and blockers

Do not create additional planning documents unless the owner explicitly requests
one. Update the relevant source-of-truth file instead.

Priority when information conflicts:

1. `AGENTS.md` for agent behavior
2. `PRODUCT.md` for factual claims and content
3. `DESIGN.md` for design and interaction decisions
4. `ROADMAP.md` for delivery status
5. Current source code for observed implementation state

## Working role

- Act as a senior frontend engineer and interaction designer.
- Build a premium, recruiter-memorable portfolio that feels sophisticated,
  technical, cinematic, warm, and intentional.
- Preserve the narrative **Earth → Deep Space → Event Horizon**.
- Prefer precise restraint over extra effects.
- Never invent project outcomes, metrics, roles, stacks, or links. Project 03 and
  04 have confirmed names only; see `PRODUCT.md`.

## Code architecture

- Use TypeScript for new code.
- Follow `frontend/src/`: `components/`, `hooks/`, `lib/`, and `types/`.
- Compose small components; refactor in place instead of creating `V2`, `New`, or
  `Refactored` copies.
- Define prop interfaces and avoid `any` unless the reason is documented.
- Reuse existing hooks, motion utilities, tokens, and UI primitives.
- Preserve unrelated working-tree changes.

## GSAP and scrolling

- Import `gsap` and `ScrollTrigger` only through `src/lib/gsap.ts`.
- Initialize no ScrollTrigger before `preloaderDone === true`.
- Wrap component animation in `gsap.context()` and call `ctx.revert()` on cleanup.
- Clean up timelines, triggers, media listeners, pointer listeners, and ticker work.
- Use `depthReveal()` for major entrances when a depth entrance is appropriate.
- Every pinned trigger requires `anticipatePin: 1`.
- Do not mix scrubbed and time-based animation in the same sequence.
- Preloader, cursor, and navbar are time-based; never scrub them.
- Prefer transforms, opacity, and shader uniforms over layout properties. Blur may be
  used for a short time-based entrance, but never scrubbed across large text.
- Section navigation must use the shared helper in `src/lib/navigation.ts` so Lenis,
  hashes, and pin spacers remain synchronized.

## Three.js scene

- `SpaceScene.tsx` is the single continuous React Three Fiber canvas.
- Do not add a second section canvas without a new documented decision.
- The Hero ship must continue along its current travel vector when departing. After
  the close pass, its screen-space X direction must not reverse to re-enter the frame.
- The About environment continues the warm deep-space star field inside the same
  canvas. Do not add a comet or another foreground celestial object to this section.
- Use CSS design tokens to construct Three.js colors; do not hardcode scene colors.
- Keep effects behind content, outside reading zones, and subordinate to typography.
- Reduce particle counts and pixel ratio on mobile.
- Stop shader updates for effects after they become fully hidden.
- Respect `prefers-reduced-motion` with a stable, readable fallback.

## Responsive behavior

| Viewport | Required behavior |
| --- | --- |
| `< 768px` | Natural scrolling, no long section pins, no custom cursor, one-column content, simplified scene |
| `768–1024px` | Two-column layouts where useful, pin distances at 60% of desktop |
| `> 1024px` | Full bounded cinematic sequence and desktop pins |

All breakpoints must keep content readable, keyboard accessible, and free from
horizontal overflow.

## Design constraints

- Use the token and font roles in `DESIGN.md` and `frontend/src/index.css`.
- Never hardcode hex colors in components.
- Never use `--color-brand`, `text-brand`, `border-brand`, or `bg-brand`.
- No Framer Motion; GSAP is the only motion library.
- No neon/cyan sci-fi treatment, gradient text, lens flares, planet illustrations,
  or astronaut SVGs.
- Do not add random, chaotic, or continuously distracting motion.
- Do not hide essential content by default when a failed script would leave it
  inaccessible.
- Do not sacrifice navigation, reading, focus, or reduced-motion behavior for an
  effect.

## Project showcase rule

`ProjectCarousel.tsx` owns selection, gestures, keyboard navigation, and cover-flow
transforms. `ProjectPanel.tsx` is the single reusable project presentation component.
Do not create alternate project-card copies or restore the deleted `ProjectWindow`.
Keep navigation finite: no autoplay, infinite loop, scroll-wheel capture, or fabricated
content for pending projects.

## Commands

Run commands from `frontend/`:

```bash
npm run dev
npm run lint
npm run optimize-images
```

Do **not** run `npm run build` during an interactive agent session.
