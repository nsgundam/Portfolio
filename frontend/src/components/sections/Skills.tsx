import { useScrollReveal } from "../../hooks/useScrollReveal";
import { BlurReveal } from "../ui/BlurReveal";

interface SkillsProps {
  preloaderDone: boolean;
}

const SKILL_GROUPS = [
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
    ],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "Socket.io", "RESTful API", "IoT"],
  },
  {
    category: "Database",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "PostGIS"],
  },
  {
    category: "Infrastructure",
    skills: ["Vercel", "Docker", "GitHub Actions", "Neon", "Render"],
  },
  {
    category: "Process",
    skills: ["Agile / Scrum", "Sprint Planning", "Git", "Postman"],
  },
];

export default function Skills({ preloaderDone }: SkillsProps) {
  const sectionRef = useScrollReveal<HTMLElement>(preloaderDone);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="px-5 sm:px-8 py-20 md:py-32 max-w-5xl mx-auto"
    >
      <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
        03 / Skills
      </p>

      <BlurReveal enabled={preloaderDone} className="mb-16">
        <h2
          className="font-heading text-text-primary leading-tight"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Tech
          <br />
          <span className="text-text-secondary">Stack</span>
        </h2>
      </BlurReveal>

      <div className="flex flex-col">
        {SKILL_GROUPS.map((group, index) => (
          <BlurReveal
            key={group.category}
            enabled={preloaderDone}
            delay={index * 0.08}
          >
            <div
              className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-8 border-t border-border py-6 sm:py-8
                           last:border-b"
            >
              <span className="font-body text-text-disabled text-xs tracking-widest uppercase pt-1">
                {group.category}
              </span>

              <div className="sm:col-span-2 flex flex-wrap gap-x-6 gap-y-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-body text-text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
