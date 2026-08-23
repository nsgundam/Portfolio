import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { prefersReducedMotion } from "../../lib/motion";
import type { Project } from "../../types";
import { ProjectPanel } from "./ProjectPanel";

export interface ProjectCarouselProps {
  projects: Project[];
  initialIndex?: number;
}

export function ProjectCarousel({ projects, initialIndex = 0 }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const activeIndexRef = useRef(initialIndex);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const total = projects.length;

  const goToIndex = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= total) return;
      setActiveIndex(newIndex);
    },
    [total],
  );

  const prev = useCallback(() => {
    if (activeIndex > 0) goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const next = useCallback(() => {
    if (activeIndex < total - 1) goToIndex(activeIndex + 1);
  }, [activeIndex, total, goToIndex]);

  // Handle keyboard navigation (ArrowLeft / ArrowRight)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  // Pointer drag/swipe gestures with pan-y preservation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
  };

  // Position update function using persistent context and gsap.to with overwrite
  const applyTransforms = useCallback((targetIndex: number, immediate: boolean = false) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.add(() => {
      const isReduced = prefersReducedMotion();
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const offset = i - targetIndex;

        if (isReduced) {
          gsap.set(panel, {
            xPercent: -50,
            left: "50%",
            scale: 1,
            rotateY: 0,
            opacity: offset === 0 ? 1 : 0,
            zIndex: offset === 0 ? 20 : 0,
            display: Math.abs(offset) <= 1 ? "block" : "none",
          });
          return;
        }

        let targetXPercent: number;
        let targetScale: number;
        let targetOpacity: number;
        let targetRotateY: number;
        let targetZIndex: number;

        if (offset === 0) {
          targetXPercent = -50;
          targetScale = 1;
          targetOpacity = 1;
          targetRotateY = 0;
          targetZIndex = 20;
        } else if (offset === 1) {
          targetXPercent = isMobile ? 38 : 16;
          targetScale = isMobile ? 0.90 : 0.88;
          targetOpacity = isMobile ? 0.25 : 0.45;
          targetRotateY = isMobile ? 0 : -12;
          targetZIndex = 10;
        } else if (offset === -1) {
          targetXPercent = isMobile ? -138 : -116;
          targetScale = isMobile ? 0.90 : 0.88;
          targetOpacity = isMobile ? 0.25 : 0.45;
          targetRotateY = isMobile ? 0 : 12;
          targetZIndex = 10;
        } else {
          targetXPercent = offset > 0 ? 120 : -220;
          targetScale = 0.75;
          targetOpacity = 0;
          targetRotateY = 0;
          targetZIndex = 0;
        }

        if (immediate) {
          gsap.set(panel, {
            left: "50%",
            xPercent: targetXPercent,
            scale: targetScale,
            opacity: targetOpacity,
            rotateY: targetRotateY,
            zIndex: targetZIndex,
            display: "block",
          });
          return;
        }

        gsap.to(panel, {
          left: "50%",
          xPercent: targetXPercent,
          scale: targetScale,
          opacity: targetOpacity,
          rotateY: targetRotateY,
          zIndex: targetZIndex,
          display: "block",
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    });
  }, []);

  // 1. Mount-only persistent gsap.context
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {}, stage);
    ctxRef.current = ctx;

    // Apply initial positioning immediately
    applyTransforms(activeIndex, true);

    // Re-run positions on window resize / breakpoint changes without recreating context
    const handleResize = () => {
      applyTransforms(activeIndexRef.current, true);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Animate when activeIndex changes
  useLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
    applyTransforms(activeIndex, false);
  }, [activeIndex, applyTransforms]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected Projects Case Studies"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="relative w-full outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-3xl"
      style={{ touchAction: "pan-y" }}
    >
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Project ${activeIndex + 1} of ${total}: ${projects[activeIndex].title} (${projects[activeIndex].subtitle})`}
      </div>

      {/* Stage Area for 3D Coverflow Panels */}
      <div
        ref={stageRef}
        className="relative h-[480px] w-full overflow-hidden sm:h-[420px] md:h-[400px] perspective-[1200px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {projects.map((project, index) => (
          <ProjectPanel
            key={project.number}
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            project={project}
            index={index}
            total={total}
            isActive={activeIndex === index}
            offset={index - activeIndex}
            onSelect={() => goToIndex(index)}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40">
        {/* Direct Selection Button Group */}
        <div
          role="group"
          aria-label="Project selection"
          className="flex items-center gap-1.5 sm:gap-2"
        >
          {projects.map((project, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={project.number}
                aria-current={isSelected ? "true" : undefined}
                aria-label={`Project ${project.number}: ${project.title}`}
                onClick={() => goToIndex(index)}
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center px-3.5 py-2 rounded-full font-label text-xs tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  isSelected
                    ? "bg-accent text-bg font-semibold"
                    : "bg-surface-2/60 text-text-secondary hover:text-text-primary hover:bg-surface-2"
                }`}
              >
                <span>{project.number}</span>
              </button>
            );
          })}
        </div>

        {/* Counter Info & Arrow Controls */}
        <div className="flex items-center gap-4">
          <span className="font-label text-xs text-text-disabled tracking-widest uppercase">
            <span className="text-text-primary">{String(activeIndex + 1).padStart(2, "0")}</span> /{" "}
            {String(total).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Previous Project"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-3 rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={next}
              disabled={activeIndex === total - 1}
              aria-label="Next Project"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-3 rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
