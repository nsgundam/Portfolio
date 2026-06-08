import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Splitting from "splitting";
import { gsap, Flip } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { usePinnedTimeline } from "../../hooks/usePinnedTimeline";
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
  // pinRef doubles as sectionRef — passed to both <section> and gsap.context()
  const { ref: pinRef, tl } = usePinnedTimeline<HTMLElement>(preloaderDone, {
    pinDistance: 1400,
  });

  const nameRef    = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  const [isCentered, setIsCentered] = useState(() => !prefersReducedMotion());
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  useEffect(() => {
    Splitting({ target: nameRef.current!,    by: "words" });
    Splitting({ target: taglineRef.current!, by: "words" });

    // Hide everything until the reveal animation runs
    gsap.set(nameRef.current!.querySelectorAll(".word"), { opacity: 0 });
    gsap.set(taglineRef.current!.querySelectorAll(".word"), { opacity: 0 });
    gsap.set([buttonsRef.current, scrollRef.current], { opacity: 0 });
  }, []);

  // ── Phase A-1: word blur reveal (time-based) ──────────────────────────────
  useEffect(() => {
    if (!preloaderDone) return;

    if (prefersReducedMotion()) {
      // Instant reveal — no animation
      gsap.set(nameRef.current!.querySelectorAll(".word"), { opacity: 1 });
      gsap.set(taglineRef.current!.querySelectorAll(".word"), { opacity: 1, y: 0 });
      gsap.set([buttonsRef.current, scrollRef.current], { opacity: 1 });
      onTransitionComplete();
      return;
    }

    const ctx = gsap.context(() => {
      // Words bloom from blur, staggered from center outward
      gsap.to(nameRef.current!.querySelectorAll(".word"), {
        opacity: 1,
        filter:  "blur(0px)",
        startAt: { filter: "blur(16px)" },
        duration: 1,
        ease:    "power2.out",
        stagger: { each: 1, from: "edges" },
        onComplete: () => {
          const state = Flip.getState(nameRef.current!);
          flipStateRef.current = state;
          setIsCentered(false);
        },
      });
    }, pinRef);

    return () => ctx.revert();
  }, [preloaderDone, onTransitionComplete, pinRef]);

  // ── Phase A-2: Flip to natural position + reveal rest of UI ──────────────
  useLayoutEffect(() => {
    if (isCentered || !preloaderDone || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (flipStateRef.current) {
        Flip.from(flipStateRef.current, {
          duration: 1.0,
          ease:     "power4.out",
        });

        // Tagline, buttons, scroll indicator appear after name settles
        const reveal = gsap.timeline({ 
          delay: 0.8,
          onComplete: onTransitionComplete // unlock scroll only when fully done
        });

        reveal.to(taglineRef.current!.querySelectorAll(".word"), {
          opacity: 1,
          y:       "0%",
          startAt: { y: "120%" },
          duration: 1,
          ease:    "power4.out",
        });

        reveal.to(
          buttonsRef.current,
          { opacity: 1, y: 0, startAt: { y: "120%" }, duration: 1, ease: "power4.out" },
          "<",
        );

        reveal.to(
          scrollRef.current,
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "<+0.2",
        );
      }
    }, pinRef);

    return () => ctx.revert();
  }, [isCentered, preloaderDone, onTransitionComplete, pinRef]);

  useEffect(() => {
    if (!tl) return;
    const nameEl    = nameRef.current;
    const taglineEl = taglineRef.current;
    const buttonsEl = buttonsRef.current;
    const scrollEl  = scrollRef.current;
    if (!nameEl || !taglineEl || !buttonsEl || !scrollEl) return;

    const words    = nameEl.querySelectorAll<HTMLElement>(".word");
    const leftWord  = words[0] ?? null;
    const rightWord = words[1] ?? null;

    const halfVW = window.innerWidth * 0.55;

    tl.to(
      [taglineEl, buttonsEl, scrollEl],
      { opacity: 0, y: -30, filter: "blur(8px)", duration: 0.2, ease: "power2.in" },
      0,
    );

    tl.to(
      nameEl,
      {
        fontSize:      "clamp(80px, 14vw, 220px)",
        letterSpacing: "-0.02em",
        duration:      0.4,
        ease:          "power3.inOut",
      },
      0,
    );

    // ─ Beat 0.40 → 0.75 ─  name halves split apart ───────────────────────
    if (leftWord) {
      tl.to(
        leftWord,
        { x: -halfVW, opacity: 0, filter: "blur(6px)", duration: 0.35, ease: "power3.in" },
        0.2,
      );
    }
    if (rightWord) {
      tl.to(
        rightWord,
        { x: halfVW, opacity: 0, filter: "blur(6px)", duration: 0.35, ease: "power3.in" },
        0.2,
      );
    }

    // ─ Beat 0.90 → 1.0 ─  clear hero, hand off to About ─────────────────
    tl.to(
      nameEl,
      { opacity: 0, duration: 0.1, ease: "none" },
      0.9,
    );

    // Restore x/opacity on revert (reverse scroll)
    // GSAP handles this automatically when `scrub: 1.5` is set.
  }, [tl]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={pinRef}
      id="hero"
      className="top-0 z-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8"
    >
      {/* Background: SpaceScene fixed canvas renders behind (z-index -1, App.tsx) */}

      {/* aria-label gives screen readers the clean string; Splitting word-spans are decorative */}
      <h1
        ref={nameRef}
        aria-label="Narunat Sutthibut"
        className={
          isCentered
            ? "fixed z-30 font-display text-text-primary leading-none tracking-tight select-none pointer-events-none text-center px-5 sm:px-8 w-full whitespace-nowrap"
            : "relative font-display text-text-primary mb-4 leading-none tracking-tight text-center whitespace-nowrap"
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

      {/* CTA buttons */}
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
