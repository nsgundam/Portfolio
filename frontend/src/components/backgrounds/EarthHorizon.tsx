import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;

export interface EarthPalette {
  background: THREE.Color;
  surface: THREE.Color;
  accent: THREE.Color;
  accentDark: THREE.Color;
  starlight: THREE.Color;
}

interface EarthHorizonProps {
  progressRef: ProgressRef;
  contributionRef: ProgressRef;
  isMobile: boolean;
  palette: EarthPalette;
}

const EARTH_VERTEX_SHADER = /* glsl */ `
  varying vec3 vObjectPosition;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vObjectPosition = position;
    vNormalView = normalize(normalMatrix * normal);
    vViewPosition = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const NOISE_GLSL = /* glsl */ `
  float hash31(vec3 point) {
    point = fract(point * 0.1031);
    point += dot(point, point.yzx + 33.33);
    return fract((point.x + point.y) * point.z);
  }

  float valueNoise(vec3 point) {
    vec3 cell = floor(point);
    vec3 fraction = fract(point);
    fraction = fraction * fraction * (3.0 - 2.0 * fraction);

    return mix(
      mix(
        mix(hash31(cell), hash31(cell + vec3(1.0, 0.0, 0.0)), fraction.x),
        mix(hash31(cell + vec3(0.0, 1.0, 0.0)), hash31(cell + vec3(1.0, 1.0, 0.0)), fraction.x),
        fraction.y
      ),
      mix(
        mix(hash31(cell + vec3(0.0, 0.0, 1.0)), hash31(cell + vec3(1.0, 0.0, 1.0)), fraction.x),
        mix(hash31(cell + vec3(0.0, 1.0, 1.0)), hash31(cell + vec3(1.0, 1.0, 1.0)), fraction.x),
        fraction.y
      ),
      fraction.z
    );
  }

  float earthFbm(vec3 point) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * valueNoise(point);
      point = point * 2.03 + vec3(1.7, 2.9, 4.3);
      amplitude *= 0.5;
    }
    return value;
  }
`;

const EARTH_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying vec3 vObjectPosition;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  uniform vec3 uBackground;
  uniform vec3 uSurface;
  uniform vec3 uAccentDark;
  uniform vec3 uStarlight;
  uniform float uOpacity;

  ${NOISE_GLSL}

  void main() {
    vec3 normalView = normalize(vNormalView);
    vec3 viewDirection = normalize(vViewPosition);
    vec3 lightDirection = normalize(vec3(-0.48, 0.62, 0.74));

    float terrain = earthFbm(normalize(vObjectPosition) * 3.4);
    float continent = smoothstep(0.47, 0.66, terrain);
    float daylight = smoothstep(-0.18, 0.78, dot(normalView, lightDirection));
    float rim = pow(1.0 - max(dot(normalView, viewDirection), 0.0), 3.4);

    vec3 nightColor = mix(uBackground, uSurface, 0.45);
    vec3 dayColor = mix(uSurface, uAccentDark, continent * 0.26);
    vec3 color = mix(nightColor, dayColor, daylight * 0.72);
    color = mix(color, uStarlight, rim * daylight * 0.12);

    gl_FragColor = vec4(color, uOpacity);
  }
`;

const CLOUD_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying vec3 vObjectPosition;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  uniform vec3 uCloudColor;
  uniform float uOpacity;

  ${NOISE_GLSL}

  void main() {
    vec3 normalView = normalize(vNormalView);
    vec3 viewDirection = normalize(vViewPosition);
    float cloudNoise = earthFbm(normalize(vObjectPosition) * 5.7 + vec3(3.1, 0.4, 1.8));
    float cloud = smoothstep(0.54, 0.69, cloudNoise);
    float facing = smoothstep(0.0, 0.42, dot(normalView, viewDirection));
    float alpha = cloud * facing * uOpacity;

    if (alpha < 0.002) discard;
    gl_FragColor = vec4(uCloudColor, alpha);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  uniform vec3 uAtmosphereColor;
  uniform float uOpacity;

  void main() {
    vec3 normalView = normalize(vNormalView);
    vec3 viewDirection = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(normalView, viewDirection)), 2.6);
    gl_FragColor = vec4(uAtmosphereColor, fresnel * uOpacity);
  }
`;

function smoothstep(min: number, max: number, value: number): number {
  const normalized = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

export function EarthHorizon({
  progressRef,
  contributionRef,
  isMobile,
  palette,
}: EarthHorizonProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const surfaceMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const cloudMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial>(null!);

  const radius = isMobile ? 7.4 : 9.6;
  const widthSegments = isMobile ? 36 : 64;
  const heightSegments = isMobile ? 24 : 48;
  const basePosition = isMobile
    ? new THREE.Vector3(3.25, -7.65, -10.5)
    : new THREE.Vector3(5.35, -9.85, -11.5);

  const surfaceUniforms = useMemo(
    () => ({
      uBackground: { value: palette.background },
      uSurface: { value: palette.surface },
      uAccentDark: { value: palette.accentDark },
      uStarlight: { value: palette.starlight },
      uOpacity: { value: 0 },
    }),
    [palette],
  );

  const cloudUniforms = useMemo(
    () => ({
      uCloudColor: { value: palette.starlight },
      uOpacity: { value: 0 },
    }),
    [palette],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uAtmosphereColor: { value: palette.accent },
      uOpacity: { value: 0 },
    }),
    [palette],
  );

  useFrame((_state, delta) => {
    const group = groupRef.current;
    const surfaceMaterial = surfaceMaterialRef.current;
    const cloudMaterial = cloudMaterialRef.current;
    const atmosphereMaterial = atmosphereMaterialRef.current;
    if (!group || !surfaceMaterial || !cloudMaterial || !atmosphereMaterial) return;

    const progress = progressRef.current;
    const contribution = contributionRef.current;
    const exitProgress = smoothstep(0.08, isMobile ? 0.34 : 0.48, progress);
    const opacity = contribution * (1 - exitProgress);

    if (opacity <= 0.001) {
      if (group.visible) group.visible = false;
      return;
    }

    if (!group.visible) group.visible = true;

    const clampedDelta = Math.min(delta, 0.1);
    const targetY = basePosition.y - exitProgress * (isMobile ? 2.8 : 5.4);
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      targetY,
      9,
      clampedDelta,
    );
    group.rotation.y = -0.34 + progress * 0.14;
    group.rotation.z = -0.08 + progress * 0.025;

    surfaceMaterial.uniforms.uOpacity.value = opacity * 0.88;
    cloudMaterial.uniforms.uOpacity.value = opacity * (isMobile ? 0.09 : 0.14);
    atmosphereMaterial.uniforms.uOpacity.value = opacity * (isMobile ? 0.22 : 0.32);
  });

  return (
    <group
      ref={groupRef}
      name="earth-horizon"
      position={basePosition}
      rotation={[0.04, -0.34, -0.08]}
    >
      <mesh name="earth-surface" renderOrder={1}>
        <sphereGeometry args={[radius, widthSegments, heightSegments]} />
        <shaderMaterial
          ref={surfaceMaterialRef}
          vertexShader={EARTH_VERTEX_SHADER}
          fragmentShader={EARTH_FRAGMENT_SHADER}
          uniforms={surfaceUniforms}
          transparent
          depthWrite
        />
      </mesh>

      <mesh name="earth-cloud-layer" renderOrder={2}>
        <sphereGeometry args={[radius * 1.006, widthSegments, heightSegments]} />
        <shaderMaterial
          ref={cloudMaterialRef}
          vertexShader={EARTH_VERTEX_SHADER}
          fragmentShader={CLOUD_FRAGMENT_SHADER}
          uniforms={cloudUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh name="earth-atmosphere" renderOrder={3}>
        <sphereGeometry
          args={[radius * 1.035, isMobile ? 28 : 48, isMobile ? 18 : 32]}
        />
        <shaderMaterial
          ref={atmosphereMaterialRef}
          vertexShader={EARTH_VERTEX_SHADER}
          fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
          uniforms={atmosphereUniforms}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
