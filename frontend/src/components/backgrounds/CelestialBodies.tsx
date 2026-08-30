import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type SceneProgressRef = MutableRefObject<number>;

interface EarthHorizonProps {
  heroProgressRef: SceneProgressRef;
  isMobile: boolean;
}

interface EventHorizonProps {
  contactProgressRef: SceneProgressRef;
  isMobile: boolean;
}

const FULLSCREEN_VS = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PLATE_FS = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uImageAspect;
  uniform float uViewportAspect;
  uniform float uTime;
  uniform float uWarpStrength;
  uniform vec2 uWarpCenter;

  vec2 coverUv(vec2 uv) {
    vec2 scale = vec2(1.0);
    if (uViewportAspect > uImageAspect) {
      scale.y = uImageAspect / uViewportAspect;
    } else {
      scale.x = uViewportAspect / uImageAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 delta = uv - uWarpCenter;
    float radius = length(delta);
    float influence = exp(-radius * radius * 15.0);
    vec2 direction = delta / max(radius, 0.001);
    float ripple = sin(radius * 22.0 - uTime * 0.12);
    uv += direction * ripple * influence * uWarpStrength;

    vec4 plate = texture2D(uMap, uv);
    gl_FragColor = vec4(plate.rgb, plate.a * uOpacity);
  }
`;

function smoothstep(min: number, max: number, value: number): number {
  const t = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function usePreparedTexture(
  source: THREE.Texture,
  anisotropy: number,
): THREE.Texture {
  const texture = useMemo(() => {
    const clone = source.clone();
    clone.colorSpace = THREE.SRGBColorSpace;
    clone.anisotropy = anisotropy;
    clone.needsUpdate = true;
    return clone;
  }, [anisotropy, source]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

interface ImagePlateProps {
  progressRef: SceneProgressRef;
  src: string;
  mode: "earth" | "event";
  isMobile: boolean;
}

function ImagePlate({ progressRef, src, mode, isMobile }: ImagePlateProps) {
  const sourceTexture = useTexture(src);
  const texture = usePreparedTexture(sourceTexture, isMobile ? 1 : 4);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const { size, viewport } = useThree();
  const timeRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uOpacity: { value: 1 },
      uImageAspect: { value: 1672 / 941 },
      uViewportAspect: { value: size.width / size.height },
      uTime: { value: 0 },
      uWarpStrength: { value: mode === "event" && !isMobile ? 0.0018 : 0 },
      uWarpCenter: {
        value: mode === "event"
          ? new THREE.Vector2(0.72, 0.51)
          : new THREE.Vector2(0.75, 0.65),
      },
    }),
    [isMobile, mode, size.height, size.width, texture],
  );

  useFrame((_state, delta) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    if (!material || !mesh) return;

    const progress = progressRef.current;
    const travel = mode === "event"
      ? smoothstep(0.02, 0.5, progress)
      : smoothstep(0.1, 0.52, progress);

    // Celestial bodies travel through the composition instead of dissolving.
    // The plate stays fully opaque while visible, so its motion reads as a
    // camera/object relationship rather than an image cross-fade.
    material.uniforms.uOpacity.value = 1;
    mesh.visible = mode === "event" ? travel > 0.002 : travel < 0.998;
    if (!mesh.visible) return;

    if (mode === "earth") {
      mesh.position.x = viewport.width * 1.12 * travel;
      mesh.position.y = -viewport.height * 0.08 * travel;
      mesh.scale.setScalar(1 + travel * 0.1);
    } else {
      const remainingTravel = 1 - travel;
      mesh.position.x = viewport.width * 1.08 * remainingTravel;
      mesh.position.y = viewport.height * 0.04 * remainingTravel;
      mesh.scale.setScalar(0.84 + travel * 0.16);
    }

    if (!isMobile) {
      timeRef.current += Math.min(delta, 0.1);
      material.uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      renderOrder={mode === "event" ? -4 : -5}
    >
      <planeGeometry
        args={[
          viewport.width * (mode === "event" ? 1.18 : 1.08),
          viewport.height * (mode === "event" ? 1.18 : 1.08),
        ]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={FULLSCREEN_VS}
        fragmentShader={PLATE_FS}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function EarthHorizon({
  heroProgressRef,
  isMobile,
}: EarthHorizonProps) {
  return (
    <ImagePlate
      progressRef={heroProgressRef}
      src="/images/celestial/earth-horizon-fallback.png"
      mode="earth"
      isMobile={isMobile}
    />
  );
}

export function EventHorizon({
  contactProgressRef,
  isMobile,
}: EventHorizonProps) {
  return (
    <ImagePlate
      progressRef={contactProgressRef}
      src="/images/celestial/event-horizon-plate.png"
      mode="event"
      isMobile={isMobile}
    />
  );
}
