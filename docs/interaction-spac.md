# Interaction Spec
> Refactored: May 2026 — lukebaffait.fr reference
> Agent: This file defines all interactive behaviors, scroll choreography, and animation specs.
> Cross-reference: design-system.md, architecture-spac.md

---

## 1. Custom Cursor ✅ Done — do not rewrite

**File:** `src/components/cursor/CustomCursor.tsx`
No changes needed. The suck-in collapse + spring emerge is already polished.
The only update: the cursor dot color pulls from `--color-accent` (now gold, not red).
This happens automatically since the dot uses `bg-white` with `mix-blend-mode: difference`.

---

## 2. Magnetic Hover ✅ Done — do not rewrite

**File:** `src/hooks/useMagneticHover.ts` + `src/components/ui/MagneticButton.tsx`
No changes needed.

```
STRENGTH:      0.3
TRIGGER_PAD:   40px
SNAP_EASE:     back.out(1.4)
SNAP_DURATION: 0.8s
```

---

## 3. Preloader ✅ Done — do not rewrite

**File:** `src/components/preloader/Preloader.tsx`
No changes needed. The preloader counter uses Space Mono (now `font-label`).
Update the class from `font-heading` → `font-label` only.

---

## 4. Navbar ✅ Done — warm tint update only

**File:** `src/components/navbar/Navbar.tsx`
One change only: glassmorphism background warm tint.

```
Old: rgba(22, 26, 29, 0.65)
New: rgba(22, 20, 17, 0.65)   ← warmer, matches new bg
```

Everything else — pill shape, logo tuck, rolling text, mobile menu — unchanged.

---

## 5. Scroll Progress ✅ Done — color token update only

**File:** `src/components/ui/ScrollProgress.tsx`
Change `bg-accent` from red to gold automatically via token update in `index.css`.
No code changes needed.

---

## 6. NEW: usePinnedTimeline Hook ⬜ Build first

**File:** `src/hooks/usePinnedTimeline.ts`
This is the foundation for all section rewrites. Build this before any section.

### Full Implementation Spec

```typescript
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";

interface PinOptions {
  pinDistance: number;
  scrub?: number;        // default 1.5
  start?: string;        // default "top top"
  onComplete?: () => void;
}

export function usePinnedTimeline<T extends HTMLElement>(
  enabled: boolean,
  options: PinOptions,
) {
  const ref = useRef<T>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    if (prefersReducedMotion()) {
      // Skip to final state — no pin, no animation
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const pinDistance = isMobile
      ? options.pinDistance * 0.5
      : options.pinDistance;

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: options.scrub ?? 1.5,
        anticipatePin: 1,
        animation: tl,
        onLeave: options.onComplete,
      });
    }, el);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, [enabled]);   // only re-run when preloaderDone flips

  return { ref, tl: tlRef.current };
}
```

### How Sections Use It

```typescript
// Typical pattern in any section:
const { ref, tl } = usePinnedTimeline<HTMLElement>(preloaderDone, {
  pinDistance: 900,
});

useEffect(() => {
  if (!tl || !labelRef.current) return;
  tl
    .from(labelRef.current, { opacity: 0, y: 20, duration: 0.3 })
    .from(headingRef.current, {
      opacity: 0, scale: 0.88, y: 60, filter: "blur(8px)", duration: 1.2,
    }, "-=0.2")
    .from(bioLines, { opacity: 0, y: 30, stagger: 0.08, duration: 0.8 }, "-=0.4");
}, [tl]);
```

---

## 7. Hero — Pin Upgrade ⬜ Refactor

**File:** `src/components/sections/Hero.tsx`

### What Changes

- Typography: name → `font-display` (Cormorant Garamond), Display XL
- Tagline: add italic to "matters." via `<em>` with `font-display italic`
- Animation: convert from `useEffect` time-based → `usePinnedTimeline` scrubbed

### Scrubbed Timeline Spec

```
Pin distance: +=500px
Scrub: 1.5

Progress 0%  → 15%:  label fades in  { opacity: 0→1, y: 20→0 }
Progress 15% → 55%:  name chars bloom from blur
                     { opacity:0→1, filter:blur(10px)→blur(0), stagger edges }
Progress 55% → 80%:  tagline words slide up from overflow
                     { y:"100%"→"0%", opacity:0→1 }
Progress 80% → 100%: scroll indicator fades in { opacity:0→1 }
```

### Typography Update (Hero only)

```tsx
// Label stays font-label
<span className="font-label text-accent text-xs tracking-[0.3em] uppercase">
  Full Stack Developer
</span>

// Name changes to font-display
<h1
  ref={nameRef}
  aria-label="Narunat Sutthibut"
  className="font-display text-text-primary leading-none tracking-tight"
  style={{ fontSize: "clamp(64px, 12vw, 160px)", fontWeight: 300 }}
>
  Narunat Sutthibut
</h1>

// Tagline — italic "matters."
<p className="font-body text-text-secondary max-w-md text-sm leading-relaxed">
  Aiming high, building what{" "}
  <em className="font-display not-italic" style={{ fontStyle: "italic" }}>
    matters.
  </em>
</p>
```

---

## 8. About — Full Typographic Rewrite ⬜ Refactor

**File:** `src/components/sections/About.tsx`

### What Changes

- Remove three-column grid entirely
- Remove photo placeholder
- Remove all bordered boxes
- New layout: full-width, generous vertical rhythm, type-only
- Add `usePinnedTimeline` with `+=900`

### DOM Structure (new)

```tsx
<div ref={ref} className="min-h-screen flex flex-col justify-center
  px-[clamp(24px,6vw,120px)] py-[clamp(80px,12vh,160px)]">

  {/* Section label */}
  <p ref={labelRef} className="font-label text-accent text-xs
    tracking-[0.3em] uppercase mb-12">
    01 / About
  </p>

  {/* Giant heading — display font, two lines */}
  <h2 ref={headingRef} className="font-display text-text-primary
    leading-[1.05] mb-16"
    style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 300 }}>
    Agile Technical<br />
    <em style={{ fontStyle: "italic" }}>Explorer.</em>
  </h2>

  {/* Bio — three lines, each a separate ref for stagger */}
  <div ref={bioRef} className="max-w-160 space-y-4 mb-20">
    <p ref={line1Ref} className="font-body text-text-secondary text-base leading-[1.8]">
      A developer driven by curiosity and a problem-solving mindset.
    </p>
    <p ref={line2Ref} className="font-body text-text-secondary text-base leading-[1.8]">
      I work at the intersection of efficient architecture and sophisticated
      visuals — building systems that are both fast and intentional.
    </p>
    <p ref={line3Ref} className="font-body text-text-secondary text-base leading-[1.8]">
      Currently in my final year, looking for a team that moves with purpose.
    </p>
  </div>

  {/* Facts row — no borders, just spacing */}
  <div ref={factsRef} className="flex flex-col sm:flex-row gap-10">
    {FACTS.map(({ label, value }) => (
      <div key={label} className="flex flex-col gap-2">
        <span className="font-label text-text-disabled text-xs tracking-[0.25em] uppercase">
          {label}
        </span>
        <span className="font-body text-text-primary text-sm">{value}</span>
      </div>
    ))}
  </div>
</div>
```

### Pinned Timeline Spec

```
Pin distance: +=900px
Scrub: 1.5

0%  → 10%:  panel slides up from 100vh (the existing scrub behavior — keep)
10% → 20%:  label fades in { opacity:0→1, y:20→0 }
20% → 45%:  heading depthReveal { opacity:0→1, scale:0.88→1, blur:8→0, y:60→0 }
45% → 60%:  bio line 1 { opacity:0→1, y:30→0 }
60% → 72%:  bio line 2 { opacity:0→1, y:30→0 }
72% → 82%:  bio line 3 { opacity:0→1, y:30→0 }
82% → 100%: facts row slides in { opacity:0→1, x:-20→0, stagger:0.1 }
```

### Visual Treatment (keep from existing)

```
Panel background:  rgba(22, 20, 17, 0.96)   ← warmer tint
Top border:        1px solid rgba(255,255,255,0.06)
Top corners:       border-radius: 24px 24px 0 0
Box shadow:        0 -20px 60px rgba(0,0,0,0.5)
```

---

## 9. Projects — Full-Screen Stacked ⬜ Full Rewrite

**File:** `src/components/sections/Projects.tsx`
**New File:** `src/components/ui/ProjectPanel.tsx`

### Architecture

Projects.tsx maps over PROJECTS array, renders one `<ProjectPanel>` per project.
Each ProjectPanel is a full-screen section with its own `usePinnedTimeline(+=700)`.

### ProjectPanel DOM Structure

```tsx
<section
  ref={ref}
  className="min-h-screen flex flex-col justify-center
    px-[clamp(24px,6vw,120px)] relative overflow-hidden"
>
  {/* Project number — top left, very faint */}
  <span ref={numberRef} className="font-label text-text-disabled text-xs
    tracking-[0.3em] uppercase mb-8 block">
    {project.number}
  </span>

  {/* Project name — huge, display font */}
  <h2 ref={nameRef} className="font-display text-text-primary leading-[1.05] mb-4"
    style={{ fontSize: "clamp(48px, 8vw, 110px)", fontWeight: 300 }}>
    {project.title}
  </h2>

  {/* Subtitle / one-liner — italic display */}
  <p ref={subtitleRef} className="font-display text-text-secondary mb-10"
    style={{
      fontSize: "clamp(20px, 3vw, 36px)",
      fontWeight: 300,
      fontStyle: "italic",
    }}>
    {project.subtitle}
  </p>

  {/* Description — body copy */}
  <p ref={descRef} className="font-body text-text-secondary text-sm
    leading-[1.8] max-w-140 mb-10">
    {project.description}
  </p>

  {/* Stack — comma-separated inline, no pill tags */}
  <p ref={stackRef} className="font-label text-text-disabled text-xs
    tracking-[0.2em] uppercase mb-10">
    {project.stack.join(" · ")}
  </p>

  {/* Link */}
  <a ref={linkRef} href={project.link} target="_blank" rel="noopener noreferrer"
    className="font-label text-accent text-xs tracking-[0.25em] uppercase
    inline-flex items-center gap-3 hover:text-accent-light transition-colors">
    {project.linkType === "Live" ? "View Live" : "View on GitHub"}
    <span>→</span>
  </a>

  {/* Giant background number — decorative depth */}
  <div className="pointer-events-none absolute right-[clamp(24px,6vw,80px)]
    top-1/2 -translate-y-1/2 font-display text-text-primary select-none"
    style={{
      fontSize: "clamp(120px, 22vw, 320px)",
      fontWeight: 300,
      opacity: 0.03,
      lineHeight: 1,
    }}
    aria-hidden="true">
    {project.number}
  </div>
</section>
```

### ProjectPanel Pinned Timeline Spec

```
Pin distance: +=700px
Scrub: 1.5

0%  → 12%:  project number fades { opacity:0→1 }
12% → 40%:  project name depthReveal { scale:0.88→1, blur:8→0, y:60→0 }
40% → 55%:  subtitle italic slides in { opacity:0→1, y:20→0 }
55% → 72%:  description body reveals { opacity:0→1, y:20→0 }
72% → 85%:  stack text fades in { opacity:0→1 }
85% → 100%: link arrow appears { opacity:0→1, x:-10→0 }
```

### Background Number

The giant faint `{project.number}` behind the content adds depth without being decorative.
It echoes lukebaffait's use of typographic scale for spatial tension.
`opacity: 0.03` — barely visible, but you feel it's there.

---

## 10. Skills — Two Groups, No Cards ⬜ Rewrite

**File:** `src/components/sections/Skills.tsx`

### What Changes

- Remove all floating animation cards
- Remove five-category grid
- New layout: two groups, generous spacing, type only
- Add `usePinnedTimeline(+=400)`

### DOM Structure

```tsx
<section ref={ref} className="min-h-screen flex flex-col justify-center
  px-[clamp(24px,6vw,120px)]">

  {/* Section label */}
  <p className="font-label text-accent text-xs tracking-[0.3em] uppercase mb-12">
    03 / Skills
  </p>

  {/* Section heading */}
  <h2 ref={headingRef} className="font-display text-text-primary leading-[1.05] mb-20"
    style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 300 }}>
    Tech<br />
    <em style={{ fontStyle: "italic" }}>Stack.</em>
  </h2>

  {/* Two groups — side by side on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-200">

    {/* Group 1 */}
    <div ref={group1Ref}>
      <p className="font-display text-text-secondary mb-6"
        style={{ fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 300 }}>
        Shipped with
      </p>
      <p className="font-body text-text-primary text-sm leading-[2.2]">
        Next.js · React · TypeScript<br />
        Node.js · Express · Socket.io<br />
        PostgreSQL · PostGIS · Prisma ORM<br />
        Tailwind CSS · GSAP · Lenis<br />
        Git · GitHub Actions · Vercel
      </p>
    </div>

    {/* Group 2 */}
    <div ref={group2Ref}>
      <p className="font-display text-text-secondary mb-6"
        style={{ fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 300,
                 fontStyle: "italic" }}>
        Learning with
      </p>
      <p className="font-body text-text-primary text-sm leading-[2.2]">
        Docker · MongoDB · MySQL<br />
        Agile / Scrum · Postman
      </p>
    </div>
  </div>
</section>
```

### Pinned Timeline Spec

```
Pin distance: +=400px
Scrub: 1.5

0%  → 20%:  label + heading depthReveal
20% → 60%:  "Shipped with" group reveals { opacity:0→1, y:40→0 }
60% → 100%: "Learning with" group reveals { opacity:0→1, y:40→0 }
```

---

## 11. Contact — Font Update Only ⬜ Minor Update

**File:** `src/components/sections/Contact.tsx`

### What Changes

- Heading "Let's Connect." → `font-display` for "Connect"
- Email CTA MagneticButton → `font-display` weight 300, larger size
- Terminal section: unchanged
- Copy: unchanged (already updated in project-brief.md)
- No pinning — Contact scrolls normally

```tsx
// Heading update
<h2 className="font-display text-text-primary leading-[1.05] mb-16"
  style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 300 }}>
  Let's<br />
  <em style={{ fontStyle: "italic" }}>Connect.</em>
</h2>

// Email CTA update
<MagneticButton
  href="mailto:snarunat.99@gmail.com"
  className="font-display text-text-primary mb-16 block leading-none
    hover:text-accent"
  style={{ fontSize: "clamp(24px, 3.5vw, 52px)", fontWeight: 300,
           transition: "color 0.3s" }}>
  snarunat.99@gmail.com
</MagneticButton>
```

---

## 12. Blur Reveal ✅ Done — no changes

**File:** `src/hooks/useBlurReveal.ts` + `src/components/ui/BlurReveal.tsx`
Still used in Contact for the terminal reveal.
Not used in About/Projects/Skills anymore — those use `usePinnedTimeline` + depthReveal directly.

---

## 13. Scroll Reveal (Standard) ✅ Done — no changes

**File:** `src/hooks/useScrollReveal.ts`
Still used for Contact section (not pinned).
No changes needed.

---

## 14. Preloader → Hero Handoff ✅ Done — no changes

Sequence is already polished. The Hero reveal now starts from the pinned timeline
instead of a standalone `useEffect` timeline, but the handoff timing is the same:
`onComplete()` fires → `preloaderDone = true` → Hero pin initializes.

---

## 15. Keyboard & Focus Management ✅ Done — no changes

- Mobile menu focus trap — implemented
- Escape closes menu — implemented
- Skip-to-content link — implemented
- All interactive elements keyboard-navigable