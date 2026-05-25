import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

const RING_SIZE = 32; // default circle diameter (px)
const FOLLOW_DURATION = 0.5; // how long ring takes to reach mouse
const FOLLOW_EASE = "power4.out";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bail out entirely on touch / coarse-pointer devices.
    // The CSS @media (pointer: fine) rule already restores the native cursor;
    // this guard stops GSAP from running and keeps the elements invisible.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Respect prefers-reduced-motion: disable the stretch effect only.
    // Dot tracking, ring following, and hover animations remain active.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // isHovering covers three states:
    //   true  → suck-in animating, button hovered (ring invisible), or ring emerging
    //   false → normal idle tracking + stretch
    // It stays true through the entire leave-emerge animation so renderStretch
    // cannot fight the scale tween while the ring is growing back.
    let isHovering = false;

    // ── Initial placement ────────────────────────────────────────────────
    // Reveal elements (they start at opacity:0 to stay invisible on touch devices)
    gsap.set([dot, ring], { x: mouse.x, y: mouse.y, opacity: 1 });

    // ── quickTo: declared with `let` so onLeave can re-create them ───────
    // onEnter's overwrite:true kills their backing tweens; a dead quickTo
    // silently does nothing when called — re-creating gives a live tween.
    let ringXTo = gsap.quickTo(ring, "x", {
      duration: FOLLOW_DURATION,
      ease: FOLLOW_EASE,
    });
    let ringYTo = gsap.quickTo(ring, "y", {
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

    // ── Stretch Effect (RAF ticker) ──────────────────────────────────────
    // Stretches ring in the direction of travel based on lag distance.
    // Gated by isHovering so it never fights the enter/leave scale tweens.
    const renderStretch = () => {
      if (isHovering) return;
      if (prefersReduced) return;
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

    // ── Hover Enter — suck-in collapse ─────────────────────────────────
    // Ring collapses to nothing at its current position (no travel across
    // the button). power4.in starts almost still then ends violently —
    // that acceleration IS the "suck" sensation without covering content.
    const onEnter = () => {
      isHovering = true;

      gsap.to(ring, {
        scaleX: 0,
        scaleY: 0,
        duration: 0.35,
        ease: "power4.in", // near-instant collapse at the end
        overwrite: true,
      });
    };

    // ── Hover Leave — emerge from cursor ─────────────────────────────────
    // Ring teleports (invisible) to the current cursor position, then
    // springs back into existence right under the mouse.
    const onLeave = () => {
      // Instantly place the ring at the cursor — still invisible (scale 0).
      // This means it "materialises" at the mouse, not flying in from the button.
      gsap.set(ring, {
        x: mouse.x,
        y: mouse.y,
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: "9999px",
        scaleX: 0,
        scaleY: 0,
        rotation: 0,
      });

      // Spring-pop the ring back into existence.
      // isHovering stays true during this animation so renderStretch cannot
      // set scaleX/scaleY while the ring is growing — that would fight this tween.
      gsap.to(ring, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.55,
        ease: "back.out(2.2)", // overshoots slightly for a satisfying pop
        overwrite: true,
        onComplete: () => {
          // Ring is fully formed — re-enable tracking and stretch.
          isHovering = false;
          // Re-create quickTo: the originals were killed by onEnter's overwrite:true.
          // A fresh instance has a live backing tween that actually animates.
          ringXTo = gsap.quickTo(ring, "x", {
            duration: FOLLOW_DURATION,
            ease: FOLLOW_EASE,
          });
          ringYTo = gsap.quickTo(ring, "y", {
            duration: FOLLOW_DURATION,
            ease: FOLLOW_EASE,
          });
          ringXTo(mouse.x);
          ringYTo(mouse.y);
        },
      });
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
      {/* Dot — opacity:0 initial; GSAP sets it to 1 on pointer:fine devices only */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-9999 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white"
        style={{ mixBlendMode: "difference", opacity: 0 }}
      />

      {/* Ring — same opacity:0 guard. Collapses into buttons; springs back on leave. */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-9998 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
          mixBlendMode: "difference",
          opacity: 0,
        }}
      />
    </>
  );
}
