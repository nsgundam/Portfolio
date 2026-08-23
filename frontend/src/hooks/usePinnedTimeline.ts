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

    const mobileMedia = window.matchMedia("(max-width: 767px)");
    const tabletMedia = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px)",
    );

    let ctx: gsap.Context | null = null;

    const setup = () => {
      if (ctx) {
        ctx.revert();
        ctx = null;
      }

      if (mobileMedia.matches || prefersReducedMotion()) {
        setTl(null);
        return;
      }

      const factor = tabletMedia.matches ? 0.6 : 1;
      const pinDistance = options.pinDistance * factor;

      const newTl = gsap.timeline({ paused: true });
      setTl(newTl);

      ctx = gsap.context(() => {
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
    };

    setup();

    const handleMediaChange = () => {
      setup();
    };

    mobileMedia.addEventListener("change", handleMediaChange);
    tabletMedia.addEventListener("change", handleMediaChange);

    return () => {
      mobileMedia.removeEventListener("change", handleMediaChange);
      tabletMedia.removeEventListener("change", handleMediaChange);
      if (ctx) ctx.revert();
      setTl(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { ref, tl };
}
