import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "../../lib/motion";
import { EarthHorizon } from "./EarthHorizon";
import { EventHorizon } from "./EventHorizon";
import { NebulaField } from "./NebulaField";
import { SolarPassage } from "./SolarPassage";
import type {
  JourneyController,
  JourneyEnvironmentProgress,
  JourneySection,
} from "../../types/journey";

// ─── Utility ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ScrollRef = MutableRefObject<number>;
interface MouseState {
  x:  number;   // normalised 0-1
  y:  number;   // normalised 0-1 (flipped for GLSL)
}
type MouseRef = MutableRefObject<MouseState>;

interface DecorativeAssetBoundaryProps {
  children: ReactNode;
}

interface DecorativeAssetBoundaryState {
  hasError: boolean;
}

class DecorativeAssetBoundary extends Component<
  DecorativeAssetBoundaryProps,
  DecorativeAssetBoundaryState
> {
  state: DecorativeAssetBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DecorativeAssetBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

type StarLayerName = "far" | "mid" | "near";

interface StarLayerConfig {
  name: StarLayerName;
  desktopCount: number;
  mobileCount: number;
  xySpread: number;
  ySpread: number;
  depthNear: number;
  depthFar: number;
  size: number;
  opacity: number;
  parallax: number;
  travel: number;
  seed: number;
}

const STAR_LAYER_CONFIGS: readonly StarLayerConfig[] = [
  {
    name: "far",
    desktopCount: 6500,
    mobileCount: 2200,
    xySpread: 4200,
    ySpread: 720,
    depthNear: 420,
    depthFar: 1700,
    size: 0.9,
    opacity: 0.46,
    parallax: 0.008,
    travel: 1.2,
    seed: 1701,
  },
  {
    name: "mid",
    desktopCount: 4000,
    mobileCount: 1300,
    xySpread: 2600,
    ySpread: 520,
    depthNear: 120,
    depthFar: 900,
    size: 0.62,
    opacity: 0.68,
    parallax: 0.018,
    travel: 2.4,
    seed: 2903,
  },
  {
    name: "near",
    desktopCount: 1500,
    mobileCount: 500,
    xySpread: 1500,
    ySpread: 360,
    depthNear: 24,
    depthFar: 430,
    size: 0.38,
    opacity: 0.82,
    parallax: 0.035,
    travel: 4.2,
    seed: 4127,
  },
] as const;

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

function buildStarPositions(
  count: number,
  config: StarLayerConfig,
  seedOffset: number,
): Float32Array {
  const arr = new Float32Array(count * 3);
  const random = createSeededRandom(config.seed + seedOffset);

  for (let i = 0; i < count; i++) {
    const x = (random() - 0.5) * config.xySpread;
    const gaussianY = (random() + random() + random() + random() - 2) / 2;
    const y = gaussianY * config.ySpread + x * 0.19;
    const z = -lerp(config.depthNear, config.depthFar, random());

    arr[i * 3]     = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

const STAR_POSITIONS = Object.fromEntries(
  STAR_LAYER_CONFIGS.map((config) => [
    config.name,
    {
      desktop: buildStarPositions(config.desktopCount, config, 0),
      mobile: buildStarPositions(config.mobileCount, config, 10000),
    },
  ]),
) as Record<StarLayerName, { desktop: Float32Array; mobile: Float32Array }>;

// ─── Token Palette Helper ──────────────────────────────────────────────────

interface ThemePalette {
  bg:          THREE.Color;
  surface:     THREE.Color;
  accent:      THREE.Color;
  accentLight: THREE.Color;
  accentDark:  THREE.Color;
  textPrimary: THREE.Color;
}

function getCssColor(varName: string): THREE.Color {
  if (typeof window !== "undefined") {
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (val) {
      return new THREE.Color(val);
    }
  }
  return new THREE.Color();
}

function readThemePalette(): ThemePalette {
  return {
    bg:          getCssColor("--color-bg"),
    surface:     getCssColor("--color-surface"),
    accent:      getCssColor("--color-accent"),
    accentLight: getCssColor("--color-accent-light"),
    accentDark:  getCssColor("--color-accent-dark"),
    textPrimary: getCssColor("--color-text-primary"),
  };
}

// ─── Universe: deterministic far / mid / near star layers ───────────────────

interface StarLayerProps {
  config: StarLayerConfig;
  heroProgressRef: ScrollRef;
  journeyProgressRef: ScrollRef;
  intensityRef: ScrollRef;
  mouseRef: MouseRef;
  isMobile: boolean;
  color: THREE.Color;
}

function StarLayer({
  config,
  heroProgressRef,
  journeyProgressRef,
  intensityRef,
  mouseRef,
  isMobile,
  color,
}: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = isMobile
    ? STAR_POSITIONS[config.name].mobile
    : STAR_POSITIONS[config.name].desktop;

  useFrame((_state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const intensity = intensityRef.current;
    if (intensity <= 0.001) {
      if (pts.visible) pts.visible = false;
      return;
    }

    if (!pts.visible) pts.visible = true;

    const heroP = heroProgressRef.current;
    const starIntro = 0.24 + Math.min(heroP / 0.3, 1) * 0.76;
    const starOpacity = starIntro * intensity * config.opacity;

    (pts.material as THREE.PointsMaterial).opacity = starOpacity;

    const clampedDelta = Math.min(delta, 0.1);
    const targetRotationY = (mouseRef.current.x - 0.5) * config.parallax;
    const targetRotationX = (mouseRef.current.y - 0.5) * config.parallax * 0.55;
    const targetY = -journeyProgressRef.current * config.travel;

    pts.rotation.y = THREE.MathUtils.damp(
      pts.rotation.y,
      targetRotationY,
      4,
      clampedDelta,
    );
    pts.rotation.x = THREE.MathUtils.damp(
      pts.rotation.x,
      targetRotationX,
      4,
      clampedDelta,
    );
    pts.position.y = THREE.MathUtils.damp(
      pts.position.y,
      targetY,
      5,
      clampedDelta,
    );
  });

  return (
    <points ref={pointsRef} name={`${config.name}-stars`}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={config.size}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

interface UniverseProps {
  heroProgressRef: ScrollRef;
  journeyProgressRef: ScrollRef;
  intensityRef: ScrollRef;
  mouseRef: MouseRef;
  isMobile: boolean;
  color: THREE.Color;
}

function Universe(props: UniverseProps) {
  return (
    <group name="universe">
      {STAR_LAYER_CONFIGS.map((config) => (
        <StarLayer key={config.name} config={config} {...props} />
      ))}
    </group>
  );
}

// ─── Layer 2: Aurora Plane (NeuralNoise GLSL port) ───────────────────────────

const AURORA_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function buildAuroraFS(iterations: number): string {
  return /* glsl */ `
    precision mediump float;
    varying vec2  vUv;
    uniform float uTime;
    uniform float uRatio;
    uniform vec2  uPointer;
    uniform float uSpeed;
    uniform float uFade;
    uniform vec3  uAccent;
    uniform vec3  uAccentLight;
    uniform vec3  uAccentDark;
    uniform vec3  uTextPrimary;

    vec2 rot2d(vec2 v, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * v;
    }

    float neuroShape(vec2 uv, float t, float p) {
      vec2  sineAcc = vec2(0.0);
      vec2  res     = vec2(0.0);
      float scale   = 8.0;
      for (int j = 0; j < ${iterations}; j++) {
        uv       = rot2d(uv,      1.0);
        sineAcc  = rot2d(sineAcc, 1.0);
        vec2 layer = uv * scale + float(j) + sineAcc - t;
        sineAcc   += sin(layer) + 0.8 * p;
        res       += (0.5 + 0.5 * cos(layer)) / scale;
        scale     *= 1.2;
      }
      return res.x + res.y;
    }

    void main() {
      vec2 uv  = 0.5 * vUv;
      uv.x    *= uRatio;
      vec2  ptr = vUv - uPointer;
      ptr.x    *= uRatio;
      float p   = clamp(length(ptr), 0.0, 1.0);
      p         = 0.3 * pow(1.0 - p, 2.0);

      float t     = uSpeed * uTime;
      float noise = neuroShape(uv, t, p);
      noise = smoothstep(0.2, 1.1, noise);
      noise = max(0.0, noise - 0.15);
      noise *= (1.0 - length(vUv - 0.5));

      vec3 col = mix(uAccentDark, uAccent, vUv.x + 0.2 * sin(t));
      col      = mix(col, uAccentLight, vUv.y + 0.2 * cos(t));
      col      = mix(col, uTextPrimary, smoothstep(0.4, 1.0, noise));
      col     *= noise;

      gl_FragColor = vec4(col, noise * 0.45 * (1.0 - uFade));
    }
  `;
}

interface AuroraPlaneProps {
  scrollRef: ScrollRef;
  contributionRef: ScrollRef;
  mouseRef:  MouseRef;
  isMobile:  boolean;
  palette:   ThemePalette;
}

function AuroraPlane({
  scrollRef,
  contributionRef,
  mouseRef,
  isMobile,
  palette,
}: AuroraPlaneProps) {
  const { viewport, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const timeAccRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime:        { value: 0 },
      uRatio:       { value: size.width / size.height },
      uPointer:     { value: new THREE.Vector2(0.5, 0.5) },
      uSpeed:       { value: 0.0004 },
      uFade:        { value: 0 },
      uAccent:      { value: palette.accent },
      uAccentLight: { value: palette.accentLight },
      uAccentDark:  { value: palette.accentDark },
      uTextPrimary: { value: palette.textPrimary },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette],
  );

  const fragmentShader = useMemo(
    () => buildAuroraFS(isMobile ? 8 : 15),
    [isMobile],
  );

  useFrame((_state, delta) => {
    const p = scrollRef.current;
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    // Fully faded out once Hero progress reaches 0.25 (uFade = 1.0 -> alpha = 0.0)
    const isFaded = p >= 0.25 || contributionRef.current <= 0.001;

    if (isFaded) {
      if (mesh.visible) {
        mat.uniforms.uFade.value = 1.0;
        mesh.visible = false;
      }
      return; // Skip time accumulation and all uniform work once fade is complete
    }

    if (!mesh.visible) {
      mesh.visible = true;
    }

    timeAccRef.current += delta;
    mat.uniforms.uTime.value    = timeAccRef.current * 1000;
    mat.uniforms.uFade.value    = Math.min(p / 0.25, 1.0);
    mat.uniforms.uRatio.value   = size.width / size.height;
    mat.uniforms.uPointer.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} key={`aurora-${size.width}-${size.height}`}>
      {/* 1.05x safety scale ensures no black borders from viewport rounding or perspective */}
      <planeGeometry args={[viewport.width * 1.05, viewport.height * 1.05]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={AURORA_VS}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Layer 3: Camera Controller ───────────────────────────────────────────────
// Tweens camera.position.x during beat 0.50–0.98 for the side-angle reveal and departure.
// Returns null — purely a side-effect component.

interface CameraControllerProps {
  scrollRef: ScrollRef;
  contributionRef: ScrollRef;
}

function CameraController({ scrollRef, contributionRef }: CameraControllerProps) {
  useFrame(({ camera }, delta) => {
    if (contributionRef.current <= 0.001) {
      camera.position.x = 0;
      return;
    }

    const p = scrollRef.current;
    let targetX = 0;

    if (p > 0.5 && p <= 0.75) {
      // Subtle camera ease right as ship sweeps left
      targetX = lerp(0, 0.5, (p - 0.5) / 0.25);
    } else if (p > 0.75 && p <= 0.93) {
      // Hold targetX=0.5 while ship departs upper-left so camera doesn't recenter against flight
      targetX = 0.5;
    } else if (p > 0.93 && p <= 0.99) {
      // Smoothly recenter camera after ship is physically offscreen
      targetX = lerp(0.5, 0, (p - 0.93) / 0.06);
    } else if (p > 0.99) {
      targetX = 0;
    }

    // Frame-rate-independent smooth damping toward targetX
    const clampedDelta = Math.min(delta, 0.1);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, clampedDelta);
  });

  return null;
}

// ─── Layer 4: Spaceship Model ─────────────────────────────────────────────────

interface SpaceshipModelProps {
  scrollRef:   ScrollRef;
  contributionRef: ScrollRef;
  positionRef: MutableRefObject<THREE.Vector3>;
}

function SpaceshipModel({
  scrollRef,
  contributionRef,
  positionRef,
}: SpaceshipModelProps) {
  const { scene } = useGLTF("/3D/lego_ship.glb");
  const groupRef  = useRef<THREE.Group>(null!);

  // Target vectors to avoid GC allocation per frame
  const targetPos = useMemo(() => new THREE.Vector3(2, -0.5, -120), []);
  const targetRot = useMemo(() => new THREE.Euler(0.05, -0.3, 0), []);
  const targetScaleRef = useRef(0.02);

  useFrame((_state, delta) => {
    const p     = scrollRef.current;
    const group = groupRef.current;
    if (!group) return;

    if (contributionRef.current <= 0.001) {
      if (group.visible) group.visible = false;
      return;
    }

    // Visibility: visible from early hero approach onwards; physical frustum exit handles departure
    group.visible = p >= 0.07;
    if (!group.visible && p < 0.05) return;

    // Ship faces its travel direction — nose-forward orientation
    // ── Easing Functions ──────────────────────────────────────────────────────
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // ── Beat 0 → 0.25 ─ distant approach, a faint glint in deep space ────
    if (p <= 0.25) {
      const bp = Math.max(0, p / 0.25);
      const easedBp = easeOutCubic(bp);

      targetPos.set(
        lerp(2, 0.5, bp),
        lerp(-0.5, 0, bp),
        lerp(-120, -30, bp),
      );
      targetScaleRef.current = lerp(0.02, 0.12, easedBp);

      targetRot.set(
        lerp(0.05, 0.02, bp),
        lerp(-0.3, -0.1, bp),
        0,
      );
    }
    // ── Beat 0.25 → 0.50 ─ glides closer, clearly visible ────────────────
    else if (p <= 0.5) {
      const bp = (p - 0.25) / 0.25;
      const easedBp = easeInOutQuad(bp);

      targetPos.set(
        lerp(0.5, -0.3, bp),
        lerp(0, 0.2, bp),
        lerp(-30, -10, bp),
      );
      targetScaleRef.current = lerp(0.12, 0.35, easedBp);

      targetRot.set(
        lerp(0.02, 0, bp),
        lerp(-0.1, 0, bp),
        lerp(0, -0.03, bp),
      );
    }
    // ── Beat 0.50 → 0.75 ─ sweeps past camera on a smooth arc (remains in front of camera) ──
    else if (p <= 0.75) {
      const bp = (p - 0.5) / 0.25;

      targetPos.set(
        lerp(-0.3, -1.5, bp),
        lerp(0.2, 0.8, bp),
        lerp(-10, -4, bp),
      );
      targetScaleRef.current = lerp(0.35, 0.55, bp);

      targetRot.set(
        lerp(0, -0.08, bp),
        lerp(0, 0.4, bp),
        lerp(-0.03, -0.15, bp),
      );
    }
    // ── Beat 0.75 → 0.93+ ─ departure: decisive translation-first exit through upper-left ──
    else {
      // Map p=0.75 to p=0.93 into a mildly accelerating translation curve around power 1.25
      const bp = Math.min(1, Math.max(0, (p - 0.75) / 0.18));
      const accelBp = Math.pow(bp, 1.25);

      targetPos.set(
        lerp(-1.5, -24.0, accelBp),
        lerp(0.8, 12.0, accelBp),
        lerp(-4, -6.0, bp),
      );
      // Z and scale changes remain subordinate
      targetScaleRef.current = lerp(0.55, 0.48, bp);

      // Lock rotation exactly at close-pass orientation; do not interpolate rotation during departure
      targetRot.set(-0.08, 0.40, -0.15);
    }

    // Frame-rate-independent damping toward target transforms (faster position lambda to follow scroll decisively)
    const posLambda = 16;
    const rotLambda = 10;
    const clampedDelta = Math.min(delta, 0.1);

    group.position.x = THREE.MathUtils.damp(group.position.x, targetPos.x, posLambda, clampedDelta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetPos.y, posLambda, clampedDelta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetPos.z, posLambda, clampedDelta);

    const currentScale = group.scale.x;
    const nextScale = THREE.MathUtils.damp(currentScale, targetScaleRef.current, posLambda, clampedDelta);
    group.scale.setScalar(nextScale);

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetRot.x, rotLambda, clampedDelta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRot.y, rotLambda, clampedDelta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, targetRot.z, rotLambda, clampedDelta);

    positionRef.current.copy(group.position);
  });

  return (
    <group ref={groupRef} position={[2, -0.5, -120]} scale={0.02}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Spaceship Group (GLTF Suspense boundary) ─────────────────────────────────

interface SpaceshipGroupProps {
  scrollRef: ScrollRef;
  contributionRef: ScrollRef;
}

function SpaceshipGroup({ scrollRef, contributionRef }: SpaceshipGroupProps) {
  const shipPosRef = useRef(new THREE.Vector3(2, -0.5, -120));

  return (
    <>
      <SpaceshipModel
        scrollRef={scrollRef}
        contributionRef={contributionRef}
        positionRef={shipPosRef}
      />
    </>
  );
}

// ─── Camera / environment responsibilities inside the single Canvas ─────────

interface HeroEnvironmentProps {
  heroProgressRef: ScrollRef;
  contributionRef: ScrollRef;
  mouseRef: MouseRef;
  isMobile: boolean;
  palette: ThemePalette;
}

function HeroEnvironment({
  heroProgressRef,
  contributionRef,
  mouseRef,
  isMobile,
  palette,
}: HeroEnvironmentProps) {
  return (
    <group name="hero-environment">
      <EarthHorizon
        progressRef={heroProgressRef}
        contributionRef={contributionRef}
        isMobile={isMobile}
        palette={{
          background: palette.bg,
          surface: palette.surface,
          accent: palette.accent,
          accentDark: palette.accentDark,
          starlight: palette.textPrimary,
        }}
      />

      <AuroraPlane
        scrollRef={heroProgressRef}
        contributionRef={contributionRef}
        mouseRef={mouseRef}
        isMobile={isMobile}
        palette={palette}
      />

      <DecorativeAssetBoundary>
        <Suspense fallback={null}>
          <SpaceshipGroup
            scrollRef={heroProgressRef}
            contributionRef={contributionRef}
          />
        </Suspense>
      </DecorativeAssetBoundary>
    </group>
  );
}

interface SceneContentsProps {
  heroProgressRef: ScrollRef;
  projectsProgressRef: ScrollRef;
  skillsProgressRef: ScrollRef;
  contactProgressRef: ScrollRef;
  journeyProgressRef: ScrollRef;
  heroContributionRef: ScrollRef;
  projectsContributionRef: ScrollRef;
  skillsContributionRef: ScrollRef;
  contactContributionRef: ScrollRef;
  universeIntensityRef: ScrollRef;
  mouseRef: MouseRef;
  isMobile: boolean;
  palette: ThemePalette;
}

function SceneContents({
  heroProgressRef,
  projectsProgressRef,
  skillsProgressRef,
  contactProgressRef,
  journeyProgressRef,
  heroContributionRef,
  projectsContributionRef,
  skillsContributionRef,
  contactContributionRef,
  universeIntensityRef,
  mouseRef,
  isMobile,
  palette,
}: SceneContentsProps) {
  return (
    <>
      {/* Warm deep-black scene background matching --color-bg */}
      <color attach="background" args={[palette.bg]} />

      {/* Warm accent lights — token palette */}
      <ambientLight     intensity={0.4}  color={palette.accentLight} />
      <directionalLight position={[3, 5, 2]}   intensity={1.6}  color={palette.accentLight} />
      <pointLight       position={[-4, -3, 3]}  intensity={0.25} color={palette.accentDark} />

      <CameraController
        scrollRef={heroProgressRef}
        contributionRef={heroContributionRef}
      />

      <HeroEnvironment
        heroProgressRef={heroProgressRef}
        contributionRef={heroContributionRef}
        mouseRef={mouseRef}
        isMobile={isMobile}
        palette={palette}
      />

      <Universe
        heroProgressRef={heroProgressRef}
        journeyProgressRef={journeyProgressRef}
        intensityRef={universeIntensityRef}
        mouseRef={mouseRef}
        isMobile={isMobile}
        color={palette.textPrimary}
      />

      <SolarPassage
        progressRef={projectsProgressRef}
        contributionRef={projectsContributionRef}
        isMobile={isMobile}
        palette={{
          accent: palette.accent,
          accentLight: palette.accentLight,
          accentDark: palette.accentDark,
          starlight: palette.textPrimary,
        }}
      />

      <NebulaField
        progressRef={skillsProgressRef}
        contributionRef={skillsContributionRef}
        isMobile={isMobile}
        palette={{
          accent: palette.accent,
          accentDark: palette.accentDark,
          starlight: palette.textPrimary,
        }}
      />

      <EventHorizon
        progressRef={contactProgressRef}
        contributionRef={contactContributionRef}
        isMobile={isMobile}
        palette={{
          background: palette.bg,
          accent: palette.accent,
          accentLight: palette.accentLight,
          accentDark: palette.accentDark,
          starlight: palette.textPrimary,
        }}
      />
    </>
  );
}

// ─── Static fallback for reduced motion and unavailable WebGL ───────────────

interface StaticSpaceFallbackProps {
  position?: "fixed" | "absolute";
}

function StaticSpaceFallback({
  position = "fixed",
}: StaticSpaceFallbackProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position,
        top:           0,
        left:          0,
        width:         "100%",
        height:        "100%",
        zIndex:        position === "fixed" ? -1 : 0,
        pointerEvents: "none",
        background:    "var(--color-bg)",
        backgroundImage: [
          "radial-gradient(ellipse 60% 40% at 25% 60%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)",
          "radial-gradient(ellipse 40% 30% at 78% 28%, color-mix(in srgb, var(--color-accent) 3%, transparent) 0%, transparent 60%)",
        ].join(", "),
      }}
    />
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export interface SpaceSceneProps {
  journey: JourneyController;
}

const UNIVERSE_INTENSITY: Record<JourneySection, number> = {
  hero: 0.92,
  about: 0.9,
  projects: 0.3,
  skills: 0.22,
  contact: 0.12,
};

function getUniverseIntensity(
  environments: JourneyEnvironmentProgress,
): number {
  return Math.min(
    1,
    (Object.keys(UNIVERSE_INTENSITY) as JourneySection[]).reduce(
      (intensity, section) =>
        intensity + environments[section] * UNIVERSE_INTENSITY[section],
      0,
    ),
  );
}

export function SpaceScene({ journey }: SpaceSceneProps) {
  const initialJourneyState = journey.stateRef.current;
  const heroProgressRef = useRef(initialJourneyState.sectionProgress.hero);
  const projectsProgressRef = useRef(initialJourneyState.sectionProgress.projects);
  const skillsProgressRef = useRef(initialJourneyState.sectionProgress.skills);
  const contactProgressRef = useRef(initialJourneyState.sectionProgress.contact);
  const journeyProgressRef = useRef(initialJourneyState.progress);
  const heroContributionRef = useRef(initialJourneyState.environments.hero);
  const projectsContributionRef = useRef(
    initialJourneyState.environments.projects,
  );
  const skillsContributionRef = useRef(initialJourneyState.environments.skills);
  const contactContributionRef = useRef(initialJourneyState.environments.contact);
  const universeIntensityRef = useRef(
    getUniverseIntensity(initialJourneyState.environments),
  );

  const mouseRef = useRef<MouseState>({ x: 0.5, y: 0.5 });

  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches,
  );

  const palette = useMemo(() => readThemePalette(), []);
  const isReducedMotion = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (isReducedMotion) return;
    const mobileMedia = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mobileMedia.matches);
    mobileMedia.addEventListener("change", updateMobile);
    return () => mobileMedia.removeEventListener("change", updateMobile);
  }, [isReducedMotion]);

  useEffect(
    () => {
      if (isReducedMotion) return;
      return journey.subscribe((state) => {
        heroProgressRef.current = state.sectionProgress.hero;
        projectsProgressRef.current = state.sectionProgress.projects;
        skillsProgressRef.current = state.sectionProgress.skills;
        contactProgressRef.current = state.sectionProgress.contact;
        journeyProgressRef.current = state.progress;
        heroContributionRef.current = state.environments.hero;
        projectsContributionRef.current = state.environments.projects;
        skillsContributionRef.current = state.environments.skills;
        contactContributionRef.current = state.environments.contact;
        universeIntensityRef.current = getUniverseIntensity(state.environments);
      });
    },
    [isReducedMotion, journey],
  );

  // ── Mouse tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isReducedMotion) return;
    const onMove = (e: PointerEvent) => {
      mouseRef.current = {
        x:  e.clientX / window.innerWidth,
        y:  1 - e.clientY / window.innerHeight, // flip Y for GLSL
      };
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isReducedMotion]);

  if (isReducedMotion) return <StaticSpaceFallback />;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100%",
        height:        "100%",
        zIndex:        -1,
        pointerEvents: "none",
        background:    "var(--color-bg)",
      }}
    >
      <Canvas
        gl={{ antialias: !isMobile, alpha: true }}
        dpr={Math.min(devicePixelRatio, isMobile ? 1.15 : 1.5)}
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 2000 }}
        fallback={<StaticSpaceFallback position="absolute" />}
        style={{ display: "block" }}
      >
        <SceneContents
          heroProgressRef={heroProgressRef}
          projectsProgressRef={projectsProgressRef}
          skillsProgressRef={skillsProgressRef}
          contactProgressRef={contactProgressRef}
          journeyProgressRef={journeyProgressRef}
          heroContributionRef={heroContributionRef}
          projectsContributionRef={projectsContributionRef}
          skillsContributionRef={skillsContributionRef}
          contactContributionRef={contactContributionRef}
          universeIntensityRef={universeIntensityRef}
          mouseRef={mouseRef}
          isMobile={isMobile}
          palette={palette}
        />
      </Canvas>
    </div>
  );
}
