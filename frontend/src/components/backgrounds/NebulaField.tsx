import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;

export interface NebulaPalette {
  accent: THREE.Color;
  accentDark: THREE.Color;
  starlight: THREE.Color;
}

interface NebulaFieldProps {
  progressRef: ProgressRef;
  contributionRef: ProgressRef;
  isMobile: boolean;
  palette: NebulaPalette;
}

interface NebulaAttributes {
  positions: Float32Array;
  colorMix: Float32Array;
  scale: Float32Array;
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

function buildNebulaAttributes(count: number, seed: number): NebulaAttributes {
  const random = createSeededRandom(seed);
  const positions = new Float32Array(count * 3);
  const colorMix = new Float32Array(count);
  const scale = new Float32Array(count);

  for (let index = 0; index < count; index++) {
    const radius = Math.pow(random(), 0.62) * 4.9;
    const angle = random() * Math.PI * 2 + radius * 0.34;
    const verticalNoise = (random() + random() + random() - 1.5) * 0.72;
    const depthNoise = (random() + random() - 1) * 1.35;
    const lobeOffset = random() > 0.48 ? 0.62 : -0.48;

    positions[index * 3] = Math.cos(angle) * radius + lobeOffset;
    positions[index * 3 + 1] = Math.sin(angle) * radius * 0.42 + verticalNoise;
    positions[index * 3 + 2] = depthNoise - radius * 0.1;
    colorMix[index] = THREE.MathUtils.clamp(random() * 0.82 + radius * 0.025, 0, 1);
    scale[index] = THREE.MathUtils.lerp(0.55, 1.45, random());
  }

  return { positions, colorMix, scale };
}

const NEBULA_VERTEX_SHADER = /* glsl */ `
  attribute float aColorMix;
  attribute float aScale;

  varying float vColorMix;

  uniform float uPointSize;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vColorMix = aColorMix;
    gl_PointSize = uPointSize * aScale / max(1.0, -viewPosition.z);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const NEBULA_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying float vColorMix;

  uniform vec3 uAccent;
  uniform vec3 uAccentDark;
  uniform vec3 uStarlight;
  uniform float uOpacity;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceFromCenter = length(point);
    float particle = 1.0 - smoothstep(0.08, 0.5, distanceFromCenter);
    float brightDust = smoothstep(0.84, 1.0, vColorMix);
    vec3 color = mix(uAccentDark, uAccent, vColorMix * 0.72);
    color = mix(color, uStarlight, brightDust * 0.28);
    float alpha = particle * uOpacity * mix(0.34, 0.9, vColorMix);

    if (alpha < 0.002) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function NebulaField({
  progressRef,
  contributionRef,
  isMobile,
  palette,
}: NebulaFieldProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const attributes = useMemo(
    () => buildNebulaAttributes(isMobile ? 260 : 820, isMobile ? 8101 : 7207),
    [isMobile],
  );
  const basePosition = useMemo(
    () => isMobile
      ? new THREE.Vector3(2.9, -0.25, -8.6)
      : new THREE.Vector3(4.1, 0.15, -8.4),
    [isMobile],
  );
  const uniforms = useMemo(
    () => ({
      uAccent: { value: palette.accent },
      uAccentDark: { value: palette.accentDark },
      uStarlight: { value: palette.starlight },
      uPointSize: { value: isMobile ? 38 : 46 },
      uOpacity: { value: 0 },
    }),
    [isMobile, palette],
  );

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;

    const contribution = contributionRef.current;
    if (contribution <= 0.001) {
      if (group.visible) group.visible = false;
      return;
    }

    if (!group.visible) group.visible = true;

    const progress = progressRef.current;
    const clampedDelta = Math.min(delta, 0.1);
    const targetX = basePosition.x + (progress - 0.5) * (isMobile ? 0.18 : 0.34);
    const targetY = basePosition.y - (progress - 0.5) * (isMobile ? 0.12 : 0.24);

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
    group.rotation.y = -0.08 + progress * 0.16;
    group.rotation.z = -0.1 + progress * 0.2;
    material.uniforms.uOpacity.value = contribution * (isMobile ? 0.2 : 0.3);
  });

  return (
    <group
      ref={groupRef}
      name="nebula-environment"
      position={basePosition}
      rotation={[0.04, -0.08, -0.1]}
      visible={false}
    >
      <points name="nebula-dust" renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[attributes.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aColorMix"
            args={[attributes.colorMix, 1]}
          />
          <bufferAttribute
            attach="attributes-aScale"
            args={[attributes.scale, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={NEBULA_VERTEX_SHADER}
          fragmentShader={NEBULA_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
