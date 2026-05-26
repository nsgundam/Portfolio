// src/hooks/useMagneticHover.ts
import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";

// Design tokens (interaction-spac.md §2)
const DEFAULT_STRENGTH = 0.3;
const DEFAULT_TRIGGER_PAD = 40;

/**
 * Applies a magnetic hover effect to the returned ref element.
 *
 * When the cursor enters a zone `triggerPad` pixels beyond the element's
 * bounds, the element translates toward the cursor by `strength * offset`.
 * When the cursor leaves the zone the element snaps back to origin.
 *
 * @param strength   - Pull factor (0–1). Default: 0.3
 * @param triggerPad - Detection zone in px beyond element bounds. Default: 40
 * @returns A ref to attach to the magnetic element.
 */
export function useMagneticHover<T extends HTMLElement>(
  strength: number = DEFAULT_STRENGTH,
  triggerPad: number = DEFAULT_TRIGGER_PAD,
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      prefersReducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    // Track whether the cursor is currently inside the trigger zone so we
    // don't fire the snap-back tween on every frame when already outside.
    let inZone = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();

      // Expanded bounds — the trigger zone
      const left   = rect.left   - triggerPad;
      const right  = rect.right  + triggerPad;
      const top    = rect.top    - triggerPad;
      const bottom = rect.bottom + triggerPad;

      const cursorX = e.clientX;
      const cursorY = e.clientY;

      const withinZone =
        cursorX >= left &&
        cursorX <= right &&
        cursorY >= top &&
        cursorY <= bottom;

      if (withinZone) {
        inZone = true;

        // Offset from element center
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const offsetX = cursorX - centerX;
        const offsetY = cursorY - centerY;

        gsap.to(el, {
          x: offsetX * strength,
          y: offsetY * strength,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (inZone) {
        // Cursor just left the zone — snap back once
        inZone = false;

        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      // Reset position on unmount
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, triggerPad]);

  return ref;
}
