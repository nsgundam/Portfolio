# Portfolio Roadmap

> Updated: 28 August 2026

## Purpose and status

This roadmap turns the documented **Dust, Gravity, and Time** direction into small,
verifiable implementation tasks. It describes both the current repository reality and
the target experience; a checked item means it exists in the repository, not that the
full next-generation visual target is complete.

Current state: the scroll foundation, Hero-to-About transition, finite four-project
cover-flow shell, static editorial composition, and continuous-universe foundation
across all five sections are implemented. Detailed Three.js environments currently
cover Hero/Earth, About/Deep Space, Projects/Solar Passage, Skills/Nebula Field, and
Contact/Event Horizon. Projects 03/04 remain pending because their evidence is not
confirmed.

Primary blockers for a high-fidelity visual match:

1. The reference spacecraft needs an approved model or a multi-view reference sheet.
2. Approved Earth textures and project screenshots are not yet prepared.
3. Project 03/04 outcomes, roles, challenges, stacks, evidence, and links still need
   owner confirmation.

## Documentation system

The repository intentionally keeps five source-of-truth files instead of duplicating
the specification under `docs/`:

| File | Authority |
| --- | --- |
| `AGENTS.md` | Agent behavior, prohibitions, and implementation invariants |
| `PRODUCT.md` | Audience, positioning, confirmed content, and factual evidence |
| `DESIGN.md` | Visual reference, design system, experience, motion, scene, assets, and decisions |
| `ROADMAP.md` | Delivery phases, gaps, acceptance criteria, and blockers |
| `README.md` | Human setup and repository orientation |

## Completed foundation

- [x] React + Vite + TypeScript SPA structure
- [x] Preloader, navbar, cursor, Hero, About, Projects, Skills, and Contact render
- [x] Shared Lenis/ScrollTrigger-aware section navigation helper
- [x] Mobile natural scrolling and desktop/tablet Hero/About pin behavior
- [x] Warm token-driven aurora and star field replace the neon shader palette
- [x] Ship transforms use frame-rate-independent damping
- [x] Ship departs through the same left/up edge it is already approaching
- [x] About follows immediately without a dark empty gap
- [x] About continues the warm star field inside the single Three.js scene
- [x] Fast-scroll catch-up reduced across Lenis, pinned timelines, Hero, and About
- [x] Aurora rendering stops after it is fully hidden
- [x] Four-project cover-flow shell with finite controls, arrow keys, and mobile swipe
- [x] Project panels remain truthful when evidence is pending
- [x] Documentation consolidated into five source-of-truth files
- [x] Attached visual reference translated into a composition and fidelity contract
- [x] Typed normalized journey state drives the scene and desktop orientation rail

## Phase 0 — Documentation and asset preparation

### Documentation refactor — complete

**Objective:** make the repository explain the next-generation direction without
requiring this conversation to be reread.

**Scope completed:** repository audit; current/target separation; visual reference;
experience and journey; animation ownership; single-scene architecture; asset status;
performance; responsive/reduced-motion requirements; accessibility; decision register.

**Acceptance:** another agent can identify what is locked, provisional, open, current,
and planned from `PRODUCT.md`, `DESIGN.md`, and this roadmap.

**Validation:** inspect the three source-of-truth files and run `git diff --check`.

### Asset inventory and approvals — pending

**Objective:** remove visual-asset ambiguity before implementing high-fidelity scenes.

**Scope:** confirm the license and visual suitability of `public/3D/lego_ship.glb`,
decide whether to replace it, produce a consistent multi-view spacecraft reference,
request project screenshots, and identify licensed Earth texture options.

**Dependencies:** owner approval and asset sources.

**Acceptance:** every target asset has an owner/source, format, optimization plan, and
explicit blocking status recorded in `DESIGN.md`.

**Validation:** verify files exist, licenses are recorded, and GLB/screenshot sizes are
within the agreed budget before integration.

## Phase 1 — Static visual foundation

**Objective:** make the page composition resemble the selected reference before heavy
motion or WebGL effects are relied upon.

**Tasks:**

- [x] Apply the target display/body type scale while preserving the three font roles.
- [x] Recompose Hero as left editorial content with the ship/Earth visual field on the
  right, then validate the 375px version.
- [x] Recompose About, Projects, Skills, and Contact into stable reading zones with
  quiet separators and restrained scrims.
- [x] Add the desktop section markers and the 01 HOME → 05 CONTACT orientation model
  only where it improves navigation rather than adding HUD clutter.
- [x] Replace legacy red/blue-black/traffic-light styling with the token palette.

**Acceptance:** the static page has the reference's hierarchy and density; all factual
content remains readable without animation; no horizontal overflow exists at 375px.

**Validation completed 27 August 2026:** desktop, tablet, and 375px visual passes;
keyboard/hash navigation and carousel arrow-key checks; responsive boundary checks at
767/768/1024/1025px; token contrast audit; lint; and the UI detector.

## Phase 2 — Journey and scroll architecture

**Objective:** provide one normalized journey state that can drive both DOM and scene
progress without each section inventing its own document-coordinate logic.

**Current:** Lenis, GSAP, ScrollTrigger, shared section navigation, and one typed
journey controller are implemented. The controller maps live pin-aware geometry to
global, local-section, and overlapping environment progress without another RAF.

**Tasks:**

- [x] Introduce a typed `JourneySection`/`JourneyState` boundary in the existing
  architecture, without creating a second scroll loop.
- [x] Map section progress to overlapping normalized environment ranges.
- [x] Add or refine the desktop journey indicator while keeping hashes, Lenis, pin
  spacers, and direct navigation synchronized through `src/lib/navigation.ts`.
- [x] Audit every ScrollTrigger, including `ScrollProgress`, so none initializes before
  `preloaderDone`.
- [x] Keep time-based preloader/cursor/navbar motion separate from scrubbed timelines.

**Acceptance:** direct navigation, reverse scroll, fast scroll, refresh, mobile
natural scroll, and reduced motion all produce a coherent state.

**Validation completed 27 August 2026:** trigger/RAF ownership audit; clean direct-load
hash to Projects; forward Contact and reverse Home navigation; pin-aware semantic
section preservation across 375/767/768/1024/1025/1440px; mobile natural scrolling;
reduced-motion source-path audit; listener cleanup review; lint; and visual checks of
the desktop rail and mobile fallback.

## Phase 3 — Continuous universe foundation

**Objective:** extend the current single canvas into a persistent world whose
environments blend instead of switching abruptly.

**Current:** one fixed R3F `Canvas` exists in `SpaceScene.tsx`. Its scene composition
is split into camera, persistent universe, and five implemented environment
responsibilities. It subscribes to the shared journey state and owns no
document-coordinate or ScrollTrigger logic.

**Tasks:**

- [x] Preserve `SpaceScene.tsx` as the only canvas and organize its internals around
  camera/universe/environment responsibilities.
- [x] Establish far/mid/near star layers with bounded parallax and mobile tiers.
- [x] Add inactive environment slots and overlapping opacity/uniform controls before
  implementing their detailed shaders.
- [x] Stop updates for any environment whose contribution is fully hidden.

**Acceptance:** Hero → Contact can use the same world; no second canvas, abrupt reset,
or expensive hidden effect; scene remains decorative and content remains HTML.

**Validation completed 27 August 2026:** source and runtime resource-tier audit
(12,000 deterministic stars on desktop, 4,000 on mobile, DPR capped at 1.5/1.15,
reduced mobile aurora iterations); single-canvas checks; 375px and 1440px visual
passes; 375→1440→375 semantic resize preservation; reverse navigation to Hero;
mobile pin/cursor removal; no horizontal overflow; hidden-contribution update gating;
WebGL/reduced-motion static fallback source-path audit; TypeScript, lint,
`git diff --check`, and the UI detector. The in-app browser sandbox did not expose
`requestAnimationFrame`, so representative-device FPS profiling remains part of the
Phase 8 production pass rather than being inferred here.

## Phase 4 — Earth sequence

**Objective:** make the Hero the closest visual match to the reference and preserve
the existing fly-by continuity.

**Current:** a restrained procedural Earth horizon, cloud layer, atmosphere, aurora,
star field, camera movement, and `/3D/lego_ship.glb` approach/close-pass/departure are
implemented. Earth texture sourcing and spacecraft visual approval remain open.

**Tasks:**

- [x] Add a restrained procedural Earth horizon with a cloud layer and atmosphere
  treatment inside the existing Hero environment.
- [ ] Integrate approved Earth surface/cloud textures after their source and license
  are recorded in `DESIGN.md`.
- [ ] Approve or replace the spacecraft with a model that matches the reference while
  preserving the established travel vector.
- [x] Keep the ship departure moving toward more-negative X and higher Y after the
  close-pass state near `(-1.5, 0.8, -4)`.
- [x] Keep aurora fading, stars continuing, and About arriving without a fade-to-black
  reset or dark empty gap.

**Acceptance:** Hero reads clearly at first arrival; ship never reverses to re-enter;
Earth/aurora remain behind copy; reverse scroll restores a coherent scene.

**Validation in progress 27 August 2026:** 1440px and 375px visual passes; one-canvas
and no-overflow checks; mobile geometry/DPR simplification; forward Hero→About handoff;
reverse About→Hero restoration; hidden-contribution frame gating; static
reduced-motion source-path audit; and decorative ship asset error-boundary audit.
Final reference comparison, approved-texture integration, spacecraft approval, and
representative-device performance remain open.

## Phase 5 — Solar Projects

**Objective:** make Projects feel like a Solar Passage while keeping project evidence
as the dominant reading path.

**Current:** a deterministic Solar Passage environment and finite visitor-controlled
carousel are implemented. The environment uses bounded gravity particles, curved
traces, and restrained lighting behind one reusable `ProjectPanel.tsx`. Project
screenshots and evidence for Projects 03/04 remain open.

**Tasks:**

- [x] Add warm gravity particles, curved traces, and restrained solar lighting to the
  shared scene with progressive activation.
- [x] Preserve the finite carousel contract: no autoplay, loop, vertical-wheel capture,
  or visitor trap.
- [ ] Add only owner-confirmed evidence and screenshots for Projects 01–04.
- [x] Keep active content dominant and adjacent panels visibly secondary on desktop;
  keep one complete readable panel on mobile.

**Acceptance:** a recruiter can understand the backend contribution in under 30
seconds; pending projects remain honest; background never competes with evidence.

**Validation in progress 27 August 2026:** 1440px and 375px visual checks; one-canvas,
no-overflow, mobile natural-scroll/pin/cursor checks; progressive contribution and
hidden-work source audit; keyboard navigation from Project 01→04 with a finite disabled
end state; direct selectors, accessible live announcement, and truthful pending-state
checks; horizontal-swipe threshold plus `touch-action: pan-y` source audit; and HTTP 200
verification for the published Vercel and GitHub links. Browser-level synthetic
pointer events were unavailable, so a physical swipe pass remains open alongside
owner-confirmed screenshots and Projects 03/04 evidence.

## Phase 6 — Nebula Skills

**Objective:** present a credible technology ecosystem rather than a decorative logo
or card grid.

**Current:** four evidence-led capability groups connect visible technologies to
published projects or this repository. A deterministic ambient Nebula Field supports
the section without introducing an ornamental technology diagram or interaction.

**Tasks:**

- [x] Replace floating decorative cards with meaningful proven/learning capability
  groups based on repository and owner-confirmed evidence.
- [x] Evaluate a scientific orbital visualization and omit it because the evidence-led
  HTML ledger communicates the current relationships more clearly.
- [x] Keep technology emphasis non-interactive; any future emphasis must remain
  optional, keyboard accessible, and based on real usage relationships.
- [x] Keep nebula work ambient and disable it when hidden.

**Acceptance:** categories are scannable, claims are supportable, and the section is
useful with animation and WebGL disabled.

**Validation completed 27 August 2026:** visible-claim audit against `PRODUCT.md`,
configured published-project data, and repository dependencies; removal of unsupported
broad tool/process claims; semantic ordered-list audit; 1440px and 375px visual checks;
mobile one-column/no-overflow/no-pin/native-cursor checks; Projects↔Skills hash and
section restoration; static reduced-motion/WebGL-fallback audit; deterministic
820/260-particle tiers; and hidden-contribution update gating. Representative-device
GPU profiling remains part of Phase 8 rather than being inferred from particle count.

## Phase 7 — Event Horizon Contact

**Objective:** deliver the visual climax without turning contact into a gate or blank
screen.

**Current:** a procedural black hole, warm accretion disk, photon ring, and bounded
particle field occupy the right visual zone. Confirmed contact channels remain visible
HTML in the left/center reading zone and no longer wait for a ScrollTrigger reveal.

**Tasks:**

- [x] Add a procedural black hole/accretion disk with bounded warm distortion or
  particle treatment; do not download a generic black-hole model by default.
- [x] Compose the invitation and confirmed contact methods in the left/center reading
  zone with the event horizon on the right.
- [x] Ensure the final camera and environment settle rather than continuously pulling
  the visitor inward.
- [x] Preserve direct email, GitHub, and LinkedIn access without waiting for animation.

**Acceptance:** contact links are immediately usable; final state is readable,
performant, reduced-motion-safe, and visually quieter than the content.

**Validation completed 28 August 2026:** 1440px and 375px final-scroll visual checks;
one-canvas/no-overflow/mobile-natural-scroll checks; four immediately rendered Contact
links; semantic labels and sequential keyboard path from primary email → channel email
→ GitHub; Skills↔Contact hash restoration; token-only shader colors; deterministic
480/160-particle tiers; bounded settling with no time uniform; hidden-contribution
gating; and static reduced-motion/WebGL-fallback source audits. Representative-device
GPU profiling remains in Phase 8.

## Phase 8 — Production polish and release

**Tasks:**

- [ ] Profile renderer, shader, memory, image, and GLB costs at representative devices.
- [ ] Verify Chrome, Safari, and Firefox at 375px, tablet, and desktop breakpoints.
- [ ] Verify navigation, focus, skip link, menu semantics, hashes, contrast, and
  reduced motion.
- [ ] Verify missing assets, slow loading, WebGL failure, and horizontal overflow.
- [x] Run lint and the final UI detector over changed targets.
- [ ] Run the production build outside interactive agent work.
- [ ] Deploy to Vercel and perform production smoke testing.

**Validation in progress 28 August 2026:** fixed a production-impacting journey
initialization defect where the temporary Hero scroll lock collapsed measured document
height and activated the Contact environment at scroll zero; verified clean
Hero → Contact → Hero environment isolation afterward. Fixed the mobile dialog focus
cycle so Shift+Tab from the close control wraps to Contact and Tab wraps back. Brave
runtime checks cover 375/768/1024/1025/1440px with synchronized `#contact` state,
zero horizontal overflow, no mobile pins, native mobile cursor, one canvas, direct-load
hash navigation, four immediate Contact links, and a visible first-tab skip link.
Text/control token contrast meets WCAG AA; reduced-motion and WebGL fallbacks remain
source-verified. Removed the unused 55 MB asteroid GLB and unused Vite starter assets,
leaving the 1.4 MB ship as the only GLB. TypeScript, lint, `git diff --check`, and the
final UI detector pass clean.

Lifecycle hardening on the same date moved the StrictMode-sensitive preloader and
infinite scroll-cue timelines into scoped GSAP contexts, made pinned timelines owned
by the context that creates their triggers, and explicitly kills magnetic-hover
tweens during cleanup. A repeated 1440 → 375 → 1440 → 375 → 1440 runtime pass held
pin-spacer counts at exactly 2 → 0 → 2 → 0 → 2 with no horizontal overflow or console
errors; Contact and Home navigation remained synchronized afterward.

A reversible missing-asset simulation temporarily withheld `lego_ship.glb` and then
restored the byte-identical file (`SHA-256 b0e346b9…a792cf3`). The decorative asset
boundary preserved the single canvas, Hero identity and two actions, all four Contact
links, synchronized desktop/mobile navigation, mobile natural scrolling, and zero
horizontal overflow. The loader error remained visible in the developer console as
expected, while no critical HTML content or navigation failed. Slow-network and real
WebGL-context failure simulation remain open separately.

Still required before release: representative-device GPU/FPS/memory profiling; slow
network and real WebGL-failure simulation; Chrome (browser extension not connected),
Safari (local accessibility control timed out), and Firefox (not installed) checks;
the production build outside this interactive session; deployment and production smoke
testing.

The repository-side Vercel handoff is now explicit: root `vercel.json` installs and
builds the nested `frontend/` package, publishes `frontend/dist`, and applies baseline
content-type, referrer, camera, microphone, and geolocation headers. No local Vercel
linkage or CLI is present, so account/project verification, preview deployment,
production promotion, canonical URL metadata, and live header/smoke checks remain
external release actions.

The first `iad1` build of commit `88f2897` exposed that Vercel's install environment
did not resolve the tracked `frontend/package-lock.json` through
`npm --prefix frontend ci`. The handoff now changes directory explicitly with
`cd frontend && npm ci` and uses the same working-directory strategy for the build;
the corrected install path passes an npm dry run locally.

**Release acceptance:** no critical information depends on animation/WebGL, all
published project claims are evidenced, all navigation paths work, and performance is
acceptable on both desktop and mobile.

## Current versus target gaps

| Area | Current repository | Target / next action |
| --- | --- | --- |
| Scene | One blended canvas implements all five environments from shared journey input | Representative-device profiling and final visual sign-off |
| Earth | Procedural horizon/cloud/atmosphere implemented; approved textures absent | Approve texture sources and spacecraft fidelity |
| Projects scene | Solar Passage supports a finite evidence-led HTML carousel | Add owner-confirmed screenshots and Projects 03/04 evidence |
| Skills scene | Evidence-led capability ledger with a bounded ambient Nebula | Revisit orbital relationships only if future evidence makes them useful |
| Contact scene | Immediate direct-contact ledger with a settled procedural Event Horizon | Final cross-browser and reduced-motion sign-off |
| Navigation | 01 HOME through 05 CONTACT plus a secondary desktop journey rail | Retain synchronized hashes and pin-aware direct navigation |
| Scroll lifecycle | One typed journey master feeds DOM and scene; all triggers wait for `preloaderDone`; component timelines, triggers, hover tweens, listeners, and tickers have explicit cleanup | Retain strict ownership and single RAF semantics as the experience evolves |
| Color hygiene | UI and scene colors derive from approved tokens | Maintain token-only colors as environments expand |
| Assets | One 1.4 MB ship GLB plus procedural Earth/Solar/Nebula/Event environments; unused 55 MB asteroid and starter assets removed; no approved Earth/project imagery | Approve and optimize only the evidence and fidelity assets still required |
| Content | Projects 03/04 names only; About/skills copy needs final review | Owner-confirmed factual content and links |

## Known technical debt

- `@react-three/fiber@9.6.1` constructs deprecated `THREE.Clock` internally with
  `three@0.184.0`. Application code no longer uses deprecated Clock reads; do not
  suppress the upstream warning.
- The package does not expose a separate `typecheck` script; the release `build`
  script runs `tsc -b` before Vite compilation. Interactive agents must continue to
  follow `AGENTS.md` and not run the production build.
- Cross-browser automation is incomplete in the current environment: Chrome requires
  the ChatGPT browser extension, Safari did not expose a responsive accessibility
  session, and Firefox is not installed. Do not infer those passes from Brave.

## Information required for Projects 03 and 04

For each project, collect:

1. One-sentence outcome
2. Narunat's role and ownership
3. Hardest system or backend problem
4. Specific evidence of the solution
5. Technologies actually used
6. Live, repository, demo, or private-work link status
7. Any metric that can be verified and publicly stated

No phase may fill these gaps by guessing.
