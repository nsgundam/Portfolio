# Architecture Spec
> AI Agent: Read this before touching any file structure or creating new components.
> Cross-reference: `design-system.md`, `ai-rules.md`, `Agent.md`

---

## 1. Project Overview

Single Page Application. No routing. All navigation via anchor links (`#section-id`).
Cinematic scroll storytelling — the page is one continuous narrative, not a collection of pages.

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
        CustomCursor.tsx          ← Spring-physics cursor (desktop only)
      navbar/
        Navbar.tsx                ← Glassmorphism floating navbar + logo tuck
      preloader/
        Preloader.tsx             ← Cinematic 0→100 counter + slide-up exit
      sections/
        Hero.tsx                  ← Immersive entry — char/word stagger reveal
        About.tsx                 ← Sticky slide-up panel covering Hero
        Projects.tsx              ← Bento grid showcase
        Skills.tsx                ← Floating tech capsules
        Contact.tsx               ← Terminal-inspired contact interface
      ui/
        ScrollProgress.tsx        ← Horizontal progress bar (bottom edge)
        MagneticButton.tsx        ← Reusable magnetic CTA wrapper
        BlurReveal.tsx            ← Reusable blur-to-focus reveal wrapper
      AmbientBackground.tsx       ← Fixed ambient orbs + SVG noise layer
    hooks/
      useLenis.ts                 ← Lenis init + GSAP ticker bridge
      useScrollReveal.ts          ← Reusable ScrollTrigger fade+slide reveal
      useMagneticHover.ts         ← Magnetic hover logic (extracted hook)
      useBlurReveal.ts            ← Blur reveal animation hook
    lib/
      gsap.ts                     ← GSAP + ScrollTrigger registration (single source)
    types/
      index.ts                    ← Shared TypeScript interfaces
    App.tsx
    main.tsx
    index.css                     ← Tailwind v4 @theme tokens
```

**Rules:**
- Never import `gsap` directly from `"gsap"` — always use `"../../lib/gsap"` (or relative equivalent)
- Never create a second GSAP registration file
- Never add `tailwind.config.js` — tokens live in `index.css @theme`
- Never use `@studio-freight/lenis` — use `"lenis"` only

---

## 3. Component Hierarchy

```
App
├── AmbientBackground          (fixed, z-[-1])
├── CustomCursor               (fixed, z-[9999])
├── ScrollProgress             (fixed, z-30, bottom edge)
├── Preloader                  (fixed, z-50 — unmounts after exit)
├── Navbar                     (fixed, z-40)
└── main
    ├── Hero                   (section #hero)
    ├── About                  (section #about — sticky slide-up)
    ├── Projects               (section #projects)
    ├── Skills                 (section #skills)
    └── Contact                (section #contact)
```

**Z-index ladder (never break this order):**

| Layer | z-index | Component |
|---|---|---|
| Background | -1 | AmbientBackground |
| Sections | 0–9 | All `<section>` elements |
| About panel | 10 | About (when covering Hero) |
| Scroll Progress | 30 | ScrollProgress |
| Navbar | 40 | Navbar |
| Mobile menu | 39 | Mobile overlay (below navbar) |
| Preloader | 50 | Preloader |
| Cursor ring | 9998 | CustomCursor ring |
| Cursor dot | 9999 | CustomCursor dot |

---

## 4. State Architecture

Minimal state. No global store. No Context API needed.

**App-level state:**

```typescript
// App.tsx
const [preloaderDone, setPreloaderDone] = useState(false);
```

`preloaderDone` is passed as a prop to every component that has ScrollTrigger animations.
**Rule:** No ScrollTrigger may initialize before `preloaderDone === true`.

**Component-level state only:**
- `Navbar`: `scrolled` (boolean), `menuOpen` (boolean)
- No other components need local state — animation is handled entirely by GSAP refs

---

## 5. Animation Architecture

### Single Source of Truth
All GSAP imports come from `src/lib/gsap.ts`. This file registers ScrollTrigger once.

### GSAP Context Pattern
Every component that uses GSAP must wrap animations in `gsap.context()` and return `ctx.revert()` from the cleanup function.

```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    // animations here
  });
  return () => ctx.revert();
}, [dependency]);
```

### ScrollTrigger Gating
All ScrollTrigger animations must be inside a `useEffect` that depends on `preloaderDone`:

```typescript
useEffect(() => {
  if (!preloaderDone) return;
  // ScrollTrigger setup here
}, [preloaderDone]);
```

### Hook Reuse Policy
- `useScrollReveal` — use for standard fade+slide section reveals
- `useMagneticHover` — use for all magnetic CTA buttons (do not inline magnetic logic)
- `useBlurReveal` — use for blur-to-focus transitions
- Never duplicate animation logic across components

---

## 6. Styling Architecture

### Tailwind v4 Token System
All design tokens are defined in `src/index.css` inside `@theme {}`.
Use Tailwind utility classes (`bg-brand`, `text-text-primary`, etc.) in components.
Never use raw hex values in component files.

**Available tokens:**

```css
--color-bg: #0b090a
--color-surface: #161a1d
--color-border: #2a2d30
--color-brand: #a4161a
--color-accent: #a4161a
--color-brand-light: #e5383b
--color-text-primary: #f5f3f4
--color-text-secondary: #6b7280
--color-text-disabled: #3d4147

--font-heading: "Space Mono", monospace
--font-body: "IBM Plex Mono", monospace
```

### Glassmorphism Token
When applying glassmorphism, always use these exact values:
```
background: rgba(22, 26, 29, 0.5)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.08)
```
Use selectively. Never apply to more than 2 elements visible at once.

---

## 7. Performance Rules

- Use `gsap.set()` for initial states (not CSS transitions)
- Use `transform` and `opacity` only — never animate `width`, `height`, `top`, `left`
- Use `will-change: transform` only on elements actively animating
- Clean up all GSAP contexts on component unmount
- Use `ScrollTrigger.refresh()` after layout changes
- Lazy render sections below the fold where possible
- Target 60fps — profile with Chrome DevTools before shipping

---

## 8. Accessibility Rules

- All animated text must have `aria-label` with clean readable text
- Splitting.js char/word spans are decorative — mark parent with `aria-label`
- Respect `prefers-reduced-motion`: wrap all non-essential animations in a motion check
- All interactive elements must be keyboard-navigable
- Color contrast must meet WCAG AA minimum

```typescript
// Motion check pattern
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  // run animation
}
```

---

## 9. Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| Mobile `< 768px` | Disable custom cursor, simplify hover effects, hamburger nav, single-column layouts |
| Tablet `768px–1024px` | Reduce motion complexity, 2-column grids where applicable |
| Desktop `> 1024px` | Full cinematic experience, all effects active |

Custom cursor is gated by `(pointer: fine)` media query — not breakpoint.

---

## 10. File Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Utilities/lib: `camelCase.ts`
- Types: `index.ts` in `types/` folder
- Section IDs: `kebab-case` matching component name (`#hero`, `#about`, `#projects`, `#skills`, `#contact`)
