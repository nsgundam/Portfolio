// src/hooks/useBlurReveal.ts
import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";

// enabled defaults to true so elements that don't need gating still work.
// Pass preloaderDone from App to respect the "all ScrollTriggers wait for
// preloaderDone" rule documented in Agent.md.
export function useBlurReveal<T extends HTMLElement>(
  enabled: boolean = true,
  options?: {
    blurStart?: string;  // default: "20px"
    duration?: number;   // default: 0.8
    delay?: number;      // default: 0
    start?: string;      // ScrollTrigger start, default: "top 80%"
  },
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const blurStart = options?.blurStart ?? "20px";

    const duration = options?.duration ?? 0.8;
    const delay = options?.delay ?? 0;
    const start = options?.start ?? "top 80%";

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        el,
        {
          filter: `blur(${blurStart})`,
          opacity: 0,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          duration,
          delay,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [enabled, options?.blurStart, options?.duration, options?.delay, options?.start]);

  return ref;
}
