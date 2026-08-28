import { useEffect, useRef, useSyncExternalStore } from "react";
import { JOURNEY_SECTION_DEFINITIONS } from "../../lib/journey";
import { handleSectionNav } from "../../lib/navigation";
import type { JourneyController } from "../../types/journey";

interface ScrollProgressProps {
  journey: JourneyController;
  heroTransitionComplete?: boolean;
}

export default function ScrollProgress({
  journey,
  heroTransitionComplete,
}: ScrollProgressProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const activeSection = useSyncExternalStore(
    journey.subscribe,
    () => journey.stateRef.current.section,
    () => "hero",
  );

  useEffect(
    () => journey.subscribe((state) => {
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleY(${state.progress})`;
      }
    }),
    [journey],
  );

  return (
    <nav
      aria-label="Journey progress"
      className="journey-indicator"
      style={{
        opacity: heroTransitionComplete ? 1 : 0,
        pointerEvents: heroTransitionComplete ? "auto" : "none",
      }}
    >
      <div className="journey-indicator__track" aria-hidden="true">
        <div
          ref={lineRef}
          className="journey-indicator__progress"
          style={{
            transform: `scaleY(${journey.stateRef.current.progress})`,
          }}
        />
      </div>

      <ol className="journey-indicator__list">
        {JOURNEY_SECTION_DEFINITIONS.map(({ id, number, label }) => {
          const isActive = activeSection === id;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                aria-label={`${number} ${label}`}
                className="journey-indicator__link"
                onClick={(event) => handleSectionNav(event, `#${id}`)}
              >
                <span className="journey-indicator__label" aria-hidden="true">
                  {number}
                </span>
                <span className="journey-indicator__dot" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
