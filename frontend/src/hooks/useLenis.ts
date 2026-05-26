import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "../lib/gsap"
import { prefersReducedMotion } from "../lib/motion"

export function useLenis() {
  useEffect(() => {
    // ป้องกัน Browser จำตำแหน่ง Scroll และบังคับกลับไปบนสุดทุกครั้งที่ Refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    window.scrollTo(0, 0)

    if (prefersReducedMotion()) {
      const onScroll = () => ScrollTrigger.update()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on("scroll", ScrollTrigger.update)

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])
}