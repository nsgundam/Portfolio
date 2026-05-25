// src/components/navbar/Navbar.tsx
import { useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

interface NavbarProps {
  preloaderDone: boolean;
}

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// ── Design tokens ──────────────────────────────────
const THRESHOLD = 30;
// Use rgba values (never 'transparent' or 'none') so CSS can interpolate smoothly
const SCROLLED_BG = "rgba(22, 26, 29, 0.65)";
const DEFAULT_BG = "rgba(22, 26, 29, 0)";
const BLUR = "20px";
const SATURATE = "180%";
const LOGO_SCALE = 0.85;
const DURATION = "0.7s";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // power4.out equivalent
// ──────────────────────────────────────────────────

export default function Navbar({ preloaderDone }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: `${THRESHOLD}px top`,
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <header
      id="navbar"
      // Only keep positioning/layout helpers here — all animated props live in style
      className="fixed z-40 flex items-center justify-between px-8 left-1/2 -translate-x-1/2"
      style={{
        // Geometry — use px/% so every value is interpolable
        height: scrolled ? "60px" : "72px",
        top: scrolled ? "1rem" : "0px",
        width: scrolled ? "90%" : "100%",
        maxWidth: scrolled ? "42rem" : "100%",
        borderRadius: scrolled ? "1rem" : "0px",

        // Glass surface
        backgroundColor: scrolled ? SCROLLED_BG : DEFAULT_BG,
        // blur(0px) → blur(20px) is interpolable; 'none' → 'blur(x)' is not
        backdropFilter: scrolled
          ? `blur(${BLUR}) saturate(${SATURATE})`
          : "blur(0px) saturate(100%)",

        // Shadows — use zero-value shadow so transition works
        boxShadow: scrolled
          ? "inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 4px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.25)"
          : "inset 0 0 0 rgba(255,255,255,0), inset 0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)",

        // Border — rgba 0 → 0.08 is interpolable
        border: scrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(255, 255, 255, 0)",

        // Single transition declaration drives everything above
        transition: `all ${DURATION} ${EASE}`,
      }}
    >
      <div
        id="navbar-logo"
        className="font-heading text-text-primary text-lg tracking-wider origin-left"
        style={{
          transform: scrolled ? `scale(${LOGO_SCALE})` : "scale(1)",
          transition: `transform ${DURATION} ${EASE}`,
        }}
      >
        NS
      </div>

      <nav className="flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.href} label={link.label} href={link.href} />
        ))}
      </nav>
    </header>
  );
}

// NavLink — Rolling Text hover (Step 06)
function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group font-body text-text-secondary text-sm tracking-widest uppercase relative overflow-hidden block"
      style={{ height: "1.2em" }}
    >
      <div className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2">
        <span className="h-[1.2em] flex items-center">{label}</span>
        <span className="h-[1.2em] flex items-center text-brand">{label}</span>
      </div>
    </a>
  );
}
