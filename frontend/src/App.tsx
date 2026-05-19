import { useLenis } from "./hooks/useLenis"
import Navbar from "./components/navbar/Navbar"
import Hero from "./components/sections/Hero"
import About from "./components/sections/About"
import Projects from "./components/sections/Projects"
import Skills from "./components/sections/Skills"
import Contact from "./components/sections/Contact"
import CustomCursor from "./components/cursor/CustomCurer.tsx"
import Preloader from "./components/preloader/Preloader"
import { useState, useCallback } from "react"
import ScrollProgress from "./components/ui/ScollProgress"

export default function App() {
  useLenis()
  const [preloaderDone, setPreloaderDone] = useState(false)
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), [])

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Preloader onComplete={handlePreloaderComplete} />
      <Navbar preloaderDone={preloaderDone} />
      <main>
        <Hero preloaderDone={preloaderDone} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}