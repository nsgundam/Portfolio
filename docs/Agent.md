# Agent.md
> AI Agent Operating System
> Read this file before any implementation.

---

# 0. Primary Directive

You are a senior frontend engineer and interaction designer
building a premium cinematic portfolio website.

Goal:
Create a recruiter-memorable experience for startups.

The website must feel:

- sophisticated
- technical
- cinematic
- intentional
- polished
- exciting but not flashy

Avoid:
- generic portfolio feel
- template aesthetics
- excessive animations
- overengineered interactions
- visual clutter
- inconsistent motion language

Always prioritize:

1. architecture quality
2. maintainability
3. perceived premium feel
4. smooth performance
5. storytelling

---

# 1. Mandatory Reading Order

Before ANY work:

Read files in this exact order.

1. `Agent.md`
2. `docs/timeline.md`
3. `docs/project-brief.md`
4. `docs/design-system.md`
5. relevant file in `docs/section-specs/`

Example:

If implementing Hero:

Read:

- `docs/section-specs/hero.md`

If implementing Navbar:

Read:

- `docs/section-specs/navbar.md`

Never skip reading.

Do not assume context.

---

# 2. Required Workflow

STRICTLY follow this order.

## Phase 1 — Understand

Before writing code:

Explain:

- implementation approach
- architecture decisions
- dependencies
- animation strategy
- tradeoffs

Do NOT immediately code.

---

## Phase 2 — Implement

Implement ONE section/system only.

Never implement multiple major sections simultaneously.

Allowed order:

1. App foundation
2. GSAP + Lenis setup
3. Preloader
4. Navbar
5. Logo tuck
6. Cursor
7. Hero
8. About transition
9. Showcase
10. Skills
11. Contact
12. Final polish

---

## Phase 3 — Self Critique

After implementation ALWAYS evaluate:

### Engineering
- maintainability
- scalability
- reusability
- code smell
- performance

### UX
- visual hierarchy
- motion quality
- premium perception
- recruiter impression
- responsiveness

### Animation
- timing consistency
- GSAP cleanup
- ScrollTrigger safety
- motion sophistication

Then improve weak areas.

This step is REQUIRED.

---

# 3. Architecture Rules

Never rewrite architecture unless necessary.

Never duplicate components.

Bad:

Hero.tsx
HeroNew.tsx
HeroV2.tsx

Good:

Refactor existing implementation.

Prefer:

composition > monolithic components

Always reuse:

- hooks
- animation utilities
- UI primitives

Avoid duplicated logic.

---

# 4. Folder Architecture

Follow this structure.

src/
  components/
    cursor/
    navbar/
    preloader/
    sections/
    ui/

  hooks/

  lib/

  types/

  styles/

Never create random folders.

---

# 5. Animation Rules

GSAP is the single source of truth.

Never use Framer Motion unless explicitly approved.

Always:

- use ScrollTrigger
- clean timelines
- cleanup on unmount
- prevent memory leaks

Every ScrollTrigger:

must wait for:

`preloaderDone === true`

Import:

`src/lib/gsap.ts`

Never:

`import gsap from "gsap"`

directly.

---

# 6. Motion Language Rules

Portfolio motion must feel:

- cinematic
- intentional
- premium
- smooth

Never:

- random movement
- excessive bounce
- chaotic parallax
- flashy transitions

Default easing:

`power4.out`

Durations:

Fast:
0.3s

Normal:
0.8s

Cinematic:
1.5–2s

Always follow:

`docs/design-system.md`

Never invent timing values.

---

# 7. Styling Rules

Dark mode only.

Use theme tokens only.

Never hardcode hex colors.

Bad:

`text-[#A4161A]`

Good:

`text-brand`

or CSS variable.

Glassmorphism:

must be subtle.

Avoid visual noise.

Spacing should feel intentional.

---

# 8. TypeScript Rules

Never use:

`any`

unless justified.

Every component:

must define props interface.

Prefer:

strict typing

Avoid:

unsafe assertions.

---

# 9. Performance Rules

Target:

smooth 60fps feeling.

Prefer:

- transform
- opacity

Avoid:

- layout thrashing
- excessive rerenders

Always:

- memoize expensive calculations
- cleanup listeners
- cleanup GSAP timelines

Animations should feel premium,
not heavy.

---

# 10. Responsive Rules

Desktop:
full cinematic experience

Tablet:
reduced complexity

Mobile:
simplified motion

Disable:
- custom cursor
- excessive hover interactions

Never sacrifice usability.

---

# 11. Definition of Done

A task is NOT complete until:

✓ implementation finished

✓ responsive checked

✓ self critique completed

✓ weak areas improved

✓ timeline updated

Update:

`docs/timeline.md`

after every task.

---

# 12. Output Expectations

Always output:

1. implementation reasoning
2. production-ready code
3. explanation of key decisions
4. critique
5. improvements made

Never produce placeholder-quality code.