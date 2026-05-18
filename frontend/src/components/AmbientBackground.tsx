import React from 'react';

const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-2 bg-bg-primary overflow-hidden">
      
      {/* Layer 1: Base Grid (ตารางแนว Tech) 
          ใช้ CSS linear-gradient สร้างเส้นตารางทั้งแนวตั้งและแนวนอน
      */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px' // ปรับขนาดความกว้าง-ยาวของช่องตาราง
        }}
      />

      {/* Layer 2: Animated Scanline (เส้นแสงกวาดจากบนลงล่าง) 
          ใช้สีแดง #A4161A ของคุณมาทำเป็นแสงจางๆ
      */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div 
          className="w-full h-[20vh] bg-gradient-to-b from-transparent via-[#A4161A]/15 to-transparent"
          style={{
            animation: 'scan 5s linear infinite',
          }}
        />
      </div>

      {/* Layer 3: Vignette Effect (ขอบจอมืด)
          ช่วยบีบโฟกัสสายตาให้เข้ามาที่ตรงกลางหน้าจอ และทำให้แสง Scanline ดูเนียนขึ้นตอนแตะขอบจอ
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 50%, #0B090A 150%)'
        }}
      />

      {/* สร้าง CSS Keyframes แบบฝังใน Component 
          (ถ้าใช้งานจริง แนะนำให้ย้าย @keyframes ไปไว้ที่ไฟล์ globals.css ครับ จะคลีนกว่า)
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}} />

    </div>
  );
};
export default AmbientBackground;