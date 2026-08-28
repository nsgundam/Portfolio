import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";

interface ScrollIndicatorProps {
  className?: string;
}

/**
 * Animated mouse wheel scroll indicator
 * Shows a bouncing wheel to indicate scrolling
 */
export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    const dot = dotRef.current;
    if (!wheel || !dot) return;

    if (prefersReducedMotion()) return;

    // Scroll indicator dot moves inside wheel
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dot,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 4,
          duration: 0.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.2,
        },
      );
    }, wheel);

    return () => ctx.revert();
  }, []);

  return (
    <div className={className}>
      <span className="font-body text-text-secondary text-xs tracking-widest uppercase block mb-3">
        Scroll
      </span>
      <div
        ref={wheelRef}
        className="w-6 h-10 border-2 border-text-disabled rounded-full flex items-start justify-center pt-2 mx-auto"
        aria-hidden="true"
      >
        <div
          ref={dotRef}
          className="w-1.5 h-1.5 bg-text-disabled rounded-full"
        />
      </div>
    </div>
  );
}
