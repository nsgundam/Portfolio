# Section Spec — About
> AI Agent: Read `design-system.md`, `interaction-spac.md`, and `hero.md` before implementing.
> Status: ⬜ Needs upgrade — current implementation is a standard scroll section. Sticky slide-up panel required.

---

## Purpose

The About section is the first narrative beat after the Hero. It physically rises from below and covers the Hero — like a new layer of the world emerging. This creates a sense of depth and cinematic progression. After About fully covers Hero, normal scroll resumes.

---

## Scroll Mechanic — Sticky Slide-Up

This is the most complex layout in the portfolio. Read carefully.

### Hero Setup
```css
section#hero {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 0;
  overflow: hidden;  /* clips About panel edges during rise */
}
```

### About Wrapper
```css
.about-wrapper {
  position: relative;
  z-index: 10;
  margin-top: -100vh;  /* overlaps Hero vertically */
}
```

### About Panel
```css
.about-panel {
  min-height: 100vh;
  transform: translateY(100vh);  /* starts below viewport */
}
```

### ScrollTrigger Animation
```typescript
gsap.to(".about-panel", {
  y: 0,
  ease: "none",
  scrollTrigger: {
    trigger: ".about-wrapper",
    start: "top bottom",    // when About wrapper top hits viewport bottom
    end: "top top",         // when About wrapper top hits viewport top
    scrub: true,            // tied directly to scroll position
  }
});
```

After the panel reaches `y: 0`, normal document flow takes over and scroll continues naturally through the About content.

---

## Visual Design

### Panel Appearance
```
background:     rgba(22, 26, 29, 0.92)   ← near-opaque surface, slightly transparent
backdrop-filter: blur(20px)
border-top:     1px solid rgba(255, 255, 255, 0.06)
border-radius:  24px 24px 0 0            ← rounded top corners only
box-shadow:     0 -20px 60px rgba(0, 0, 0, 0.5)   ← shadow cast downward onto Hero
```

The panel should feel like a physical object rising from below — the shadow and rounded corners reinforce this.

---

## Layout

```
section#about
  padding: px-5 sm:px-8, py-20 md:py-32
  max-width: max-w-5xl, mx-auto

  ├── Section label: "01 / About"
  ├── Heading: "Agile Technical / Explorer"
  └── Content grid (2 columns on desktop, 1 on mobile)
      ├── Left: Bio paragraphs
      └── Right: Quick info rows
```

---

## Content

### Section Label
```
"01 / About"
font:     IBM Plex Mono (font-body)
size:     text-xs
color:    var(--color-brand)
tracking: 0.3em uppercase
margin:   mb-4
```

### Heading
```
"Agile Technical"
"Explorer"          ← second line in text-secondary color
font:     Space Mono (font-heading)
size:     clamp(32px, 4vw, 64px)
color:    var(--color-text-primary) / var(--color-text-secondary)
leading:  tight
margin:   mb-16
```

### Bio (Left Column)
```
Paragraph 1:
"I am a developer driven by curiosity and a problem-solving mindset.
In a fast-evolving tech landscape, I define myself as an Agile Technical Explorer—
always ready to leverage new tools to transform ideas into reality."

Paragraph 2:
"My focus lies in the intersection of efficient architecture and sophisticated visuals,
ensuring every project is built with purpose and impact."

font:     IBM Plex Mono (font-body)
size:     text-sm
color:    var(--color-text-secondary)
leading:  relaxed
"Agile Technical Explorer" inline: text-text-primary (emphasis)
```

### Quick Info (Right Column)
```
Rows:
  Based in    | Thailand
  Focus       | Software Engineer / Full-Stack / AI
  Available   | Internship 2026

Layout: justify-between, border-b border-border, pb-4
Label:  font-body, text-xs, text-disabled, tracking-widest uppercase
Value:  font-body, text-xs, text-primary
```

---

## Content Reveal Animation

After the About panel finishes sliding into position (ScrollTrigger `onEnter` callback), trigger blur reveals on content elements in sequence.

```typescript
// Triggered when panel reaches final position
const revealTl = gsap.timeline();

revealTl
  .fromTo(labelRef.current, 
    { opacity: 0, filter: "blur(8px)" },
    { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power4.out" }
  )
  .fromTo(headingRef.current,
    { opacity: 0, filter: "blur(12px)", y: 20 },
    { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, ease: "power4.out" },
    "-=0.3"
  )
  .fromTo(bioRef.current,
    { opacity: 0, filter: "blur(8px)" },
    { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power4.out" },
    "-=0.4"
  )
  .fromTo(infoRef.current,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power4.out" },
    "-=0.5"
  );
```

---

## Responsive

| Breakpoint | Behavior |
|---|---|
| Mobile | Single column layout. Slide-up mechanic preserved. Reduced blur values. |
| Tablet | Same as mobile layout. Slide-up preserved. |
| Desktop | 2-column grid. Full slide-up + blur reveal. |

On mobile, the slide-up scrub may feel too slow. Consider `scrub: 0.5` (faster snap) on mobile.

---

## Accessibility

- Section has `id="about"` for anchor navigation
- Heading has proper `h2` hierarchy
- Inline emphasis on "Agile Technical Explorer" uses `<span>` not `<strong>` (visual only)
- With `prefers-reduced-motion`: skip slide-up, render panel at final position immediately

---

## Implementation Checklist

- [ ] Add `position: sticky; top: 0; overflow: hidden` to Hero section
- [ ] Wrap About section in a `.about-wrapper` div with `margin-top: -100vh`
- [ ] Add `.about-panel` inner div with `transform: translateY(100vh)` initial state
- [ ] Set up ScrollTrigger scrub animation on `.about-panel`
- [ ] Apply glassmorphism styles to `.about-panel`
- [ ] Add content reveal timeline triggered on panel arrival
- [ ] Test that normal scroll resumes after panel is in place
- [ ] Test on mobile — ensure slide-up doesn't break layout

---

## What NOT to do

- Do not use `position: fixed` for the About panel — it must scroll with the page after arriving
- Do not add a close/collapse button — the panel stays in place
- Do not add a profile photo — the section is typography-driven
- Do not overuse glassmorphism — the panel background should be near-opaque, not heavily transparent
- Do not animate the panel with a spring ease — use `ease: "none"` with `scrub` for scroll-tied movement
