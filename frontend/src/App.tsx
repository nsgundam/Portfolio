import { useLenis } from "./hooks/useLenis";
import { useJourneyState } from "./hooks/useJourneyState";
import CustomCursor from "./components/cursor/CustomCursor";
import ScrollProgress from "./components/ui/ScrollProgress";
import Preloader from "./components/preloader/Preloader";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";
import { SpaceScene } from "./components/backgrounds/SpaceScene";
import { useState, useCallback, useEffect, useRef } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { prefersReducedMotion } from "./lib/motion";
import { handleSectionNav, scrollToSection } from "./lib/navigation";
import { JOURNEY_SECTIONS } from "./types/journey";

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroTransitionComplete, setHeroTransitionComplete] = useState(() => prefersReducedMotion());
  const initialHashHandledRef = useRef(false);
  const journey = useJourneyState(preloaderDone);

  // Lock Lenis scroll until Hero animation finishes
  useLenis(!heroTransitionComplete);

  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);
  const handleHeroTransitionComplete = useCallback(() => setHeroTransitionComplete(true), []);

  useEffect(() => {
    if (!heroTransitionComplete) {
      document.documentElement.classList.add("no-scroll");
      document.body.classList.add("no-scroll");
    } else {
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
    };
  }, [heroTransitionComplete]);

  useEffect(() => {
    if (!heroTransitionComplete || initialHashHandledRef.current) return;
    initialHashHandledRef.current = true;

    const target = window.location.hash.replace(/^#/, "");
    if (!JOURNEY_SECTIONS.includes(target as (typeof JOURNEY_SECTIONS)[number])) {
      return;
    }

    ScrollTrigger.refresh();
    scrollToSection(target, { updateHash: false, immediate: true });
  }, [heroTransitionComplete]);

  return (
    <>
      <a
        href="#hero"
        onClick={(e) => handleSectionNav(e, "#hero")}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100
                   focus:px-4 focus:py-2 focus:bg-surface focus:text-text-primary focus:border
                   focus:border-accent font-body text-sm"
      >
        Skip to content
      </a>

      <SpaceScene journey={journey} />

      {/* Global overlays */}
      <CustomCursor />
      <ScrollProgress
        journey={journey}
        heroTransitionComplete={heroTransitionComplete}
      />

      {/* Preloader — unmounts itself after exit */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Primary nav */}
      <Navbar preloaderDone={preloaderDone} heroTransitionComplete={heroTransitionComplete} />

      {/* Page sections */}
      <main>
        <Hero
          preloaderDone={preloaderDone}
          onTransitionComplete={handleHeroTransitionComplete}
        />
        <About preloaderDone={preloaderDone} />
        <Projects preloaderDone={preloaderDone} />
        <Skills preloaderDone={preloaderDone} />
        <Contact preloaderDone={preloaderDone} />
      </main>
    </>
  );
}
