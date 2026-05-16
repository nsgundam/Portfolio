export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
    >
      {/* Gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(164,22,26,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Name */}
      <h1
        className="font-heading text-text-primary mb-6 leading-none tracking-tight"
        style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
      >
        Narunat
        Sutthibut
      </h1>

      {/* Tagline */}
      <p className="font-body text-text-secondary max-w-md text-sm leading-relaxed">
        Aiming high, building what matters.
      </p>

      <div className="flex mt-8 items-center justify-center gap-4">
        <a href="#contact" className="bg-brand font-body text-text-primary border border-text-primary px-4 py-2 text-sm tracking-widest uppercase hover:text-brand hover:bg-text-primary">
          Contact me
        </a>
        <a href="#projects" className="font-body text-text-primary border border-text-primary px-4 py-2 text-sm tracking-widest uppercase hover:text-brand">
          View Projects
        </a>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-text-disabled text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="h-8 w-px bg-border" />
      </div>
    </section>
  )
}