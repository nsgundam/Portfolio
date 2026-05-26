import { useScrollReveal } from "../../hooks/useScrollReveal";
import { BlurReveal } from "../ui/BlurReveal";

interface AboutProps {
  preloaderDone: boolean;
}

export default function About({ preloaderDone }: AboutProps) {
  const sectionRef = useScrollReveal<HTMLElement>(preloaderDone);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="px-5 sm:px-8 py-20 md:py-32 max-w-5xl mx-auto"
    >
      <p
        aria-hidden="true"
        className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4"
      >
        01 / About
      </p>

      <BlurReveal enabled={preloaderDone} className="mb-16">
        <h2
          className="font-heading text-text-primary leading-tight"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Agile Technical
          <br />
          <span className="text-text-secondary">Explorer</span>
        </h2>
      </BlurReveal>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <BlurReveal enabled={preloaderDone} delay={0.1}>
          <div>
            <p className="font-body text-text-secondary text-sm leading-relaxed">
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
        </BlurReveal>

        <BlurReveal enabled={preloaderDone} delay={0.2}>
          <div className="flex flex-col gap-4">
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
        </BlurReveal>
      </div>
    </section>
  );
}
