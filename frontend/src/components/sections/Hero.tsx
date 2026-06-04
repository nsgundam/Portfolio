// src/components/sections/Hero.tsx
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Splitting from "splitting";
import { gsap, Flip } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { ScrollIndicator } from "../ui/ScrollIndicator";
import { MagneticButton } from "../ui/MagneticButton";
import { NeuralNoise } from "../backgrounds/NeuralNoise";

interface HeroProps {
  preloaderDone: boolean;
  onTransitionComplete: () => void;
}

export default function Hero({
  preloaderDone,
  onTransitionComplete,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isCentered, setIsCentered] = useState(() => !prefersReducedMotion());
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  // Setup and hide elements initially to avoid FOUC
  useEffect(() => {
    Splitting({ target: nameRef.current!, by: "chars" });
    Splitting({ target: taglineRef.current!, by: "words" });

    gsap.set(
      [
        nameRef.current!.querySelectorAll(".char"),
        taglineRef.current!.querySelectorAll(".word"),
        buttonsRef.current,
        scrollRef.current,
      ],
      { opacity: 0 },
    );
  }, []);

  // 1. Reveal name characters at the center
  useEffect(() => {
    if (!preloaderDone) return;

    if (prefersReducedMotion()) {
      gsap.set(nameRef.current!.querySelectorAll(".char"), {
        opacity: 1,
        filter: "blur(0px)",
      });
      gsap.set(taglineRef.current!.querySelectorAll(".word"), {
        opacity: 1,
        y: "0%",
      });
      gsap.set(buttonsRef.current, { opacity: 1 });
      gsap.set(scrollRef.current, { opacity: 1 });
      onTransitionComplete();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(nameRef.current!.querySelectorAll(".char"), {
        opacity: 1,
        filter: "blur(0px)",
        startAt: { filter: "blur(10px)" },
        duration: 1.2,
        ease: "power2.out",
        stagger: { each: 0.03, from: "edges" },
        onComplete: () => {
          // Capture the layout state of name element at the center
          const state = Flip.getState(nameRef.current);
          flipStateRef.current = state;
          setIsCentered(false);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [preloaderDone, onTransitionComplete]);

  // 2. Perform the layout transition to natural flow position and reveal the rest of UI
  useLayoutEffect(() => {
    if (isCentered || !preloaderDone || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (flipStateRef.current) {
        // Signal transition complete to App.tsx immediately to fade in Navbar/ScrollProgress simultaneously
        onTransitionComplete();

        Flip.from(flipStateRef.current, {
          duration: 1.5,
          ease: "power4.inOut",
        });

        const tl = gsap.timeline();

        // Tagline word reveal
        tl.to(
          taglineRef.current!.querySelectorAll(".word"),
          {
            opacity: 1,
            y: "0%",
            startAt: { y: "100%" },
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.02,
          },
          "-=0.7",
        );

        // Buttons fade in
        tl.to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            startAt: { y: 20 },
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.6",
        );

        // Scroll indicator fade in
        tl.to(
          scrollRef.current,
          {
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.5",
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isCentered, preloaderDone, onTransitionComplete]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="top-0 z-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
    >
      {/* Background with neural noise effect */}
      <NeuralNoise />

      {/* aria-label gives screen readers clean text; Splitting.js char-spans are decorative */}
      <h1
        ref={nameRef}
        aria-label="Narunat Sutthibut"
        className={
          isCentered
            ? "fixed z-30 font-display text-text-primary leading-none tracking-tight select-none pointer-events-none text-center px-5 sm:px-8 w-full"
            : "relative font-display text-text-primary mb-4 leading-none tracking-tight text-center"
        }
        style={{ fontSize: "clamp(56px, 10vw, 140px)", fontWeight: 300 }}
      >
        Narunat Sutthibut
      </h1>

      <p
        ref={taglineRef}
        aria-label="Aiming high, building what matters."
        className="font-body text-text-primary max-w-md text-sm leading-relaxed mb-8"
      >
        Aiming high, building what{" "}
        <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
          matters.
        </em>
      </p>

      {/* CTA Buttons */}
      <div
        ref={buttonsRef}
        className="flex gap-4 flex-wrap justify-center mb-12"
      >
        <MagneticButton
          onClick={() => scrollToSection("contact")}
          className="px-6 py-2 font-label text-text-primary border border-accent text-xs tracking-wider uppercase hover:bg-accent hover:text-bg transition-colors duration-300"
          aria-label="Navigate to Contact section"
        >
          Contact
        </MagneticButton>
        <MagneticButton
          onClick={() => scrollToSection("projects")}
          className="px-6 py-2 font-label text-text-primary border border-accent text-xs tracking-wider uppercase hover:bg-accent hover:text-bg transition-colors duration-300"
          aria-label="Navigate to Explore Work section"
        >
          Explore Work
        </MagneticButton>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ScrollIndicator />
      </div>
    </section>
  );
}
