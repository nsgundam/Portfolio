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
| `DESIGN.md` | Both | Visual system, narrative, architecture, and motion |
| `ROADMAP.md` | Both | Current status, next phases, and blockers |

These five files are the complete documentation set. Update them instead of creating
new sprint snapshots or duplicate specifications.

## Current state

- Navigation, mobile natural scroll, warm Three.js palette, the translation-first
  ship departure, and the continuous Hero-to-About star-field transition are
  implemented.
- Projects currently render two entries.
- Project 03 is **Mini Appointment App**.
- Project 04 is **Backend Line LIFF Baanchangsom**.
- Detailed evidence for Projects 03/04 is still required before implementation.

See `ROADMAP.md` for the active delivery plan.
