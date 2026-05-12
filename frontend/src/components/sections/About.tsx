export default function About() {
  return (
    <section id="about" className="px-8 py-32 max-w-5xl mx-auto">

      {/* Section label */}
      <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
        01 / About
      </p>

      {/* Heading */}
      <h2
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

        {/* Quick info */}
        <div className="flex flex-col gap-4">
          {[
            { label: "Based in",  value: "Thailand"            },
            { label: "Focus",     value: "Fullstack / Frontend" },
            { label: "Available", value: "Internship 2026"      },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between border-b border-border pb-4">
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
  )
}