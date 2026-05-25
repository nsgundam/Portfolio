# Timeline & Progress Tracker
> อัปเดตไฟล์นี้ทุกครั้งหลังทำงานเสร็จในแต่ละ step

---

## 🔴 Current Status

```
Sprint:   Sprint 3 — Animation Layer
Step:     กำลังทำ Step 07 Blur Reveal Transition
Blocker:  ไม่มี
```

---

## ✅ Completed

### Phase 1 — Discovery & Planning
- [x] กำหนด Project Goal (สาย, target company, deadline)
- [x] กำหนด Personal Identity (tagline, tone, จุดแข็ง)
- [x] Collect reference websites (6 เว็บ)
- [x] กำหนด Tech Stack
- [x] สร้าง Effect List พร้อม priority (8 effects)
- [x] ตัดสินใจ Dark mode only → ตัด Dark/Light toggle ออก

### Phase 2 — Content Strategy
- [x] Hero section content (name, tagline)
- [x] About copy
- [x] Projects (Exploding Kittens + TramTracking) พร้อม impact statement
- [x] Skills inventory ครบทุก category
- [x] Contact links (LinkedIn ยังค้างอยู่)

### Phase 3 — Design
- [x] Color palette (Dark mode only)
- [x] Typography (Space Mono + IBM Plex Mono)
- [x] Spacing system (Tailwind default)
- [x] Glassmorphism spec
- [x] Animation principles (easing, duration, stagger)
- [x] CSS Variables พร้อมใช้
- [ ] Wireframe Figma — **ข้ามไป** (ตัดสินใจทำ Playground แทน)

### Playground (ก่อน Sprint 4)
- [x] 01 Custom Cursor — tune spring physics แล้ว
- [x] 02 Text Reveal — tune stagger แล้ว
- [x] 03 Preloader — tune exit style แล้ว
- [x] 04 Navbar — tune threshold + glass opacity แล้ว
- [x] 05 Magnetic Hover — tune strength + snap แล้ว

### Sprint 1 — Setup & Foundation
- [x] Vite + React + TypeScript
- [x] Tailwind v4 + `@theme` tokens
- [x] GSAP + ScrollTrigger registered
- [x] Lenis smooth scroll (`"lenis"` package)
- [x] ลบ `@studio-freight/lenis` ออก
- [x] ESLint flat config
- [x] Folder structure ครบ
- [x] Dev server รันได้, cursor hidden, font โหลดได้

### Sprint 2 — Static Layout
- [x] Preloader (static — overlay + counter)
- [x] Navbar (fixed top, logo + nav links)
- [x] Hero (name, tagline, gradient bg, scroll hint)
- [x] About (bio + quick info grid)
- [x] Projects (2 cards — Exploding Kittens + TramTracking)
- [x] Skills (5 categories)
- [x] Contact (email CTA + links)
- [x] App.tsx เชื่อม sections ครบ

---

## 🔄 In Progress

### Sprint 3 — Animation Layer

| # | Animation | Status | หมายเหตุ |
|---|---|---|---|
| 01 | Custom Cursor + Spring Physics | ✅ DONE | redesigned — suck-in collapse on hover, spring emerge on leave |
| 02 | Preloader Sequence (0→100 + exit) | ✅ DONE | |
| 03 | Navbar Glassmorphism + Logo Tuck | ✅ DONE | รอ preloaderDone |
| 04 | Hero Text Reveal | ✅ DONE | รอ preloaderDone |
| 05 | Section Scroll Reveals | ✅ DONE | |
| 06 | Rolling Text (Menu hover) | ✅ DONE | |
| 07 | Blur Reveal Transition | ⬜ TODO | |
| 08 | Magnetic Hover (CTA) | ⬜ TODO | |
| 09 | Scroll Progress Line | ✅ DONE | ย้ายไปแนวนอนขอบล่าง |

> **Agent:** เมื่อทำ animation ใดเสร็จ ให้เปลี่ยน `⬜ TODO` → `✅ DONE` และเพิ่ม note ถ้ามี

---

## 📋 Upcoming

### Sprint 4 — Polish & Responsive
- [ ] Responsive (mobile 375px, tablet 768px)
- [ ] Disable cursor บน touch device
- [ ] `prefers-reduced-motion` support
- [ ] Image optimization (WebP)
- [ ] Lighthouse audit (target > 90)
- [ ] Meta tags + OG image
- [ ] LinkedIn URL (ยังไม่ได้ใส่ — **must before launch**)

### Sprint 5 — Deployment
- [ ] Build production (`npm run build`)
- [ ] Deploy to Vercel
- [ ] Custom domain (optional)
- [ ] Vercel Analytics
- [ ] Final QA ทุก browser

---

## ⚠️ Open Issues / Blockers

| Issue | Priority | Status |
|---|---|---|
| LinkedIn URL ยังไม่มี | 🔴 High | ✅ DONE — อยู่ใน Contact.tsx แล้ว |
| Playground values ยังไม่ได้ใส่ใน design-system.md | 🟡 Medium | ✅ DONE (ใส่ใน design-system.md แล้ว) |

---

## 📝 Agent Update Log

> Agent ที่มาทำงาน ให้ append บันทึกที่นี่ทุกครั้ง

```
Format:
[DATE] [AGENT/SESSION] — ทำอะไร + ผลลัพธ์
```

| Date | Session | งานที่ทำ |
|---|---|---|
| Apr 2026 | Planning Session | Phase 1-3 + Playground + Sprint 1-2 เสร็จสมบูรณ์ |
| May 2026 | AI Agent | ตรวจสอบและอัปเดตสถานะ Step 01-04 (เสร็จแล้ว), เพิ่ม Playground values ใน design-system.md, ทำ Step 05 (Section Scroll Reveals) ใน Projects/Skills/Contact, และทำ Step 06 (Rolling Text) ใน Navbar |
| May 2026 | AI Agent | แก้ไขบั๊ก Scroll Reveal + AmbientBackground, ปรับปรุง Hero Text Reveal ให้ต่อเนื่องจาก Preload, อัปเดต Navbar เป็น Liquid Glass Effect, ทำ Step 09 (Scroll Progress Line) แนวนอนล่างจอ และตั้งค่าบังคับ Scroll บนสุดเมื่อ Refresh |
| May 2026 | AI Agent | Codebase audit + full fix pass (14 issues): แก้ไข aria-hidden ใน Hero, ตั้ง text-secondary สี #6B7280, แก้ CSS dead code, ปรับ Preloader ease เป็น power2.in, เพิ่ม preloaderDone guard ใน useScrollReveal (ส่งต่อทุก section), ออกแบบ Navbar ใหม่ (values + interpolable transitions), redesign CustomCursor ด้วย gsap.quickTo + back.out leave, เปลี่ยนชื่อไฟล์ที่พิมพ์ผิด, ย้าย AmbientBackground เข้า App.tsx, แก้ Contact placeholder email, ปิด LinkedIn open issue |
| May 2026 | AI Agent | แก้บั๊ก Custom Cursor ring ค้างหลัง leave button: `overwrite:true` ใน onEnter kill backing tween ของ gsap.quickTo ทำให้ dead quickTo silent-fail — แก้โดยเปลี่ยน `const` → `let` และ re-create ringXTo/ringYTo ใหม่ใน onLeave |
| May 2026 | AI Agent | Redesign Custom Cursor hover effect: เปลี่ยนจาก ring ขยายคลุม button (wrapping) → blackhole suck-in (ring หดหายเข้าปุ่ม ด้วย power3.in) + emerge spring-back ที่ cursor (back.out 2.2) เมื่อ leave — isHovering คง true ตลอด emerge เพื่อป้องกัน renderStretch fight กับ scale tween |
| May 2026 | AI Agent | Refine Cursor suck-in: เปลี่ยนจาก ring บินไปกลาง button center ก่อน collapse → collapse in place ที่ตำแหน่ง cursor ทันที (ไม่ผ่านเนื้อหา button), เปลี่ยนเป็น power4.in + duration 0.35s (near-instant collapse ที่ปลาย) |