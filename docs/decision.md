# Decision Log
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
**การตัดสินใจ:** เปลี่ยน hover behavior ของ cursor จาก ring ขยายคลุม button (morph to button bounds) ไปเป็น ring หดหายตรงจุด (collapse in place) ด้วย `power4.in`
**เหตุผล:** Ring ที่ขยายคลุม button บังเนื้อหาและ label ทำให้ดูรกและไม่ clean — เอฟเฟกต์ "ปุ่มดูด ring เข้าไป" ตรงกับ Sophisticated tone มากกว่า และ ring หายไปทันทีเมื่อ hover ทำให้ button content อ่านได้ชัดขึ้น  
**ผลกระทบ:**
- `onEnter`: ใช้ `scaleX/Y → 0` + `power4.in` (0.35s) แทน morphing width/height/borderRadius ให้คลุม button
- `onLeave`: ring emerge จาก cursor position (scale 0 → 1, `back.out(2.2)`, 0.55s) แทน restore shape
- ขณะ hover มีแค่ dot cursor มองเห็น — ring ถูก "กลืน" เข้าไปใน button
- `isHovering` คง `true` ตลอด emerge animation เพื่อป้องกัน `renderStretch` fight กับ scale tween

---

## DEC-010 — gsap.quickTo ต้อง re-create หลัง overwrite:true
**วันที่:** May 2026  
**การตัดสินใจ:** ประกาศ `ringXTo` / `ringYTo` ด้วย `let` แทน `const` และ re-create ใหม่ทุกครั้งใน `onLeave`
**เหตุผล:** `overwrite:true` ใน `onEnter` kills backing tween ของ `gsap.quickTo` — dead quickTo เรียก `resetTo()` บน killed tween แล้ว silent-fail (ring ค้างที่ button position ไม่ขยับ) สาเหตุ: `quickTo` stores tween ref; `restart()` บน killed tween ไม่ add กลับ render queue  
**ผลกระทบ:** Pattern นี้ใช้กับทุก `gsap.quickTo` ที่อยู่ใน scope เดียวกับ tween ที่ใช้ `overwrite:true` — ต้อง re-create เสมอ ไม่ใช่แค่ call function เดิม

---

## Template สำหรับ Decision ใหม่

```markdown
## DEC-00X — ชื่อการตัดสินใจ
**วันที่:** 
**การตัดสินใจ:** 
**เหตุผล:** 
**ผลกระทบ:** 
```