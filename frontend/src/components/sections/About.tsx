import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { SectionShell } from "../ui/SectionShell";
import { JOURNEY_PIN_DISTANCE } from "../../lib/journey";

interface AboutProps {
  preloaderDone: boolean;
}

export default function About({ preloaderDone }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef     = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);

  // ── Unified pinned scrub timeline for desktop/tablet; static on mobile ──
  useEffect(() => {
    if (!preloaderDone) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const contentTargets = [
      headingRef.current,
      bioRef.current,
      infoRef.current,
    ].filter(Boolean);

    const mobileMedia = window.matchMedia("(max-width: 767px)");
    const tabletMedia = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px)",
    );

    let ctx: gsap.Context | null = null;

    const setup = () => {
      if (ctx) {
        ctx.revert();
        ctx = null;
      }

      const isMobile = mobileMedia.matches;
      const isReduced = prefersReducedMotion();

      if (isMobile || isReduced) {
        // Mobile below 768px and prefers-reduced-motion:
        // stable final static state with no pin, no pin-spacer, no y transform, and no hidden content
        gsap.set(content, { clearProps: "transform,y", y: 0 });
        gsap.set(contentTargets, {
          clearProps: "opacity,transform,y,scale",
          opacity: 1,
          y: 0,
          scale: 1,
        });
        ScrollTrigger.refresh();
        return;
      }

      // Desktop / Tablet behavior: single coherent pinned scrub timeline
      const factor = tabletMedia.matches ? 0.6 : 1;
      const pinDistance = JOURNEY_PIN_DISTANCE.about * factor;

      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Content container starts close to resting position and settles
        tl.fromTo(
          content,
          { y: "4vh" },
          { y: 0, duration: 0.3, ease: "power2.out" },
          0,
        );

        // 2. Main heading is clearly perceptible and legible at progress 0 with restrained depth settle
        tl.fromTo(
          headingRef.current,
          { opacity: 1, y: 12, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "power3.out",
          },
          0,
        );

        // 3. Bio stays readable as the section arrives, then settles into place
        tl.fromTo(
          bioRef.current,
          { opacity: 1, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power4.out",
          },
          0.20,
        );

        // 4. Facts stay readable as the section arrives, then settle into place
        tl.fromTo(
          infoRef.current,
          { opacity: 1, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power4.out" },
          0.40,
        );

        // 5. Brief hold before releasing
        tl.to({}, { duration: 0.2 }, 0.80);

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          scrub: 0.8,
          fastScrollEnd: true,
          anticipatePin: 1,
          animation: tl,
        });
      }, section);

      ScrollTrigger.refresh();
    };

    setup();

    const handleMediaChange = () => {
      setup();
    };

    mobileMedia.addEventListener("change", handleMediaChange);
    tabletMedia.addEventListener("change", handleMediaChange);

    return () => {
      mobileMedia.removeEventListener("change", handleMediaChange);
      tabletMedia.removeEventListener("change", handleMediaChange);
      if (ctx) ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [preloaderDone]);

  return (
    <SectionShell
      id="about"
      ref={sectionRef}
      sectionNumber="02"
      sectionLabel="About"
      className="about-section relative z-10"
    >
      {/* Subtle token-based readability scrim over the continuous deep-space star field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 25% 45%, color-mix(in srgb, var(--color-bg) 60%, transparent) 0%, transparent 80%)",
        }}
      />

      <div ref={contentRef} className="section-shell__content about-layout">
        <div className="about-copy">
          <h2 ref={headingRef} className="section-heading">
            Agile Technical
            <br />
            <em className="text-accent">Explorer</em>
          </h2>

          {/* Bio Text */}
          <div ref={bioRef} className="section-prose">
            <p className="mb-4 font-body text-sm leading-relaxed text-text-secondary">
              I am a developer driven by curiosity and a problem-solving
              mindset. In a fast-evolving tech landscape, I define myself as
              an{" "}
              <span className="text-text-primary">
                Agile Technical Explorer
              </span>
              —always ready to leverage new tools to transform ideas into
              reality.
            </p>
            <p className="font-body text-sm leading-relaxed text-text-secondary">
              My focus lies in the intersection of efficient architecture and
              sophisticated visuals, ensuring every project is built with
              purpose and impact.
            </p>
          </div>

          {/* Info Grid */}
          <div ref={infoRef} className="about-facts">
            {[
              { label: "Based in", value: "Thailand" },
              { label: "Focus", value: "Software Engineer / Full-Stack" },
              { label: "Available", value: "Internship 2026" },
            ].map(({ label, value }) => (
              <div key={label} className="about-fact">
                <span className="about-fact-label">
                  {label}
                </span>
                <span className="about-fact-value">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" />
      </div>
    </SectionShell>
  );
}
