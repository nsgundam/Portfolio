// src/components/sections/Hero.tsx
import { useEffect, useRef } from "react"
import Splitting from "splitting"
import { gsap } from "../../lib/gsap"

interface HeroProps {
  preloaderDone: boolean
}

export default function Hero({ preloaderDone }: HeroProps) {
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const nameRef    = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!preloaderDone) return

    // Split text เป็น chars
    Splitting({ target: nameRef.current!, by: "chars" })
    Splitting({ target: taglineRef.current!, by: "words" })

    const tl = gsap.timeline()

    // Label fade in
    tl.from(labelRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power4.out",
    })

    // Name — char stagger
    tl.from(
      nameRef.current!.querySelectorAll(".char"),
      {
        opacity: 0,
        y: 40,           // ← ปรับจาก Playground
        duration: 0.8,   // ← ปรับจาก Playground
        ease: "power4.out",
        stagger: 0.03,   // ← ปรับจาก Playground
      },
      "-=0.3"
    )

    // Tagline — word stagger
    tl.from(
      taglineRef.current!.querySelectorAll(".word"),
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power4.out",
        stagger: 0.08,   // ← ปรับจาก Playground
      },
      "-=0.4"
    )

    // Scroll hint
    tl.from(scrollRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power4.out",
    }, "-=0.2")

  }, [preloaderDone])

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <span ref={labelRef} aria-hidden="true" className="font-body text-text-secondary mb-6 text-xs tracking-[0.3em] uppercase">
        Full Stack Developer
      </span>

      <h1
        ref={nameRef}
        aria-hidden="true"
        className="font-heading text-text-primary mb-6 leading-none tracking-tight"
        style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
      >
        Narunat<br />Sutthibut
      </h1>

      <p ref={taglineRef} aria-hidden="true" className="font-body text-text-secondary max-w-md text-sm leading-relaxed">
        Aiming high, building what matters.
      </p>

      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-text-disabled text-xs tracking-widest uppercase">Scroll</span>
        <div className="h-8 w-px bg-border" />
      </div>
    </section>
  )
}