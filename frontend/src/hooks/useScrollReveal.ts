// src/hooks/useScrollReveal.ts
import { useEffect, useRef } from "react"
import { gsap } from "../lib/gsap"

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

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
            start: "top 85%",   // เริ่ม animate เมื่อ element เข้ามา 85% ของ viewport
            once: true,         // animate แค่ครั้งเดียว
          },
        }
      )
    }, el)

    return () => ctx.revert() // Cleanup to fix React StrictMode issues
  }, [])

  return ref
}