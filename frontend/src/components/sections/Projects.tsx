import { useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { BlurReveal } from "../ui/BlurReveal";
import { ProjectWindow } from "../ui/ProjectWindow";

interface ProjectsProps {
  preloaderDone: boolean;
}

const PROJECTS = [
  {
    number: "01",
    title: "Boardgame Online",
    subtitle: "Exploding Kittens",
    description:
      "Real-time multiplayer card game. Scalable room system supporting up to 5 players with event-driven architecture and sub-100ms sync.",
    stack: [
      "Next.js",
      "Socket.io",
      "PostgreSQL",
      "TypeScript",
      "Prisma ORM",
      "GitHub Actions",
    ],
    link: "https://exploding-kittens-beta.vercel.app/",
    type: "Live",
    featured: true,
  },
  {
    number: "02",
    title: "TramTracking",
    subtitle: "System",
    description:
      "Full-stack real-time mobility platform for campus shuttles. Sub-500ms location updates via WebSocket and PostGIS spatial indexing.",
    stack: [
      "Next.js",
      "Socket.io",
      "PostGIS",
      "OpenStreetMap",
      "PostgreSQL",
      "TypeScript",
    ],
    link: "https://github.com/nsgundam/TramTrackingSystem",
    type: "GitHub",
    featured: false,
  },
];

export default function Projects({ preloaderDone }: ProjectsProps) {
  const sectionRef = useScrollReveal<HTMLElement>(preloaderDone);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative px-5 sm:px-8 py-20 md:py-32 max-w-6xl mx-auto"
    >
      {/* Sticky Heading */}
      <div className="top-0 z-20 backdrop-blur-md pb-8 pt-4 -mx-5 sm:-mx-8 px-5 sm:px-8">
        <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
          02 / Projects
        </p>

        <BlurReveal enabled={preloaderDone} className="mb-0">
          <h2
            className="font-heading text-text-primary leading-tight"
            style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
          >
            Showcase
            <br />
            <span className="text-text-secondary">Of Projects</span>
          </h2>
        </BlurReveal>
      </div>

      {/* Project Window */}
      <div className="mt-12">
        <ProjectWindow
          projects={PROJECTS}
          activeIndex={activeProjectIndex}
          onTabChange={setActiveProjectIndex}
        />
      </div>

      {/* Navigation Info */}
      <div className="mt-8 text-center">
        <p className="font-body text-text-secondary text-xs">
          Click tabs to view different projects • {activeProjectIndex + 1} of{" "}
          {PROJECTS.length}
        </p>
      </div>
    </section>
  );
}
