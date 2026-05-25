import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

interface PreloaderProps {
  onComplete: () => void; // callback บอก App ว่า exit เสร็จแล้ว
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const countObj = useRef({ val: 0 });

  useEffect(() => {
    const overlay = overlayRef.current!;
    const counter = counterRef.current!;

    const tl = gsap.timeline();

    // 1. นับ 0 → 100
    tl.to(countObj.current, {
      val: 100,
      duration: 2.3, // ← ตาม design-system.md
      ease: "power2.in", // ← เริ่มช้า เร่งขึ้นตอนท้าย (สร้าง tension ก่อนถึง 100)
      snap: { val: 1 },
      onUpdate: () => {
        counter.textContent = String(Math.round(countObj.current.val));
      },
    });

    // 2. Pause เล็กน้อยหลังถึง 100
    tl.to({}, { duration: 0.3 });

    // 3. Exit overlay — ปรับ style จาก Playground
    tl.to(overlay, {
      yPercent: -100, // ← เปลี่ยนได้: -100 = slide ขึ้น
      duration: 1.8, // ← ปรับจาก Playground
      ease: "power4.out",
      onStart: () => {
        onComplete(); // บอก App ว่า preloader กำลัง exit ให้ Hero เริ่มเล่นได้เลย
      },
      onComplete: () => {
        overlay.style.display = "none";
      },
    });
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg"
    >
      <span
        ref={counterRef}
        className="font-heading text-text-primary select-none"
        style={{ fontSize: "clamp(80px, 20vw, 280px)" }}
      >
        0
      </span>
    </div>
  );
}
