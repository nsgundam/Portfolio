const NAV_LINKS = [
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills"   },
  { label: "Contact",  href: "#contact"  },
]

export default function Navbar() {
  return (
    <header
      id="navbar"
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6"
    >
      {/* Logo */}
      <div id="navbar-logo" className="font-heading text-text-primary text-lg tracking-wider">
        NS
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-body text-text-secondary text-sm tracking-widest uppercase
                       hover:text-text-primary"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}