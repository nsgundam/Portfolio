# Portfolio Roadmap

> Updated: 30 August 2026

## Current status

The scroll foundation, Hero-to-About transition, and finite four-project cover-flow
showcase are implemented. The remaining Projects work is evidence and copy, not the
interaction shell.

Earth Horizon and Event Horizon visual-study v1 plates under `docs/visual-studies/`
were approved by the owner on 30 August 2026 and are now integrated into the single
`SpaceScene` prototype. Earth uses the approved 2.5D plate after a sphere-based spike
was rejected for looking like a conventional CG demo. Event Horizon loads only when
Projects or Contact approaches and both plates stop shader updates while hidden.
This single-plate integration is a runtime prototype, not the final layered celestial
implementation. Its current whole-image translation can still read as a placed image;
the approved plan below replaces that behavior after the static page converges.

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
- [x] Fast-scroll catch-up reduced across Lenis, pinned timelines, Hero, and About;
  large scrubbed blur/layout animations removed
- [x] Aurora rendering stops after it is fully hidden
- [x] Four-project cover-flow shell with finite controls, arrow keys, and mobile swipe
- [x] Project panels remain truthful when evidence is pending
- [x] Documentation consolidated into five source-of-truth files

## Phase 3 — Four-project showcase

- [ ] Confirm Project 03/04 factual content and links with the owner
- [x] Define the typed four-project display model and publication status
- [ ] Add owner-approved outcome, role, challenge, backend evidence, stack, and links
  for Projects 03/04
- [x] Create one reusable `ProjectPanel.tsx`
- [x] Replace the legacy `ProjectWindow.tsx` implementation
- [x] Verify desktop controls, keyboard arrows, 375px layout, and horizontal swipe
- [x] Delete `ProjectWindow.tsx` after replacement QA
- [ ] Add a real screenshot or repository-backed architecture visual to each
  published project panel
- [ ] Present owner-approved outcome, role, engineering challenge, solution evidence,
  verified stack, and links in the active case study
- [ ] Replace fixed-height mobile dead space with a naturally sized selected panel

Acceptance: all four projects render from typed, owner-approved data and a recruiter
can understand the backend contribution in under 30 seconds.

## Phase 4 — Approved whole-site implementation program

The owner approved the following program on 30 August 2026. It supersedes the earlier
section-by-section implementation order. The governing rule is **static whole page
first, then celestial layers and continuous motion**. A section is not finished in
isolation while neighboring compositions and the shared journey remain unresolved.

### Stage A — Foundation and design-system convergence

- [ ] Reconcile the CSS tokens with the normative palette and three font roles in
  `DESIGN.md`; components must not introduce hardcoded colors or replacement roles.
- [ ] Establish shared editorial containers, responsive grids, dividers, metadata,
  links, focus states, and section-spacing primitives.
- [ ] Raise reading copy toward 16–18px and reserve 11–13px for true metadata.
- [ ] Refine the compact navigation, preloader, and cursor so they support rather than
  delay the portfolio; mobile retains its native cursor and natural scrolling.
- [ ] Define stable reading zones for celestial art at desktop, tablet, and mobile.

Acceptance: the unanimated page has one coherent typographic, spacing, color, and
interaction system with no horizontal overflow at 375px.

### Stage B — Static composition across all five sections

- [ ] Recompose Hero so Narunat Sutthibut, Software Engineer, Full-stack / Backend /
  Real-time systems focus, CTA, and resume path are available in the first viewport.
- [ ] Recompose About as an asymmetric editorial biography with concise facts and a
  complete, immediately readable direct-link state.
- [ ] Refine `ProjectPanel` into an evidence-led case-study surface while preserving
  the finite `ProjectCarousel` selection, gestures, keyboard controls, and transforms.
- [ ] Remove fixed-height mobile project dead space and retain only a narrow,
  non-competing adjacent-panel cue.
- [ ] Replace Skills cards with the five confirmed capability lanes: Product
  Interfaces, Backend Systems, Real-time Systems, Data & Persistence, and Delivery &
  Tooling. This stage is static; marquee behavior comes later.
- [ ] Remove the Contact terminal and legacy traffic-light/blue-gray styling. Build a
  typography-led finale with one direct email action plus GitHub and LinkedIn.
- [ ] Verify the complete page with GSAP and Three.js unavailable before continuing.

Acceptance: Hero, About, Projects, Skills, and Contact match the approved editorial
direction as one static composition at 1440px, 1024px, and 375px.

### Stage C — Content truth and project evidence

- [ ] Finalize owner-approved Hero and About identity wording without inventing a
  stronger claim.
- [ ] Add a real screenshot or repository-backed architecture visual to each
  published project.
- [ ] Present confirmed outcome, role, engineering challenge, solution evidence,
  verified stack, and relevant links for each published project.
- [ ] Keep Projects 03/04 in an honest preparation state until the required facts at
  the end of this document are confirmed.
- [ ] Validate every public claim against `PRODUCT.md`, repository evidence, or an
  explicit owner confirmation.

Acceptance: a recruiter can identify the engineering position and understand the
backend contribution of each published project in under 30 seconds.

### Stage D — Celestial asset production

- [x] Produce and approve the Earth Horizon and Event Horizon v1 composition studies.
- [x] Reject and archive the conventional CG sphere spike outside the production
  bundle.
- [x] Integrate optimized single-plate prototypes to validate crop, color, loading,
  direct navigation, and baseline runtime cost.
- [ ] Derive production Earth layers: stable background, surface/horizon, atmosphere
  rim, edge mask, and authored static fallback.
- [ ] Derive production Event Horizon layers: stable deep-space background, black-core
  occlusion mask, accretion disk, rear arc/outer glow, sparse dust, and authored
  static fallback.
- [ ] Compare PNG, WebP, and AVIF derivatives for banding, grain, shadow detail, and
  highlight rolloff before choosing production formats.
- [ ] Document provenance, crop decisions, and derivative outputs for every final
  celestial asset.

Acceptance: celestial objects can move independently without translating a
full-screen rectangular plate or exposing its edges.

### Stage E — One continuous scene controller

- [ ] Replace independent Hero/About/Contact progress assumptions with one
  section-aware journey controller and numeric refs for Hero, About, Projects,
  Skills, and Contact.
- [ ] Preserve the binding ship travel-vector invariant.
- [ ] Implement the continuous environment sequence: Earth / Aurora → Deep Space →
  restrained Solar Passage → quiet Nebula / dust → Event Horizon.
- [ ] Give desktop, tablet, and mobile their own composition coordinates while sharing
  the same narrative state and motion direction.
- [ ] Resolve direct hashes immediately to a stable scene without replaying earlier
  stages.
- [ ] Stop shader, particle, and ticker work for fully hidden layers.

Acceptance: Desktop and Mobile enter the same environment at the same narrative point;
no Event Horizon appears in About or Projects, and no celestial transition depends on
opacity cross-fades to hide a full-screen image.

### Stage F — Purposeful motion and interaction

- [ ] Move Earth past the camera using layer-relative depth, UV travel, scale, and
  occlusion; do not slide or fade the full fallback plate.
- [ ] Move the star field along camera-relative depth so it arrives and recedes
  spatially rather than through opacity.
- [ ] Bring the Event Horizon from the right-side distance into its final Contact
  composition using independent core, disk, glow, and dust motion. It settles before
  the primary contact action reaches its reading state.
- [ ] Add restrained section entrances only where they explain hierarchy or spatial
  continuity; do not apply one repeated reveal to every section.
- [ ] Add slow alternating Skills marquees on desktop/tablet with lane hover and
  keyboard-focus pause, a visible global Pause/Resume control, and offscreen/document-
  hidden shutdown.
- [ ] Keep Skills static on mobile and `prefers-reduced-motion`; no information may be
  available only through movement or hover.

Acceptance: removing any implemented motion would remove meaningful spatial or
interaction information, not merely decoration.

### Stage G — Responsive, accessibility, and performance hardening

- [ ] Inspect 1440px desktop, 1024px tablet, 768px boundary, 430px mobile, and 375px
  mobile together.
- [ ] Verify keyboard navigation, focus order, skip link, menu semantics, project
  controls, marquee controls, and Contact links.
- [ ] Verify direct section hashes, reverse scroll, fast scroll, resize/orientation,
  reduced motion, WebGL failure, missing assets, and initial loading states.
- [ ] Validate WCAG AA contrast and ensure scene layers never invade reading zones.
- [ ] Measure representative desktop and mobile frame timing, GPU memory, draw calls,
  and idle work; use the authored fallback when the device cannot sustain the target.
- [ ] Confirm there is no horizontal overflow or clipped contact value at 375px.

Acceptance: every essential fact and action remains readable and operable across all
required input, viewport, motion-preference, and rendering paths.

### Stage H — Final convergence and release handoff

- [ ] Perform one bounded whole-page visual QA pass, fix the resulting defect batch,
  and run one confirmation pass.
- [ ] Run lint and the final UI detector over all changed targets.
- [ ] Inspect Chrome, Safari, and Firefox at representative breakpoints.
- [ ] Reconcile `DESIGN.md`, `PRODUCT.md`, and this roadmap with the verified final
  implementation.
- [ ] Run the production build outside the interactive agent session.
- [ ] Deploy to Vercel and perform production smoke testing.

Acceptance: the released site preserves recruiter comprehension, the approved warm
editorial identity, and the complete Earth-to-Event-Horizon journey without relying
on spectacle to carry unfinished content or layout.

### Celestial R&D gates

The Earth and Event Horizon must each pass these gates before production integration:

1. **Still composition:** reads as cinematic at 1440px without motion, keeps the text
   zone clean, and remains recognizably part of the warm editorial system.
2. **Asset provenance:** final source files, licenses or usage guidance, attribution,
   crop decisions, and derived outputs are recorded; no unknown downloaded texture is
   accepted.
3. **Runtime prototype:** uses the existing Three.js dependency and single canvas;
   no new post-processing package or second section canvas is introduced.
4. **Performance:** representative desktop sustains the target 60fps experience;
   representative mobile remains responsive at 30fps or switches to the authored
   fallback. Invisible layers stop updating.
5. **Fallback:** static mobile, reduced-motion, WebGL-failure, and direct-section
   navigation states are intentionally composed and expose all content immediately.

The first Event Horizon prototype must avoid full-screen ray marching and global
bloom. A localized render target is a later escalation only if the approved still
cannot be reproduced convincingly with authored layers and material-local shaders.

## Known technical debt

- `@react-three/fiber@9.6.1` constructs deprecated `THREE.Clock` internally with
  `three@0.184.0`. Application code no longer uses deprecated Clock reads; do not
  suppress the upstream warning.
- The Projects content shell is complete, but its planned Solar Passage background is
  not. Skills and Contact also await their final continuous-scene environments.

## Information required for Projects 03 and 04

For each project, collect:

1. One-sentence outcome
2. Narunat's role and ownership
3. Hardest system or backend problem
4. Specific evidence of the solution
5. Technologies actually used
6. Live, repository, demo, or private-work link status
7. Any metric that can be verified and publicly stated
