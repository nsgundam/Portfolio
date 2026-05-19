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

  // Setup and hide elements initially to avoid FOUC
  useEffect(() => {
    Splitting({ target: nameRef.current!, by: "chars" })
    Splitting({ target: taglineRef.current!, by: "words" })

    gsap.set([
      labelRef.current,
      nameRef.current!.querySelectorAll(".char"),
      taglineRef.current!.querySelectorAll(".word"),
      scrollRef.current
    ], { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!preloaderDone) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Label fade in
      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        startAt: { y: 20 },
        duration: 0.6,
        ease: "power4.out",
      })

      // Name — char stagger (Tuning from design system)
      tl.to(
        nameRef.current!.querySelectorAll(".char"),
        {
          opacity: 1,
          filter: "blur(0px)",
          startAt: { filter: "blur(10px)" },
          duration: 1.2,
          ease: "power2.out",
          stagger: { each: 0.03, from: "edges" },
        },
        "-=0.3"
      )

      // Tagline — word stagger (Tuning from design system)
      tl.to(
        taglineRef.current!.querySelectorAll(".word"),
        {
          opacity: 1,
          y: "0%",
          startAt: { y: "100%" },
          duration: 3.5,
          ease: "power4.out",
          stagger: 0,
        },
        "-=0.4"
      )

      // Scroll hint
      tl.to(scrollRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power4.out",
      }, "-=2.5") // Bring it in earlier since tagline is 3.5s long
    })

    return () => ctx.revert()
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
      >Narunat Sutthibut</h1>

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