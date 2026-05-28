# Decision Log
>
> บันทึกการตัดสินใจสำคัญทุกอย่าง พร้อมเหตุผล
> Agent ที่มาทีหลัง ห้ามเปลี่ยนสิ่งที่บันทึกไว้โดยไม่มีเหตุผลใหม่

---

## DEC-001 — Dark Mode Only

**วันที่:** Apr 2026
**การตัดสินใจ:** ใช้ Dark mode เพียงอย่างเดียว ไม่มี Light mode toggle
**เหตุผล:** Sophisticated & Tech-savvy tone เข้ากับ Dark mode มากกว่า และลด complexity ลงได้มาก
**ผลกระทบ:** ตัด Dark/Light Mode Morph Icon ออกจาก Effect List

---

## DEC-002 — ตัด Framer Motion ออก

**วันที่:** Apr 2026
**การตัดสินใจ:** ไม่ใช้ Framer Motion แม้จะอยู่ใน tech stack เดิมของ project อื่น
**เหตุผล:** GSAP และ Framer Motion ทำสิ่งเดียวกัน ใช้พร้อมกันทำให้ bundle บวมและ fight กันเรื่อง DOM control
**ผลกระทบ:** ใช้ GSAP เป็น animation library หลักทั้งหมด

---

## DEC-003 — ข้าม Figma Wireframe

**วันที่:** Apr 2026
**การตัดสินใจ:** ข้าม lo-fi wireframe ใน Figma ไปทำ Playground แทน
**เหตุผล:** ยังไม่มีความชำนาญเรื่อง animation timing และ UI เลยต้องทดลองจริงก่อน
**ผลกระทบ:** ทำ 5 experiments ใน playground-portfolio ก่อน แล้วค่อย apply ค่าจริงใน project

---

## DEC-004 — Lenis Package

**วันที่:** Apr 2026
**การตัดสินใจ:** ใช้ `"lenis"` package แทน `"@studio-freight/lenis"`
**เหตุผล:** `@studio-freight/lenis` เป็น deprecated แล้ว official package ใหม่คือ `"lenis"`
**ผลกระทบ:** ลบ `@studio-freight/lenis` ออกจาก package.json แล้ว

---

## DEC-005 — Tailwind v4 + @theme

**วันที่:** Apr 2026
**การตัดสินใจ:** ใช้ Tailwind v4 ซึ่งไม่มี `tailwind.config.js` แล้ว
**เหตุผล:** Stack ที่ติดตั้งมาเป็น Tailwind v4 อยู่แล้ว ใช้ `@theme` ใน CSS แทน config JS
**ผลกระทบ:** Custom tokens ทั้งหมดอยู่ใน `src/index.css` ภายใน `@theme {}` block

---

## DEC-006 — ไม่ใส่ Fastwork ใน Portfolio

**วันที่:** Apr 2026
**การตัดสินใจ:** ไม่ใส่ link Fastwork ใน Portfolio ที่ยื่น Startup
**เหตุผล:** Fastwork ส่งสัญญาณว่ารับงาน freelance เป็นหลัก ซึ่งอาจทำให้บริษัทกังวลเรื่อง commitment
**ผลกระทบ:** Contact section มีแค่ Email, GitHub, LinkedIn

---

## DEC-007 — Single Page Application

**วันที่:** Apr 2026
**การตัดสินใจ:** ทำเป็น SPA (Single Page) ทั้งหมด ไม่มี routing
**เหตุผล:** Portfolio ไม่ต้องการ SEO ลึก และ CSR เหมาะกับ animation-heavy มากกว่า SSR
**ผลกระทบ:** ใช้ anchor links (`#section-id`) แทน router

---

## DEC-008 — Effect Priority

**วันที่:** Apr 2026
**การตัดสินใจ:** 4 Must Have + 3 Should Have + 1 Nice to Have (รวม 8 effects)
**เหตุผล:** 9 effects เกินไปสำหรับ deadline 31 May และอาจ overwhelm ผู้ดู
**ผลกระทบ:** ดู Effect List ครบใน `docs/project-brief.md`

---

## DEC-009 — Custom Cursor: Suck-In Collapse แทน Button Wrapping

**วันที่:** May 2026
**การตัดสินใจ:** เปลี่ยน hover behavior จาก ring ขยายคลุม button → ring หดหายตรงจุด
**เหตุผล:** Ring ที่ขยายคลุม button บังเนื้อหา — suck-in เข้ากับ Sophisticated tone มากกว่า
**ผลกระทบ:** `onEnter`: scaleX/Y → 0, power4.in. `onLeave`: emerge from cursor, back.out(2.2)

---

## DEC-010 — gsap.quickTo ต้อง re-create หลัง overwrite:true

**วันที่:** May 2026
**การตัดสินใจ:** ประกาศ `ringXTo` / `ringYTo` ด้วย `let` แทน `const` และ re-create ใหม่ทุกครั้งใน `onLeave`
**เหตุผล:** `overwrite:true` kills backing tween ของ quickTo ทำให้ silent-fail
**ผลกระทบ:** Pattern นี้ใช้กับทุก gsap.quickTo ที่อยู่ใน scope เดียวกับ tween ที่ใช้ overwrite:true

---

## DEC-011 — Palette Shift: Deep Red → Warm Gold

**วันที่:** May 2026
**การตัดสินใจ:** เปลี่ยน brand color จาก `#A4161A` (deep red) → `#C4A97D` (warm gold)
**เหตุผล:** Red เป็น aggressive และ startup-loud เกินไป — gold เข้ากับ editorial / sophisticated
tone ที่ lukebaffait.fr ใช้ได้ดีกว่า ผู้ดูจะสังเกตเห็น accent โดยไม่รู้ตัว แทนที่จะถูกตีหน้า
**ผลกระทบ:**

- `--color-brand` ถูกแทนที่ด้วย `--color-accent: #C4A97D`
- `--color-accent-light: #D4BC9A` สำหรับ hover
- `--color-accent-dark: #8A7450` สำหรับ pressed / subdued
- ลบ `--color-brand`, `--color-brand-light` ออก
- ค้นหา `text-brand`, `border-brand`, `bg-brand` ทั้งหมดและเปลี่ยนเป็น `text-accent` etc.
- Cursor dot: ยังใช้ `bg-white` + `mix-blend-mode: difference` — เปลี่ยนอัตโนมัติตาม palette

---

## DEC-012 — Typography: เพิ่ม Cormorant Garamond สำหรับ Display

**วันที่:** May 2026
**การตัดสินใจ:** เพิ่ม Cormorant Garamond เป็น `font-display` สำหรับ H1, H2, section headings
ทั้งหมด โดยยังเก็บ Space Mono และ IBM Plex Mono ไว้ตามเดิม
**เหตุผล:** lukebaffait.fr ใช้ serif display font เพื่อสร้าง editorial tension กับ mono body
Cormorant Garamond 300 (thin) เป็น free font ที่มีความสวยงามในระดับสูง โดยเฉพาะ italic
**ผลกระทบ:**

- เพิ่ม Google Fonts import ใน `index.html`
- `--font-heading` เปลี่ยนชื่อเป็น `--font-label` (Space Mono — ใช้สำหรับ labels/numbers)
- `--font-display` ใหม่ → Cormorant Garamond (headings ทั้งหมด)
- `--font-body` ยังคงเป็น IBM Plex Mono
- Breaking change: `font-heading` class ต้อง find-replace เป็น `font-label` หรือ `font-display` ตามบริบท

---

## DEC-013 — Aggressive Pinning: ทุก Major Section

**วันที่:** May 2026
**การตัดสินใจ:** ใช้ ScrollTrigger pin บน Hero, About, Projects (แต่ละ panel), Skills
Contact ไม่ pin — scroll ปกติ
**เหตุผล:** lukebaffait's signature คือ scroll เป็น director ไม่ใช่ user — ผู้ดูต้อง "earn"
แต่ละ section โดยการ scroll ผ่าน pin distance ก่อนที่ content จะ reveal ครบ
**ผลกระทบ:**

- สร้าง `usePinnedTimeline` hook ใหม่ที่ทุก pinned section ใช้ร่วมกัน
- Pin distances: Hero +=500, About +=900, Projects +=700/panel, Skills +=400
- `scrub: 1.5` แทน `scrub: true` ทุกที่ — ให้ความรู้สึก weighted
- `anticipatePin: 1` บนทุก ScrollTrigger pin — ป้องกัน layout jump
- Mobile: pin distance ลดลง 50% ผ่าน `usePinnedTimeline` options

---

## DEC-014 — depthReveal แทน flat fade+slide

**วันที่:** May 2026
**การตัดสินใจ:** เปลี่ยน standard entrance animation จาก `{ opacity:0, y:60 }` →
`{ opacity:0, scale:0.88, y:60, filter:"blur(8px)" }` ทุกที่ใน major sections
**เหตุผล:** Scale + blur ทำให้ elements รู้สึกว่ามาจาก "depth" ไม่ใช่แค่ slide ขึ้นมาจากล่าง
นี่คือ lukebaffait fingerprint ที่ทำให้ scroll storytelling รู้สึก spatial และ cinematic
**ผลกระทบ:**

- Export `depthReveal()` utility จาก `src/lib/gsap.ts`
- Export `depthRevealVars` object สำหรับใช้ใน timeline definitions
- `useScrollReveal` hook: ยังใช้ flat entrance สำหรับ Contact (ไม่ pin)
- `useBlurReveal` hook: ยังใช้สำหรับ Contact terminal — ไม่เปลี่ยน

---

## DEC-015 — Projects Layout: Full-Screen Stacked Panels แทน MacBook Window

**วันที่:** May 2026
**การตัดสินใจ:** แทนที่ MacBook window tabbed UI ด้วย full-screen stacked pinned panels
แต่ละ project เป็น 100vh section มี pin ของตัวเอง
**เหตุผล:**

- MacBook window เป็น decoration ไม่ใช่ content — มันบอกว่า "UI demo" แต่ project
  เป็น engineering story
- Full-screen panels ให้ space ที่เพียงพอสำหรับ display typography ขนาดใหญ่
- Stacked pinning ทำให้ผู้ดูรู้สึกว่าแต่ละ project มีน้ำหนักและความสำคัญของตัวเอง
**ผลกระทบ:**
- ลบ `ProjectWindow.tsx` component ออก
- สร้าง `ProjectPanel.tsx` ใหม่
- `Projects.tsx` เปลี่ยนเป็น container ที่ map PROJECTS array → `<ProjectPanel>`
- Project descriptions rewritten (ดู project-brief.md section 07)
- Giant faint background number (opacity:0.03) เพิ่ม depth

---

## DEC-016 — Skills: Two Honest Groups แทน Five Floating Cards

**วันที่:** May 2026
**การตัดสินใจ:** เปลี่ยน 5 category floating cards → 2 groups: "Shipped with" / "Learning with"
**เหตุผล:**

- Floating cards ดู random และไม่บอก depth of knowledge
- "Shipped" vs "Learning" split เป็น honest signal ที่ startups appreciate
- Typography-only (comma-separated) ดู editorial และ confident กว่า pill tags
**ผลกระทบ:**
- ลบ SKILL_GROUPS array และ FLOAT_CONFIG array ออก
- ลบ floating animation ทั้งหมด
- เพิ่ม `usePinnedTimeline(+=400)` แทน

---

## DEC-017 — About: ลบ Photo Placeholder และ Grid

**วันที่:** May 2026
**การตัดสินใจ:** ลบ photo placeholder, สาม-column grid, และ bordered boxes ทั้งหมดออกจาก About
แทนด้วย full-width typographic layout
**เหตุผล:**

- Photo placeholder ที่มี emoji 📸 และข้อความ "Add your image to public/images/"
  ดู unfinished และ unprofessional กว่าการไม่มีรูปเลย
- Three-column grid ทำให้เนื้อหาดู boxed-in — ขัดกับ editorial approach
- Typography-only about section ทำให้ words มีพื้นที่ breathe และรู้สึก confident
**ผลกระทบ:**
- ลบ `photoRef` และ photo div ทั้งหมด
- ลบ `grid grid-cols-1 md:grid-cols-3` wrapper
- ลบ border-b บน info items
- เพิ่ม individual refs สำหรับ bio lines (line1Ref, line2Ref, line3Ref) สำหรับ stagger reveal

---

## Template สำหรับ Decision ใหม่

```markdown
## DEC-00X — ชื่อการตัดสินใจ
**วันที่:**
**การตัดสินใจ:**
**เหตุผล:**
**ผลกระทบ:**
```
