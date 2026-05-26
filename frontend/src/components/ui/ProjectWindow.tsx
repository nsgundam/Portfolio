import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";

interface ProjectWindowProps {
  projects: Array<{
    number: string;
    title: string;
    subtitle: string;
    description: string;
    stack: string[];
    link: string;
    type: string;
    featured?: boolean;
  }>;
  activeIndex: number;
  onTabChange: (index: number) => void;
}

/**
 * MacBook-style window UI for displaying projects
 * Features:
 * - Window frame with title bar and traffic lights
 * - Tab bar for switching between projects
 * - Smooth content transition on tab change
 */
export function ProjectWindow({
  projects,
  activeIndex,
  onTabChange,
}: ProjectWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate content on active project change
  useEffect(() => {
    const content = contentRef.current;
    if (!content || prefersReducedMotion()) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    gsap.fromTo(
      content,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power4.out",
        onComplete: () => {
          setIsAnimating(false);
        },
      },
    );
  }, [activeIndex]);

  const activeProject = projects[activeIndex];

  return (
    <div
      ref={windowRef}
      className="w-full max-w-4xl mx-auto border border-border rounded-xl overflow-hidden bg-surface shadow-2xl"
      style={{
        boxShadow:
          "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 1px rgba(164, 22, 26, 0.2) inset",
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-surface border-b border-border px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          </div>
        </div>
        <span className="font-body text-text-secondary text-xs text-center flex-1">
          Projects
        </span>
        <div className="w-12" /> {/* Spacer for symmetry */}
      </div>

      {/* Tab Bar */}
      <div className="flex overflow-x-auto border-b border-border bg-surface/50 backdrop-blur-sm">
        {projects.map((project, index) => (
          <button
            key={project.number}
            onClick={() => !isAnimating && onTabChange(index)}
            disabled={isAnimating}
            className={`px-4 py-3 text-xs font-body whitespace-nowrap border-r border-border/50 transition-colors duration-300 ${
              activeIndex === index
                ? "bg-surface text-text-primary border-b-2 border-brand"
                : "bg-surface/50 text-text-secondary hover:bg-surface/75 hover:text-text-primary"
            } disabled:cursor-not-allowed`}
          >
            {project.number}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="p-8 md:p-12 min-h-96 bg-gradient-to-br from-surface to-bg"
        key={`project-${activeIndex}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Text Content */}
          <div>
            <div className="mb-8">
              <span className="font-body text-text-disabled text-xs tracking-widest uppercase block mb-2">
                {activeProject.number}
              </span>
              <h3 className="font-heading text-text-primary text-2xl md:text-3xl mb-2">
                {activeProject.title}
              </h3>
              <p className="font-heading text-text-secondary text-xl md:text-2xl mb-6">
                {activeProject.subtitle}
              </p>
              <p className="font-body text-text-secondary text-sm leading-relaxed mb-8">
                {activeProject.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mb-8">
              <p className="font-body text-text-disabled text-xs tracking-widest uppercase mb-4">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {activeProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-body text-text-secondary text-xs border border-border px-3 py-1 rounded hover:border-brand transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href={activeProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-brand text-xs tracking-widest uppercase hover:text-red-400 transition-colors"
            >
              {activeProject.type}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </div>

          {/* Right: Visual Placeholder */}
          <div className="flex items-center justify-center">
            <div
              className="w-full aspect-square rounded-lg border-2 border-border/50 flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 50%, rgba(164, 22, 26, 0.1) 0%, transparent 50%)`,
              }}
            >
              <div className="text-center">
                <div className="font-heading text-text-secondary text-6xl opacity-20 mb-4">
                  {activeProject.number}
                </div>
                <p className="font-body text-text-secondary text-sm">
                  {activeProject.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
