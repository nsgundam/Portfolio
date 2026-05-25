# Section Spec — Contact
> AI Agent: Read `design-system.md` and `interaction-spac.md` before implementing.
> Status: ⬜ Needs upgrade — current implementation is a plain link list. Terminal-inspired interface required.

---

## Purpose

The Contact section is the final chapter of the narrative. It should feel like arriving at a developer's workstation — a terminal interface that is both atmospheric and fully functional. The viewer should feel invited to reach out, not just presented with a list of links.

---

## Visual Concept — Communication Terminal

A terminal-inspired interface with:
- A fake boot sequence that plays on scroll entry
- Monospace typography throughout
- Command-line aesthetic without being gimmicky
- Fully functional links (not just decoration)

**Tone:** Developer workstation. Sophisticated. Usable. Not cosplay.

---

## Section Header

```
Section label: "04 / Contact"
  font-body, text-xs, text-brand, tracking-[0.3em] uppercase, mb-4

Heading: "Let's"
         "Connect"  ← second line in text-secondary
  font-heading, clamp(32px, 4vw, 64px), mb-16
```

---

## Terminal Interface

### Container
```
background:     rgba(22, 26, 29, 0.8)
border:         1px solid var(--color-border)
border-radius:  0.75rem
padding:        p-6 sm:p-8
font-family:    IBM Plex Mono (font-body)
max-width:      640px
```

### Terminal Header Bar
```
height: 36px
background: rgba(255, 255, 255, 0.04)
border-bottom: 1px solid var(--color-border)
border-radius: 0.75rem 0.75rem 0 0
padding: px-4

Content (left-aligned):
  Three dots: ● ● ●
  Colors: #FF5F57, #FFBD2E, #28C840  (macOS traffic lights)
  size: 10px each, gap: 6px

Title (centered):
  "narunat@portfolio ~ contact"
  font-body, text-xs, text-disabled
```

### Boot Sequence Lines

These lines type out one by one when the section enters the viewport.

```
Line 1:  "> Initializing contact protocol..."
Line 2:  "> Loading communication channels..."
Line 3:  "> Status: READY"
Line 4:  ""  (empty line)
Line 5:  "> Available commands:"
```

Each line appears with a typewriter effect:
```typescript
// Stagger each line
lines.forEach((line, i) => {
  gsap.fromTo(lineEl,
    { opacity: 0, x: -10 },
    {
      opacity: 1, x: 0,
      duration: 0.4,
      ease: "power2.out",
      delay: i * 0.25,
      scrollTrigger: { trigger: terminal, start: "top 80%", once: true }
    }
  );
});
```

### Command Links

After the boot sequence, display the contact commands:

```
$ email     → snarunat.99@gmail.com
$ github    → github.com/nsgundam
$ linkedin  → linkedin.com/in/narunat-sutthibut
```

Each command line structure:
```
<span class="prompt">$</span>
<span class="command">email</span>
<span class="arrow">→</span>
<a class="value" href="...">snarunat.99@gmail.com</a>
```

**Styling:**
```
prompt:   color: var(--color-brand), font-body, text-sm
command:  color: var(--color-text-primary), font-body, text-sm, mr-4
arrow:    color: var(--color-text-disabled), mx-2
value:    color: var(--color-text-secondary), font-body, text-sm
          hover: color: var(--color-text-primary), underline
```

**Row hover:**
```
background: rgba(255, 255, 255, 0.03)
border-left: 2px solid var(--color-brand)
padding-left: adjusted
transition: 0.2s ease
```

---

## Primary CTA

Above the terminal, a large email CTA using `MagneticButton`:

```
"snarunat.99@gmail.com"
font-heading, clamp(20px, 3vw, 42px), text-primary
hover: text-brand
transition: color 0.3s

Magnetic: STRENGTH 0.3, TRIGGER_PAD 40
```

---

## Cursor Blink

A blinking cursor at the end of the last terminal line:

```
content: "█" or "|"
animation: opacity 0 ↔ 1, 0.8s, step-start, infinite
color: var(--color-brand)
```

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.terminal-cursor {
  animation: blink 0.8s step-start infinite;
}
```

---

## Footer

```
"© 2026 Narunat Sutthibut. Built with React + Vite."
font-body, text-xs, text-disabled
margin-top: mt-20, padding-bottom: pb-8
```

---

## Contact Data

```typescript
const CONTACT_LINKS = [
  {
    command: "email",
    value: "snarunat.99@gmail.com",
    href: "mailto:snarunat.99@gmail.com",
  },
  {
    command: "github",
    value: "github.com/nsgundam",
    href: "https://github.com/nsgundam",
  },
  {
    command: "linkedin",
    value: "linkedin.com/in/narunat-sutthibut",
    href: "https://www.linkedin.com/in/narunat-sutthibut/",
  },
];
```

Note: Fastwork is intentionally excluded (see DEC-006).

---

## Scroll Reveal

The terminal container reveals with blur:
```
from: { opacity: 0, filter: "blur(16px)", y: 40 }
to:   { opacity: 1, filter: "blur(0px)", y: 0 }
duration: 1.0s
ease: power4.out
scrollTrigger: { start: "top 80%", once: true }
```

After the container reveal, the boot sequence lines begin.

---

## Accessibility

- All links have descriptive `aria-label` attributes
- External links have `target="_blank"` and `rel="noopener noreferrer"`
- Terminal is decorative — actual links are real `<a>` elements
- Blinking cursor has `aria-hidden="true"`
- Boot sequence text is readable (not just animation)
- With `prefers-reduced-motion`: skip typewriter, show all lines immediately

---

## Responsive

| Breakpoint | Behavior |
|---|---|
| Mobile | Terminal full width, reduced padding. Boot sequence preserved. |
| Tablet | Same as mobile. |
| Desktop | Terminal max-width 640px, centered or left-aligned. |

---

## What NOT to do

- Do not make the terminal non-functional (links must work)
- Do not add a contact form — it requires a backend
- Do not add a "Download CV" button (no CV file available)
- Do not add Fastwork link (see DEC-006)
- Do not make the boot sequence too long — max 5 lines, max 2s total
- Do not use actual terminal emulation libraries — pure CSS/GSAP only
- Do not add a fake command input field — it implies interactivity that doesn't exist
