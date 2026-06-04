import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import { BlurReveal } from "../ui/BlurReveal";

interface SkillsProps {
  preloaderDone: boolean;
}

const SKILL_GROUPS = [
  {
    category: "Frontend",
    icon: "◈",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Lenis",
    ],
  },
  {
    category: "Backend",
    icon: "◉",
    skills: ["Node.js", "Express", "Socket.io", "RESTful API", "IoT"],
  },
  {
    category: "Database",
    icon: "◎",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "PostGIS"],
  },
  {
    category: "Infrastructure",
    icon: "◇",
    skills: ["Vercel", "Docker", "GitHub Actions", "Neon", "Render"],
  },
  {
    category: "Process",
    icon: "◈",
    skills: ["Agile / Scrum", "Sprint Planning", "Git", "Postman"],
  },
];

const FLOAT_CONFIG = [
  { y: -12, duration: 3.2, delay: 0 },
  { y: -8, duration: 2.8, delay: 0.6 },
  { y: -14, duration: 3.8, delay: 1.1 },
  { y: -10, duration: 3.0, delay: 0.3 },
  { y: -8, duration: 2.5, delay: 0.9 },
];

export default function Skills({ preloaderDone }: SkillsProps) {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!preloaderDone) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const isReducedMotion = prefersReducedMotion();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;

    if (isReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        const config = FLOAT_CONFIG[index] ?? FLOAT_CONFIG[FLOAT_CONFIG.length - 1];
        gsap.fromTo(
          card,
          { opacity: 0, filter: "blur(12px)", y: 30 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
              onEnter: () => {
                if (isMobile) return;
                const floatY = isTablet ? config.y / 2 : config.y;
                gsap.to(card, {
                  y: floatY,
                  duration: config.duration,
                  delay: config.delay,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                });
              },
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <section
      id="skills"
      className="px-5 sm:px-8 py-20 md:py-32 max-w-5xl mx-auto"
    >
      <p className="font-body text-accent text-xs tracking-[0.3em] uppercase mb-4">
        03 / Skills
      </p>

      <BlurReveal enabled={preloaderDone} className="mb-16">
        <h2
          className="font-display text-text-primary leading-tight"
          style={{ fontSize: "clamp(32px, 4vw, 64px)" }}
        >
          Tech
          <br />
          <span className="text-text-secondary">Stack</span>
        </h2>
      </BlurReveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] lg:gap-6">
        {SKILL_GROUPS.map((group, index) => (
          <div
            key={group.category}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="relative overflow-hidden rounded-2xl border border-border bg-[rgba(22,26,29,0.6)] p-6 transition-all duration-300 hover:border-[rgba(164,22,26,0.3)] hover:shadow-[0_8px_32px_rgba(164,22,26,0.08)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-label text-lg text-accent">{group.icon}</span>
              <span className="font-body text-xs tracking-widest text-text-disabled uppercase">
                {group.category}
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-xs text-text-secondary transition-all duration-300 hover:border-[rgba(164,22,26,0.4)] hover:bg-[rgba(164,22,26,0.12)] hover:text-text-primary"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
