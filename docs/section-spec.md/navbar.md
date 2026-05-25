# Section Spec — Navbar
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ✅ Implemented. This spec documents the final design for reference and future changes.

---

## Purpose

The navbar is a persistent wayfinding element that transforms from invisible to a floating glassmorphism pill as the user scrolls. It should feel like it emerges from the content rather than being imposed on top of it.

---

## Visual States

### State 1 — At Top (scroll < 30px)
```
position:         fixed, top: 0
width:            100%
height:           72px
background:       transparent (rgba(22, 26, 29, 0))
backdrop-filter:  none
border:           transparent
border-radius:    0
```

### State 2 — Scrolled (scroll ≥ 30px)
```
position:         fixed, top: 1rem
width:            92%
max-width:        42rem
height:           60px
background:       rgba(22, 26, 29, 0.65)
backdrop-filter:  blur(20px) saturate(180%)
border:           1px solid rgba(255, 255, 255, 0.08)
border-radius:    1rem
box-shadow:       inset 0 1px 1px rgba(255,255,255,0.12),
                  inset 0 -1px 4px rgba(0,0,0,0.40),
                  0 8px 32px rgba(0,0,0,0.25)
```

**Transition between states:**
```
all: 0.7s cubic-bezier(0.16, 1, 0.3, 1)
```
All properties interpolate simultaneously — width, border-radius, background, blur all animate together.

---

## Logo

**Content:** `NS` (monogram)
**Font:** `Space Mono` (`font-heading`)
**Color:** `var(--color-text-primary)`
**Link:** `#hero`

### Logo Tuck
```
At top:    scale(1)
Scrolled:  scale(0.85)
duration:  0.7s
ease:      cubic-bezier(0.16, 1, 0.3, 1)
origin:    left center
```

---

## Navigation Links (Desktop)

**Items:** About (`#about`), Projects (`#projects`), Skills (`#skills`), Contact (`#contact`)
**Font:** `IBM Plex Mono` (`font-body`)
**Size:** `text-sm`
**Color:** `var(--color-text-secondary)` default
**Tracking:** `tracking-widest uppercase`
**Hidden on mobile:** `hidden md:flex`

### Rolling Text Hover Effect
Each link contains two stacked copies of its label. On hover, the container slides up to reveal the brand-colored copy.

```
Structure:
  <a> (overflow: hidden, height: 1.2em)
    <div> (flex-col, transition: transform 0.3s ease-in-out)
      <span> LABEL (default color)
      <span> LABEL (brand color: #A4161A)

Hover: translateY(-50%) on the inner div
```

---

## Mobile Menu

**Trigger:** Hamburger icon (3 bars → X animation)
**Breakpoint:** Visible only on `< md` (< 768px)

### Hamburger Animation
```
Bar 1: translateY(6.5px) rotate(45deg) when open
Bar 2: opacity 0 when open
Bar 3: translateY(-6.5px) rotate(-45deg) when open
transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1)
```

### Full-Screen Overlay
```
position:   fixed, inset-0
z-index:    39 (below navbar at 40)
background: var(--color-bg)
opacity:    0 → 1 on open (0.45s ease)
```

### Mobile Menu Items
```
font:       Space Mono
size:       clamp(2rem, 8vw, 3.5rem)
color:      var(--color-text-primary)
hover:      var(--color-brand)

Stagger in on open:
  opacity: 0 → 1
  translateY: 20px → 0
  duration: 0.5s
  delay: 0.1s + (index * 0.07s)

Snap out on close:
  opacity: 0, translateY: 20px
  duration: 0.2s (no stagger)
```

Each item shows a small brand-colored number prefix (`01`, `02`, etc.).

### Tagline Footer
```
"Aiming high, building what matters."
font:    IBM Plex Mono, text-xs
color:   var(--color-text-disabled)
tracking: 0.2em
position: absolute bottom-10
opacity: 0 → 1 on open (delay: 0.4s)
```

---

## Accessibility

- `aria-label` on hamburger button: "Open menu" / "Close menu"
- `aria-expanded` on hamburger button
- `aria-controls="mobile-menu"` on hamburger button
- `role="dialog"` and `aria-modal="true"` on mobile overlay
- `Escape` key closes mobile menu
- Focus trap inside mobile menu when open

---

## Initialization

Navbar waits for `preloaderDone === true` before initializing the ScrollTrigger that watches scroll position. This prevents the glass effect from triggering during the preloader.

```typescript
useEffect(() => {
  if (!preloaderDone) return;
  // ScrollTrigger.create({ ... })
}, [preloaderDone]);
```

---

## What NOT to do

- Do not add a `Home` link — the logo serves as the home link
- Do not use CSS `transition` for the glassmorphism — use inline style interpolation driven by React state
- Do not add a dark/light mode toggle
- Do not add social icons to the navbar
- Do not make the navbar full-width on mobile when scrolled — it stays full-width on mobile always
