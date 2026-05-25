import { useScrollReveal } from "../../hooks/useScrollReveal";

interface AboutProps {
  preloaderDone: boolean;
}

export default function About({ preloaderDone }: AboutProps) {
  const sectionRef = useScrollReveal<HTMLElement>(preloaderDone);
  const headingRef = useScrollReveal<HTMLHeadingElement>(preloaderDone);
  const bioRef = useScrollReveal<HTMLDivElement>(preloaderDone);
  const infoRef = useScrollReveal<HTMLDivElement>(preloaderDone);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="px-8 py-32 max-w-5xl mx-auto"
    >
      {/* Section label */}
      <p
        aria-hidden="true"
        className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4"
      >
        01 / About
      </p>

      {/* Heading */}
      <h2
        ref={headingRef}
        className="font-heading text-text-primary leading-tight mb-16"
        style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
      >
        Agile Technical
        <br />
        <span className="text-text-secondary">Explorer</span>
      </h2>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {/* Bio */}
        <div>
          <p
            ref={bioRef}
            className="font-body text-text-secondary text-sm leading-relaxed"
          >
            I am a developer driven by curiosity and a problem-solving mindset.
            In a fast-evolving tech landscape, I define myself as an{" "}
            <span className="text-text-primary">Agile Technical Explorer</span>
            —always ready to leverage new tools to transform ideas into reality.
          </p>
          <p className="font-body text-text-secondary text-sm leading-relaxed mt-4">
            My focus lies in the intersection of efficient architecture and
            sophisticated visuals, ensuring every project is built with purpose
            and impact.
          </p>
        </div>

        {/* Quick info */}
        <div ref={infoRef} className="flex flex-col gap-4">
          {[
            { label: "Based in", value: "Thailand" },
            { label: "Focus", value: "Software Engineer / Full-Stack / AI" },
            { label: "Available", value: "Internship 2026" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between border-b border-border pb-4"
            >
              <span className="font-body text-text-disabled text-xs tracking-widest uppercase">
                {label}
              </span>
              <span className="font-body text-text-primary text-xs">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
