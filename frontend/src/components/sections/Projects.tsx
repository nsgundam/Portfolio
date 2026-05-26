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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:gap-6">
        {PROJECTS.map((project, index) => (
          <BlurReveal
            key={project.number}
            enabled={preloaderDone}
            delay={index * 0.15}
            className={project.featured ? "md:col-span-2 lg:col-span-1" : ""}
          >
            <article
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 md:p-6 lg:p-8 hover:-translate-y-1 hover:border-brand hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              style={{
                transition:
                  "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {project.featured ? (
                <div
                  aria-hidden="true"
                  className="featured-glow pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(164,22,26,0.15), transparent 60%)",
                  }}
                />
              ) : null}

              <div className="flex items-start justify-between mb-6">
                <span className="font-body text-text-disabled text-xs tracking-widest">
                  {project.number}
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link font-body text-text-secondary text-xs tracking-widest uppercase hover:text-brand"
                  aria-label={`${project.type} link for ${project.title} ${project.subtitle} (opens in new tab)`}
                  style={{ transition: "color 0.3s" }}
                >
                  {project.type}{" "}
                  <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-[3px] group-hover/link:translate-y-[-3px]">
                    ↗
                  </span>
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

              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="font-body text-text-disabled text-xs border border-border px-3 py-1"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
