import { useLenis } from "./hooks/useLenis";
import AmbientBackground from "./components/AmbientBackground";
import CustomCursor from "./components/cursor/CustomCursor";
import ScrollProgress from "./components/ui/ScrollProgress";
import Preloader from "./components/preloader/Preloader";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";
import { useState, useCallback, useEffect } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { prefersReducedMotion } from "./lib/motion";

export default function App() {
  useLenis();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroTransitionComplete, setHeroTransitionComplete] = useState(() => prefersReducedMotion());

  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);
  const handleHeroTransitionComplete = useCallback(() => setHeroTransitionComplete(true), []);

  useEffect(() => {
    if (preloaderDone) {
      ScrollTrigger.refresh();
    }
  }, [preloaderDone]);

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

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100
                   focus:px-4 focus:py-2 focus:bg-surface focus:text-text-primary focus:border
                   focus:border-brand font-body text-sm"
      >
        Skip to content
      </a>

      {/* Background layer — fixed, behind everything */}
      <AmbientBackground />

      {/* Global overlays */}
      <CustomCursor />
      <ScrollProgress heroTransitionComplete={heroTransitionComplete} />

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
