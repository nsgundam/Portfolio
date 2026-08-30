import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import {
  EarthHorizon,
  EventHorizon,
} from "./CelestialBodies";

// ─── Utility ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(min: number, max: number, value: number): number {
  const t = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ScrollRef = MutableRefObject<number>;

interface MouseState {
  x:  number;   // normalised 0-1
  y:  number;   // normalised 0-1 (flipped for GLSL)
  dx: number;   // raw client-space delta (pixels/frame, decays)
}
type MouseRef = MutableRefObject<MouseState>;

function buildStarPositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const isBand = Math.random() < 1;
    let x, y, z;

    if (isBand) {
      // Spread widely across X
      x = (Math.random() - 0.5) * 4000;
      
      // Gaussian-like distribution for Y to cluster them tightly in the middle but fade out smoothly
      const gy = (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2; 
      
      // Band angles slightly upwards (slope 0.25)
      y = gy * 500 + (x * 0.25); 
      
      // Z spread also clustered, pushed back slightly
      const gz = (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
      z = gz * 800 - 200;
    } else {
      // Remaining 25% scattered randomly
      x = (Math.random() - 0.5) * 4000;
      y = (Math.random() - 0.5) * 2500;
      z = (Math.random() - 0.5) * 1500;
    }

    arr[i * 3]     = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

const STAR_POSITIONS_DESKTOP = buildStarPositions(12000);
const STAR_POSITIONS_MOBILE  = buildStarPositions(4000);

// ─── Token Palette Helper ──────────────────────────────────────────────────

interface ThemePalette {
  bg:          THREE.Color;
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
    accent:      getCssColor("--color-accent"),
    accentLight: getCssColor("--color-accent-light"),
    accentDark:  getCssColor("--color-accent-dark"),
    textPrimary: getCssColor("--color-text-primary"),
  };
}

// ─── Layer 1: Star Field ──────────────────────────────────────────────────────

interface StarFieldProps {
  scrollRef:      ScrollRef;
  aboutScrollRef: ScrollRef;
  isMobile:       boolean;
  color:          THREE.Color;
}

function StarField({ scrollRef, aboutScrollRef, isMobile, color }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = isMobile ? STAR_POSITIONS_MOBILE : STAR_POSITIONS_DESKTOP;
  const timeAccRef = useRef(0);

  useFrame((_state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    timeAccRef.current += delta;

    // Stars arrive from deep space as Earth departs, then recede beyond the
    // camera's far field before Projects. No opacity cross-fade is used.
    const heroP = scrollRef.current;
    const aboutP = aboutScrollRef.current;
    const arrival = smoothstep(0.04, 0.3, heroP);
    const departure = smoothstep(0.72, 1, aboutP);
    pts.visible = arrival > 0.002 && departure < 0.998;
    if (!pts.visible) return;

    pts.position.z = -2600 * (1 - arrival) - 2600 * departure;
    const depthScale = 0.72 + arrival * 0.28 - departure * 0.18;
    pts.scale.setScalar(depthScale);

    // Subtle field drift
    pts.rotation.y += 0.00005 * delta * 60;
    pts.rotation.x  = Math.sin(timeAccRef.current * 0.02) * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.5}
        sizeAttenuation
        transparent
        opacity={0.82}
        depthWrite={false}
      />
    </points>
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
  mouseRef:  MouseRef;
  isMobile:  boolean;
  palette:   ThemePalette;
}

function AuroraPlane({ scrollRef, mouseRef, isMobile, palette }: AuroraPlaneProps) {
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
    const isFaded = p >= 0.25;

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
}

function CameraController({ scrollRef }: CameraControllerProps) {
  useFrame(({ camera }, delta) => {
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
  positionRef: MutableRefObject<THREE.Vector3>;
}

function SpaceshipModel({ scrollRef, positionRef }: SpaceshipModelProps) {
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
}

function SpaceshipGroup({ scrollRef }: SpaceshipGroupProps) {
  const shipPosRef = useRef(new THREE.Vector3(2, -0.5, -120));

  return (
    <>
      <SpaceshipModel
        scrollRef={scrollRef}
        positionRef={shipPosRef}
      />
    </>
  );
}

// ─── Scene Contents (everything inside Canvas) ───────────────────────────────

interface SceneContentsProps {
  scrollRef:      ScrollRef;
  aboutScrollRef: ScrollRef;
  contactScrollRef: ScrollRef;
  mouseRef:       MouseRef;
  isMobile:       boolean;
  palette:        ThemePalette;
  eventAssetsReady: boolean;
}

function SceneContents({
  scrollRef,
  aboutScrollRef,
  contactScrollRef,
  mouseRef,
  isMobile,
  palette,
  eventAssetsReady,
}: SceneContentsProps) {
  return (
    <>
      {/* Warm deep-black scene background matching --color-bg */}
      <color attach="background" args={[palette.bg]} />

      {/* Warm accent lights — token palette */}
      <ambientLight     intensity={0.4}  color={palette.accentLight} />
      <directionalLight position={[3, 5, 2]}   intensity={1.6}  color={palette.accentLight} />
      <pointLight       position={[-4, -3, 3]}  intensity={0.25} color={palette.accentDark} />

      <CameraController scrollRef={scrollRef} />

      {/* Earth establishes the Hero horizon behind the existing aurora and ship journey. */}
      <Suspense fallback={null}>
        <EarthHorizon
          heroProgressRef={scrollRef}
          isMobile={isMobile}
        />
      </Suspense>

      {/* Render Aurora first, then Stars, so stars appear on top across Hero and About. */}
      <AuroraPlane scrollRef={scrollRef} mouseRef={mouseRef} isMobile={isMobile} palette={palette} />
      <StarField   scrollRef={scrollRef} aboutScrollRef={aboutScrollRef} isMobile={isMobile} color={palette.textPrimary} />

      {/* Event assets are deferred until the visitor approaches the lower page. */}
      {eventAssetsReady && (
        <Suspense fallback={null}>
          <EventHorizon
            contactProgressRef={contactScrollRef}
            isMobile={isMobile}
          />
        </Suspense>
      )}

      {/* Spaceship loads async — Suspense prevents canvas stall */}
      <Suspense fallback={null}>
        <SpaceshipGroup scrollRef={scrollRef} />
      </Suspense>
    </>
  );
}

// ─── Reduced Motion Fallback ──────────────────────────────────────────────────

function ReducedMotionFallback() {
  const [activeStage, setActiveStage] = useState<"earth" | "event" | "quiet">("earth");

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contact");
    if (!hero || !contact) return;

    const updateStage = () => {
      const viewportMiddle = window.innerHeight * 0.5;
      const heroRect = hero.getBoundingClientRect();
      const contactRect = contact.getBoundingClientRect();

      if (contactRect.top <= viewportMiddle && contactRect.bottom >= 0) {
        setActiveStage("event");
      } else if (heroRect.top <= viewportMiddle && heroRect.bottom >= 0) {
        setActiveStage("earth");
      } else {
        setActiveStage("quiet");
      }
    };

    updateStage();
    window.addEventListener("scroll", updateStage, { passive: true });
    window.addEventListener("resize", updateStage);
    return () => {
      window.removeEventListener("scroll", updateStage);
      window.removeEventListener("resize", updateStage);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        zIndex:        -1,
        pointerEvents: "none",
        backgroundColor: "var(--color-bg)",
        backgroundImage: [
          activeStage === "earth"
            ? "linear-gradient(90deg, var(--color-bg) 0%, transparent 58%), url('/images/celestial/earth-horizon-fallback.png')"
            : activeStage === "event"
              ? "linear-gradient(90deg, var(--color-bg) 0%, transparent 52%), url('/images/celestial/event-horizon-plate.png')"
              : "radial-gradient(ellipse 60% 40% at 25% 60%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)",
        ].join(", "),
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    />
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export interface SpaceSceneProps {
  preloaderDone: boolean;
}

export function SpaceScene({ preloaderDone }: SpaceSceneProps) {
  const scrollRef      = useRef(0);
  const aboutScrollRef = useRef(0);
  const contactScrollRef = useRef(0);
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const [eventAssetsReady, setEventAssetsReady] = useState(false);

  // Richer mouse state: x, y (normalised), dx (raw delta pixels, decays per frame)
  const mouseRef = useRef<MouseState>({ x: 0.5, y: 0.5, dx: 0 });

  const isMobile = useMemo(
    () => window.matchMedia("(max-width: 767px)").matches,
    [],
  );

  const palette = useMemo(() => readThemePalette(), []);

  // Defer the 1.5 MB Event Horizon plate until Projects approaches the viewport.
  useEffect(() => {
    if (!preloaderDone || eventAssetsReady) return;
    const projects = document.getElementById("projects");
    const contact = document.getElementById("contact");
    if (!projects || !contact) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEventAssetsReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );

    observer.observe(projects);
    observer.observe(contact);
    return () => observer.disconnect();
  }, [eventAssetsReady, preloaderDone]);

  // ── Mouse tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    let lastClientX = window.innerWidth * 0.5;

    const onMove = (e: PointerEvent) => {
      const rawDx = e.clientX - lastClientX;
      lastClientX  = e.clientX;
      mouseRef.current = {
        x:  e.clientX / window.innerWidth,
        y:  1 - e.clientY / window.innerHeight, // flip Y for GLSL
        dx: rawDx,                               // px per event (decayed in useFrame)
      };
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // ── Master ScrollTrigger ──────────────────────────────────────────────────
  // Lives OUTSIDE the Canvas — GSAP + R3F co-exist via refs, no dual RAF.
  // Single master range derived from responsive Hero/About pin distances and viewport geometry.
  // Rule: never initialise before preloaderDone.
  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id:      "space-scene-master",
        trigger: "#hero",
        start:   "top top",
        end: () => {
          const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
          const isTabletViewport = window.matchMedia(
            "(min-width: 768px) and (max-width: 1024px)",
          ).matches;
          const heroPin = isMobileViewport ? 0 : isTabletViewport ? 1700 * 0.6 : 1700;
          const aboutPin = isMobileViewport ? 0 : isTabletViewport ? 900 * 0.6 : 900;
          return `+=${heroPin + window.innerHeight + aboutPin + window.innerHeight}`;
        },
        invalidateOnRefresh: true,
        scrub:   0.8,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const scrollY = self.scroll();
          const H = window.innerHeight;
          const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
          const isTabletViewport = window.matchMedia(
            "(min-width: 768px) and (max-width: 1024px)",
          ).matches;
          const heroPin = isMobileViewport ? 0 : isTabletViewport ? 1700 * 0.6 : 1700;
          const aboutPin = isMobileViewport ? 0 : isTabletViewport ? 900 * 0.6 : 900;

          // 1. Hero progress (0 → 1.0 over scrollY: 0 → heroPin + H)
          const heroRange = heroPin + H;
          const heroProgress = Math.min(1, Math.max(0, scrollY / heroRange));
          scrollRef.current = heroProgress;

          // 2. About progress (0 → 1.0 over scrollY: heroPin → heroPin + H + aboutPin + 0.6 * H)
          // 0.0: About begins rising into viewport as Hero unpins
          // ~0.38: About reaches viewport top and pins
          // ~0.77: About finishes pin
          // 1.0: About released and faded before Projects
          const aboutStart = heroPin;
          const aboutTotal = H + aboutPin + 0.6 * H;
          const aboutProgress = Math.min(1, Math.max(0, (scrollY - aboutStart) / aboutTotal));
          aboutScrollRef.current = aboutProgress;

          // Decay mouse dx so it doesn't accumulate between scroll ticks.
          mouseRef.current.dx *= 0.85;
        },
      });

      ScrollTrigger.create({
        id: "space-scene-contact",
        trigger: "#contact",
        start: "top bottom",
        end: "top 20%",
        invalidateOnRefresh: true,
        refreshPriority: -100,
        onUpdate: (self) => {
          contactScrollRef.current = self.progress;
        },
        onRefresh: (self) => {
          contactScrollRef.current = self.progress;
        },
        onLeaveBack: () => {
          contactScrollRef.current = 0;
        },
        onLeave: () => { contactScrollRef.current = 1; },
      });
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  if (prefersReducedMotion()) return <ReducedMotionFallback />;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        zIndex:        -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: !isMobile, alpha: true }}
        dpr={isMobile ? 1 : Math.min(devicePixelRatio, 1.5)}
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 2000 }}
        style={{ display: "block" }}
      >
        <SceneContents
          scrollRef={scrollRef}
          aboutScrollRef={aboutScrollRef}
          contactScrollRef={contactScrollRef}
          mouseRef={mouseRef}
          isMobile={isMobile}
          palette={palette}
          eventAssetsReady={eventAssetsReady}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3D/lego_ship.glb");
