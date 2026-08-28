import { BlurReveal } from "../ui/BlurReveal";
import { MagneticButton } from "../ui/MagneticButton";
import { SectionShell } from "../ui/SectionShell";

interface ContactProps {
  preloaderDone: boolean;
}

const CONTACT_LINKS = [
  {
    command: "email",
    value: "snarunat.99@gmail.com",
    href: "mailto:snarunat.99@gmail.com",
  },
  {
    command: "github",
    value: "github.com/nsgundam",
    href: "https://github.com/nsgundam",
  },
  {
    command: "linkedin",
    value: "linkedin.com/in/narunat-sutthibut",
    href: "https://www.linkedin.com/in/narunat-sutthibut/",
  },
];

export default function Contact({ preloaderDone }: ContactProps) {
  return (
    <SectionShell
      id="contact"
      sectionNumber="05"
      sectionLabel="Contact"
      className="section-shell--contact relative z-10"
    >
      <div className="section-shell__content contact-layout">
        <div className="contact-intro">
          <BlurReveal enabled={preloaderDone}>
            <h2 className="section-heading">
              Let&apos;s build
              <br />
              <span className="text-text-secondary">something great</span>
              <br />
              <em className="text-accent">together.</em>
            </h2>
          </BlurReveal>

          <p className="section-prose">
            Have a role, project, or problem worth exploring? Reach out through
            any of these direct channels.
          </p>

          <MagneticButton
            href="mailto:snarunat.99@gmail.com"
            className="contact-email"
          >
            snarunat.99@gmail.com
          </MagneticButton>
        </div>

        <div className="contact-panel contact-channels">
          <p className="contact-channels__label">Direct channels</p>
          <div className="contact-links">
            {CONTACT_LINKS.map(({ command, value, href }) => (
              <a
                key={command}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={`${command}: ${value}${href.startsWith("http") ? " (opens in new tab)" : ""}`}
                className="contact-link"
              >
                <span className="contact-link__command">{command}</span>
                <span className="contact-link__value">{value}</span>
                <svg
                  aria-hidden="true"
                  className="contact-link__arrow"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 13 13 3M6 3h7v7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="contact-footer">
        © 2026 Narunat Sutthibut. Built with React + Vite.
      </p>
    </SectionShell>
  );
}
