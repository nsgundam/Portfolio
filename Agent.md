# Agent.md
> AI Agent Entry Point — อ่านไฟล์นี้ก่อนทำงานทุกครั้ง

## คำสั่งสำหรับ Agent

1. **อ่านไฟล์นี้ก่อนเสมอ** ก่อนทำงานใดๆ
2. **อ่าน `docs/timeline.md`** เพื่อเข้าใจว่าทำอะไรไปแล้วบ้าง
3. **อ่าน `docs/project-brief.md`** เพื่อเข้าใจ goal และ identity ของ project
4. **อ่าน `docs/design-system.md`** ก่อนแตะ UI หรือ animation ใดๆ
5. **อัปเดต `docs/timeline.md`** ทุกครั้งหลังทำงานเสร็จ

---

## Project Overview

| Field | Value |
|---|---|
| Project | Personal Portfolio Website |
| Owner | Narunat Sutthibut |
| Stack | React + Vite + TypeScript + Tailwind v4 + GSAP + Lenis |
| Deadline | 31 May 2026 |
| Deploy | Vercel |
| Repo | (ใส่ GitHub URL ที่นี่) |

---

## Current Sprint

> **Sprint 3 — Animation Layer** (กำลังทำอยู่)

ดูรายละเอียดและ checklist ใน `docs/timeline.md`

---

## โครงสร้างไฟล์ docs/

```
docs/
  CLAUDE.md          ← ไฟล์นี้ — อ่านก่อนเสมอ
  timeline.md        ← history + current status + next steps
  project-brief.md   ← goal, identity, content, effects, references
  design-system.md   ← colors, typography, spacing, animation tokens
  decisions.md       ← บันทึกการตัดสินใจสำคัญและเหตุผล
```

---

## โครงสร้าง Source Code

```
src/
  components/
    cursor/           CustomCursor.tsx
    navbar/           Navbar.tsx
    preloader/        Preloader.tsx
    sections/         Hero.tsx, About.tsx, Projects.tsx, Skills.tsx, Contact.tsx
    ui/               MagneticButton.tsx, TextReveal.tsx, BlurReveal.tsx, ScrollProgress.tsx
  hooks/
    useLenis.ts       Lenis smooth scroll setup
    useScrollReveal.ts  reusable ScrollTrigger reveal hook
  lib/
    gsap.ts           GSAP + ScrollTrigger registration — import จากนี้เสมอ
  types/
    index.ts
  App.tsx
  index.css           Tailwind v4 @theme tokens
```

---

## Rules ที่ Agent ต้องรู้

### Animation
- Import `gsap` จาก `src/lib/gsap.ts` เท่านั้น — ห้าม import จาก `"gsap"` ตรงๆ
- ทุก ScrollTrigger ต้องรอ `preloaderDone === true` ก่อน init
- ใช้ค่า easing/duration จาก `docs/design-system.md` เสมอ — ห้ามใช้ค่าสุ่ม

### Styling
- ใช้ CSS variables จาก `@theme` ใน `index.css` เสมอ
- ห้ามใช้ hex color ตรงๆ ใน component — ใช้ `var(--color-brand)` หรือ Tailwind class แทน
- ไม่มี `tailwind.config.js` — Tailwind v4 ใช้ `@theme` ใน CSS

### Lenis
- Import จาก `"lenis"` เท่านั้น — ไม่ใช่ `"@studio-freight/lenis"` (deprecated)

### TypeScript
- ห้าม `any` โดยไม่มีเหตุผล
- ทุก component ต้องมี interface สำหรับ props

---

## Quick Reference — Design Tokens

```
Background:       #0B090A
Surface:          #161A1D
Brand/Accent:     #A4161A
Text Primary:     #F5F3F4
Text Secondary:   #6B7280
Border:           #2A2D30

Font Heading:     Space Mono
Font Body:        IBM Plex Mono

Ease Default:     power4.out
Duration Fast:    0.3s
Duration Normal:  0.8s
Duration Cinema:  1.8s
```