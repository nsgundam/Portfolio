// src/components/sections/Hero.tsx
import { useEffect, useRef } from "react";
import Splitting from "splitting";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { MagneticButton } from "../ui/MagneticButton";
import { ScrollIndicator } from "../ui/ScrollIndicator";

interface HeroProps {
  preloaderDone: boolean;
}

export default function Hero({ preloaderDone }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Setup and hide elements initially to avoid FOUC
  useEffect(() => {
    Splitting({ target: nameRef.current!, by: "chars" });
    Splitting({ target: taglineRef.current!, by: "words" });

    gsap.set(
      [
        labelRef.current,
        nameRef.current!.querySelectorAll(".char"),
        taglineRef.current!.querySelectorAll(".word"),
        scrollRef.current,
      ],
      { opacity: 0 },
    );
  }, []);

  useEffect(() => {
    if (!preloaderDone) return;

    if (prefersReducedMotion()) {
      gsap.set(labelRef.current, { opacity: 1, y: 0 });
      gsap.set(nameRef.current!.querySelectorAll(".char"), {
        opacity: 1,
        filter: "blur(0px)",
      });
      gsap.set(taglineRef.current!.querySelectorAll(".word"), {
        opacity: 1,
        y: "0%",
      });
      gsap.set(scrollRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Label fade in
      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        startAt: { y: 20 },
        duration: 0.6,
        ease: "power4.out",
      });

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
        "-=0.3",
      );

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
        "-=0.4",
      );

      // Scroll hint
      tl.to(
        scrollRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
        },
        "-=2.5",
      );
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  // Background fade effect on scroll
  useEffect(() => {
    if (!preloaderDone) return;

    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    if (prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg,
        { opacity: 1 },
        {
          opacity: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onEnter: () => {
              gsap.set(bg, { opacity: 1 });
            },
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 z-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
    >
      {/* Enhanced Background */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 -z-10 opacity-100 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(circle at 30% 50%, rgba(164, 22, 26, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(164, 22, 26, 0.08) 0%, transparent 40%),
            linear-gradient(135deg, rgba(11, 9, 10, 1) 0%, rgba(22, 26, 29, 0.5) 100%)
          `,
        }}
      />

      <span
        ref={labelRef}
        className="font-body text-text-secondary mb-6 text-xs tracking-[0.3em] uppercase"
      >
        Full Stack Developer
      </span>

      {/* aria-label gives screen readers clean text; Splitting.js char-spans are decorative */}
      <h1
        ref={nameRef}
        aria-label="Narunat Sutthibut"
        className="font-heading text-text-primary mb-6 leading-none tracking-tight"
        style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
      >
        Narunat Sutthibut
      </h1>

      <p
        ref={taglineRef}
        aria-label="Aiming high, building what matters."
        className="font-body text-text-secondary max-w-md text-sm leading-relaxed"
      >
        Aiming high, building what matters.
      </p>

      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <MagneticButton
          href="#about"
          aria-label="Scroll to About section"
          className="flex flex-col items-center gap-2"
        >
          <ScrollIndicator />
        </MagneticButton>
      </div>
    </section>
  );
}
