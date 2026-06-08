import { Suspense, useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { prefersReducedMotion } from '../../lib/motion';

// ─── Utility ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ScrollRef  = MutableRefObject<number>;
type PointerRef = MutableRefObject<{ x: number; y: number }>;

// ─── Module-level random geometry ────────────────────────────────────────────
// Generated once at import time — stable across re-renders.
// Kept outside components to satisfy react-hooks/purity lint rule.

function buildStarPositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 3000; // x ±1500
    arr[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y ±1000
    arr[i * 3 + 2] = (Math.random() - 0.5) * 1000; // z ±500
  }
  return arr;
}

function buildCometPositions(): Float32Array {
  const arr = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 0.5; // x spread
    arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // y spread
    arr[i * 3 + 2] = i * 0.15;                     // z trail depth
  }
  return arr;
}

const STAR_POSITIONS_DESKTOP = buildStarPositions(2000);
const STAR_POSITIONS_MOBILE  = buildStarPositions(800);
const COMET_POSITIONS        = buildCometPositions();

// ─── Layer 1: Star Field ──────────────────────────────────────────────────────

interface StarFieldProps {
  scrollRef: ScrollRef;
  isMobile:  boolean;
}

function StarField({ scrollRef, isMobile }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count     = isMobile ? 800 : 2000;
  const positions = isMobile ? STAR_POSITIONS_MOBILE : STAR_POSITIONS_DESKTOP;

  useFrame(({ clock }, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    // Scroll-driven opacity: stars fade IN as aurora fades out
    (pts.material as THREE.PointsMaterial).opacity =
      Math.min(scrollRef.current / 0.3, 1.0);

    // Subtle drift — twinkle substitute without vertex shader complexity
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
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Layer 2: Aurora Plane (NeuralNoise GLSL port) ────────────────────────────

const AURORA_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Template-literal shader — iterations baked at compile time per device tier
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

      // Original NeuralNoise palette — fully opaque at uFade=0,
      // invisible at uFade=1.0 (scroll beat 0.25)
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
  scrollRef:  ScrollRef;
  pointerRef: PointerRef;
  isMobile:   boolean;
}

function AuroraPlane({ scrollRef, pointerRef, isMobile }: AuroraPlaneProps) {
  const { viewport, size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  // Uniforms are stable objects — updated each frame via ref, never re-created
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

  // Bake shader at correct iteration count — mobile gets 8, desktop 15
  const fragmentShader = useMemo(
    () => buildAuroraFS(isMobile ? 8 : 15),
    [isMobile],
  );

  useFrame(({ clock }) => {
    const mat = matRef.current;
    if (!mat) return;
    const p = scrollRef.current;
    // NeuralNoise used ms (performance.now()), so multiply elapsedTime by 1000
    mat.uniforms.uTime.value    = clock.elapsedTime * 1000;
    mat.uniforms.uFade.value    = Math.min(p / 0.25, 1.0);
    mat.uniforms.uRatio.value   = size.width / size.height;
    mat.uniforms.uPointer.value.set(pointerRef.current.x, pointerRef.current.y);
  });

  // key forces geometry remount on resize so UVs stay viewport-aligned
  return (
    <mesh
      position={[0, 0, -0.1]}
      key={`aurora-${size.width}-${size.height}`}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
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

// ─── Layer 3: Asteroid Model ──────────────────────────────────────────────────

interface AsteroidModelProps {
  scrollRef:   ScrollRef;
  positionRef: MutableRefObject<THREE.Vector3>;
}

function AsteroidModel({ scrollRef, positionRef }: AsteroidModelProps) {
  const { scene } = useGLTF('/3D/asteroid.glb');
  const groupRef  = useRef<THREE.Group>(null!);

  // Adjust existing materials (preserves GLTF textures)
  useEffect(() => {
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh  = child as THREE.Mesh;
      const mats  = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.roughness  = 0.8;
          mat.metalness  = 0.3;
          mat.needsUpdate = true;
        }
      });
    });
  }, [scene]);

  useFrame((_state, delta) => {
    const p     = scrollRef.current;
    const group = groupRef.current;
    if (!group) return;

    // Only visible after beat 0.25
    group.visible = p > 0.25;

    if (p > 0.25 && p <= 0.75) {
      // Entrance: surge from deep space to near camera
      const ap = (p - 0.25) / 0.5;
      group.position.z = lerp(-30, 8, ap);
      group.position.x = 0;
      group.rotation.y += 0.003 * delta * 60;
    } else if (p > 0.75) {
      // Exit: peel off to upper-right
      const ep = Math.min((p - 0.75) / 0.15, 1);
      group.position.z = lerp(8, 20, ep);
      group.position.x = lerp(0, 6, ep);
      group.rotation.y += 0.002 * delta * 60;
    }

    // Expose position to CometTail via shared ref
    positionRef.current.copy(group.position);
  });

  return (
    <group ref={groupRef} visible={false} position={[0, 0, -30]} scale={0.5}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Layer 4: Comet Tail (desktop only) ──────────────────────────────────────

interface CometTailProps {
  scrollRef:    ScrollRef;
  asteroidPosRef: MutableRefObject<THREE.Vector3>;
}

function CometTail({ scrollRef, asteroidPosRef }: CometTailProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const COUNT     = 200;

  useFrame(() => {
    const p   = scrollRef.current;
    const pts = pointsRef.current;
    if (!pts) return;

    const active = p > 0.75 && p < 0.92;
    pts.visible  = active;

    if (active) {
      // Anchor tail to asteroid's current position (offset +0.5 z toward camera)
      const { x, y, z } = asteroidPosRef.current;
      pts.position.set(x, y, z + 0.5);
      // Fade out as asteroid exits
      (pts.material as THREE.PointsMaterial).opacity =
        Math.max(0, 1 - (p - 0.75) / 0.15);
    }
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={COMET_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFD27F"
        size={0.08}
        transparent
        sizeAttenuation
        depthWrite={false}
        opacity={0}
      />
    </points>
  );
}

// ─── Asteroid Group (Suspense boundary) ───────────────────────────────────────

interface AsteroidGroupProps {
  scrollRef: ScrollRef;
  isMobile:  boolean;
}

function AsteroidGroup({ scrollRef, isMobile }: AsteroidGroupProps) {
  // Shared ref — AsteroidModel writes, CometTail reads each frame
  const asteroidPosRef = useRef(new THREE.Vector3(0, 0, -30));

  return (
    <>
      <AsteroidModel scrollRef={scrollRef} positionRef={asteroidPosRef} />
      {!isMobile && (
        <CometTail scrollRef={scrollRef} asteroidPosRef={asteroidPosRef} />
      )}
    </>
  );
}

// ─── Scene Contents (inside Canvas) ──────────────────────────────────────────

interface SceneContentsProps {
  scrollRef:  ScrollRef;
  pointerRef: PointerRef;
  isMobile:   boolean;
}

function SceneContents({ scrollRef, pointerRef, isMobile }: SceneContentsProps) {
  return (
    <>
      {/* Scene background — warm deep black matching --color-bg */}
      <color attach="background" args={[0x080706]} />

      {/* Lights for MeshStandardMaterial on the asteroid */}
      <ambientLight intensity={0.5} color="#C4A97D" />
      <directionalLight position={[5, 8, 5]}   intensity={1.4} color="#EDE6D6" />
      <pointLight       position={[-4, -3, 3]}  intensity={0.3} color="#C4A97D" />

      <StarField   scrollRef={scrollRef} isMobile={isMobile} />
      <AuroraPlane scrollRef={scrollRef} pointerRef={pointerRef} isMobile={isMobile} />

      {/* Asteroid + CometTail only render after GLTF loads */}
      <Suspense fallback={null}>
        <AsteroidGroup scrollRef={scrollRef} isMobile={isMobile} />
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
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        bottom:     0,
        zIndex:     -1,
        pointerEvents: 'none',
        background: 'var(--color-bg)',
        // Static star-like radial gradients — no animation
        backgroundImage: [
          'radial-gradient(ellipse 60% 40% at 25% 60%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)',
          'radial-gradient(ellipse 40% 30% at 78% 28%, color-mix(in srgb, var(--color-accent) 3%, transparent) 0%, transparent 60%)',
        ].join(', '),
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
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  // Evaluate once at mount — not reactive (screen size doesn't change identity)
  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 767px)').matches,
    [],
  );

  // Track pointer position for aurora shader — passive to avoid blocking scroll
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight, // flip Y to match GLSL convention
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // ScrollTrigger lives OUTSIDE the Canvas (GSAP + R3F co-exist via refs)
  // Rule: no ScrollTrigger before preloaderDone
  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id:      'space-scene',
        trigger: '#hero',
        start:   'top top',
        end:     '+=1400', // covers Hero (500) + About (900) pin distances
        scrub:   1.5,
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        },
      });
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  // No Three.js for users who prefer reduced motion
  if (prefersReducedMotion()) return <ReducedMotionFallback />;

  return (
    <Canvas
      gl={{ antialias: false, alpha: true }}
      dpr={Math.min(devicePixelRatio, 1.5)}
      style={{
        position: 'fixed',
        top:      0,
        left:     0,
        right:    0,
        bottom:   0,
        zIndex:   -1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <SceneContents
        scrollRef={scrollRef}
        pointerRef={pointerRef}
        isMobile={isMobile}
      />
    </Canvas>
  );
}

// Kick off GLTF load immediately so it's ready by the time user reaches beat 0.25
useGLTF.preload('/3D/asteroid.glb');
