// src/components/navbar/Navbar.tsx
import { useEffect, useRef } from "react"
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

export default function Navbar({ preloaderDone }: NavbarProps) {
  const headerRef = useRef<HTMLElement>(null)
  const logoRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!preloaderDone) return  // รอ preloader เสร็จก่อน

    const header = headerRef.current!
    const logo   = logoRef.current!

    // ScrollTrigger: เมื่อ scroll เกิน threshold
    ScrollTrigger.create({
      start: "50px top",        // ← ปรับ threshold จาก Playground
      onEnter: () => {
        // Glassmorphism
        gsap.to(header, {
          backgroundColor: "rgba(22, 26, 29, 0.5)",
          backdropFilter:  "blur(12px)",
          borderBottom:    "1px solid rgba(42, 45, 48, 0.4)",
          duration: 0.5,
          ease: "power4.out",
        })
        // Logo Tuck
        gsap.to(logo, {
          scale:    0.7,        // ← ปรับจาก Playground
          duration: 0.5,
          ease: "power4.out",
        })
      },
      onLeaveBack: () => {
        // กลับ state เดิมเมื่อ scroll ขึ้น
        gsap.to(header, {
          backgroundColor: "transparent",
          backdropFilter:  "blur(0px)",
          borderBottom:    "1px solid transparent",
          duration: 0.5,
          ease: "power4.out",
        })
        gsap.to(logo, {
          scale:    1,
          duration: 0.5,
          ease: "power4.out",
        })
      },
    })
  }, [preloaderDone])

  return (
    <header
      ref={headerRef}
      id="navbar"
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6"
    >
      <div
        ref={logoRef}
        id="navbar-logo"
        className="font-heading text-text-primary text-lg tracking-wider origin-left"
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
      className="font-body text-text-secondary text-sm tracking-widest uppercase
                 hover:text-text-primary overflow-hidden relative"
      style={{ transition: "color 0.3s" }}
    >
      {label}
    </a>
  )
}