import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";

interface AboutProps {
  preloaderDone: boolean;
}

export default function About({ preloaderDone }: AboutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preloaderDone) return;
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    if (!wrapper || !panel) return;

    const isReducedMotion = prefersReducedMotion();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const revealTargets = [
      labelRef.current,
      headingRef.current,
      photoRef.current,
      bioRef.current,
      infoRef.current,
    ];

    const runReveal = () => {
      gsap.timeline()
        .fromTo(
          labelRef.current,
          { opacity: 0, filter: "blur(8px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power4.out" },
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, filter: "blur(12px)", y: 20 },
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, ease: "power4.out" },
          "-=0.3",
        )
        .fromTo(
          photoRef.current,
          { opacity: 0, scale: 0.9, filter: "blur(12px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power4.out" },
          "-=0.4",
        )
        .fromTo(
          bioRef.current,
          { opacity: 0, filter: "blur(8px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power4.out" },
          "-=0.4",
        )
        .fromTo(
          infoRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power4.out" },
          "-=0.5",
        );
    };

    if (isReducedMotion) {
      gsap.set(panel, { y: 0 });
      gsap.set(revealTargets, { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 });
      return;
    }

    gsap.set(panel, { y: window.innerHeight });
    gsap.set(revealTargets, { opacity: 0 });

    let revealPlayed = false;
    const ctx = gsap.context(() => {
      gsap.to(panel, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "top top",
          scrub: isMobile ? 0.5 : true,
          onUpdate: (self) => {
            if (!revealPlayed && self.progress >= 0.995) {
              revealPlayed = true;
              runReveal();
            }
          },
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <div ref={wrapperRef} className="about-wrapper relative z-10 ">
      <section
        id="about"
        ref={panelRef}
        className="about-panel min-h-screen rounded-t-[24px] border-t border-white/10 px-5 py-20 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-8 md:py-32"
        style={{ backgroundColor: "rgba(22, 26, 29, 0.92)" }}
      >
        <div className="mx-auto max-w-5xl">
          <p
            ref={labelRef}
            aria-hidden="true"
            className="mb-4 font-body text-xs tracking-[0.3em] text-brand uppercase"
          >
            01 / About
          </p>

          <h2
            ref={headingRef}
            className="mb-12 font-heading leading-tight text-text-primary"
            style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
          >
            Agile Technical
            <br />
            <span className="text-text-secondary">Explorer</span>
          </h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
            {/* Personal Photo */}
            <div
              ref={photoRef}
              className="flex justify-center md:col-span-1"
            >
              <div className="w-full max-w-xs aspect-square rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-surface to-bg shadow-lg">
                {/* Placeholder for personal photo */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `
                      radial-gradient(circle at 30% 40%, rgba(164, 22, 26, 0.2) 0%, transparent 50%),
                      linear-gradient(135deg, rgba(22, 26, 29, 1) 0%, rgba(11, 9, 10, 1) 100%)
                    `,
                  }}
                >
                  <div className="text-center">
                    <div className="font-heading text-6xl text-text-secondary opacity-20 mb-2">
                      📸
                    </div>
                    <p className="font-body text-xs text-text-secondary opacity-50">
                      Personal Photo
                    </p>
                    <p className="font-body text-xs text-text-disabled opacity-30 mt-1">
                      (Add your image to public/images/)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Text */}
            <div ref={bioRef} className="md:col-span-1">
              <p className="font-body text-sm leading-relaxed text-text-secondary mb-4">
                I am a developer driven by curiosity and a problem-solving mindset.
                In a fast-evolving tech landscape, I define myself as an{" "}
                <span className="text-text-primary">Agile Technical Explorer</span>
                —always ready to leverage new tools to transform ideas into reality.
              </p>
              <p className="font-body text-sm leading-relaxed text-text-secondary">
                My focus lies in the intersection of efficient architecture and
                sophisticated visuals, ensuring every project is built with purpose
                and impact.
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
                  <span className="font-body text-xs text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
