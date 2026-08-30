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

The warm aurora, ship journey, and About star field are implemented. The Hero Earth
horizon and the later Solar Passage, Nebula Field, and Event Horizon remain planned
production environments with the asset and performance requirements below.

The owner approved this whole-page direction and its implementation approach on
30 August 2026. The approved target is not a collection of independent section
redesigns: it is one recruiter-readable editorial page whose atmosphere travels from
Earth to the Event Horizon. The current Earth and Event Horizon integrations are
motion and compositing prototypes. They are evidence for crop, tone, loading, and
performance decisions, but they are not the final layered celestial implementation.

**Key Characteristics:**

- Warm near-black surfaces and sparse gravity-gold accents
- Editorial serif display type against precise mono copy
- One continuous Three.js world behind readable HTML content
- Motion that preserves direction and explains the journey
- Calm negative space; no decorative sci-fi interface language

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

### Confirmed hierarchy targets

The following ranges are refinement targets, not permission to enlarge every element:

| Role | Desktop target |
| --- | --- |
| Hero name | 96–144px |
| Hero positioning | 18–22px |
| Section heading | 64–88px |
| Project title | 56–72px where the panel composition permits |
| Reading body | 16–18px |
| Metadata | 11–13px |

The hierarchy must remain visibly separated into Display, Body, and Metadata. Body
copy may not be reduced merely to make more atmosphere visible. On mobile, scale
fluidly while preserving the same hierarchy and comfortable reading size.

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

### Confirmed section composition and rhythm

| Section | Composition | Experience intensity |
| --- | --- | --- |
| Hero | Immediate identity and engineering position; scene remains supporting evidence | High |
| About | Asymmetric editorial biography with calm negative space and legible facts | Calm / medium |
| Projects | Largest evidence-led composition; the active case study dominates | High |
| Skills | Capability-led editorial lanes; typography carries the section | Quiet / medium |
| Contact | Direct typography-led conclusion with one obvious contact path | Strong final moment |

Avoid repeating a centered heading followed by centered content and cards. Each
section needs a distinct balance of density, scale, and negative space while sharing
the same content alignment, palette, type roles, and spatial narrative.

### Static composition contract

The redesign must first be completed and approved as a coherent static page with
GSAP and Three.js unavailable. This pass owns typography, content hierarchy,
responsive layout, reading zones, contrast, section rhythm, and the following final
compositions:

- **Hero:** editorial identity and engineering position with an open right-side field
  for the Earth horizon and ship. Name, Software Engineer role, Full-stack / Backend /
  Real-time systems focus, and primary actions are immediately legible.
- **About:** asymmetric biography, concise engineering statement, and factual details
  balanced against a calm deep-space field. A direct `#about` visit exposes the full
  reading state without another gesture.
- **Projects:** the existing finite carousel becomes an evidence-led case-study
  composition. A published project presents its visual evidence, outcome, role,
  challenge, solution, verified stack, and links in that order of importance.
- **Skills:** a large editorial statement is balanced against five capability lanes.
  The section is readable as static grouped text before marquee behavior is added.
- **Contact:** the terminal metaphor is removed. A typography-led conclusion, direct
  email action, GitHub, and LinkedIn occupy the reading field opposite the Event
  Horizon composition.

No scene motion may be used to compensate for unresolved alignment, weak hierarchy,
missing evidence, unreadable text, or mobile overflow.

## Elevation & Depth

Depth comes from the fixed Three.js world, tonal surface changes, bounded blur, scale,
and occlusion—not glowing card shadows. `SpaceScene.tsx` is the only continuous canvas.

### Section environments

- **Hero — Earth horizon, aurora, and ship approach:** a restrained, data-derived
  Earth horizon anchors the opening without becoming a full-disk planet poster. Warm
  token-derived aurora gives way to a star field as the ship approaches and crosses
  the frame. The Earth stays outside the primary reading zone and supports the ship's
  existing travel vector.
- **About — Deep-space continuation:** the warm star field remains inside the same
  Three.js canvas after the ship exits. No comet or separate foreground celestial
  object competes with the copy; a restrained token-based scrim protects readability.
- **Projects — Solar Passage:** planned; must remain warm, typographic, and subordinate
  to project evidence. Localized focal light may support the active case study but
  may not obscure screenshots or technical copy.
- **Skills — Nebula Field:** planned; ambient depth only, never decorative floating
  cards. Dust and sparse particles stay outside the primary reading lanes.
- **Contact — Event Horizon:** planned final environment; the contact action remains
  readable without animation. The ending should approach near-black and feel final,
  not introduce another independent spectacle.

No section may introduce an independent canvas until a documented performance and
continuity reason supersedes the single-scene decision.

### Celestial production method — confirmed direction

The Earth and Event Horizon must be **art-directed illusions**, not browser-side
physics demonstrations. Three.js owns camera, depth, compositing, light response,
and restrained motion. It must not be asked to synthesize every visual detail at
runtime.

#### Hero Earth horizon

- Owner-approved composition reference (30 August 2026):
  `docs/visual-studies/earth-horizon-study-v1.png`. The optimized derivative at
  `frontend/public/images/celestial/earth-horizon-fallback.png` is the runtime plate
  and reduced-motion fallback.
- Render the approved plate as a full-viewport Three.js plane with cover-cropped UVs,
  bounded scroll travel, and no continuous pointer response. As Hero releases, the
  horizon moves beyond the right/lower frame edge while scaling slightly to preserve
  camera-relative depth; it does not dissolve through opacity. Only approximately
  25–40% of the Earth horizon enters the composition; never center the full planet.
- A real sphere with day, night, cloud, and atmosphere layers was tested and rejected
  on 30 August 2026 because it read as a conventional CG globe and diverged from the
  approved cinematic reference. Its prototype-only maps remain under
  `docs/visual-studies/earth-sphere-spike/` and are excluded from the Vite bundle.
- Do not restore the sphere path merely for technical novelty. Reconsider it only if
  a new isolated study matches or exceeds the approved plate at desktop and mobile
  without adding visible loading or GPU cost.

#### Contact Event Horizon

- Owner-approved composition reference (30 August 2026):
  `docs/visual-studies/event-horizon-study-v1.png`. This is the art-direction target;
  runtime layers and the fallback plate must be derived and optimized separately.
- Use a **2.5D authored plate** rather than a physically accurate full-screen
  ray-marched black hole. Prepare the main accretion-disk shape offline at the final
  camera angle, without stars, interface marks, or baked typography.
- Runtime v1 uses the approved authored plate with cover-cropped UVs, restrained
  material-local distortion, and a right-edge spatial arrival driven by Contact's
  actual viewport position. The object translates and scales into the composition;
  it must not opacity-fade over About or Projects. Split it into a black
  core/occlusion mask, emissive accretion plate, and sparse dust/noise mask only if a
  later visual review proves the single plate lacks sufficient depth.
- A localized shader may animate slow UV drift, asymmetric heat variation, and a
  restrained mirrored rear arc to suggest gravitational lensing. It may distort only
  the local celestial field; it must not warp HTML copy, navigation, or the whole
  canvas.
- Avoid a permanent full-screen `EffectComposer` merely to obtain bloom or lensing.
  Prefer authored softness, additive halo geometry, and material-local distortion.
  Add a render target only if the approved visual study cannot achieve the required
  depth without it.
- Keep the core near-black and the disk within Gravity Gold, Starlight, and warm dust
  values. The result should resemble a photographed astronomical event, not an orange
  portal, glowing ring logo, or shader playground.
- Contact text remains the brightest readable priority. The object sits primarily in
  the opposite visual field and settles before the main contact action reaches its
  reading position.

#### Asset and fallback strategy

- Prototype the Earth and Event Horizon as isolated visual studies before integrating
  either into the master scroll scene. Approve the still composition first, then add
  motion.
- During R&D, PNG plates are acceptable. Before release, compare WebP and AVIF output
  against the approved grain, shadow detail, and highlight rolloff; keep PNG only if
  the smaller formats introduce visible banding or texture loss.
- Provide dedicated static Hero and Contact fallback plates for mobile,
  `prefers-reduced-motion`, WebGL failure, and low-capability devices. These are not
  screenshots of broken WebGL states; they are intentionally composed alternatives.
- Production targets: no new single asset above 2 MB, no 4K map by default, at most
  4 Earth draw calls and 5 Event Horizon draw calls, and no invisible shader updates.
  Validate actual GPU memory and frame timing rather than treating compressed file
  size as runtime cost.
- Preload only the Hero-critical Earth plate. Defer Event Horizon assets until the
  visitor approaches Projects or the browser is idle, then precompile its shader
  before Contact enters to avoid a visible first-frame stall.

## Shapes

Most content remains unboxed. Thin warm borders separate factual groups. Rounded pills
are limited to compact controls and the navigation shell; they are not the default
content container. Celestial geometry is soft and particulate, never a literal planet
illustration or HUD diagram.

## Components

### SpaceScene

- Fixed behind the document and driven by one master scroll range.
- Reads every color from CSS variables before creating Three.js materials.
- Hero progress controls the 2.5D Earth horizon plate, aurora, stars, camera, and ship.
- About progress keeps the star field continuous and controls the scene exit.
- Replace the current post-About wrapper fade with continuous section weights before
  adding later environments. Hero, About, Projects, Skills, and Contact each expose a
  numeric scene weight through refs; React state must not update on every scroll tick.
- Canvas opacity stays available through Contact. Celestial objects and the star field
  enter or leave through directional translation, camera-relative depth, scale, or
  occlusion rather than cross-fading. Hidden groups sleep or become invisible once
  their spatial transition is complete.
- The scene controller must permit direct section navigation to resolve immediately
  to the correct stable environment instead of replaying every earlier stage.

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
- Use layout, spacing, typography, and contrast to create the scroll rhythm before
  adding motion. Do not animate every section with equal intensity.
- Static-first rule: if Three.js and GSAP are unavailable, the complete page must
  still look intentionally composed and expose every essential fact and action.

### Whole-page implementation contract

Implementation proceeds across the whole page in layers rather than completing one
section's layout, scene, and motion before starting the next:

1. Converge tokens, typography, containers, navigation, section spacing, and shared
   editorial primitives.
2. Build and approve all five static section compositions.
3. Add truthful project evidence and final owner-approved positioning copy.
4. Prepare layered celestial assets and intentional static fallbacks.
5. Refactor `SpaceScene` into one section-aware journey controller.
6. Add environmental travel and section interactions only after the static page
   passes desktop and mobile review.
7. Validate responsive behavior, accessibility, direct navigation, reduced motion,
   WebGL failure, and runtime cost before final polish and release.

The complete delivery checklist, dependencies, and acceptance gates live in
`ROADMAP.md`. This section is the binding design-side sequencing rule.

### Navigation

The warm navigation pill stays fixed above content. Navbar links, Hero CTAs, hashes,
and skip navigation share `src/lib/navigation.ts`; native jumps must not bypass Lenis
and ScrollTrigger geometry.

Direct section navigation must land on a useful reading state. In particular, an
About deep link may not show only the heading while hiding the biography and facts
until another scroll gesture.

### Hero — confirmed refinement direction

- The first viewport must identify **Narunat Sutthibut**, **Software Engineer**, and
  the **Full-stack / Backend / Real-time systems** focus without waiting for scroll.
- Preserve the memorable name and ship sequence, but reduce preloader, scroll-lock,
  and entrance time wherever they delay access to positioning or navigation.
- The ship supports the identity rather than becoming the whole experience. Its
  existing travel-vector invariant remains binding.
- Hero CTA placement must remain immediately understandable on desktop and mobile.

### About — confirmed refinement direction

- Keep About directly after Hero and retain the continuous warm star field.
- Replace the centered-bio feeling with an asymmetric editorial composition that
  balances a clear engineering-oriented statement, readable biography, and concise
  facts.
- “Agile Technical Explorer” is not a locked public headline. Replace it only after
  the final identity wording is owner-approved; do not invent a stronger-sounding
  claim as a design shortcut.
- The section communicates mindset, engineering curiosity, current focus, and
  personal context without generic self-description.

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
- Preserve the carousel as the finite selection and navigation shell, but make each
  active `ProjectPanel` read as a substantial case study rather than an enlarged
  technology card.
- Published projects prioritize a real screenshot or repository-backed architecture
  visual, then outcome, role, engineering challenge, solution evidence, verified
  stack, and relevant links. Visual evidence must remain subordinate to comprehension.
- Remove fixed-height dead space on mobile. The selected panel should size naturally
  to its evidence while retaining only a narrow, non-competing next-panel cue.

### Skills capability lanes — confirmed direction

- Replace the floating technology-card grid with an asymmetric editorial composition:
  a large heading and concise capability statement on the left, with typographic
  capability lanes on the right.
- Organize the section around **Product Interfaces**, **Backend Systems**,
  **Real-time Systems**, **Data & Persistence**, and **Delivery & Tooling** rather
  than presenting an undifferentiated inventory of tools. Exact technologies must
  remain owner-confirmed or supported by project evidence.
- On desktop and tablet, the technology names move slowly in alternating horizontal
  marquee directions. Typography and thin warm dividers carry the composition; do
  not introduce logo tiles, pills, orbital HUD diagrams, or another canvas.
- Hovering a lane pauses that lane. Keyboard focus provides the same behavior, and a
  visible Pause/Resume control stops or restarts all lanes.
- Marquee work stops when the Skills section leaves the viewport or the document is
  hidden. Mobile and `prefers-reduced-motion` show the complete capability groups as
  static wrapping lists with no motion-only information.

### Contact — confirmed refinement direction

- Replace the generic terminal-window presentation with a typography-led finale that
  belongs to the Event Horizon environment.
- Use a strong concluding statement, one direct email action, and plainly labeled
  GitHub and LinkedIn links. The contact path must remain obvious with animation and
  WebGL disabled.
- Do not use traffic-light dots, terminal commands, blue-gray legacy surfaces, or
  clipped single-line contact values as decorative developer shorthand.
- At 375px, every contact value must wrap or recompose without horizontal clipping.

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
