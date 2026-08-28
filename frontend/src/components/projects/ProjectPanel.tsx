import { forwardRef } from "react";
import type { Project } from "../../types";

export interface ProjectPanelProps {
  project: Project;
  index: number;
  total: number;
  isActive: boolean;
  offset: number;
  onSelect: () => void;
}

export const ProjectPanel = forwardRef<HTMLDivElement, ProjectPanelProps>(
  function ProjectPanel(
    { project, index, total, isActive, offset, onSelect },
    ref,
  ) {
    const isAdjacent = Math.abs(offset) === 1;

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${total}: ${project.title}`}
        aria-hidden={!isActive}
        className={`absolute top-0 left-0 h-full w-full max-w-2xl rounded-2xl border bg-surface p-6 transition-colors duration-300 sm:p-8 md:p-10 lg:max-w-3xl ${
          isAdjacent
            ? "cursor-pointer border-border/80 hover:border-accent/40"
            : isActive
              ? "cursor-default border-border"
              : "pointer-events-none border-border/40"
        }`}
      >
        {isAdjacent && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Show ${project.title}`}
            onClick={onSelect}
            className="absolute inset-0 z-20 rounded-2xl"
          />
        )}

        <div className="grid h-full grid-cols-1 items-stretch md:grid-cols-12 md:gap-8">
          {/* Main Case Study Content */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              {/* Header Label & Index */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-label text-xs tracking-[0.2em] text-accent uppercase">
                  {project.category}
                </span>
                <span className="font-label text-xs tracking-widest text-text-secondary uppercase">
                  {project.number}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-display text-text-primary text-2xl sm:text-3xl md:text-4xl leading-tight mb-1">
                {project.title}
              </h3>
              <p className="font-display italic text-text-secondary text-2xl sm:text-3xl leading-tight mb-4">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="font-body text-text-secondary text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            <div>
              {/* Tech Stack or Pending State */}
              {project.stack.length > 0 && (
                <div className="mb-6">
                  <p className="font-label text-[11px] tracking-wider text-text-secondary uppercase mb-2.5">
                    Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-body text-[11px] sm:text-xs text-text-secondary bg-surface-2/60 border border-border/80 px-2.5 py-1 rounded tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Link */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                {project.link && project.linkType ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    className="group inline-flex items-center gap-2 font-label text-xs tracking-widest text-accent uppercase hover:text-accent-light transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    aria-label={`Open ${project.title} (${project.linkType})`}
                  >
                    <span>{project.linkType === "Live" ? "Live Application" : "GitHub Repository"}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <span className="font-label text-xs tracking-widest text-text-secondary uppercase">
                    Case study in preparation
                  </span>
                )}

                {project.status === "published" && (
                  <span className="font-label text-[11px] text-text-secondary tracking-wider uppercase">
                    Published
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Typographic Column (Desktop) */}
          <div className="hidden md:flex md:col-span-4 border-l border-border/40 pl-6 flex-col justify-between">
            <span className="font-label text-xs text-text-secondary tracking-widest uppercase">
              Project
            </span>

            <div className="my-auto py-8 text-center">
              <span className="font-display font-light text-text-disabled/20 text-7xl lg:text-8xl leading-none block">
                {project.number}
              </span>
            </div>

            <div className="flex items-center gap-2 font-label text-xs text-text-secondary tracking-wider uppercase">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  project.status === "published" ? "bg-accent" : "bg-text-disabled/40"
                }`}
              />
              <span>{project.status === "published" ? "Published" : "In preparation"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
