---
name: Narunat Sutthibut Portfolio
description: A warm editorial journey through full-stack and real-time systems work.
colors:
  event-horizon: "#080706"
  deep-surface: "#161310"
  raised-surface: "#1E1C18"
  warm-border: "#2A2519"
  light-border: "#3A3732"
  gravity-gold: "#C4A97D"
  gravity-gold-light: "#D4BC9A"
  gravity-gold-dark: "#8A7450"
  starlight: "#EDE6D6"
  warm-copy: "#BAAFA1"
  muted-dust: "#544D42"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 4rem)"
    fontWeight: 300
    lineHeight: 1.2
  body:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.25em"
---

# Design System: Dust, Gravity, and Time

## Overview

**Creative North Star: "Dust, Gravity, and Time"**

The portfolio is a warm, dark editorial journey inspired by the scale and restraint
of *Interstellar*, *Inception*, and *3 Body Problem*. Its signature is one continuous
spatial transition rather than a collection of unrelated effects. Typography carries
the authority; the cosmic scene supplies depth and continuity.

The narrative order is binding:

```text
Earth / Aurora → Deep Space / Star Field → Solar Passage
→ Nebula Field → Event Horizon
```

All five environments are implemented inside the shared canvas. Asset approval and
production profiling remain separate release requirements.

**Key Characteristics:**

- Warm near-black surfaces and sparse gravity-gold accents
- Editorial serif display type against precise mono copy
- One continuous Three.js world behind readable HTML content
- Motion that preserves direction and explains the journey
- Calm negative space; no decorative sci-fi interface language

## Reference composition

The attached wide portfolio reference is the visual contract for the next refactor.
It defines composition, density, hierarchy, and atmosphere; it does not replace
`PRODUCT.md` as the source for copy or factual claims.

### Persistent desktop frame

- Use full-bleed cinematic sections separated by quiet, thin warm rules.
- Keep a compact section marker and label at the upper-left of each section.
- Keep the primary navigation in a restrained rounded shell at the upper-right.
- A right-side progress rail and a vertical scroll cue may reinforce orientation on
  desktop, but they are secondary and can disappear on smaller screens.
- Content alignment should stay stable while the environment changes behind it.

### Section compositions

- **Hero / Earth and Aurora:** left-aligned introduction, large name, role, short
  positioning copy, and two clear actions. The ship and Earth horizon occupy the
  right-side visual field; aurora remains atmospheric rather than a reading layer.
- **About / Deep Space:** editorial heading and short biography on the left, with a
  compact facts row or grid beneath it. The star field continues across the section
  without introducing a new foreground object.
- **Projects / Solar Passage:** a short editorial introduction anchors the left side;
  the active project panel owns the reading path while adjacent panels communicate
  sequence and depth. Orbital traces may sit low in the background, never beneath
  dense text.
- **Skills / Nebula Field:** keep the heading and explanation editorial, then group
  proven capabilities by meaningful category. An abstract nebula or orbital system
  may support the right side, but skills remain HTML and directly readable.
- **Contact / Event Horizon:** place the invitation and direct contact channels in a
  calm left/center reading zone. The event horizon is a final background composition,
  not a gate or interaction that must be completed before contact is usable.
- **Footer:** close the journey with a small, quiet ownership line and no competing
  navigation system.

### Fidelity boundary

The image's exact wording, phone number, location, years of experience, technology
icons, project outcomes, and contact details are reference content only. Implement
them only when confirmed in `PRODUCT.md` or by repository evidence. Preserve the
composition and hierarchy even when the factual copy differs.

## Colors

The frontmatter is the normative palette and mirrors `frontend/src/index.css`.

- **Gravity Gold** is the only primary accent. Use it sparingly for metadata,
  interactive emphasis, and restrained celestial material.
- **Starlight** carries primary text and the brightest star-field particles.
- **Warm Copy** is the body-text neutral; **Muted Dust** is reserved for secondary
  metadata that still passes its intended contrast context.
- Surfaces progress from **Deep Surface** to **Event Horizon**, never toward blue-black.

**The Rare Accent Rule.** Gold should feel discovered, not applied to every element.

## Typography

- **Display:** Cormorant Garamond, minimum 24px, used for H1/H2 and project titles.
- **Body:** IBM Plex Mono for prose and technical descriptions.
- **Label:** Space Mono for navigation, metadata, and meaningful sequence markers.

Italic Cormorant on the final word of a major heading is the signature type move.
Large headings should balance naturally; body copy should remain within roughly
65–75 characters per line where layout permits.

**The Three Roles Rule.** Never substitute one font role for another merely to add
variation. `font-heading` no longer exists.

### Current versus target scale

The repository currently uses a smaller scale in `frontend/src/index.css` and
section-level styles. The following is the target hierarchy for the visual refactor;
it is documented here but is not yet implemented:

| Role | Target |
| --- | --- |
| Hero heading | `clamp(3.8rem, 7.5vw, 8rem)` |
| Section heading | `clamp(3rem, 5vw, 6rem)` |
| Body copy | `clamp(1rem, 1.1vw, 1.125rem)` with approximately `1.7` line-height |
| Reading width | roughly 65–75 characters per line |

The implementation must validate the target scale at 375px before treating the
desktop composition as complete.

## Layout

The application is one page in this order: Hero, About, Projects, Skills, Contact.
Text sections use generous vertical rhythm and a readable central container. Visual
atmosphere may extend edge-to-edge, but content alignment remains stable.

| Viewport | Layout and motion |
| --- | --- |
| `< 768px` | One column, natural scrolling, no long pins, simplified scene, native cursor |
| `768–1024px` | Up to two columns, bounded pins at 60% of desktop distance |
| `> 1024px` | Full cinematic pins with content kept inside readable zones |

Transparent section surfaces may reveal `SpaceScene`, but each text area needs a
restrained token-based scrim when scene contrast would impair reading. A scrim is not
a replacement illustration and must not hide the environment.

## Elevation & Depth

Depth comes from the fixed Three.js world, tonal surface changes, bounded blur, scale,
and occlusion—not glowing card shadows. `SpaceScene.tsx` is the only continuous canvas.

### Section environments

- **Hero — Earth, aurora, and ship approach:** a restrained warm Earth horizon remains
  low/right behind the copy while the token-derived aurora gives way to stars and the
  ship crosses the frame. Procedural surface/cloud detail is provisional until an
  approved texture source is recorded.
- **About — Deep-space continuation:** the warm star field remains inside the same
  Three.js canvas after the ship exits. No comet or separate foreground celestial
  object competes with the copy; a restrained token-based scrim protects readability.
- **Projects — Solar Passage:** deterministic warm particles bend around incomplete
  orbital traces and a restrained low solar core. The composition remains beneath the
  carousel and subordinate to project evidence.
- **Skills — Nebula Field:** a deterministic warm dust field supplies ambient depth
  behind an evidence-led HTML capability ledger. No orbital technology diagram or
  emphasis interaction is added until it would clarify a real evidenced relationship.
- **Contact — Event Horizon:** a procedural black hole, accretion disk, photon ring,
  and bounded particles settle in the right visual zone. Contact actions remain
  visible HTML in the left/center zone without waiting for animation.

No section may introduce an independent canvas until a documented performance and
continuity reason supersedes the single-scene decision.

## Shapes

Most content remains unboxed. Thin warm borders separate factual groups. Rounded pills
are limited to compact controls and the navigation shell; they are not the default
content container. Celestial geometry is soft and particulate, never a literal planet
illustration or HUD diagram.

## Components

### SpaceScene

- Fixed behind the document and driven by the shared typed journey controller.
- Reads every color from CSS variables before creating Three.js materials.
- Hero progress controls aurora, camera, and ship; journey progress drives bounded
  travel across the persistent universe.
- The Earth horizon uses a procedural token-derived surface, separate cloud shell,
  atmosphere shell, bounded downward exit, and reduced mobile geometry. It performs
  no perpetual rotation and stops updating once the Hero contribution is hidden.
- Far, mid, and near stars use deterministic positions, distinct depth/parallax
  budgets, and desktop/mobile particle tiers.
- Solar Passage uses deterministic gravity particles (720 desktop / 220 mobile), three
  desktop or two mobile curved traces, and one contribution-scaled point light. Its
  movement is bounded to Projects progress; it has no perpetual orbit and stops frame
  work when hidden.
- Nebula Field uses one token-derived particle shader with 820 desktop / 260 mobile
  deterministic particles. It has no time uniform, follows bounded Skills progress,
  and becomes invisible before returning from its frame callback when hidden.
- Event Horizon uses procedural ring/core geometry and 480 desktop / 160 mobile
  deterministic particles. Its shader has no time uniform; position, scale, disk phase,
  and opacity settle during the opening portion of Contact progress and then stop
  changing.
- Overlapping environment contributions keep the universe continuous while Hero-only
  effects stop their frame work once the Hero contribution reaches zero.
- Canvas opacity stays at 1 as the persistent world; individual environments own their
  contribution and visibility instead of fading the entire canvas.

**Ship trajectory invariant:** after the close pass ends at approximately
`(-1.5, 0.8, -4)`, departure continues toward more-negative X and higher Y until the
ship leaves the same edge it is already approaching. It must never reverse X to loop
back toward the upper-right. Damping must be frame-rate independent and reverse scroll
must restore a coherent state.

### Section motion

- Desktop/tablet major sections use one scrubbed timeline per pinned section.
- Mobile and reduced-motion users receive visible, stable content without long pins.
- Major identities must be legible as their section arrives; do not create an empty
  full-screen surface that waits for additional scroll.
- Time-based overlays—preloader, cursor, and navbar—never share a scrubbed sequence.
- Do not scrub blur or layout properties on large text. Keep scroll response bounded,
  and stop invisible shader work once its scene contribution reaches zero.

### Navigation

The warm navigation pill stays fixed above content. Navbar links, Hero CTAs, hashes,
and skip navigation share `src/lib/navigation.ts`; native jumps must not bypass Lenis
and ScrollTrigger geometry.

### ProjectCarousel

- The active case study is the primary reading path; adjacent panels communicate
  sequence and depth without becoming competing reading surfaces.
- Desktop uses restrained perspective, scale, and horizontal displacement. Mobile
  keeps one complete readable panel with a narrow next-panel cue.
- The sequence is finite and visitor-controlled: direct 01–04 selectors, previous and
  next controls, arrow keys, and horizontal swipe are equivalent paths.
- Do not autoplay, loop from end to start, capture the vertical wheel, or pin the
  visitor inside the carousel.
- Pending projects show an honest preparation state until owner-confirmed evidence is
  available. Their cards must not invent stacks, outcomes, roles, or links.
- Reduced motion removes the cover-flow travel and presents only the selected panel.

## Experience specification

The page is one spatial journey, not five unrelated backgrounds:

```text
Earth / Aurora → Deep Space → Solar Passage → Nebula Field → Event Horizon
       identity       self          work           tools           next step
```

The semantic content order remains `Hero → About → Projects → Skills → Contact`.
Each scene change should blend through shared stars, dust, light, or camera movement;
it must not hard-switch to a replacement background or a blank transition surface.

The visitor should understand the page without scrolling through every animation beat.
Direct hashes and navigation links must land on usable section content immediately.

## Motion and animation system

### Ownership

| System | Responsibility | State |
| --- | --- | --- |
| Three.js / React Three Fiber | 3D environment, particles, materials, and camera-side spatial rendering | All five current environments in one canvas |
| GSAP | DOM entrances, preloader, cursor, navbar, and finite carousel transitions | Current and retained |
| ScrollTrigger | Maps scroll progress to bounded section timelines | Central journey mapping plus local bounded section timelines |
| Lenis | Smooth document scrolling and section navigation handoff | Current and retained |
| CSS | Tokens, layout, hover/focus, and non-critical transitions | Current and retained |

Do not add another animation framework. Time-based overlays such as the preloader,
cursor, and navbar must not share a scrubbed section timeline. Scrubbed sequences must
use transforms, opacity, and shader uniforms; do not scrub large-text blur or layout
properties.

### Motion semantics

- **Vertical motion** means travel through the journey: camera, stars, environment,
  and scroll progression.
- **Horizontal motion** means selection or navigation, primarily in the project
  carousel.
- **Depth motion** means exploration: ship fly-by, project perspective, and orbital
  relationships.
- **Opacity** means an environment transition, such as aurora yielding to stars or
  event-horizon light settling into its final state.

Motion must have a narrative or orientation purpose. Avoid perpetual floating or
decorative movement that competes with reading.

### Hero choreography

The intended sequence is:

1. Stars establish the space.
2. Aurora appears as a restrained warm atmospheric layer.
3. The name reveals through clipped or word-level editorial typography.
4. Role, positioning copy, and CTAs enter after the heading is legible.
5. The spacecraft approaches, passes close to camera, and continues toward the
   upper-left until it exits.

The existing ship invariant is binding: after the close-pass state near
`(-1.5, 0.8, -4)`, departure continues toward more-negative X and higher Y. It must
not reverse screen-space direction or loop back. Reverse scroll must reconstruct the
same state coherently.

### Hero-to-About continuity

During the handoff, aurora fades, the Earth horizon (when implemented) drops below
frame, the ship continues its existing travel vector, stars remain, and the camera
enters deep space. There must be no fade-to-black reset or dark empty gap.

## Three.js architecture

### Current state

`frontend/src/components/backgrounds/SpaceScene.tsx` owns one fixed React Three Fiber
`Canvas`. It currently contains:

- CSS-token-derived scene colors and lights
- a low/right procedural Earth horizon with cloud and atmosphere shells
- deterministic far/mid/near star layers (12,000 desktop / 4,000 mobile positions)
  with bounded journey and pointer parallax
- a procedural aurora shader with lower mobile iteration count
- the existing `/3D/lego_ship.glb` spacecraft
- a decorative asset error boundary so ship loading failure does not remove content or
  the rest of the environment
- a camera controller consuming typed Hero progress from the shared journey state
- pin-aware overlapping environment contribution supplied by `useJourneyState`
- a progressive Solar Passage with deterministic gravity particles, curved traces,
  and restrained token-derived lighting
- a deterministic ambient Nebula Field with one bounded particle shader
- a settled procedural Event Horizon with accretion disk, photon ring, and particles
- hidden-contribution gating for every section environment
- a static CSS fallback for reduced motion and WebGL failure

The current world implements all five environment beats. It does not yet include
approved Earth textures, final spacecraft approval, or project screenshots; these are
asset/content fidelity gates rather than missing environment architecture.

### Target world

Keep `SpaceScene.tsx` as the single persistent canvas and evolve its internal scene
composition rather than creating a canvas per section:

```text
SpaceScene
├── CameraRig / JourneyController
├── Universe
│   ├── FarStars
│   ├── MidStars
│   └── NearStars
├── EarthEnvironment
│   ├── Earth sphere / atmosphere
│   ├── Aurora
│   └── Spaceship
├── SolarEnvironment
│   ├── GravityParticles
│   └── SolarLighting
├── NebulaEnvironment
│   └── OrbitalSystem
└── EventHorizonEnvironment
    ├── BlackHole
    └── AccretionDisk
```

HTML remains responsible for typography, navigation, project evidence, capability
groups, and contact links. WebGL is decorative and must never be the only place where
important information exists.

### Journey state

The implemented boundary centralizes normalized progress so environments do not know
about document coordinates independently:

```ts
type JourneySection = "hero" | "about" | "projects" | "skills" | "contact";

interface JourneyState {
  progress: number;
  section: JourneySection;
  sectionProgress: Record<JourneySection, number>;
  environments: Record<JourneySection, number>;
  ranges: Record<JourneySection, JourneyEnvironmentRange>;
}
```

Directional overlapping ranges are preferred so environments blend instead of
appearing at hard boundaries:

| Environment | Directional range |
| --- | --- |
| Hero / Earth | `0.00 → 0.22` |
| About / Deep Space | `0.18 → 0.39` |
| Projects / Solar Passage | `0.34 → 0.66` |
| Skills / Nebula Field | `0.62 → 0.85` |
| Contact / Event Horizon | `0.80 → 1.00` |

These values remain fallback design guidance. At runtime the controller resolves
normalized ranges from current section and pin-spacer geometry, blends across each
boundary, and preserves the semantic section when breakpoint pin distances change.

## Asset plan and status

Do not flatten the reference image into static section backgrounds. Use procedural
rendering where it preserves continuity and use real content images only for evidence.

| Asset | Current status | Required | Intended source/type | Blocking? |
| --- | --- | --- | --- | --- |
| Spaceship | `/frontend/public/3D/lego_ship.glb` exists and is used in Hero; visual fidelity is not validated | Yes, replacement or approval needed for close reference match | Custom or licensed GLB/GLTF | Yes for final Hero fidelity |
| Spaceship reference sheet | Not present | Yes before commissioning or generating a replacement | Front/rear/side/top/bottom/material views | Yes for consistent modeling |
| Earth geometry/textures | Procedural sphere, cloud shell, and atmosphere are implemented; no approved texture is present | Approved surface/cloud textures are still needed for final fidelity | Existing `SphereGeometry`/shaders plus licensed textures | Yes for final Hero fidelity |
| Aurora | Procedural shader exists in `SpaceScene.tsx` | Reuse and tune | Three.js shader | No |
| Star field | Procedural positions exist; desktop/mobile counts are split | Reuse and extend to depth layers | Three.js particles | No |
| Asteroid | Removed during the Phase 8 asset audit because the unused GLB added roughly 55 MB to the deployable public directory | Not currently required | Add only a licensed, approved, optimized GLB if a future scene decision requires one | No |
| Project screenshots | No project screenshots are present under `public/images/` | Required for evidence-led showcase | Owner-provided images | Yes for image-led project panels |
| Technology icons | No dedicated icon set is present | Optional; text categories are sufficient | Approved SVG/icon set | No |
| Nebula/noise textures | No texture is needed; deterministic shader particles are implemented | Optional only if later quality profiling justifies them | Existing procedural field; licensed texture fallback only if required | No |
| Black hole / accretion disk | Procedural ring/core geometry, photon ring, and bounded particles are implemented | Retain and profile; no downloaded model is required | Existing geometry/shader | No |

The spacecraft workflow is:

```text
master visual reference → consistent multi-view reference sheet → 3D model
→ optimized GLB/GLTF → integration → camera/material matching
```

The same spacecraft identity, proportions, materials, and lighting logic must persist
across every view. Do not create separate unrelated models from one screenshot.

## Performance and responsive quality gates

Target smoothness is approximately 60 FPS on desktop where practical and a stable,
usable 30–60 FPS on mobile. The current renderer caps device pixel ratio at `1.5` on
desktop and `1.15` on mobile, and reduces aurora shader iterations and star count on
mobile; Solar, Nebula, and Event Horizon also use explicit lower mobile tiers.

Environment work should activate progressively and stop expensive shader updates when
an environment is fully hidden:

```text
Hero:      aurora + ship active; Solar/Nebula/Event Horizon inactive
About:     stars + deep-space dust active; ship leaving; later environments inactive
Projects:  Solar Passage active; Hero-only effects inactive; movement follows scroll
Skills:    ambient Nebula active; Solar fades; no ornamental technology orbit
Contact:   Event Horizon settles; previous effects fade or stop
```

Required responsive behavior:

- Below 768px: natural scrolling, no long pins, one column, reduced particles, native
  cursor, simplified camera/ship, and a readable single project panel.
- 768–1024px: useful two-column layouts, with pin distances at 60% of desktop.
- Above 1024px: full bounded cinematic sequence, perspective carousel, and optional
  orientation rail.

Required reduced-motion behavior:

- no dramatic camera travel, close fly-by, long scrub, or persistent parallax
- minimal carousel travel and stable scene state
- all content, navigation, project controls, and contact links remain available

## Accessibility and failure behavior

- Use semantic landmarks and a working skip link.
- Keep visible keyboard focus and keyboard-operable project controls.
- Treat the canvas as decorative with `aria-hidden="true"`.
- Do not put project evidence, contact details, or essential labels inside WebGL only.
- Ensure the page remains readable when scripts are slow, animation is disabled, or
  WebGL fails.
- Never use a loading animation as the only path to factual content.

## Navigation contract

The target desktop sequence is:

```text
01 HOME → 02 ABOUT → 03 PROJECTS → 04 SKILLS → 05 CONTACT
```

The current `Navbar` exposes all five destinations and `ScrollProgress` renders a
secondary right-side journey rail above 1024px. Both consume the shared journey
definitions and route through `frontend/src/lib/navigation.ts`; the rail disappears on
tablet/mobile and never replaces primary navigation.

## Decision register

### LOCKED

- Creative theme: **Dust, Gravity, and Time**.
- Latest selected cinematic portfolio image is the primary visual composition target.
- Palette is warm near-black with sparse Gravity Gold accents.
- Narrative is Earth → Deep Space → Solar Passage → Nebula Field → Event Horizon.
- One persistent Three.js canvas is the spatial world.
- GSAP, ScrollTrigger, Lenis, and Three.js have distinct ownership roles.
- Project carousel is finite and visitor-controlled: no autoplay, infinite loop,
  vertical-wheel capture, or visitor trap.
- Mobile has natural scrolling and no long cinematic pins.
- Reduced motion is a required supported mode.
- Project data must remain truthful and pending projects must not be embellished.

### PROVISIONAL

- Exact journey progress ranges and final scroll distances.
- The internal split of `SpaceScene.tsx` into environment components.
- Final shader and particle quality after representative-device profiling.
- Whether the desktop progress rail is necessary after visual QA.

### OPEN

- Final spaceship model and its license/visual match.
- Earth textures and cloud/atmosphere treatment.
- Whether future capability evidence warrants an orbital relationship view.
- Project screenshots and owner-confirmed detail for Projects 03 and 04.
- Owner approval of final About copy and any additional contact metadata.

### DEFERRED

- Production deployment and final cross-browser/performance sign-off.
- Any visual effect that cannot pass readability, reduced-motion, or mobile quality
  gates.

## Do's and Don'ts

### Do

- **Do** let typography remain the primary information layer.
- **Do** use CSS tokens for every UI and Three.js color.
- **Do** preserve motion direction and spatial continuity.
- **Do** keep all essential content readable with animation disabled.
- **Do** test desktop and 375px mobile together after scene or pin changes.

### Don't

- **Don't** use neon cyan, magenta plasma, cyberpunk HUDs, or gradient text.
- **Don't** add lens flares, planet illustrations, astronaut SVGs, or generic space art.
- **Don't** let the ship, star field, or scrim impair important copy.
- **Don't** create repeated card grids when a sparse editorial structure communicates
  the content more directly.
- **Don't** add motion merely because a section is static.
