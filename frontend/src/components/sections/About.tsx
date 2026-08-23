import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";

interface AboutProps {
  preloaderDone: boolean;
}

export default function About({ preloaderDone }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);
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
      labelRef.current,
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
      const pinDistance = 900 * factor;

      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Content container starts close to resting position and settles
        tl.fromTo(
          content,
          { y: "4vh" },
          { y: 0, duration: 0.3, ease: "power2.out" },
          0,
        );

        // 2. Section label is visibly legible at progress 0 and settles into resting position
        tl.fromTo(
          labelRef.current,
          { opacity: 0.9, y: 8 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0,
        );

        // 3. Main heading is clearly perceptible and legible at progress 0 with restrained depth settle
        tl.fromTo(
          headingRef.current,
          { opacity: 0.8, y: 12, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "power3.out",
          },
          0,
        );

        // 4. Bio text reveals in the second beat
        tl.fromTo(
          bioRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power4.out",
          },
          0.25,
        );

        // 5. Info grid reveals in the third beat
        tl.fromTo(
          infoRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power4.out" },
          0.50,
        );

        // 6. Brief hold before releasing
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
    <section
      id="about"
      ref={sectionRef}
      className="about-section relative z-10 min-h-screen overflow-hidden px-5 py-20 sm:px-8 md:py-32"
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

      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl">
        <p
          ref={labelRef}
          aria-hidden="true"
          className="mb-4 font-body text-xs tracking-[0.3em] text-accent uppercase"
        >
          01 / About
        </p>

        <h2
          ref={headingRef}
          className="mb-12 font-display leading-tight text-text-primary"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Agile Technical
          <br />
          <em
            style={{ fontStyle: "italic", color: "var(--color-accent)" }}
          >
            Explorer
          </em>
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {/* Bio Text */}
          <div ref={bioRef} className="md:col-span-1">
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
          <div ref={infoRef} className="flex flex-col gap-4 md:col-span-1">
            {[
              { label: "Based in", value: "Thailand" },
              { label: "Focus", value: "Software Engineer / Full-Stack" },
              { label: "Available", value: "Internship 2026" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-2 border-b border-border pb-4"
              >
                <span className="font-body text-xs tracking-widest text-text-disabled uppercase">
                  {label}
                </span>
                <span className="font-body text-xs text-text-primary">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
