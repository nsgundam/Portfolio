import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Splitting from "splitting";
import { gsap, Flip } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { usePinnedTimeline } from "../../hooks/usePinnedTimeline";
import { ScrollIndicator } from "../ui/ScrollIndicator";
import { MagneticButton } from "../ui/MagneticButton";
import { SectionShell } from "../ui/SectionShell";
import { scrollToSection } from "../../lib/navigation";
import { JOURNEY_PIN_DISTANCE } from "../../lib/journey";

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
    pinDistance: JOURNEY_PIN_DISTANCE.hero,
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
      { opacity: 0, y: -30, duration: 0.2, ease: "power2.in" },
      0,
    );

    tl.to(
      nameEl,
      {
        scale:    1.55,
        duration: 0.4,
        ease:     "power3.inOut",
      },
      0,
    );

    // ─ Beat 0.40 → 0.75 ─  name halves split apart ───────────────────────
    if (leftWord) {
      tl.to(
        leftWord,
        { x: -halfVW, opacity: 0, duration: 0.35, ease: "power3.in" },
        0.2,
      );
    }
    if (rightWord) {
      tl.to(
        rightWord,
        { x: halfVW, opacity: 0, duration: 0.35, ease: "power3.in" },
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
    // GSAP handles this automatically when scrub is set.
  }, [tl]);

  return (
    <SectionShell
      ref={pinRef}
      id="hero"
      sectionNumber="01"
      sectionLabel="Home"
      className="section-shell--hero top-0 z-0"
    >
      {/* Background: SpaceScene fixed canvas renders behind (z-index -1, App.tsx) */}

      <div className="section-shell__content hero-layout">
        <div className="hero-copy">
          {/* aria-label gives screen readers the clean string; Split words are decorative */}
          <h1
            ref={nameRef}
            aria-label="Narunat Sutthibut"
            className={
              isCentered
                ? "hero-title hero-title--centered fixed z-30 select-none pointer-events-none text-center"
                : "hero-title relative"
            }
          >
            Narunat
            <br />
            Sutthibut
          </h1>

          <p
            ref={taglineRef}
            aria-label="Software Engineer and Full-stack Developer"
            className="hero-role"
          >
            Software Engineer / Full-stack Developer
          </p>

          {/* CTA buttons */}
          <div ref={buttonsRef} className="hero-actions">
            <p className="hero-description">
              Full-stack engineering with a focus on backend and real-time
              systems.
            </p>
            <div className="hero-button-row">
              <MagneticButton
                onClick={() => scrollToSection("contact")}
                className="hero-button hero-button--primary"
                aria-label="Navigate to Contact section"
              >
                Contact
              </MagneticButton>
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="hero-button hero-button--secondary"
                aria-label="Navigate to Explore Work section"
              >
                Explore Work
              </button>
            </div>
          </div>
        </div>

        <div aria-hidden="true" />
      </div>

      <div ref={scrollRef} className="hero-scroll-anchor">
        <ScrollIndicator />
      </div>
    </SectionShell>
  );
}
