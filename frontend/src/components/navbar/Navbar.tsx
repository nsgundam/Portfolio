import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { handleSectionNav } from "../../lib/navigation";
import { JOURNEY_SECTION_DEFINITIONS } from "../../lib/journey";

interface NavbarProps {
  preloaderDone: boolean;
  heroTransitionComplete?: boolean;
}

const NAV_LINKS = JOURNEY_SECTION_DEFINITIONS.map(({ id, label, number }) => ({
  label,
  number,
  href: `#${id}`,
}));

// ── Design tokens ──────────────────────────────────
const THRESHOLD = 30;
const DEFAULT_BG = "transparent";
const BLUR = "10px";
const SATURATE = "200%";
const LOGO_SCALE = 0.85;
const DURATION = "0.7s";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// ──────────────────────────────────────────────────

export default function Navbar({ preloaderDone, heroTransitionComplete }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

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

  // ── Track mobile breakpoint for navbar morphology ─────────────────────
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    return () => media.removeEventListener("change", updateMobile);
  }, []);

  // ── Focus trap for mobile dialog menu ─────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const container = mobileMenuRef.current;
    if (!container) return;
    const menuButtonEl = menuButtonRef.current;

    const dialogFocusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const focusable = menuButtonEl
      ? [menuButtonEl, ...dialogFocusable]
      : dialogFocusable;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
        return;
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onTrap);
    return () => {
      document.removeEventListener("keydown", onTrap);
      menuButtonEl?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  // The reference uses a compact navigation shell from the first visible frame.
  // Scroll still strengthens its surface after the visitor leaves the Hero.
  const applyDesktopPill = !isMobile;

  return (
    <>
      {/* ── Nav bar (glass pill when scrolled) ───────────────────────── */}
      <header
        id="navbar"
        className="fixed z-40 flex items-center justify-between px-6 sm:px-8"
        style={{
          height: applyDesktopPill ? "60px" : "72px",
          top: applyDesktopPill ? "1rem" : "0px",
          left: applyDesktopPill ? "auto" : "50%",
          right: applyDesktopPill ? "clamp(1.25rem, 4vw, 4rem)" : "auto",
          transform: applyDesktopPill ? "none" : "translateX(-50%)",
          width: applyDesktopPill ? "92%" : "100%",
          maxWidth: applyDesktopPill ? "42rem" : "100%",
          borderRadius: applyDesktopPill ? "1rem" : "0px",
          backgroundColor: applyDesktopPill
            ? scrolled
              ? "color-mix(in srgb, var(--color-surface) 88%, transparent)"
              : "color-mix(in srgb, var(--color-surface) 64%, transparent)"
            : DEFAULT_BG,
          backdropFilter: applyDesktopPill
            ? `blur(${BLUR}) saturate(${SATURATE})`
            : "blur(0px) saturate(100%)",
          boxShadow: applyDesktopPill
            ? "0 0.75rem 2rem color-mix(in srgb, var(--color-bg) 45%, transparent)"
            : "none",
          border: applyDesktopPill
            ? "1px solid color-mix(in srgb, var(--color-border-light) 70%, transparent)"
            : "none",
          opacity: heroTransitionComplete ? 1 : 0,
          pointerEvents: heroTransitionComplete ? "auto" : "none",
          transition: `all ${DURATION} ${EASE}`,
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          id="navbar-logo"
          onClick={(e) => handleSectionNav(e, "#hero")}
          className="font-label text-text-primary text-lg tracking-wider origin-left"
          style={{
            transform: applyDesktopPill ? `scale(${LOGO_SCALE})` : "scale(1)",
            transition: `transform ${DURATION} ${EASE}`,
          }}
        >
          NS
        </a>

        {/* Desktop nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              label={link.label}
              href={link.href}
              onClick={(e) => handleSectionNav(e, link.href)}
            />
          ))}
        </nav>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          ref={menuButtonRef}
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
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        className="fixed inset-0 z-39 flex flex-col items-center justify-center md:hidden"
        style={{
          backgroundColor: "var(--color-bg)",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
          transition: `opacity 0.45s ${EASE}, visibility 0.45s ${EASE}`,
        }}
      >
        <nav className="flex flex-col items-center gap-8 sm:gap-10">
          {NAV_LINKS.map(({ label, href, number }, i) => (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                closeMenu();
                handleSectionNav(e, href);
              }}
              className="font-label text-text-primary tracking-wider uppercase hover:text-accent flex items-baseline gap-4"
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
              <span className="font-body text-accent text-xs tracking-[0.2em]">
                {number}
              </span>
              {label}
            </a>
          ))}
        </nav>

        {/* Tagline footer */}
        <p
          className="font-body text-text-secondary text-xs tracking-[0.2em] absolute bottom-10"
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
function NavLink({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group font-body text-text-secondary text-xs tracking-widest uppercase relative overflow-hidden block"
      style={{ height: "1.2em" }}
    >
      <div className="nav-rolling-inner flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2">
        <span className="h-[1.2em] flex items-center">{label}</span>
        <span aria-hidden="true" className="h-[1.2em] flex items-center text-accent">
          {label}
        </span>
      </div>
    </a>
  );
}
