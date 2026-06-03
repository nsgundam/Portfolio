# Design

## Visual Identity

The portfolio is a dark editorial brand with a warm, cinematic color palette and a restrained typographic hierarchy. The aesthetic is intentionally not neon or cyberpunk; it is warm, tactile, and technical, with carefully controlled motion and a strong sense of spatial depth.

### Brand character

- Warm, confident, and composed
- Technical without appearing flashy
- Cinematic, yet readable and anchorable
- Precise motion that supports meaning rather than distracts

## Color Palette

### Surface

- `--color-bg`: #080706
- `--color-surface`: #161310
- `--color-surface-2`: #1E1C18
- `--color-border`: #2A2519
- `--color-border-light`: #3A3732

### Accent

- `--color-accent`: #C4A97D
- `--color-accent-light`: #D4BC9A
- `--color-accent-dark`: #8A7450

### Text

- `--color-text-primary`: #EDE6D6
- `--color-text-secondary`: #7A776E
- `--color-text-disabled`: #3A3834

### Usage

- Backgrounds are anchored in deep charcoal and near-black values.
- Accent color is a warm gold used sparingly for borders, buttons, and metadata.
- Primary text is high-contrast cream; secondary text is a soft warm gray.
- Disabled or muted text is a low-contrast dark warm gray.

## Typography

### Font stack

- `--font-display`: "Cormorant Garamond", Georgia, serif
- `--font-label`: "Space Mono", monospace
- `--font-body`: "IBM Plex Mono", monospace

### Scale

- Display XL: `clamp(72px, 12vw, 160px)` — hero name, major headings
- Display LG: `clamp(48px, 7vw, 96px)` — section headings, prominent titles
- Display MD: `clamp(32px, 4vw, 56px)` — subheads and project titles
- Body LG: `16px / 1.8` — primary paragraphs
- Body SM: `14px / 1.7` — supporting text, descriptions
- Label: `11px`, uppercase tracking, monospace — navigation labels, metadata, section IDs

### Rules

- Display type is reserved for section hero text and major headings.
- Body copy uses mono text for a technical, editorial tone.
- Labels are monospace, uppercase, and small; use them sparingly.
- Use `text-wrap: balance` on large headings and `text-wrap: pretty` on long prose when needed.

## Layout and Spacing

### Structure

- Single-page scroll narrative with sections: Hero, About, Projects, Skills, Contact.
- Each section is visually distinct but shares the same warm, dark editorial fabric.
- Use generous horizontal padding and ample vertical rhythm.

### Spacing

- Section padding: `clamp(24px, 6vw, 120px)` horizontal and generous vertical spacing.
- Content width: `max-width: 900px` for text sections, up to `1100px` for projects.
- Space headings and body copy to create clear beats and avoid dense walls of text.

## Motion and Interaction

### Motion principles

- Motion is meaningful and purposeful: reveal, transition, and interaction support the narrative.
- Use `gsap.context()` and `ScrollTrigger` for section reveals and pinned scroll timelines.
- Provide reduced-motion alternatives through `prefers-reduced-motion`.
- Avoid layout motion except where it is essential to the feeling of depth.

### Key motion patterns

- Depth reveal: opacity + scale + blur transitions for text and UI entrances.
- Scroll pinning: sections earn scroll, holding content for a cinematic beat.
- Magnetic hover on CTA buttons: subtle pointer attraction for interactivity.
- Custom cursor: only on fine pointer devices, disabled for reduced-motion.

## Components

### Navbar

- Warm glass pill navigation with soft border and subtle blur.
- Hidden until hero transition completes, then appears at top.
- Contains skip link for accessibility.

### Hero

- Full-screen cinematic opening.
- Animated hero name built with Splitting.js for text bloom.
- Tagline and CTA buttons appear after the main reveal.
- Scroll indicator anchors the next action.

### Buttons

- `MagneticButton` uses `useMagneticHover`.
- Primary CTAs are small uppercase buttons with accent border and hover fill.
- Buttons use clear verb-object labels like `Contact` and `Explore Work`.

### Content sections

- About: editorial bio with a simple vertical structure and a facts row.
- Projects: stacked full-screen panels with project number, title, one-liner, stacks, and link.
- Skills: grouped technology lists with “Shipped with” and “Learning with” sections.
- Contact: direct CTA and clean, high-contrast affordances.

## Accessibility

- Skip link present at the top of the page.
- Focus styles visible and keyboard-friendly.
- Contrast ratio targeted for WCAG AA on primary text and controls.
- Motion reduced via `prefers-reduced-motion`.
- Semantic headings, buttons, and landmarks are used throughout.

## System rules

- No gradient text.
- No neon or cyan sci-fi palette.
- No glassmorphism as the default surface style; glass effects are reserved for surface overlays only.
- Keep background textures subtle and anchored to the warm editorial palette.
