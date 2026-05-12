import { useLenis } from "./hooks/useLenis"
import Preloader from "./components/preloader/Preloader"
import Navbar from "./components/navbar/Navbar"
import Hero from "./components/sections/Hero"
import About from "./components/sections/About"
import Projects from "./components/sections/Projects"
import Skills from "./components/sections/Skills"
import Contact from "./components/sections/Contact"

export default function App() {
  useLenis()

  return (
    <>
      {/*<Preloader />*/}
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}