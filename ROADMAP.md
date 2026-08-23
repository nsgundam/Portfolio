# Portfolio Roadmap

> Updated: 24 August 2026

## Current status

The scroll foundation and Hero-to-About visual transition are complete. The next
delivery phase is the four-project content model and showcase.

Current blocker: Project 03/04 names are confirmed, but their outcomes, Narunat's
role, technical challenges, backend evidence, stacks, and links are not.

## Completed foundation

- [x] React + Vite + TypeScript SPA structure
- [x] Preloader, navbar, cursor, Hero, About, Projects, Skills, and Contact render
- [x] Shared Lenis/ScrollTrigger-aware section navigation
- [x] Mobile natural scrolling and desktop/tablet pin behavior
- [x] Hero typography fits a 375px viewport
- [x] Warm token-driven aurora and star field replace the neon shader palette
- [x] Ship transforms use frame-rate-independent damping
- [x] Ship departs through the same left/up edge it is already approaching
- [x] About follows immediately without a dark empty gap
- [x] About continues the warm star field inside the single Three.js scene, with no
  comet or foreground celestial object
- [x] Documentation consolidated into five source-of-truth files

## Phase 3 — Four-project showcase

- [ ] Confirm Project 03/04 factual content and links with the owner
- [ ] Define a typed four-project model: outcome, role, challenge, backend evidence,
  stack, and verified links
- [ ] Create one reusable `ProjectPanel.tsx`
- [ ] Replace the current `ProjectWindow.tsx` implementation
- [ ] Verify keyboard and mobile project navigation
- [ ] Delete `ProjectWindow.tsx` only after the replacement passes QA

Acceptance: all four projects render from typed, owner-approved data and a recruiter
can understand the backend contribution in under 30 seconds.

## Phase 4 — Supporting sections

- [ ] Align About copy with the final owner-approved identity
- [ ] Replace decorative Skills cards with proven and learning capability groups
- [ ] Give Projects, Skills, and Contact their planned continuous-scene environments
- [ ] Keep Contact direct and usable without animation
- [ ] Remove remaining legacy hardcoded red/traffic-light colors and stale card styling

Acceptance: every section has one clear job and remains readable across mobile,
tablet, desktop, keyboard, and reduced-motion paths.

## Phase 5 — Production QA and release

- [ ] Verify navigation, focus, skip link, menu semantics, reduced motion, and contrast
- [ ] Inspect Chrome, Safari, and Firefox at representative breakpoints
- [ ] Check WebGL fallback, loading states, missing assets, and horizontal overflow
- [ ] Run lint and the final UI detector over all changed targets
- [ ] Run the production build outside interactive agent work
- [ ] Deploy to Vercel and perform production smoke testing

## Known technical debt

- `@react-three/fiber@9.6.1` constructs deprecated `THREE.Clock` internally with
  `three@0.184.0`. Application code no longer uses deprecated Clock reads; do not
  suppress the upstream warning.
- `ProjectWindow.tsx` remains in use until Phase 3 replaces it.
- Projects, Skills, and Contact still contain legacy visual implementation that does
  not yet match the final system.

## Information required for Projects 03 and 04

For each project, collect:

1. One-sentence outcome
2. Narunat's role and ownership
3. Hardest system or backend problem
4. Specific evidence of the solution
5. Technologies actually used
6. Live, repository, demo, or private-work link status
7. Any metric that can be verified and publicly stated
