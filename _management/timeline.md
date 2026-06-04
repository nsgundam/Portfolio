# Timeline & Progress Tracker
>
> อัปเดตไฟล์นี้ทุกครั้งหลังทำงานเสร็จในแต่ละ step

---

## 🔴 Current Status

```bash
Sprint:   Sprint 5 — Refactor (lukebaffait.fr style)
Step:     Docs rewritten → ready to implement
Blocker:  ไม่มี
```

---

## ✅ Completed (Sprint 1–4)

- [x] Project setup (Vite + React + TS + Tailwind v4 + GSAP + Lenis)
- [x] All sections built (Hero, About, Projects, Skills, Contact)
- [x] Preloader — cinematic counter + slide-up exit
- [x] Custom cursor — suck-in + spring emerge
- [x] Navbar — glassmorphism pill + logo tuck + rolling text
- [x] Hero text reveal — char stagger from blur
- [x] About sticky slide-up panel
- [x] Scroll progress line
- [x] Magnetic hover (Hero CTA + Contact email)
- [x] BlurReveal (Contact terminal)
- [x] Responsive — hamburger menu + mobile layout
- [x] prefers-reduced-motion support
- [x] Image optimization (WebP pipeline)
- [x] Meta tags + OG image
- [x] Lighthouse: 92 / 96 / 100 / 100

---

## 🔄 Sprint 5 — Refactor (Do in this exact order)

### Step 00 — Docs (✅ Done)

- [x] `design-system.md` — warm palette, Cormorant Garamond, depth tokens
- [x] `project-brief.md` — identity line, copy rewrites, section specs
- [x] `architecture-spac.md` — pinning architecture, new hook, font rename
- [x] `interaction-spac.md` — per-section scroll choreography
- [x] `decision.md` — DEC-011 through DEC-017
- [x] `timeline.md` — this file

### Step 01 — Tokens + Font (do first, unblocks everything)

- [x] Update `index.css` @theme — warm palette, new font tokens
- [x] Update `index.html` — add Cormorant Garamond to Google Fonts import
- [x] Global find-replace: `font-heading` → `font-label` or `font-display`
- [x] Global find-replace: `text-brand`, `border-brand`, `bg-brand` → `text-accent` etc.
- [x] Update Navbar warm tint: `rgba(22,26,29,0.65)` → `rgba(22,20,17,0.65)`
- [x] Verify Preloader still looks correct with new tokens

### Step 02 — New Hook + lib/gsap export

- [x] Build `src/hooks/usePinnedTimeline.ts` (see interaction-spac.md §6)
- [x] Add `depthReveal()` and `depthRevealVars` export to `src/lib/gsap.ts`
- [x] Test hook in isolation before attaching to any section

### Step 03 — Hero pin upgrade

- [ ] Replace time-based useEffect timeline → `usePinnedTimeline(preloaderDone, { pinDistance: 500 })`
- [ ] Update name typography: `font-display`, Display XL, fontWeight 300
- [ ] Add italic to "matters." in tagline
- [ ] Verify preloader → hero handoff still works

### Step 04 — About full rewrite

- [ ] Remove three-column grid
- [ ] Remove photo placeholder
- [ ] New DOM structure (see interaction-spac.md §8)
- [ ] Add individual refs for bio line stagger
- [ ] Attach `usePinnedTimeline(preloaderDone, { pinDistance: 900 })`
- [ ] Wire scrubbed timeline: label → heading depthReveal → lines → facts

### Step 05 — Projects full rewrite

- [ ] Delete `ProjectWindow.tsx`
- [ ] Create `src/components/ui/ProjectPanel.tsx` (see interaction-spac.md §9)
- [ ] Rewrite `Projects.tsx` as container that maps → `<ProjectPanel>`
- [ ] Update PROJECTS data with new copy (see project-brief.md §07)
- [ ] Each panel: `usePinnedTimeline(preloaderDone, { pinDistance: 700 })`
- [ ] Add giant faint background number

### Step 06 — Skills rewrite

- [ ] Remove SKILL_GROUPS + FLOAT_CONFIG + floating animation
- [ ] New two-group layout (see interaction-spac.md §10)
- [ ] Attach `usePinnedTimeline(preloaderDone, { pinDistance: 400 })`
- [ ] Wire scrubbed timeline: heading → group 1 → group 2

### Step 07 — Contact font update

- [ ] Heading → `font-display`
- [ ] Email CTA → `font-display` weight 300
- [ ] "Connect." italic
- [ ] Terminal + boot lines: unchanged

### Step 08 — Full QA pass

- [ ] Scroll through every section on desktop — check pin timing feels right
- [ ] Check mobile (375px) — pins should feel shorter, not claustrophobic
- [ ] Check tablet (768px) — pin distances 60% of desktop
- [ ] Verify preloader → hero handoff
- [ ] Verify navbar glassmorphism warm tint
- [ ] Verify cursor dot (gold accent via mix-blend-mode)
- [ ] Verify scroll progress line (accent color)
- [ ] Run Lighthouse — target same or better than 92/96/100/100

---

## 📋 Sprint 6 — Deployment (after Sprint 5)

- [ ] `npm run build` — zero errors
- [ ] Deploy to Vercel
- [ ] Custom domain (optional)
- [ ] Vercel Analytics
- [ ] Final QA: Chrome, Safari, Firefox

---

## ⚠️ Breaking Changes in Sprint 5

| File | Change | Risk |
| --- | --- | --- |
| `index.css` | All color tokens change | High — affects every component |
| `index.html` | New font import | Low |
| All components | `font-heading` → `font-label` or `font-display` | Medium — find-replace |
| All components | `text-brand` etc. → `text-accent` | Medium — find-replace |
| `About.tsx` | Full rewrite | High |
| `Projects.tsx` | Full rewrite | High |
| `Skills.tsx` | Full rewrite | High |
| `ProjectWindow.tsx` | Deleted | Medium — just remove import from Projects.tsx |

**Do Step 01 (tokens) before everything else.** It will break the visual — that's expected.
Work through each section in order and it will come back together.

---

## 📝 Agent Update Log

| Date | Session | งานที่ทำ |
| --- | --- | --- |
| Apr 2026 | Planning | Phase 1–3 + Playground + Sprint 1–2 เสร็จสมบูรณ์ |
| May 2026 | AI Agent | Sprint 3–4 animations, responsive, prefers-reduced-motion, image optimization, SEO |
| May 2026 | AI Agent | Full section alignment pass, terminal UI, sticky About, full-screen project panels |
| May 2026 | AI Agent | Sprint 5 docs refactor — lukebaffait.fr reference: design-system, project-brief, architecture-spac, interaction-spac, decision (DEC-011–017), timeline updated |
