import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface SectionShellProps
  extends HTMLAttributes<HTMLElement> {
  sectionNumber: string;
  sectionLabel: string;
  children: ReactNode;
}

/**
 * Shared editorial frame for every journey section.
 * The marker is orientation chrome; all meaningful content remains in the DOM.
 */
export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(
  function SectionShell(
    {
      sectionNumber,
      sectionLabel,
      children,
      className = "",
      ...sectionProps
    },
    ref,
  ) {
    return (
      <section
        ref={ref}
        {...sectionProps}
        className={`section-shell ${className}`.trim()}
      >
        <div className="section-shell__marker" aria-hidden="true">
          <span className="section-shell__number">{sectionNumber}</span>
          <span className="section-shell__label">{sectionLabel}</span>
        </div>
        <div className="section-shell__inner">{children}</div>
      </section>
    );
  },
);
