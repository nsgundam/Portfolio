import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { BlurReveal } from "../ui/BlurReveal";
import { MagneticButton } from "../ui/MagneticButton";

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
  const terminalRef = useRef<HTMLDivElement>(null);
  const bootLineRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    if (!preloaderDone) return;
    const terminalEl = terminalRef.current;
    if (!terminalEl) return;

    const bootLines = bootLineRefs.current.filter(Boolean) as HTMLParagraphElement[];
    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
      gsap.set(terminalEl, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(bootLines, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        terminalEl,
        { opacity: 0, filter: "blur(16px)", y: 40 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: terminalEl,
            start: "top 80%",
            once: true,
            onEnter: () => {
              bootLines.forEach((line, i) => {
                gsap.fromTo(
                  line,
                  { opacity: 0, x: -10 },
                  {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    delay: i * 0.25,
                  },
                );
              });
            },
          },
        },
      );
    }, terminalEl);

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <section
      id="contact"
      className="px-5 sm:px-8 py-20 md:py-32 max-w-5xl mx-auto"
    >
      <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
        04 / Contact
      </p>

      <BlurReveal enabled={preloaderDone} className="mb-16">
        <h2
          className="font-heading text-text-primary leading-tight"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Let's
          <br />
          <span className="text-text-secondary">Connect</span>
        </h2>
      </BlurReveal>

      <MagneticButton
        href="mailto:snarunat.99@gmail.com"
        className="font-heading text-text-primary mb-16 block leading-none hover:text-brand"
        style={{ fontSize: "clamp(20px, 3vw, 42px)", transition: "color 0.3s" }}
      >
        snarunat.99@gmail.com
      </MagneticButton>

      <div
        ref={terminalRef}
        className="w-full max-w-160 overflow-hidden rounded-xl border border-border bg-[rgba(22,26,29,0.8)] font-body"
      >
        <div className="relative flex h-9 items-center border-b border-border bg-white/5 px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>
          <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-xs text-text-disabled">
            narunat@portfolio ~ contact
          </p>
        </div>

        <div className="space-y-2 p-6 sm:p-8">
          {[
            "> Initializing contact protocol...",
            "> Loading communication channels...",
            "> Status: READY",
            "",
            "> Available commands:",
          ].map((line, index) => (
            <p
              key={`${line}-${index}`}
              ref={(el) => {
                bootLineRefs.current[index] = el;
              }}
              className="text-sm text-text-secondary"
            >
              {line || "\u00A0"}
            </p>
          ))}

          <div className="mt-4 flex flex-col gap-1">
            {CONTACT_LINKS.map(({ command, value, href }) => (
              <a
                key={command}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={`${command}: ${value}${href.startsWith("http") ? " (opens in new tab)" : ""}`}
                className="group flex items-center border-l-2 border-transparent py-2 pl-2 transition-all duration-200 hover:border-brand hover:bg-white/5"
              >
                <span className="text-sm text-brand">$</span>
                <span className="mr-4 ml-2 min-w-20 text-sm text-text-primary">
                  {command}
                </span>
                <span className="mx-2 text-text-disabled">→</span>
                <span className="text-sm text-text-secondary underline-offset-2 group-hover:text-text-primary group-hover:underline">
                  {value}
                </span>
              </a>
            ))}
            <p className="pt-2 text-sm text-text-secondary">
              <span className="text-brand" aria-hidden="true">
                █
              </span>
              <span className="terminal-cursor" aria-hidden="true">
                █
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="font-body text-text-disabled text-xs mt-20 pb-8">
        © 2026 Narunat Sutthibut. Built with React + Vite.
      </p>
    </section>
  );
}
