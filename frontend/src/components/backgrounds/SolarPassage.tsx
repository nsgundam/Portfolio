import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;

export interface SolarPalette {
  accent: THREE.Color;
  accentLight: THREE.Color;
  accentDark: THREE.Color;
  starlight: THREE.Color;
}

interface SolarPassageProps {
  progressRef: ProgressRef;
  contributionRef: ProgressRef;
  isMobile: boolean;
  palette: SolarPalette;
}

function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGravityParticles(count: number, seed: number): Float32Array {
  const random = createSeededRandom(seed);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index++) {
    const angle = random() * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(0.42, 5.2, Math.pow(random(), 0.72));
    const flattening = THREE.MathUtils.lerp(0.18, 0.34, random());
    const drift = (random() - 0.5) * 0.24;

    positions[index * 3] = Math.cos(angle) * radius + drift;
    positions[index * 3 + 1] = Math.sin(angle) * radius * flattening + drift * 0.4;
    positions[index * 3 + 2] = (random() - 0.5) * 1.5 - radius * 0.035;
  }

  return positions;
}

interface TraceDefinition {
  radiusX: number;
  radiusY: number;
  start: number;
  end: number;
  rotation: number;
  z: number;
}

const DESKTOP_TRACES: readonly TraceDefinition[] = [
  { radiusX: 5.4, radiusY: 1.25, start: 0.18, end: 5.52, rotation: -0.08, z: -0.2 },
  { radiusX: 4.15, radiusY: 0.78, start: 1.08, end: 6.05, rotation: 0.13, z: 0.16 },
  { radiusX: 2.7, radiusY: 0.48, start: 0.42, end: 4.92, rotation: -0.2, z: 0.34 },
] as const;

const MOBILE_TRACES: readonly TraceDefinition[] = DESKTOP_TRACES.slice(0, 2);

function buildTraceSegments(
  definitions: readonly TraceDefinition[],
  segmentsPerTrace: number,
): Float32Array {
  const positions: number[] = [];

  definitions.forEach((definition) => {
    const cosRotation = Math.cos(definition.rotation);
    const sinRotation = Math.sin(definition.rotation);
    let previousPoint: THREE.Vector3 | null = null;

    for (let index = 0; index <= segmentsPerTrace; index++) {
      const progress = index / segmentsPerTrace;
      const angle = THREE.MathUtils.lerp(definition.start, definition.end, progress);
      const ellipseX = Math.cos(angle) * definition.radiusX;
      const ellipseY = Math.sin(angle) * definition.radiusY;
      const point = new THREE.Vector3(
        ellipseX * cosRotation - ellipseY * sinRotation,
        ellipseX * sinRotation + ellipseY * cosRotation,
        definition.z,
      );

      if (previousPoint) {
        positions.push(
          previousPoint.x,
          previousPoint.y,
          previousPoint.z,
          point.x,
          point.y,
          point.z,
        );
      }
      previousPoint = point;
    }
  });

  return new Float32Array(positions);
}

export function SolarPassage({
  progressRef,
  contributionRef,
  isMobile,
  palette,
}: SolarPassageProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const particlesMaterialRef = useRef<THREE.PointsMaterial>(null!);
  const tracesMaterialRef = useRef<THREE.LineBasicMaterial>(null!);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  const particlePositions = useMemo(
    () => buildGravityParticles(isMobile ? 220 : 720, isMobile ? 5701 : 4303),
    [isMobile],
  );
  const tracePositions = useMemo(
    () =>
      buildTraceSegments(
        isMobile ? MOBILE_TRACES : DESKTOP_TRACES,
        isMobile ? 52 : 88,
      ),
    [isMobile],
  );
  const basePosition = useMemo(
    () => isMobile
      ? new THREE.Vector3(2.75, -2.55, -7.8)
      : new THREE.Vector3(3.85, -2.35, -7.6),
    [isMobile],
  );

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const particlesMaterial = particlesMaterialRef.current;
    const tracesMaterial = tracesMaterialRef.current;
    const coreMaterial = coreMaterialRef.current;
    const light = lightRef.current;
    if (!group || !particlesMaterial || !tracesMaterial || !coreMaterial || !light) {
      return;
    }

    const contribution = contributionRef.current;
    if (contribution <= 0.001) {
      if (group.visible) group.visible = false;
      if (light.intensity !== 0) light.intensity = 0;
      return;
    }

    if (!group.visible) group.visible = true;

    const progress = progressRef.current;
    const clampedDelta = Math.min(delta, 0.1);
    const targetY = basePosition.y - (progress - 0.5) * (isMobile ? 0.2 : 0.36);

    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      targetY,
      7,
      clampedDelta,
    );
    group.rotation.y = -0.06 + progress * 0.12;
    group.rotation.z = -0.025 + progress * 0.05;

    particlesMaterial.opacity = contribution * (isMobile ? 0.12 : 0.2);
    tracesMaterial.opacity = contribution * (isMobile ? 0.07 : 0.11);
    coreMaterial.opacity = contribution * (isMobile ? 0.42 : 0.58);
    light.intensity = contribution * (isMobile ? 0.22 : 0.48);
  });

  return (
    <group
      ref={groupRef}
      name="solar-environment"
      position={basePosition}
      rotation={[0.08, -0.06, -0.025]}
      visible={false}
    >
      <lineSegments name="solar-gravity-traces" renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[tracePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={tracesMaterialRef}
          color={palette.accentDark}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <points name="solar-gravity-particles" renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={particlesMaterialRef}
          color={palette.starlight}
          size={isMobile ? 0.028 : 0.022}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>

      <mesh name="solar-core" renderOrder={3}>
        <sphereGeometry args={[isMobile ? 0.12 : 0.16, 20, 14]} />
        <meshBasicMaterial
          ref={coreMaterialRef}
          color={palette.accentLight}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color={palette.accent}
        intensity={0}
        distance={isMobile ? 4.5 : 7}
        decay={2}
      />
    </group>
  );
}
