import { useScrollReveal } from "../../hooks/useScrollReveal"

const LINKS = [
  { label: "Email",   value: "snarunat.99@gmail.com",          href: "mailto:snarunat.99@gmail.com" },
  { label: "GitHub",  value: "github.com/nsgundam",            href: "https://github.com/nsgundam" },
  { label: "LinkedIn", value: "linkedin.com/in/narunat-sutthibut",           href: "https://www.linkedin.com/in/narunat-sutthibut/" },
]

export default function Contact() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const headingRef = useScrollReveal<HTMLHeadingElement>()

  return (
    <section id="contact" ref={sectionRef} className="px-8 py-32 max-w-5xl mx-auto">

      <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
        04 / Contact
      </p>

      <h2
        ref={headingRef}
        className="font-heading text-text-primary leading-tight mb-16"
        style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
      >
        Let's
        <br />
        <span className="text-text-secondary">Connect</span>
      </h2>

      {/* Big CTA */}
      <a
        href="mailto:snarunat.99@gmail.com"
        className="font-heading text-text-primary block mb-20 leading-none
                   hover:text-brand"
        style={{
          fontSize: "clamp(28px, 4vw, 56px)",
          transition: "color 0.3s",
        }}
      >
        [EMAIL_ADDRESS]
      </a>

      {/* Links */}
      <div className="flex flex-col gap-0">
        {LINKS.map(({ label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center justify-between border-t border-border py-5
                       hover:border-brand group"
            style={{ transition: "border-color 0.3s" }}
          >
            <span className="font-body text-text-disabled text-xs tracking-widest uppercase">
              {label}
            </span>
            <span className="font-body text-text-secondary text-sm group-hover:text-text-primary"
              style={{ transition: "color 0.3s" }}
            >
              {value} ↗
            </span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <p className="font-body text-text-disabled text-xs mt-20 pb-8">
        © 2026 Narunat Sutthibut. Built with React + Vite.
      </p>

    </section>
  )
}