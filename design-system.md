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