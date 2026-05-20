// src/components/navbar/Navbar.tsx
import { useEffect, useState } from "react"
import { gsap, ScrollTrigger } from "../../lib/gsap"

interface NavbarProps {
  preloaderDone: boolean
}

const NAV_LINKS = [
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills"   },
  { label: "Contact",  href: "#contact"  },
]

// ── Tune these values ──────────────────────────────
const THRESHOLD    = 30
const GLASS_OPACITY= 0.08
const BLUR         = '20px'
const SATURATE     = '200%'
const LOGO_SCALE   = 0.85
const TRANSITION   = '1.5s' // CSS duration
// ──────────────────────────────────────────────────

export default function Navbar({ preloaderDone }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!preloaderDone) return
    
    // Reset and prepare GSAP context
    const ctx = gsap.context(() => {
      // Create the scroll trigger
      ScrollTrigger.create({
        start: `${THRESHOLD}px top`,
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      })
    })

    return () => ctx.revert()
  }, [preloaderDone])

  return (
    <header
      id="navbar"
      className={`fixed z-40 flex items-center justify-between px-8 transition-all left-1/2 -translate-x-1/2 ${
        scrolled
          ? 'top-4 w-[90%] max-w-2xl rounded-2xl'
          : 'top-0 w-full max-w-none rounded-none'
      }`}
      style={{
        height: scrolled ? '64px' : '72px',
        backgroundColor: scrolled
          ? `rgba(255, 255, 255, ${GLASS_OPACITY})`
          : 'rgba(22, 26, 29, 0)',
        backdropFilter: scrolled ? `blur(${BLUR}) saturate(${SATURATE})` : 'none',
        boxShadow: scrolled
          ? `
              inset 0 1px 1px rgba(255, 255, 255, 0.15), 
              inset 0 -1px 4px rgba(0, 0, 0, 0.5),      
              0 8px 32px rgba(0, 0, 0, 0.2)             
            `
          : 'none',
        border: scrolled
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid transparent',
        transitionDuration: TRANSITION,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        id="navbar-logo"
        className="font-heading text-text-primary text-lg tracking-wider origin-left"
        style={{
          transform: scrolled ? `scale(${LOGO_SCALE})` : 'scale(1)',
          transition: `transform ${TRANSITION} cubic-bezier(0.16, 1, 0.3, 1)`,
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
  )
}

// NavLink แยก component เพื่อรองรับ Rolling Text ใน Step 06
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
  )
}