// src/components/sections/Hero.tsx
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Splitting from "splitting";
import { gsap, Flip } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { ScrollIndicator } from "../ui/ScrollIndicator";
import { MagneticButton } from "../ui/MagneticButton";


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
        duration: 1,
        ease: "power2.out",
        stagger: { each: 0.1, from: "edges" },
        onComplete: () => {
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
        onTransitionComplete();

        Flip.from(flipStateRef.current, {
          duration: 1,
          ease: "power4.out",
        });

        const tl = gsap.timeline({ delay: 1 });

        // Tagline word reveal
        tl.to(
          taglineRef.current!.querySelectorAll(".word"),
          {
            opacity: 1,
            y: "0%",
            startAt: { y: 120 },
            duration: 1,
            ease: "power4.out",
          },
        );

        // Buttons fade in
        tl.to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            startAt: { y: 120 },
            duration: 0.8,
            ease: "power4.out",
          },
          "<"
        );

        // Scroll indicator fade in
        tl.to(
          scrollRef.current,
          {
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
          },
          "<",
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
          className="px-6 py-2 font-label bg-accent text-bg border border-accent rounded-full text-xs tracking-small uppercase hover:bg-transparent hover:text-text-primary transition-colors duration-300"
          aria-label="Navigate to Contact section"
        >
          Contact
        </MagneticButton>
        <button
          onClick={() => scrollToSection("projects")}
          className="px-6 py-2 font-label text-text-primary border border-accent rounded-full text-xs uppercase hover:bg-accent hover:text-bg transition-colors duration-300"
          aria-label="Navigate to Explore Work section"
        >
          Explore Work
        </button>
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
