# Narunat Sutthibut Portfolio

A cinematic single-page portfolio built with React, Vite, TypeScript, GSAP, Lenis,
Three.js, and React Three Fiber. The experience presents Narunat's full-stack and
real-time systems work to startup recruiters while keeping project evidence and
contact information easy to reach.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run optimize-images
```

`npm run build` also optimizes images before compiling. It is reserved for release
work; interactive agents are instructed not to run it.

## Deploy to Vercel

The root `vercel.json` makes the nested `frontend/` application deployable from the
repository root. It installs from `frontend/package-lock.json`, runs the existing
release build, publishes `frontend/dist`, and applies the repository's baseline
security headers. No environment variables are currently required.

After production QA is complete, link this repository to the intended Vercel project,
inspect the resolved account/project, then create a preview deployment before
promoting the verified result to production. The canonical URL and `og:url` must be
added only after the owner confirms the final production domain.

## Repository map

```text
frontend/
  public/3D/          Three.js model assets
  public/images/      Optimized public images
  scripts/            Image optimization
  src/
    components/       Backgrounds, sections, overlays, and UI primitives
    hooks/            Scroll, motion, and interaction hooks
    lib/              GSAP registration, motion helpers, and navigation
    types/            Shared TypeScript types
```

## Documentation

| File | Audience | Purpose |
| --- | --- | --- |
| `README.md` | Humans | Setup and repository orientation |
| `AGENTS.md` | Agents | Implementation rules and prohibitions |
| `PRODUCT.md` | Both | Audience, positioning, confirmed facts, open content |
| `DESIGN.md` | Both | Visual reference, design system, experience, scene, motion, assets, and decisions |
| `ROADMAP.md` | Both | Current state, implementation phases, acceptance criteria, and blockers |

These five files are the complete documentation set. Update them instead of creating
new sprint snapshots or duplicate specifications.

## Current state

- Navigation, mobile natural scroll, warm Three.js palette, the translation-first
  ship departure, and the continuous Hero-to-About star-field transition are
  implemented.
- The Projects section renders a finite four-item cover-flow carousel with direct
  controls, keyboard arrows, and mobile swipe.
- Project 01 and 02 have published evidence; Project 03 is **Mini Appointment App**
  and Project 04 is **Backend LINE LIFF Baanchangsom**.
- Projects 03/04 deliberately show an in-preparation state until their detailed
  evidence is owner-confirmed.
- Fast-scroll response around Hero and About has been tuned to reduce stacked
  catch-up and unnecessary shader work.

See `ROADMAP.md` for the active delivery plan.
