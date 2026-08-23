import { useEffect, useState } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "../lib/gsap"
import { prefersReducedMotion } from "../lib/motion"
import { setGlobalLenis } from "../lib/navigation"

export function useLenis(isLocked: boolean = false) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

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

    const lenisInstance = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisInstance.on("scroll", ScrollTrigger.update)

    const ticker = (time: number) => lenisInstance.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    setGlobalLenis(lenisInstance)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(lenisInstance)

    return () => {
      setGlobalLenis(null)
      lenisInstance.destroy()
      gsap.ticker.remove(ticker)
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    if (!lenis) return;
    if (isLocked) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, isLocked]);
}