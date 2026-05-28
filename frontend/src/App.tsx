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

export default function App() {
  useLenis();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);

  useEffect(() => {
    if (preloaderDone) {
      ScrollTrigger.refresh();
    }
  }, [preloaderDone]);

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
      <ScrollProgress />

      {/* Preloader — unmounts itself after exit */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Primary nav */}
      <Navbar preloaderDone={preloaderDone} />

      {/* Page sections */}
      <main>
        <Hero preloaderDone={preloaderDone} />
        <About preloaderDone={preloaderDone} />
        <Projects preloaderDone={preloaderDone} />
        <Skills preloaderDone={preloaderDone} />
        <Contact preloaderDone={preloaderDone} />
      </main>
    </>
  );
}
