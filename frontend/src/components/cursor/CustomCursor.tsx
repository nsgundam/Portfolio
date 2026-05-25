import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

const RING_SIZE = 32; // default circle diameter (px)
const FOLLOW_DURATION = 0.5; // how long ring takes to reach mouse
const FOLLOW_EASE = "power4.out";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHovering = false;

    // ── Initial placement ────────────────────────────────────────────────
    gsap.set([dot, ring], { x: mouse.x, y: mouse.y });

    // ── quickTo: smooth updater that never spawns a new tween per call ──
    // This is GSAP's recommended pattern for mouse-tracking (no tween
    // creation overhead on every mousemove event).
    const ringXTo = gsap.quickTo(ring, "x", {
      duration: FOLLOW_DURATION,
      ease: FOLLOW_EASE,
    });
    const ringYTo = gsap.quickTo(ring, "y", {
      duration: FOLLOW_DURATION,
      ease: FOLLOW_EASE,
    });

    // ── Mouse Move ───────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.set(dot, { x: mouse.x, y: mouse.y });
      if (!isHovering) {
        ringXTo(mouse.x);
        ringYTo(mouse.y);
      }
    };

    // ── Stretch Effect — runs every RAF frame ────────────────────────────
    // Calculates lag distance between ring and mouse to stretch/rotate ring.
    const renderStretch = () => {
      if (isHovering) return;
      const rx = gsap.getProperty(ring, "x") as number;
      const ry = gsap.getProperty(ring, "y") as number;
      const dx = mouse.x - rx;
      const dy = mouse.y - ry;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (dist > 2) {
        gsap.set(ring, {
          rotation: angle,
          scaleX: 1 + Math.min(dist * 0.012, 1.5),
          scaleY: Math.max(1 - dist * 0.0008, 0.6),
        });
      } else {
        gsap.set(ring, { scaleX: 1, scaleY: 1, rotation: 0 });
      }
    };
    gsap.ticker.add(renderStretch);

    // ── Hover Enter ──────────────────────────────────────────────────────
    // Morphs ring to wrap the hovered element.
    const onEnter = (e: MouseEvent) => {
      isHovering = true;
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const pad = 16;
      const computedRadius = window.getComputedStyle(el).borderRadius;
      const radius = computedRadius === "0px" ? "8px" : computedRadius;

      gsap.to(ring, {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + pad,
        height: rect.height + pad,
        borderRadius: radius,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true, // kill any in-flight leave/follow animation
      });
    };

    // ── Hover Leave ──────────────────────────────────────────────────────
    // Single combined tween: restore shape with spring ease.
    // Position tracking (quickTo) resumes in parallel immediately.
    const onLeave = () => {
      isHovering = false; // allow renderStretch + onMove to fire right away

      // Restore shape only — overwrite:'auto' kills conflicting props from
      // the enter tween (width/height/etc) but leaves x/y alone so quickTo
      // can run in parallel without fighting this tween.
      gsap.to(ring, {
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: "9999px",
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        duration: 0.45,
        ease: "back.out(1.7)", // satisfying spring snap-back
        overwrite: "auto",
      });

      // Resume position tracking immediately so the ring chases the mouse
      // while its shape is still restoring.
      ringXTo(mouse.x);
      ringYTo(mouse.y);
    };

    // ── Attach events ────────────────────────────────────────────────────
    document.addEventListener("mousemove", onMove);
    const interactives = document.querySelectorAll<HTMLElement>("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter as EventListener);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      gsap.ticker.remove(renderStretch);
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter as EventListener);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot — instant, tracks exact mouse position */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white"
        style={{ mixBlendMode: "difference" }}
      />

      {/* Ring — lags behind with spring physics + stretch */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
