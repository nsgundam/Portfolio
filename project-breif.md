## Project Goal
- สาย: Software engineer/Fullstack web develop/PM
- Target company type: Startup
- Deadline 31 May 2026
- อยากให้ผู้ดูรู้สึก: รู้สึกน่าตื่นเต้นและดูน่าค้นหา

## Personal Identity
- Tagline / headline: Aiming high, building what matters.
- Personality tone: Sophisticated & Tech-savvy
- จุดแข็งที่อยากโชว์: Agile Technical Explorer

## Tech Stack
- Framework	React + Vite	CSR, Single Page
- Language:	TypeScript	บังคับ — ช่วย impress interviewer
- Animation หลัก:	GSAP + ScrollTrigger	ตัวหลักของทุก animation
- Smooth Scroll: Lenis	คู่หูของ GSAP ScrollTrigger
- Text Animation:	Splitting.js	แยก chars/words สำหรับ reveal
- Styling:	Tailwind CSS	utility-first, เร็วดี
- Code Quality:	ESLint + Prettier	แสดง professionalism
- Deployment: Vercel

## Effect List
1.	Cinematic Preloader (0→100)	🔴 Must Have	Signature ของเว็บ — ขาดไม่ได้
2.	Custom Cursor + Spring Physics	🔴 Must Have	เสริม Sophisticated tone ได้ดีมาก
3.	Glassmorphism Navbar	🔴 Must Have	ใช้งานตลอด — code ร่วมกับ Logo Tuck ได้เลย
4.	Scroll-Triggered Logo Tuck	🔴 Must Have	เชื่อมกับ Navbar — ทำพร้อมกันได้เลย
5.	Rolling Text on Hover (Menu)	🟡 Should Have	Nav interaction ดูมี class — GSAP ล้วน
6.	Blur Reveal Transition	🟡 Should Have	Section transition ดู cinematic มาก
7.	Magnetic Hover on CTA	🟡 Should Have	ใส่เฉพาะปุ่มหลัก ไม่ต้องทุก element
8.	Scroll Progress Line	🟢 Nice to Have	Visual indicator ช่วย UX จริง — เพิ่มทีหลังได้

## List Ref
### https://jasminegunarto.com/
#### ชอบ
1. หน้าโหลดดิ้ง (Cinematic Pre-loader)
- Visual Structure: หน้าจอโหลดดิ้งไม่ใช่แค่สัญลักษณ์หมุนๆ ธรรมดา แต่ทำหน้าที่เป็นเหมือน "ม่าน" ที่ปิดบังการเตรียมความพร้อมของรูปภาพและฟอนต์ด้านหลัง มักจะมาพร้อมกับตัวเลขเปอร์เซ็นต์ที่วิ่งขึ้น หรือ Typography ที่เรียบหรู
- Motion Dynamics: เมื่อโหลดข้อมูลเสร็จสิ้น หน้าโหลดดิ้งจะไม่หายไปแบบกระตุก แต่จะใช้การสไลด์ออก (เช่น เลื่อนขึ้นด้านบน หรือแยกออกเป็นสองฝั่ง) หรือเฟดหายไปอย่างนุ่มนวล เพื่อส่งไม้ต่อให้ Animation ของหน้า Hero เริ่มทำงานต่อได้อย่างลื่นไหล
- Seamless Pre-loader to Hero Reveal
2. Magnetic Hover Effect

### https://studionamma.com/
#### ชอบ 
- Font: Poiret One, Comfortaa, Montserrat, Vina Sans

### https://www.moncy.dev/
#### ชอบ
- Scroll Progress Line หรือ Vertical Timeline ควบคู่กับการใช้ GSAP ScrollTrigger เพื่อคำนวณระยะ Scroll แล้วนำไปปรับค่าความสูงของเส้น (Line height)

### https://www.nareshkhatri.site/
#### ชอบ
- Visual Structure: The default system pointer is hidden and replaced by a custom DOM element, typically consisting of a small, solid central dot surrounded by a larger, slightly translucent outer ring or geometric shape.
- Motion Dynamics: The cursor utilizes spring physics or easing. While the central dot tracks the exact mouse coordinates instantly, the outer ring follows with a slight mathematical delay, creating a buttery, fluid trailing effect.
- Iconography: The toggle is represented by a minimalist, crisp SVG icon—usually a sun for light mode and a moon for dark mode.
- Morphing Animation: The transition between states is not a hard swap of images. When clicked, the SVG paths animate. For example, the sun might smoothly rotate while its "rays" retract and the center shifts to form the curve of the crescent moon. The icon typically scales down slightly on the click's down-state and springs back to full size on release.

### https://www.new.studio/
#### ชอบ
1. Glassmorphism Navbar (แถบเมนูกระจกฝ้า)
- The Aesthetic: มันให้ความรู้สึกเหมือนเราเอาแผ่นกระจกฝ้าไปวางทาบไว้ด้านบนสุดของจอ ทำให้เวลาที่เราเลื่อน (Scroll) อ่านเนื้อหา หรือมีรูปภาพวิ่งผ่านใต้ Navbar สีสันของรูปภาพเหล่านั้นจะถูกเบลอและสะท้อนขึ้นมาบน Navbar อย่างนุ่มนวล
2. Blur Reveal Transition (การเปลี่ยนผ่านราวกับเลนส์กล้อง)
- The Aesthetic: แทนที่ตัวอักษรหรือหน้าต่างใหม่จะโผล่ขึ้นมาแบบทื่อๆ หรือแค่ค่อยๆ สว่างขึ้น (Fade in) เทคนิคนี้จะเลียนแบบการทำงานของเลนส์กล้องถ่ายรูปที่กำลัง "หมุนหาโฟกัส" สิ่งที่กำลังโผล่ขึ้นมาจะเริ่มจากภาพที่เบลอจัดๆ แล้วค่อยๆ คมชัดขึ้นพร้อมกับเฟดเข้า

### https://www.donmolinico.es/
#### ชอบ
1. Rolling Text / Magnetic Hover (ลูกเล่นตอน Hover เมนู)
- The Aesthetic: เวลาที่คุณเอาเมาส์ไปชี้ที่เมนู (เช่น Work, About) ตัวหนังสือจะไม่ใช่แค่เปลี่ยนสีธรรมดา แต่มันจะใช้เทคนิค Rolling Text  คือตัวอักษรเดิมจะเลื่อนขึ้น (หรือลง) จนหายไป และมีตัวอักษรคำเดียวกันเลื่อนตามขึ้นมาแทนที่ เหมือนป้ายหน้าปัดสถานีรถไฟ (Split-flap display) ที่หมุนเปลี่ยนคำ
2. Scroll-Triggered Logo Tuck (การย่อเก็บโลโก้เข้า Navbar)
- The Aesthetic: ตอนที่โหลดเข้าเว็บครั้งแรก โลโก้จะโชว์เด่นหลา อาจจะอยู่ตรงกลางหรือมีขนาดใหญ่เพื่อประกาศ Brand Identity แต่พอผู้ใช้เริ่มเลื่อนลง (Scroll) เพื่ออ่านเนื้อหา โลโก้จะไม่ได้ลอยบังจอ แต่จะค่อยๆ ย่อขนาด (Scale down) และเลื่อนตัวเองเข้าไปจัดเรียง (Align) รวมอยู่กับแถบเมนู Navbar ด้านบนอย่างเนียนตา

- Technical Setup: * ใช้ GSAP ScrollTrigger หรือ React useEffect ดักจับค่า window.scrollY
กำหนดจุดตัด (Threshold) เช่น เลื่อนลงมาเกิน 50px ให้เพิ่ม Class (เช่น .is-scrolled) ไปที่ Navbar
Class นี้จะไปสั่งให้ Navbar ลดความสูงลง (Padding ลดลง), ใส่พื้นหลังเบลอ (Glassmorphism จากเว็บ new.studio ที่เราคุยกัน), และสั่งให้โลโก้ transform: scale(0.5) หรือปรับฟอนต์ให้เล็กลงพร้อมจัด Layout แบบ Flexbox ให้เข้าที่
