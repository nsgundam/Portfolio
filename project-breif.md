# Portfolio Website — Project Brief
> Last updated: April 2026 | Deadline: 31 May 2026

---

## 01 Project Goal

| Field | Value |
|---|---|
| สาย | Software Engineer / Fullstack Web Developer / PM |
| Target | Startup |
| Deadline | 31 May 2026 |
| อยากให้ผู้ดูรู้สึก | น่าตื่นเต้น และดูน่าค้นหา |

---

## 02 Personal Identity

| Field | Value |
|---|---|
| Tagline | Aiming high, building what matters. |
| Personality tone | Sophisticated & Tech-savvy |
| จุดแข็ง | Agile Technical Explorer |
| Color scheme | Dark mode only |

---

## 03 Tech Stack

| Layer | Technology | หมายเหตุ |
|---|---|---|
| Framework | React + Vite | CSR, Single Page |
| Language | TypeScript | บังคับ — ช่วย impress interviewer |
| Animation หลัก | GSAP + ScrollTrigger | ตัวหลักของทุก animation |
| Smooth Scroll | Lenis | คู่หูของ GSAP ScrollTrigger |
| Text Animation | Splitting.js | แยก chars/words สำหรับ reveal |
| Styling | Tailwind CSS | utility-first, เร็วดี |
| Code Quality | ESLint + Prettier | แสดง professionalism |
| Deployment | Vercel | ฟรี + เร็ว + ง่าย |

---

## 04 Effect List

| # | Effect | Priority | หมายเหตุ |
|---|---|---|---|
| 01 | Cinematic Preloader (0→100) | 🔴 Must Have | Signature ของเว็บ — ขาดไม่ได้ |
| 02 | Custom Cursor + Spring Physics | 🔴 Must Have | เสริม Sophisticated tone |
| 03 | Glassmorphism Navbar | 🔴 Must Have | ใช้งานตลอด — code ร่วมกับ Logo Tuck |
| 04 | Scroll-Triggered Logo Tuck | 🔴 Must Have | เชื่อมกับ Navbar — ทำพร้อมกันได้เลย |
| 05 | Rolling Text on Hover (Menu) | 🟡 Should Have | Nav interaction ดูมี class — GSAP ล้วน |
| 06 | Blur Reveal Transition | 🟡 Should Have | Section transition ดู cinematic |
| 07 | Magnetic Hover on CTA | 🟡 Should Have | ใส่เฉพาะปุ่มหลัก ไม่ต้องทุก element |
| 08 | Scroll Progress Line | 🟢 Nice to Have | Visual indicator ช่วย UX — เพิ่มทีหลังได้ |

---

## 05 Hero Section

| Field | Value |
|---|---|
| Name | Narunat Sutthibut |
| Tagline | Aiming high, building what matters. |
| Background | Subtle gradient (dark — กำหนดใน Phase 3) |

---

## 06 About

I am a developer driven by curiosity and a problem-solving mindset. In a fast-evolving tech landscape, I define myself as an **Agile Technical Explorer**—always ready to leverage new tools to transform ideas into reality. My focus lies in the intersection of efficient architecture and sophisticated visuals, ensuring every project is built with purpose and impact.

---

## 07 Projects

### ▸ Boardgame Online — Exploding Kittens

**Description**
A high-stakes, real-time adaptation of the strategic card game. This project focuses on translating intricate game mechanics—such as turn-based logic, card effects, and deck randomization—into a synchronized digital environment. Designed with an event-driven architecture, the platform provides a responsive, low-latency experience that brings the tension of the physical game to the web. Developed a scalable room management system supporting multi-player concurrency (up to 5 players per room) with automated seating and real-time deck shuffling.

**Tech Stack**
| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS, Framer Motion, TypeScript |
| Backend | Node.js, Express, Socket.io, PostgreSQL, Prisma ORM, TypeScript |
| CI/CD | GitHub Actions |
| Hosting | Vercel, Render, Neon |

**Link:** https://exploding-kittens-beta.vercel.app/

---

### ▸ TramTracking System

**Description**
A high-performance, full-stack real-time mobility solution designed for campus shuttle services. The platform bridges the gap between commuters and fleet operators by providing a live-map interface with sub-second synchronization. By leveraging geospatial indexing, the system ensures pinpoint accuracy in vehicle tracking and route management. Achieved sub-500ms latency for location updates using WebSocket (Socket.io) optimization, ensuring a seamless "live" experience for users.

**Tech Stack**
| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS, OpenStreetMap API, TypeScript |
| Backend | Node.js, Express, Socket.io, PostgreSQL, Prisma ORM, TypeScript |
| Hosting | Vercel, Render, Neon |

**Link:** https://github.com/nsgundam/TramTrackingSystem

---

## 08 Skills

### Frontend Development
- **Core:** React, Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, CSS Modules, Responsive Design
- **Motion & Interaction:** GSAP (ScrollTrigger), Lenis Smooth Scroll, Framer Motion
- **State Management:** Context API

### Backend Development
- **Runtime & Framework:** Node.js, Express
- **Real-time:** Socket.io
- **API Design:** RESTful API Development
- **Integration:** IoT Connectivity

### Database & Storage
- **Relational:** PostgreSQL, MySQL
- **NoSQL:** MongoDB
- **Spatial:** PostGIS (Spatial queries & tracking)

### Infrastructure & Tools
- **Deployment:** Vercel, Docker, Neon, Render
- **Version Control:** Git, GitHub
- **Process:** Agile/Scrum, Sprint Planning
- **API Testing:** Postman

---

## 09 Contact

| Channel | Value |
|---|---|
| Email | snarunat.99@gmail.com |
| GitHub | github.com/nsgundam |
| LinkedIn | — |
| Fastwork | fastwork.co/user/narunat.su99 |

---

## 10 Reference Websites

### jasminegunarto.com
- **Cinematic Preloader** — ม่านปิดหน้าเว็บ นับ % วิ่งขึ้น แล้ว slide/fade ออกเพื่อส่งไม้ต่อ Hero
- **Magnetic Hover Effect** — ปุ่มดูดเมาส์เข้าหาตัวเอง

### studionamma.com
- **Font reference:** Poiret One, Comfortaa, Montserrat, Vina Sans

### moncy.dev
- **Scroll Progress Line** — Vertical timeline ที่ความสูงเส้นผันแปรตาม scroll position (GSAP ScrollTrigger)

### nareshkhatri.site
- **Custom Cursor** — dot เล็กตรงกลาง + outer ring โปร่งใส ที่ follow ด้วย spring physics (delay เล็กน้อย)

### new.studio
- **Glassmorphism Navbar** — `rgba(255,255,255,0.05)` + `backdrop-blur` ให้ความรู้สึกกระจกฝ้าเวลา scroll
- **Blur Reveal Transition** — element โผล่จากเบลอจัดๆ แล้วค่อยๆ focus คล้ายเลนส์กล้อง

### donmolinico.es
- **Rolling Text Hover** — ตัวอักษรเลื่อนขึ้นแล้วสลับคำเหมือน Split-flap display
- **Scroll-Triggered Logo Tuck** — โลโก้ใหญ่ตอนแรก พอ scroll เกิน 50px จะ scale down เข้า Navbar
  - `GSAP ScrollTrigger` + `.is-scrolled` class + `Flexbox` align + Glassmorphism bg