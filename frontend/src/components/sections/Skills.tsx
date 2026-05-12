const SKILL_GROUPS = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"],
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
]

export default function Skills() {
  return (
    <section id="skills" className="px-8 py-32 max-w-5xl mx-auto">

      <p className="font-body text-brand text-xs tracking-[0.3em] uppercase mb-4">
        03 / Skills
      </p>

      <h2
        className="font-heading text-text-primary leading-tight mb-16"
        style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
      >
        Tech
        <br />
        <span className="text-text-secondary">Stack</span>
      </h2>

      <div className="flex flex-col">
        {SKILL_GROUPS.map((group) => (
          <div
            key={group.category}
            className="grid grid-cols-3 gap-8 border-t border-border py-8
                       last:border-b"
          >
            {/* Category */}
            <span className="font-body text-text-disabled text-xs tracking-widest uppercase pt-1">
              {group.category}
            </span>

            {/* Skills */}
            <div className="col-span-2 flex flex-wrap gap-x-6 gap-y-2">
              {group.skills.map((skill) => (
                <span key={skill} className="font-body text-text-primary text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}