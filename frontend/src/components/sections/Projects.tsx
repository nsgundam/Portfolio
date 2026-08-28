import { ProjectCarousel } from "../projects/ProjectCarousel";
import { SectionShell } from "../ui/SectionShell";
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
  return (
    <SectionShell
      id="projects"
      aria-busy={!preloaderDone}
      sectionNumber="03"
      sectionLabel="Projects"
      className="relative z-10"
    >
      <div className="section-shell__content projects-layout">
        {/* Editorial introduction */}
        <div className="projects-intro">
          <h2 className="section-heading">
            Things I&apos;ve built
            <br />
            <em className="text-accent">Systems &amp; interfaces.</em>
          </h2>
          <p className="section-prose mt-8">
            A focused selection of work across real-time systems and thoughtful
            interfaces.
          </p>
        </div>

        {/* Coverflow Carousel */}
        <div className="projects-stage">
          <ProjectCarousel projects={PROJECTS} />
        </div>
      </div>
    </SectionShell>
  );
}
