# Design System & Tokens

## 1. Color Palette (Dark Mode Only)
- **Background:** `#0B090A` (Pitch Black)
- **Text (Primary):** `#F5F3F4` (Off-white)
- **Surface / Secondary:** `#161A1D` (Dark Gray - for Cards/Navbar bg)
- **Brand / Primary Action:** `#A4161A` (Deep Red)
- **Accent:** `#A4161A` (Deep Red - for Custom Cursor, Highlights)

## 2. Typography
- **Heading Font:** `Space Mono` (ใช้กับ H1, H2, ตัวเลขเปอร์เซ็นต์ Loading)
- **Body Font:** `IBM Plex Mono` (ใช้กับ Paragraph, Description, Tech Stack labels)

## 3. UI Elements & Spacing (Tailwind System)
- **Glassmorphism:** 
  - Background: `rgba(22, 26, 29, 0.5)` (ใช้ Secondary color มาปรับ Opacity)
  - Blur: `backdrop-blur-md`

## 4. Animation Principles (GSAP Standard)
- **Default Easing:** `power4.out` (เริ่มต้นเร็ว จบแบบนุ่มนวล - ดู Sophisticated)
- **Duration (Fast - for Hover):** `0.3s`
- **Duration (Normal - for Reveal):** `0.8s`
- **Duration (Cinematic - for Preloader):** `1.5s - 2.0s`

## 5. Component Specific Values (From Playground)
- **Custom Cursor:**
  - `RING_DURATION`: `0.5s`
  - `RING_SIZE`: `32px`
  - Hover Enter: `duration 0.3s`, `power1.out`
  - Hover Leave: `duration 0.3s`, `power3.out`
- **Preloader:**
  - Count Duration: `2.3s`, `power2.in`
  - Exit Overlay: `yPercent -100`, `duration 1.8s`, `power4.out`
- **Navbar / Logo Tuck:**
  - Scroll Threshold: `30px top`
  - Glassmorphism: `rgba(255,255, 255, 0.08)`, `blur(20px)`, `1px solid rgba(255, 255, 255, 0.08)`
  - Logo Scale: `0.85`, `duration 0.5s`, `power4.out`
- **Hero Text Reveal:**
  - Name (Char stagger): `blur(10px)`,`opacity 0`, `duration 1.2s`, `stagger {each:0.03, from: "edges"}`, `power2.out`
  - Tagline (Word stagger): `y: 100%`, `duration 3.5s`, `stagger 0`, `power4.out`
- **Magnetic Hover:**
  - `STRENGTH 0.3, TRIGGER_PAD 40, SNAP_EASE 'back.out(1.4)', SNAP_DURATION 0.8`