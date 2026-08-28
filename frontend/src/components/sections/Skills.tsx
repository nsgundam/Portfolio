import { BlurReveal } from "../ui/BlurReveal";
import { SectionShell } from "../ui/SectionShell";

interface SkillsProps {
  preloaderDone: boolean;
}

const CAPABILITY_GROUPS = [
  {
    name: "Real-time systems",
    evidence: "Published work · Boardgame Online",
    description: "Real-time multiplayer delivery backed by typed application data.",
    technologies: ["Socket.IO", "PostgreSQL", "TypeScript"],
  },
  {
    name: "Geospatial systems",
    evidence: "Published work · TramTracking",
    description: "Live shuttle tracking with WebSocket and PostGIS.",
    technologies: ["WebSocket", "PostGIS", "PostgreSQL", "OpenStreetMap"],
  },
  {
    name: "Typed product interfaces",
    evidence: "Published work · Projects 01–02",
    description: "Web interfaces connected to real-time and location-aware systems.",
    technologies: ["Next.js", "TypeScript"],
  },
  {
    name: "Experience engineering",
    evidence: "Repository evidence · This portfolio",
    description: "A single-canvas editorial experience with bounded scroll motion.",
    technologies: ["React", "Vite", "GSAP", "Lenis", "Three.js"],
  },
] as const;

export default function Skills({ preloaderDone }: SkillsProps) {
  return (
    <SectionShell
      id="skills"
      sectionNumber="04"
      sectionLabel="Skills"
      className="relative z-10"
    >
      <div className="section-shell__content skills-layout">
        <div className="skills-intro">
          <BlurReveal enabled={preloaderDone}>
            <h2 className="section-heading">
              Systems
              <br />
              <span className="text-text-secondary">I work in</span>
            </h2>
          </BlurReveal>
          <p className="section-prose">
            Capabilities grounded in published projects and the code behind this
            portfolio.
          </p>
        </div>

        <ol className="skills-ledger" aria-label="Evidence-led capability groups">
          {CAPABILITY_GROUPS.map((group, index) => (
            <li key={group.name} className="skills-capability">
              <span className="skills-capability__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="skills-capability__summary">
                <h3 className="skills-capability__name">{group.name}</h3>
                <p className="skills-capability__description">
                  {group.description}
                </p>
                <p className="skills-capability__evidence">{group.evidence}</p>
              </div>

              <ul
                className="skills-capability__technologies"
                aria-label={`${group.name} technologies`}
              >
                {group.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
