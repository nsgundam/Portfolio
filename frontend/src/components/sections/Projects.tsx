import { useScrollReveal } from "../../hooks/useScrollReveal";
import { BlurReveal } from "../ui/BlurReveal";

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
    stack: ["Next.js", "Socket.io", "PostgreSQL", "TypeScript"],
    link: "https://exploding-kittens-beta.vercel.app/",
    type: "Live",
  },
  {
    number: "02",
    title: "TramTracking",
    subtitle: "System",
    description:
      "Full-stack real-time mobility platform for campus shuttles. Sub-500ms location updates via WebSocket and PostGIS spatial indexing.",
    stack: ["Next.js", "Socket.io", "PostGIS", "OpenStreetMap"],
    link: "https://github.com/nsgundam/TramTrackingSystem",
    type: "GitHub",
  },
];

export default function Projects({ preloaderDone }: ProjectsProps) {
  const sectionRef = useScrollReveal<HTMLElement>(preloaderDone);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="px-5 sm:px-8 py-20 md:py-32 max-w-5xl mx-auto"
    >
      <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
        02 / Projects
      </p>

      <BlurReveal enabled={preloaderDone} className="mb-16">
        <h2
          className="font-heading text-text-primary leading-tight"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Showcase
          <br />
          <span className="text-text-secondary">Of Projects</span>
        </h2>
      </BlurReveal>

      <div className="flex flex-col gap-8">
        {PROJECTS.map((project, index) => (
          <BlurReveal
            key={project.number}
            enabled={preloaderDone}
            delay={index * 0.12}
          >
            <article
              className="group border border-border bg-surface p-5 sm:p-8
                         hover:border-brand rounded-2xl"
              style={{ transition: "border-color 0.3s" }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-body text-text-disabled text-xs tracking-widest">
                  {project.number}
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-text-secondary text-xs tracking-widest uppercase
                             hover:text-brand"
                  style={{ transition: "color 0.3s" }}
                >
                  {project.type} ↗
                </a>
              </div>

              <h3 className="font-heading text-text-primary text-2xl mb-1">
                {project.title}
              </h3>
              <p className="font-heading text-text-secondary text-2xl mb-6">
                {project.subtitle}
              </p>

              <p className="font-body text-text-secondary text-sm leading-relaxed mb-8 max-w-xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-body text-text-disabled text-xs border border-border px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
