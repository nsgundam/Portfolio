// src/components/navbar/Navbar.tsx
import { useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

interface NavbarProps {
  preloaderDone: boolean;
}

const NAV_LINKS = [
  { label: "About", href: "#about", number: "01" },
  { label: "Projects", href: "#projects", number: "02" },
  { label: "Skills", href: "#skills", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

// ── Design tokens ──────────────────────────────────
const THRESHOLD = 30;
const SCROLLED_BG = "rgba(22, 26, 29, 0.65)";
const DEFAULT_BG = "rgba(22, 26, 29, 0)";
const BLUR = "20px";
const SATURATE = "180%";
const LOGO_SCALE = 0.85;
const DURATION = "0.7s";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// ──────────────────────────────────────────────────

export default function Navbar({ preloaderDone }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Glass pill ScrollTrigger ─────────────────────────────────────────
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

  // ── Close menu on Escape ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── Nav bar (glass pill when scrolled) ───────────────────────── */}
      <header
        id="navbar"
        className="fixed z-40 flex items-center justify-between px-6 sm:px-8 left-1/2 -translate-x-1/2"
        style={{
          height: scrolled ? "60px" : "72px",
          top: scrolled ? "1rem" : "0px",
          width: scrolled ? "92%" : "100%",
          maxWidth: scrolled ? "42rem" : "100%",
          borderRadius: scrolled ? "1rem" : "0px",
          backgroundColor: scrolled ? SCROLLED_BG : DEFAULT_BG,
          backdropFilter: scrolled
            ? `blur(${BLUR}) saturate(${SATURATE})`
            : "blur(0px) saturate(100%)",
          boxShadow: scrolled
            ? "inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 4px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.25)"
            : "inset 0 0 0 rgba(255,255,255,0), inset 0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)",
          border: scrolled
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(255, 255, 255, 0)",
          transition: `all ${DURATION} ${EASE}`,
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          id="navbar-logo"
          className="font-heading text-text-primary text-lg tracking-wider origin-left"
          style={{
            transform: scrolled ? `scale(${LOGO_SCALE})` : "scale(1)",
            transition: `transform ${DURATION} ${EASE}`,
          }}
        >
          NS
        </a>

        {/* Desktop nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} label={link.label} href={link.href} />
          ))}
        </nav>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex md:hidden flex-col justify-between w-5 h-3.5 shrink-0"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {/* Bar 1 — rotates +45° to form top arm of X */}
          <span
            className="block h-px w-full bg-text-primary origin-center transition-all duration-300"
            style={{
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
              transitionTimingFunction: EASE,
            }}
          />
          {/* Bar 2 — fades out */}
          <span
            className="block h-px w-full bg-text-primary transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          {/* Bar 3 — rotates −45° to form bottom arm of X */}
          <span
            className="block h-px w-full bg-text-primary origin-center transition-all duration-300"
            style={{
              transform: menuOpen
                ? "translateY(-6.5px) rotate(-45deg)"
                : "none",
              transitionTimingFunction: EASE,
            }}
          />
        </button>
      </header>

      {/* ── Mobile full-screen menu ───────────────────────────────────── */}
      {/* z-[39]: below navbar (z-40) so the hamburger/X stays clickable */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-0 z-39 flex flex-col items-center justify-center md:hidden"
        style={{
          backgroundColor: "var(--color-bg)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: `opacity 0.45s ${EASE}`,
        }}
      >
        <nav className="flex flex-col items-center gap-8 sm:gap-10">
          {NAV_LINKS.map(({ label, href, number }, i) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="font-heading text-text-primary tracking-wider uppercase hover:text-brand flex items-baseline gap-4"
              style={{
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                // Stagger in on open, snap out together on close
                transition: menuOpen
                  ? `opacity 0.5s ${EASE} ${0.1 + i * 0.07}s, transform 0.5s ${EASE} ${0.1 + i * 0.07}s, color 0.3s`
                  : `opacity 0.2s, transform 0.2s, color 0.3s`,
              }}
            >
              <span className="font-body text-brand text-xs tracking-[0.2em]">
                {number}
              </span>
              {label}
            </a>
          ))}
        </nav>

        {/* Tagline footer */}
        <p
          className="font-body text-text-disabled text-xs tracking-[0.2em] absolute bottom-10"
          style={{
            opacity: menuOpen ? 1 : 0,
            transition: menuOpen
              ? `opacity 0.5s ${EASE} 0.4s`
              : "opacity 0.15s",
          }}
        >
          Aiming high, building what matters.
        </p>
      </div>
    </>
  );
}

// ── Desktop NavLink — Rolling Text hover ────────────────────────────────
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
