// src/hooks/useScrollReveal.ts
import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

// enabled defaults to true so sections that don't need gating still work.
// Pass preloaderDone from App to respect the "all ScrollTriggers wait for
// preloaderDone" rule documented in Agent.md.
export function useScrollReveal<T extends HTMLElement>(
  enabled: boolean = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [enabled]); // re-runs when preloaderDone flips true

  return ref;
}
