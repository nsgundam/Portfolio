// src/components/backgrounds/CometScene.tsx
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Stars } from "@react-three/drei";
import * as THREE from "three";

interface CometInnerProps {
  progressRef: React.RefObject<number>;
}

function DualViewComet({ progressRef }: CometInnerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matFrontRef = useRef<THREE.MeshBasicMaterial>(null);
  const matSideRef = useRef<THREE.MeshBasicMaterial>(null);

  // โหลดรูปภาพจากที่คุณเจนมา
  const [texSide, texFront] = useTexture([
    "/textures/Comet1.jpeg", // รูปที่ 1: ด้านข้าง พุ่งจากไป
    "/textures/Comet2.jpeg", // รูปที่ 2: หน้าตรง พุ่งเข้าหาจอ
  ]);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const group = groupRef.current;
    const matFront = matFrontRef.current;
    const matSide = matSideRef.current;
    
    if (!group || !matFront || !matSide) return;

    // ── ลอจิกที่ 1: การเคลื่อนที่แนววิถีโค้ง (Cinematic Path) ──
    if (p <= 0.45) {
      // ช่วงแรก: พุ่งตรงเข้ามาโตระเบิดกลางจอแกน Z
      group.position.x = 0;
      group.position.y = 0;
      group.position.z = -15 + (p / 0.45) * 18; // พุ่งจากระยะลึกมาประชิดหน้าจอที่ Z = 3
      group.scale.setScalar(1 + (p / 0.45) * 3); // ขยายใหญ่ 4 เท่า
      group.rotation.y = 0; // ล็อคหน้าตรง
    } else {
      // ช่วงสอง (p > 0.45): จุดเปลี่ยนผ่าน! เริ่มหมุนตัวและฉีกพุ่งหนีออกข้างขวาบน
      const t = (p - 0.45) / 0.55; // Normalize ช่วงที่เหลือเป็น 0 -> 1

      group.position.z = 3 - t * 12;      // ถอยลึกกลับไปในอวกาศ
      group.position.x = t * 18;          // เบี่ยงหนีออกไปทางขวาอย่างรวดเร็ว
      group.position.y = t * 10;          // เชิดหน้าขึ้นไปทางขวาบน
      group.scale.setScalar(4 - t * 2.5); // ขนาดค่อยๆ เล็กลงตามระยะทางที่ห่างไป
      
      // หมุนแกน Y เลียนแบบการหันตัวข้างให้กล้อง (จาก 0 ถึงประมาณ 80 องศา)
      group.rotation.y = t * 1.4; 
    }

    // เสริมความมีชีวิตชีวาด้วยการสั่นเบาๆ ประจำตัวดวงดาว
    group.position.y += Math.sin(state.clock.getElapsedTime() * 2) * 0.05;

    // ── ลอจิกที่ 2: การทำ Cross-fade สลับรูปภาพอย่างแนบเนียน ──
    if (p <= 0.4) {
      matFront.opacity = 1;
      matSide.opacity = 0;
    } else if (p > 0.4 && p <= 0.6) {
      // ช่วงผสานรูปภาพ (0.4 -> 0.6) ตอนดาวหางใกล้หน้าจอที่สุด
      const fadeT = (p - 0.4) / 0.2;
      matFront.opacity = 1 - fadeT;
      matSide.opacity = fadeT;
    } else {
      matFront.opacity = 0;
      matSide.opacity = 1;
      
      // ตอนท้ายสุดของการเลื่อน (ดาวหางหนีไปสุดขอบฟ้าแล้ว) ค่อยๆ จางหายไปในความมืด
      if (p > 0.85) {
        const fadeOut = 1 - (p - 0.85) / 0.15;
        matSide.opacity = Math.max(0, fadeOut);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. ระนาบหน้าตรง (Comet2) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[6, 3.5]} />
        <meshBasicMaterial
          ref={matFrontRef}
          map={texFront}
          transparent={true}
          blending={THREE.AdditiveBlending} // ดำกลืนมืดไปกับฉากหลังอวกาศอัตโนมัติ
          depthWrite={false}
        />
      </mesh>

      {/* 2. ระนาบด้านข้าง (Comet1) หันมุมเอียงเผื่อไว้เล็กน้อยเพื่อให้เวลากลุ่มหมุนดูมีเหลี่ยมมิติ */}
      <mesh position={[0, 0, 0.01]} rotation={[0, -0.2, 0]}>
        <planeGeometry args={[6, 3.5]} />
        <meshBasicMaterial
          ref={matSideRef}
          map={texSide}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── องค์ประกอบหลักดาวอวกาศฉากหลัง ───
export function CometScene({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* ใช้ระบบดาวสำเร็จรูปจาก drei สะดวกและระยิบระยับขึ้น */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />
        
        <DualViewComet progressRef={progressRef} />
      </Canvas>
    </div>
  );
}