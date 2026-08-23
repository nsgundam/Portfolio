import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ProjectCarousel } from "../projects/ProjectCarousel";
import type { Project } from "../../types";

interface ProjectsProps {
  preloaderDone: boolean;
}

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Boardgame Online",
    subtitle: "Exploding Kittens",
    category: "Multiplayer Card Game",
    description: "A real-time multiplayer card game.",
    stack: [
      "Next.js",
      "Socket.io",
      "PostgreSQL",
      "TypeScript",
      "Prisma ORM",
      "GitHub Actions",
    ],
    link: "https://exploding-kittens-beta.vercel.app/",
    linkType: "Live",
    status: "published",
  },
  {
    number: "02",
    title: "TramTracking",
    subtitle: "System",
    category: "Campus Shuttle Tracking",
    description: "Campus shuttle tracking using WebSocket and PostGIS.",
    stack: [
      "Next.js",
      "Socket.io",
      "PostGIS",
      "OpenStreetMap",
      "PostgreSQL",
      "TypeScript",
    ],
    link: "https://github.com/nsgundam/TramTrackingSystem",
    linkType: "GitHub",
    status: "published",
  },
  {
    number: "03",
    title: "Mini Appointment",
    subtitle: "App",
    category: "Project",
    description: "Details are being verified before publication.",
    stack: [],
    status: "pending",
  },
  {
    number: "04",
    title: "Backend LINE LIFF",
    subtitle: "Baanchangsom",
    category: "Project",
    description: "Details are being verified before publication.",
    stack: [],
    status: "pending",
  },
];

export default function Projects({ preloaderDone }: ProjectsProps) {
  const sectionRef = useScrollReveal<HTMLElement>(preloaderDone);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative px-5 sm:px-8 py-20 md:py-32 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="mb-12 md:mb-16">
        <p className="font-label text-accent text-xs tracking-[0.3em] uppercase mb-4">
          02 / Projects
        </p>

        <h2
          className="font-display text-text-primary leading-tight"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Selected work
          <br />
          <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
            Systems & interfaces.
          </em>
        </h2>
      </div>

      {/* Coverflow Carousel */}
      <div>
        <ProjectCarousel projects={PROJECTS} />
      </div>
    </section>
  );
}
