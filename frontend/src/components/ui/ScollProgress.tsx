// src/components/ui/ScrollProgress.tsx
import { useEffect, useRef } from "react"
import { gsap } from "../../lib/gsap"

export default function ScrollProgress() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.to(lineRef.current, {
      scaleY: 1,
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
      className="fixed left-0 top-0 z-30 w-[2px] bg-border"
      style={{ height: "100vh" }}
    >
      <div
        ref={lineRef}
        className="w-full bg-accent origin-top"
        style={{
          height: "100%",
          transform: "scaleY(0)",            // เริ่มจาก 0 แล้วโตตาม scroll
        }}
      />
    </div>
  )
}