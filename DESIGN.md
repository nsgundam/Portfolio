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

The first two environments are implemented. Later environments remain directional
requirements for their roadmap phases.

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

- **Hero — Aurora and ship approach:** warm token-derived aurora gives way to a star
  field as the ship approaches and crosses the frame.
- **About — Deep-space continuation:** the warm star field remains inside the same
  Three.js canvas after the ship exits. No comet or separate foreground celestial
  object competes with the copy; a restrained token-based scrim protects readability.
- **Projects — Solar Passage:** planned; must remain warm, typographic, and subordinate
  to project evidence.
- **Skills — Nebula Field:** planned; ambient depth only, never decorative floating
  cards.
- **Contact — Event Horizon:** planned final environment; the contact action remains
  readable without animation.

No section may introduce an independent canvas until a documented performance and
continuity reason supersedes the single-scene decision.

## Shapes

Most content remains unboxed. Thin warm borders separate factual groups. Rounded pills
are limited to compact controls and the navigation shell; they are not the default
content container. Celestial geometry is soft and particulate, never a literal planet
illustration or HUD diagram.

## Components

### SpaceScene

- Fixed behind the document and driven by one master scroll range.
- Reads every color from CSS variables before creating Three.js materials.
- Hero progress controls aurora, stars, camera, and ship.
- About progress keeps the star field continuous and controls the scene exit.
- Canvas opacity stays at 1 while About enters and throughout its pinned beat, then
  fades only as About releases toward Projects.

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
