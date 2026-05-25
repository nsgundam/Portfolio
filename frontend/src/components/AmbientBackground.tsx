import React from "react";

const AmbientBackground: React.FC = () => {
  return (
    // คอนเทนเนอร์หลัก ล็อกให้อยู่หลังสุดตลอดเวลา
    <div className="fixed inset-0 z-[-1] bg-bg overflow-hidden">
      {/* Layer 1: Glowing Orbs
        วงกลมสีแดงเบลอจัดๆ ใช้ค่า blur สูงสุด และ opacity ต่ำๆ
      */}
      {/* Orb 1: มุมซ้ายบน */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.15] blur-[120px] animate-pulse"
        style={{ backgroundColor: "var(--color-brand)", animationDuration: "3s" }}
      />

      {/* Orb 2: มุมขวาล่าง */}
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.4] blur-[150px]"
        style={{ backgroundColor: "var(--color-brand)" }}
      />

      {/* Layer 2: SVG Noise Overlay
        ใช้ SVG feTurbulence สร้าง Noise แบบ Native เบาเครื่องกว่าใช้รูปภาพ
      */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
};

export default AmbientBackground;
