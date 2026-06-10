import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";

// ─── Utility ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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

// ─── Layer 1: Star Field ──────────────────────────────────────────────────────

interface StarFieldProps {
  scrollRef: ScrollRef;
  isMobile:  boolean;
}

function StarField({ scrollRef, isMobile }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = isMobile ? STAR_POSITIONS_MOBILE : STAR_POSITIONS_DESKTOP;
  const count     = positions.length / 3;

  useFrame(({ clock }, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    // Fade IN as aurora fades out (0 → 0.30 progress)
    (pts.material as THREE.PointsMaterial).opacity =
      Math.min(scrollRef.current / 0.5, 1.0);

    // Subtle field drift
    pts.rotation.y += 0.00005 * delta * 60;
    pts.rotation.x  = Math.sin(clock.elapsedTime * 0.02) * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#EDE6D6"
        size={0.5}
        sizeAttenuation
        transparent
        opacity={0}
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
    uniform vec3  uColor;
    uniform float uSpeed;
    uniform float uFade;

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
        sineAcc   += sin(layer) + 3.0 * p;
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
      p         = 0.5 * pow(1.0 - p, 2.0);

      float t     = uSpeed * uTime;
      float noise = neuroShape(uv, t, p);
      noise = 1.2 * pow(noise, 2.0);
      noise += pow(noise, 5.0);
      noise = max(0.0, noise - 0.3);
      noise *= (1.0 - length(vUv - 0.5));

      vec3 c1 = vec3(0.0,  0.91, 0.48);
      vec3 c2 = vec3(0.48, 0.31, 0.75);
      vec3 c3 = vec3(0.31, 0.76, 0.97);
      vec3 c4 = vec3(1.0,  0.24, 0.43);
      vec3 col = mix(c1, c2, vUv.x + 0.2 * sin(t));
      col      = mix(col, c3, vUv.y + 0.2 * cos(t));
      col      = mix(col, c4, smoothstep(0.5, 1.5, noise));
      col     *= noise * uColor;

      gl_FragColor = vec4(col, noise * (1.0 - uFade));
    }
  `;
}

interface AuroraPlaneProps {
  scrollRef: ScrollRef;
  mouseRef:  MouseRef;
  isMobile:  boolean;
}

function AuroraPlane({ scrollRef, mouseRef, isMobile }: AuroraPlaneProps) {
  const { viewport, size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime:    { value: 0 },
      uRatio:   { value: size.width / size.height },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uColor:   { value: new THREE.Vector3(1, 1, 1) },
      uSpeed:   { value: 0.0004 },
      uFade:    { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const fragmentShader = useMemo(
    () => buildAuroraFS(isMobile ? 8 : 15),
    [isMobile],
  );

  useFrame(({ clock }) => {
    const mat = matRef.current;
    if (!mat) return;
    const p = scrollRef.current;
    mat.uniforms.uTime.value    = clock.elapsedTime * 1000;
    mat.uniforms.uFade.value    = Math.min(p / 0.25, 1.0);
    mat.uniforms.uRatio.value   = size.width / size.height;
    mat.uniforms.uPointer.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh position={[0, 0, 0]} key={`aurora-${size.width}-${size.height}`}>
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
// Tweens camera.position.x during beat 0.50–0.75 for the side-angle reveal.
// Returns null — purely a side-effect component.

interface CameraControllerProps {
  scrollRef: ScrollRef;
}

function CameraController({ scrollRef }: CameraControllerProps) {
  useFrame(({ camera }) => {
    const p = scrollRef.current;
    let targetX = 0;

    if (p > 0.5 && p <= 0.75) {
      // Ease camera right as ship sweeps past
      targetX = lerp(0, 2, (p - 0.5) / 0.25);
    } else if (p > 0.75 && p <= 0.9) {
      // Continue drifting as ship exits
      targetX = lerp(2, 2.5, (p - 0.75) / 0.15);
    } else if (p > 0.9) {
      targetX = 2.5;
    }

    // Smooth easing — avoid abrupt snap when reversing scroll
    camera.position.x += (targetX - camera.position.x) * 0.06;
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

  useFrame((_state, delta) => {
    const p     = scrollRef.current;
    const group = groupRef.current;
    if (!group) return;

    group.visible = p >= 0.07;

    // Ship faces its travel direction — nose-forward orientation
    // Smooth easing via lerp to avoid abrupt snaps
    const dt = Math.min(delta * 60, 2); // cap frame-rate independence

    // ── Beat 0 → 0.25 ─ distant approach, a faint glint in deep space ────
    if (p <= 0.25) {
      const bp = p / 0.25;
      group.position.set(
        lerp(2, 0.5, bp),           // drifts from right toward center
        lerp(-0.5, 0, bp),          // subtle vertical rise
        lerp(-80, -18, bp),         // approaching from far away
      );
      group.scale.setScalar(lerp(0.05, 0.18, bp));
      // Gentle yaw — ship is angled slightly as it approaches
      group.rotation.y = lerp(-0.3, -0.1, bp);
      group.rotation.x = lerp(0.05, 0.02, bp);  // slight pitch
      group.rotation.z = 0;
    }
    // ── Beat 0.25 → 0.50 ─ glides closer, clearly visible ────────────────
    else if (p <= 0.5) {
      const bp = (p - 0.25) / 0.25;
      group.position.set(
        lerp(0.5, -0.3, bp),        // drifts slightly left
        lerp(0, 0.2, bp),           // gentle ascent
        lerp(-18, -3, bp),          // closing distance
      );
      group.scale.setScalar(lerp(0.18, 0.5, bp));
      group.rotation.y = lerp(-0.1, 0, bp);     // straightens heading
      group.rotation.x = lerp(0.02, 0, bp);     // levels pitch
      group.rotation.z = lerp(0, -0.03, bp);    // micro bank
    }
    // ── Beat 0.50 → 0.75 ─ sweeps past camera on a smooth arc ────────────
    else if (p <= 0.75) {
      const bp = (p - 0.5) / 0.25;
      group.position.set(
        lerp(-0.3, -1.5, bp),       // arcs to the left
        lerp(0.2, 0.8, bp),         // rises slightly
        lerp(-3, 10, bp),           // passes behind camera
      );
      group.scale.setScalar(lerp(0.5, 0.55, bp));
      group.rotation.y = lerp(0, 0.4, bp);      // yaw into the arc
      group.rotation.x = lerp(0, -0.08, bp);    // nose-up
      group.rotation.z = lerp(-0.03, -0.15, bp); // banks into turn
    }
    // ── Beat 0.75 → 0.90 ─ exit upper-right with a banking turn ──────────
    else if (p <= 0.9) {
      const bp = (p - 0.75) / 0.15;
      group.position.set(
        lerp(-1.5, 3.5, bp),        // sweeps right for exit
        lerp(0.8, 2.0, bp),         // climbs away
        lerp(10, 24, bp),           // accelerates into distance
      );
      group.scale.setScalar(lerp(0.55, 0.35, bp)); // shrinks as it departs
      group.rotation.y = lerp(0.4, 1.0, bp);      // continues yaw
      group.rotation.x = lerp(-0.08, -0.2, bp);   // pitches up to exit
      group.rotation.z = lerp(-0.15, -0.3, bp);   // deeper bank
    }

    // Share position with GhostTrail and CometTail
    positionRef.current.copy(group.position);
  });

  return (
    <group ref={groupRef} position={[0, 0, -80]} scale={0.05}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Spaceship Group (GLTF Suspense boundary) ─────────────────────────────────

interface SpaceshipGroupProps {
  scrollRef: ScrollRef;
}

function SpaceshipGroup({ scrollRef }: SpaceshipGroupProps) {
  const shipPosRef = useRef(new THREE.Vector3(0, 0, -80));

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
  scrollRef: ScrollRef;
  mouseRef:  MouseRef;
  isMobile:  boolean;
}

function SceneContents({ scrollRef, mouseRef, isMobile }: SceneContentsProps) {
  return (
    <>
      {/* Warm deep-black scene background matching --color-bg */}
      <color attach="background" args={[0x080706]} />

      {/* Warm accent lights — DEC-011 gold palette */}
      <ambientLight     intensity={0.4}  color="#FFF0D0" />
      <directionalLight position={[3, 5, 2]}   intensity={1.6}  color="#FFE8A0" />
      <pointLight       position={[-4, -3, 3]}  intensity={0.25} color="#C4A97D" />

      <CameraController scrollRef={scrollRef} />

      {/* Render Aurora first, then Stars, so stars appear on top */}
      <AuroraPlane scrollRef={scrollRef} mouseRef={mouseRef} isMobile={isMobile} />
      <StarField   scrollRef={scrollRef} isMobile={isMobile} />

      {/* Spaceship loads async — Suspense prevents canvas stall */}
      <Suspense fallback={null}>
        <SpaceshipGroup scrollRef={scrollRef} />
      </Suspense>
    </>
  );
}

// ─── Reduced Motion Fallback ──────────────────────────────────────────────────

function ReducedMotionFallback() {
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
  preloaderDone: boolean;
}

export function SpaceScene({ preloaderDone }: SpaceSceneProps) {
  const scrollRef  = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Richer mouse state: x, y (normalised), dx (raw delta pixels, decays per frame)
  const mouseRef = useRef<MouseState>({ x: 0.5, y: 0.5, dx: 0 });

  const isMobile = useMemo(
    () => window.matchMedia("(max-width: 767px)").matches,
    [],
  );

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

  // ── ScrollTrigger ────────────────────────────────────────────────────────
  // Lives OUTSIDE the Canvas — GSAP + R3F co-exist via refs, no dual RAF.
  // Rule: never initialise before preloaderDone.
  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id:      "space-scene",
        trigger: "#hero",
        start:   "top top",
        end:     "+=1200",   // must match Hero's pinDistance
        scrub:   1.5,
        onUpdate: (self) => {
          scrollRef.current = self.progress;

          // Canvas wrapper opacity fade at beat 0.90 → 1.0
          if (wrapperRef.current) {
            const p       = self.progress;
            const opacity = p > 0.9
              ? Math.max(0, 1 - (p - 0.9) / 0.1)
              : 1;
            wrapperRef.current.style.opacity = String(opacity);
          }

          // Decay mouse dx so it doesn't accumulate between scroll ticks
          mouseRef.current.dx *= 0.85;
        },
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
        willChange:    "opacity",
      }}
    >
      <Canvas
        gl={{ antialias: !isMobile, alpha: true }}
        dpr={Math.min(devicePixelRatio, 1.5)}
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 2000 }}
        style={{ display: "block" }}
      >
        <SceneContents
          scrollRef={scrollRef}
          mouseRef={mouseRef}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3D/lego_ship.glb");
