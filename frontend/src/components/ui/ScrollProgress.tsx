// src/components/ui/ScrollProgress.tsx
import { useEffect, useRef } from "react"
import { gsap } from "../../lib/gsap"

export default function ScrollProgress() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.to(lineRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,           // เชื่อมกับ scroll position โดยตรง
      },
    })
  }, [])

  return (
    <div
      className="fixed left-0 bottom-0 z-30 h-0.5 bg-border"
      style={{ width: "100vw" }}
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