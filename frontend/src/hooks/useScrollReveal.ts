// src/hooks/useScrollReveal.ts
import { useEffect, useRef } from "react"
import { gsap } from "../lib/gsap"

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.from(el, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    })
  }, [])

  return ref
}