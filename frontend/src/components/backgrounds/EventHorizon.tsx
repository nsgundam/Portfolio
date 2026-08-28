import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;

export interface EventHorizonPalette {
  background: THREE.Color;
  accent: THREE.Color;
  accentLight: THREE.Color;
  accentDark: THREE.Color;
  starlight: THREE.Color;
}

interface EventHorizonProps {
  progressRef: ProgressRef;
  contributionRef: ProgressRef;
  isMobile: boolean;
  palette: EventHorizonPalette;
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

function buildAccretionParticles(count: number, seed: number): Float32Array {
  const random = createSeededRandom(seed);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index++) {
    const angle = random() * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(1.46, 3.55, Math.pow(random(), 0.82));
    const thickness = (random() + random() - 1) * 0.12;

    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius + thickness;
    positions[index * 3 + 2] = thickness * 1.6;
  }

  return positions;
}

const DISK_VERTEX_SHADER = /* glsl */ `
  varying vec2 vDiskPosition;

  void main() {
    vDiskPosition = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying vec2 vDiskPosition;

  uniform vec3 uAccent;
  uniform vec3 uAccentLight;
  uniform vec3 uAccentDark;
  uniform float uOpacity;
  uniform float uProgress;

  void main() {
    float radius = length(vDiskPosition);
    float angle = atan(vDiskPosition.y, vDiskPosition.x);
    float innerFade = smoothstep(1.44, 1.72, radius);
    float outerFade = 1.0 - smoothstep(3.0, 3.58, radius);
    float radialBand = 0.5 + 0.5 * sin(radius * 17.0 - angle * 2.6 + uProgress * 1.2);
    float filament = smoothstep(0.3, 0.96, radialBand);
    float frontBias = mix(0.34, 1.0, smoothstep(-0.85, 0.78, sin(angle)));
    float energy = innerFade * outerFade * frontBias;

    vec3 color = mix(uAccentDark, uAccent, filament * 0.7);
    color = mix(color, uAccentLight, filament * energy * 0.34);
    float alpha = energy * mix(0.08, 0.46, filament) * uOpacity;

    if (alpha < 0.002) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function smoothstep(min: number, max: number, value: number): number {
  const normalized = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

export function EventHorizon({
  progressRef,
  contributionRef,
  isMobile,
  palette,
}: EventHorizonProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const diskMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const particlesMaterialRef = useRef<THREE.PointsMaterial>(null!);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const photonRingMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);

  const particlePositions = useMemo(
    () => buildAccretionParticles(isMobile ? 160 : 480, isMobile ? 9403 : 9109),
    [isMobile],
  );
  const basePosition = useMemo(
    () => isMobile
      ? new THREE.Vector3(3.05, -1.35, -8.3)
      : new THREE.Vector3(4.7, 0.05, -7.4),
    [isMobile],
  );
  const diskUniforms = useMemo(
    () => ({
      uAccent: { value: palette.accent },
      uAccentLight: { value: palette.accentLight },
      uAccentDark: { value: palette.accentDark },
      uOpacity: { value: 0 },
      uProgress: { value: 0 },
    }),
    [palette],
  );

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const diskMaterial = diskMaterialRef.current;
    const particlesMaterial = particlesMaterialRef.current;
    const coreMaterial = coreMaterialRef.current;
    const photonRingMaterial = photonRingMaterialRef.current;
    if (
      !group ||
      !diskMaterial ||
      !particlesMaterial ||
      !coreMaterial ||
      !photonRingMaterial
    ) {
      return;
    }

    const contribution = contributionRef.current;
    if (contribution <= 0.001) {
      if (group.visible) group.visible = false;
      return;
    }

    if (!group.visible) group.visible = true;

    const progress = progressRef.current;
    const settleProgress = smoothstep(0, isMobile ? 0.42 : 0.64, progress);
    const clampedDelta = Math.min(delta, 0.1);
    const targetX = basePosition.x - (1 - settleProgress) * (isMobile ? 0.28 : 0.72);
    const targetY = basePosition.y + (1 - settleProgress) * (isMobile ? 0.16 : 0.34);
    const targetScale = THREE.MathUtils.lerp(isMobile ? 0.64 : 0.84, isMobile ? 0.72 : 1, settleProgress);

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      targetX,
      6,
      clampedDelta,
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      targetY,
      6,
      clampedDelta,
    );
    const nextScale = THREE.MathUtils.damp(
      group.scale.x,
      targetScale,
      6,
      clampedDelta,
    );
    group.scale.setScalar(nextScale);
    group.rotation.z = -0.07 + settleProgress * 0.07;

    diskMaterial.uniforms.uOpacity.value = contribution * (isMobile ? 0.66 : 0.82);
    diskMaterial.uniforms.uProgress.value = settleProgress;
    particlesMaterial.opacity = contribution * (isMobile ? 0.12 : 0.2);
    coreMaterial.opacity = contribution * 0.98;
    photonRingMaterial.opacity = contribution * (isMobile ? 0.28 : 0.42);
  });

  return (
    <group
      ref={groupRef}
      name="event-horizon-environment"
      position={basePosition}
      rotation={[1.08, 0.08, -0.07]}
      scale={isMobile ? 0.64 : 0.84}
      visible={false}
    >
      <mesh name="accretion-disk" renderOrder={1}>
        <ringGeometry
          args={[
            1.42,
            3.6,
            isMobile ? 64 : 112,
            isMobile ? 4 : 7,
          ]}
        />
        <shaderMaterial
          ref={diskMaterialRef}
          vertexShader={DISK_VERTEX_SHADER}
          fragmentShader={DISK_FRAGMENT_SHADER}
          uniforms={diskUniforms}
          side={THREE.DoubleSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      <points name="accretion-particles" renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={particlesMaterialRef}
          color={palette.starlight}
          size={isMobile ? 0.034 : 0.026}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>

      <mesh name="event-horizon-core" renderOrder={3}>
        <sphereGeometry args={[1.34, isMobile ? 32 : 48, isMobile ? 20 : 32]} />
        <meshBasicMaterial
          ref={coreMaterialRef}
          color={palette.background}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <mesh name="photon-ring" renderOrder={4}>
        <torusGeometry args={[1.39, isMobile ? 0.018 : 0.024, 8, isMobile ? 64 : 96]} />
        <meshBasicMaterial
          ref={photonRingMaterialRef}
          color={palette.accentLight}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
