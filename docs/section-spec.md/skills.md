# Section Spec — Skills
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ⬜ Needs upgrade — current implementation is a plain text list. Floating tech capsules required.

---

## Purpose

The Skills section communicates technical breadth through visual sophistication. Technologies should feel like they belong to a living system — not a static list. The visual metaphor is a constellation of expertise: clusters of related technologies with subtle ambient motion.

---

## Visual Concept — Floating Tech Capsules

Technologies are displayed as pill-shaped capsules grouped by category. Each group floats with a subtle, independent ambient animation. The overall effect should feel like a technical dashboard or a live system map — not a resume bullet list.

**Tone:** Technical sophistication. Never childish. Never chaotic.

---

## Section Header

```
Section label: "03 / Skills"
  font-body, text-xs, text-brand, tracking-[0.3em] uppercase, mb-4

Heading: "Tech"
         "Stack"  ← second line in text-secondary
  font-heading, clamp(32px, 4vw, 64px), mb-16
```

---

## Skill Data

```typescript
const SKILL_GROUPS = [
  {
    category: "Frontend",
    icon: "◈",   // decorative monospace symbol
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Lenis"],
  },
  {
    category: "Backend",
    icon: "◉",
    skills: ["Node.js", "Express", "Socket.io", "RESTful API", "IoT"],
  },
  {
    category: "Database",
    icon: "◎",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "PostGIS"],
  },
  {
    category: "Infrastructure",
    icon: "◇",
    skills: ["Vercel", "Docker", "GitHub Actions", "Neon", "Render"],
  },
  {
    category: "Process",
    icon: "◈",
    skills: ["Agile / Scrum", "Sprint Planning", "Git", "Postman"],
  },
];
```

---

## Layout

### Desktop (≥ 1024px)
```
CSS Grid: repeat(auto-fill, minmax(280px, 1fr))
gap: 1.5rem
```

Each category is a floating card/cluster.

### Mobile (< 768px)
```
Single column, full width
No floating animation (performance)
```

---

## Capsule Card Design

### Card Container
```
background:     rgba(22, 26, 29, 0.6)
border:         1px solid var(--color-border)
border-radius:  1rem
padding:        p-6
position:       relative
overflow:       hidden
```

### Card Header
```
Row: icon (left) + category label (right)
  Icon:     font-heading, text-brand, text-lg
  Category: font-body, text-xs, text-disabled, tracking-widest uppercase
  margin-bottom: mb-4
```

### Skill Capsules
```
Flex wrap, gap-2

Each capsule:
  font-body, text-xs, text-text-secondary
  background: rgba(255, 255, 255, 0.04)
  border: 1px solid rgba(255, 255, 255, 0.08)
  border-radius: 9999px (pill shape)
  padding: px-3 py-1.5
  transition: all 0.3s ease
```

### Capsule Hover
```
background: rgba(164, 22, 26, 0.12)
border-color: rgba(164, 22, 26, 0.4)
color: var(--color-text-primary)
```

---

## Floating Animation

Each category card has a subtle, independent floating motion. This creates the sense of a living system.

```typescript
// Applied to each card with different parameters per card
gsap.to(cardRef.current, {
  y: floatDistance,    // -8px to -16px (varies per card)
  duration: floatDuration,  // 2.5s to 4s (varies per card)
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  delay: floatDelay,   // 0s to 1.5s (staggered start)
});
```

**Variation table (to avoid synchronized bobbing):**

| Category | y distance | duration | delay |
|---|---|---|---|
| Frontend | -12px | 3.2s | 0s |
| Backend | -8px | 2.8s | 0.6s |
| Database | -14px | 3.8s | 1.1s |
| Infrastructure | -10px | 3.0s | 0.3s |
| Process | -8px | 2.5s | 0.9s |

**Rules:**
- Use `sine.inOut` — smooth, organic, never mechanical
- Never use `bounce` or `elastic` ease
- Disable on mobile (`< 768px`) for performance
- Disable with `prefers-reduced-motion`

---

## Scroll Reveal

Cards reveal on scroll with staggered blur reveal:
```typescript
// Stagger each card's reveal
cards.forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, filter: "blur(12px)", y: 30 },
    {
      opacity: 1, filter: "blur(0px)", y: 0,
      duration: 0.8,
      ease: "power4.out",
      delay: i * 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true,
      }
    }
  );
});
```

After reveal completes, start the floating animation for that card.

---

## Hover — Card Level

```
default:  border-color: var(--color-border)
hover:    border-color: rgba(164, 22, 26, 0.3)
          box-shadow: 0 8px 32px rgba(164, 22, 26, 0.08)
transition: 0.3s ease
```

---

## Accessibility

- Category labels are visible text (not just icons)
- Skill capsules are `<span>` elements inside a `<ul>` / `<li>` structure
- Floating animation does not affect readability
- With `prefers-reduced-motion`: no floating, instant reveal

---

## Responsive

| Breakpoint | Layout | Floating |
|---|---|---|
| Mobile < 768px | 1 column | Disabled |
| Tablet 768–1024px | 2 columns | Reduced (half amplitude) |
| Desktop > 1024px | Auto-fill grid | Full |

---

## What NOT to do

- Do not use actual orbit/rotation animations — they look childish
- Do not add skill level bars or percentages — they are subjective and look generic
- Do not add technology logos/icons — no icon library is installed
- Do not make the floating too fast or too large — subtle is the goal
- Do not synchronize all cards to float at the same time — stagger the delays
- Do not add a "Download CV" button here — it belongs in Contact
