// src/components/ui/ScrollProgress.tsx
import { useEffect, useRef } from "react"
import { gsap } from "../../lib/gsap"
import { prefersReducedMotion } from "../../lib/motion"

interface ScrollProgressProps {
  heroTransitionComplete?: boolean;
}

export default function ScrollProgress({ heroTransitionComplete }: ScrollProgressProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    if (prefersReducedMotion()) {
      const update = () => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 0
        gsap.set(line, { scaleX: progress })
      }
      update()
      window.addEventListener("scroll", update, { passive: true })
      return () => window.removeEventListener("scroll", update)
    }

    gsap.to(line, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    })
  }, [])

  return (
    <div
      className="fixed left-0 bottom-0 z-30 h-0.5 bg-border transition-opacity duration-700"
      style={{
        width: "100vw",
        opacity: heroTransitionComplete ? 1 : 0,
        pointerEvents: heroTransitionComplete ? "auto" : "none",
      }}
    >
      <div
        ref={lineRef}
        className="h-full bg-accent origin-left"
        style={{
          width: "100%",
          transform: "scaleX(0)",            // เริ่มจาก 0 แล้วโตตาม scroll
        }}
      />
    </div>
  )
}