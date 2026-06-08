import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";

interface AboutProps {
  preloaderDone: boolean;
}

export default function About({ preloaderDone }: AboutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef     = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);

  // ── Panel slide-up + comet + content reveal (pinned scrub) ──
  useEffect(() => {
    if (!preloaderDone) return;
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    if (!wrapper || !panel) return;

    const isReducedMotion = prefersReducedMotion();
    const contentTargets = [
      labelRef.current,
      headingRef.current,
      bioRef.current,
      infoRef.current,
    ];

    if (isReducedMotion) {
      gsap.set(panel, { y: 0 });
      gsap.set(contentTargets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
      });
      return;
    }

    // Hide content initially
    gsap.set(panel, { y: window.innerHeight });
    gsap.set(contentTargets, { opacity: 0 });

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px)",
    ).matches;
    const factor = isMobile ? 0.5 : isTablet ? 0.6 : 1;

    const ctx = gsap.context(() => {
      // ── Phase A: Panel slides up from below (covers Hero) ──
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top bottom",
        end: "top top",
        scrub: isMobile ? 0.5 : 1,
        onUpdate: (self) => {
          // Panel rises from below
          gsap.set(panel, { y: (1 - self.progress) * window.innerHeight });
        },
      });

      // ── Phase B: Pinned — atmospheric pause then content reveal ──
      const pinDistance = 900 * factor;
      const tl = gsap.timeline();

      // Brief cinematic pause before content reveals
      // SpaceScene handles the asteroid drama during this beat
      tl.to({}, { duration: 0.35 });

      // Label
      tl.fromTo(
        labelRef.current,
        { opacity: 0, filter: 'blur(8px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: 'power4.out' },
      );

      // Heading
      tl.fromTo(
        headingRef.current,
        { opacity: 0, filter: "blur(12px)", y: 30, scale: 0.92 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          duration: 0.15,
          ease: "power4.out",
        },
      );

      // Bio
      tl.fromTo(
        bioRef.current,
        { opacity: 0, filter: "blur(8px)", y: 20 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.15,
          ease: "power4.out",
        },
        "-=0.05",
      );

      // Info
      tl.fromTo(
        infoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.15, ease: "power4.out" },
        "-=0.05",
      );

      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        animation: tl,
      });
    }, wrapper);

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <div ref={wrapperRef} className="about-wrapper relative z-10">
      <section
        id="about"
        ref={panelRef}
        className="about-panel relative min-h-screen overflow-hidden px-5 py-20 sm:px-8 md:py-32"
      >

        <div className="relative z-10 mx-auto max-w-5xl">
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
    </div>
  );
}
