import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";

interface PinOptions {
  pinDistance: number;
  scrub?: number;
  start?: string;
  onComplete?: () => void;
}

export function usePinnedTimeline<T extends HTMLElement>(
  enabled: boolean,
  options: PinOptions,
) {
  const ref = useRef<T>(null);
  const [tl, setTl] = useState<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (prefersReducedMotion()) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px)",
    ).matches;
    const factor = isMobile ? 0.5 : isTablet ? 0.6 : 1;
    const pinDistance = options.pinDistance * factor;

    const newTl = gsap.timeline({ paused: true });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTl(newTl);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: options.scrub ?? 1.5,
        anticipatePin: 1,
        animation: newTl,
        onLeave: options.onComplete,
      });
    }, el);

    return () => {
      ctx.revert();
      setTl(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { ref, tl };
}
