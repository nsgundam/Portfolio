# Architecture Spec
> Refactored: May 2026 — lukebaffait.fr reference
> Agent: Read this before touching any file structure or creating new components.
> Cross-reference: design-system.md, interaction-spac.md, Agent.md

---

## 1. Project Overview

Single Page Application. No routing. All navigation via anchor links (`#section-id`).
Cinematic pinned scroll storytelling — each section is a locked cinematic moment
before the scroll releases. The user earns every section.

**Stack (locked — do not change):**

| Layer | Package | Version |
|---|---|---|
| Framework | React + Vite | React 19, Vite 8 |
| Language | TypeScript | ~6.0 |
| Animation | GSAP + ScrollTrigger | ^3.15 |
| Smooth Scroll | Lenis | ^1.3 |
| Text Splitting | Splitting.js | ^1.1 |
| Styling | Tailwind CSS v4 | ^4.2 |
| Linting | ESLint flat config | ^10 |

---

## 2. Folder Structure

```
frontend/
  src/
    components/
      cursor/
        CustomCursor.tsx          ← unchanged — already polished
      navbar/
        Navbar.tsx                ← warm tint update only
      preloader/
        Preloader.tsx             ← unchanged — already polished
      sections/
        Hero.tsx                  ← pin upgrade + display font
        About.tsx                 ← full rewrite — typographic, no grid
        Projects.tsx              ← full rewrite — full-screen stacked panels
        Skills.tsx                ← full rewrite — two groups, no floating cards
        Contact.tsx               ← copy update + font update only
      ui/
        ScrollProgress.tsx        ← accent color update only
        MagneticButton.tsx        ← unchanged
        BlurReveal.tsx            ← unchanged
        ProjectPanel.tsx          ← NEW — single full-screen project component
    hooks/
      useLenis.ts                 ← unchanged
      useScrollReveal.ts          ← unchanged (still used for Contact)
      useMagneticHover.ts         ← unchanged
      useBlurReveal.ts            ← unchanged
      usePinnedTimeline.ts        ← NEW — shared pin + scrub timeline hook
    lib/
      gsap.ts                     ← add depthReveal export
    types/
      index.ts                    ← Project type update
    App.tsx                       ← unchanged structure
    main.tsx                      ← unchanged
    index.css                     ← full token update (warm palette + new fonts)
```

### File Rules (unchanged from before, plus new ones)

- Never import `gsap` directly — always use `../../lib/gsap`
- Never create a second GSAP registration file
- Never add `tailwind.config.js` — tokens live in `index.css @theme`
- Never use `@studio-freight/lenis` — use `"lenis"` only
- Never hardcode hex values — always use CSS token (`text-accent`, `var(--color-accent)`)
- Never pin more than one section at a time (GSAP ScrollTrigger limitation)
- Always add `anticipatePin: 1` to every pinned ScrollTrigger

---

## 3. Component Hierarchy (unchanged structure)

```
App
├── AmbientBackground          (fixed, z-[-1])
├── CustomCursor               (fixed, z-[9999])
├── ScrollProgress             (fixed, z-30, bottom edge)
├── Preloader                  (fixed, z-50)
├── Navbar                     (fixed, z-40)
└── main
    ├── Hero                   (section #hero    — pinned +=500)
    ├── About                  (section #about   — pinned +=900)
    ├── Projects               (section #projects — each panel pinned +=700)
    ├── Skills                 (section #skills  — pinned +=400)
    └── Contact                (section #contact — no pin, normal scroll)
```

**Z-index ladder (do not break this order):**

| Layer | z-index | Component |
|---|---|---|
| Background | -1 | AmbientBackground |
| Sections | 0–9 | All `<section>` elements |
| About panel | 10 | About panel covering Hero |
| Scroll Progress | 30 | ScrollProgress |
| Navbar | 40 | Navbar |
| Mobile menu | 39 | Mobile overlay |
| Preloader | 50 | Preloader |
| Cursor ring | 9998 | CustomCursor ring |
| Cursor dot | 9999 | CustomCursor dot |

---

## 4. New: usePinnedTimeline Hook

This is the single most important new file. Every pinned section uses it.
It encapsulates the ScrollTrigger pin + scrub pattern so sections don't each
reinvent it.

```typescript
// src/hooks/usePinnedTimeline.ts

interface PinOptions {
  pinDistance: number;   // extra scroll distance in px (e.g. 900)
  scrub?: number;        // default: 1.5
  onUpdate?: (progress: number) => void;
}

export function usePinnedTimeline<T extends HTMLElement>(
  enabled: boolean,
  options: PinOptions,
): {
  ref: React.RefObject<T>;
  tl: gsap.core.Timeline | null;  // attach your animations to this timeline
}
```

### Usage Pattern

```typescript
// Inside any pinned section:
const { ref, tl } = usePinnedTimeline<HTMLElement>(preloaderDone, {
  pinDistance: 900,
});

useEffect(() => {
  if (!tl) return;
  tl
    .from(labelRef.current, { opacity: 0, y: 20 })
    .from(headingRef.current, { ...depthRevealVars }, "-=0.3")
    .from(bioLines, { opacity: 0, y: 30, stagger: 0.08 }, "-=0.2");
}, [tl]);
```

The `tl` is pre-connected to ScrollTrigger. You just add animations to it.

---

## 5. New: depthReveal in lib/gsap.ts

Add this export to `src/lib/gsap.ts`:

```typescript
// The global entrance animation — scale + blur + y
// Use this instead of plain fromTo opacity+y everywhere except Contact

export const depthRevealVars = {
  from: {
    opacity: 0,
    scale: 0.88,
    y: 60,
    filter: "blur(8px)",
  },
  to: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    ease: "power4.out",
  },
};

export function depthReveal(
  el: gsap.TweenTarget,
  duration = 1.2,
  delay = 0,
): gsap.core.Tween {
  return gsap.fromTo(el, depthRevealVars.from, {
    ...depthRevealVars.to,
    duration,
    delay,
  });
}
```

---

## 6. State Architecture (unchanged)

```typescript
// App.tsx — same as before
const [preloaderDone, setPreloaderDone] = useState(false);
```

`preloaderDone` passed as prop to every section with animations.
No ScrollTrigger initializes before `preloaderDone === true`.

---

## 7. Animation Architecture

### Pinned Scrub vs Triggered

There are now two animation modes. Know which to use:

| Mode | When | How |
|---|---|---|
| **Pinned + Scrub** | Hero, About, Projects, Skills — major sections | `usePinnedTimeline` + timeline added to scrubbed ST |
| **Triggered + Time** | Contact terminal lines, navbar, preloader, cursor | `useEffect` with `gsap.timeline()`, not scrubbed |

Never mix modes in the same section.
Never apply scrub to the preloader or cursor — those are time-based.

### GSAP Context Pattern (unchanged)

Every component wraps animations in `gsap.context()` and returns `ctx.revert()`.

```typescript
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, ref);
  return () => ctx.revert();
}, [preloaderDone]);
```

### ScrollTrigger Refresh

Call `ScrollTrigger.refresh()` in App.tsx after `preloaderDone` flips true.
This is already implemented — do not remove it.

---

## 8. New: ProjectPanel Component

Extract the single project panel into its own component.
Projects.tsx maps over the PROJECTS array and renders `<ProjectPanel>` for each.

```typescript
// src/components/ui/ProjectPanel.tsx

interface ProjectPanelProps {
  project: Project;
  index: number;
  preloaderDone: boolean;
}
```

Each panel manages its own pin via `usePinnedTimeline`.
This keeps Projects.tsx clean — it's just a container and data source.

---

## 9. Font Registration in index.css

```css
@theme {
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-label:   "Space Mono", monospace;
  --font-body:    "IBM Plex Mono", monospace;
}
```

Tailwind utility classes this creates:
- `font-display` → Cormorant Garamond (headings)
- `font-label` → Space Mono (was `font-heading` — rename this)
- `font-body` → IBM Plex Mono (unchanged)

**Breaking change:** `font-heading` is renamed to `font-label`.
Do a global find-replace: `font-heading` → `font-label` everywhere
EXCEPT section H1/H2 which should now use `font-display`.

---

## 10. Responsive Breakpoints (unchanged)

| Breakpoint | Behavior |
|---|---|
| Mobile `< 768px` | Disable custom cursor, simplify hover, hamburger nav, single-column |
| Tablet `768px–1024px` | Reduce pin distances by 40%, 2-column grids |
| Desktop `> 1024px` | Full cinematic experience, all pins active |

### Pin Distance on Mobile

On mobile, pinning feels claustrophobic. Reduce distances:

```typescript
const isMobile = window.matchMedia("(max-width: 767px)").matches;
const PIN_DISTANCE = isMobile ? pinDistance * 0.5 : pinDistance;
```

This is already partially handled in `usePinnedTimeline` — implement it there.

---

## 11. Accessibility Rules (unchanged + additions)

- All animated text has `aria-label` with clean readable text
- Splitting.js char/word spans are decorative — parent has `aria-label`
- `prefers-reduced-motion`: all GSAP skips to final state
- All interactive elements keyboard-navigable
- WCAG AA minimum contrast (warm cream on warm black passes)
- Pinned sections: add `aria-live="polite"` to content that changes during scrub

---

## 12. Performance Rules

Same as before, plus:

- Pin containers must have `will-change: transform` only while actively pinned
- Remove `will-change` after pin completes via `onLeave` callback
- Max simultaneous pinned sections: 1
- `anticipatePin: 1` on all ScrollTrigger pins — prevents layout jump

---

## 13. File Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Section IDs: `kebab-case` (`#hero`, `#about`, `#projects`, `#skills`, `#contact`)
- New rule: no `V2`, `New`, or `Refactored` suffixes — refactor in place