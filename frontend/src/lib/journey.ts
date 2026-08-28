import {
  JOURNEY_SECTIONS,
  type JourneyEnvironmentProgress,
  type JourneyEnvironmentRange,
  type JourneyEnvironmentRanges,
  type JourneySection,
  type JourneySectionProgress,
  type JourneyState,
} from "../types/journey";

export interface JourneySectionDefinition {
  id: JourneySection;
  number: string;
  label: string;
}

export const JOURNEY_SECTION_DEFINITIONS: readonly JourneySectionDefinition[] = [
  { id: "hero", number: "01", label: "Home" },
  { id: "about", number: "02", label: "About" },
  { id: "projects", number: "03", label: "Projects" },
  { id: "skills", number: "04", label: "Skills" },
  { id: "contact", number: "05", label: "Contact" },
];

export const JOURNEY_PIN_DISTANCE = {
  hero: 1700,
  about: 900,
} as const;

// DESIGN.md guidance used before live section geometry is available.
export const DEFAULT_ENVIRONMENT_RANGES: JourneyEnvironmentRanges = {
  hero: { start: 0, activeStart: 0, activeEnd: 0.18, end: 0.22 },
  about: { start: 0.18, activeStart: 0.22, activeEnd: 0.34, end: 0.39 },
  projects: { start: 0.34, activeStart: 0.39, activeEnd: 0.62, end: 0.66 },
  skills: { start: 0.62, activeStart: 0.66, activeEnd: 0.8, end: 0.85 },
  contact: { start: 0.8, activeStart: 0.85, activeEnd: 1, end: 1 },
};

interface JourneyGeometry {
  starts: JourneySectionProgress;
  ranges: JourneyEnvironmentRanges;
  maxScroll: number;
  viewportHeight: number;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

function smoothstep(start: number, end: number, value: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function createProgressRecord(initial: number): JourneySectionProgress {
  return Object.fromEntries(
    JOURNEY_SECTIONS.map((section) => [section, initial]),
  ) as JourneySectionProgress;
}

function getDocumentTop(element: HTMLElement): number {
  const pinSpacer = element.parentElement?.classList.contains("pin-spacer")
    ? element.parentElement
    : null;
  const anchor = pinSpacer ?? element;
  return anchor.getBoundingClientRect().top + window.scrollY;
}

export function resolveJourneyGeometry(): JourneyGeometry {
  const viewportHeight = Math.max(1, window.innerHeight);
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - viewportHeight,
  );
  const starts = createProgressRecord(0);
  const startsPx: number[] = [];

  JOURNEY_SECTIONS.forEach((section, index) => {
    const element = document.getElementById(section);
    const fallback = index === 0 ? 0 : startsPx[index - 1];
    const measured = element ? getDocumentTop(element) : fallback;
    const monotonic = Math.max(fallback, measured);
    startsPx.push(monotonic);
    starts[section] = clamp01(monotonic / maxScroll);
  });

  const boundaryBlendPx = startsPx.map((boundary, index) => {
    if (index === 0) return 0;
    const previousSpan = Math.max(1, boundary - startsPx[index - 1]);
    const nextBoundary = startsPx[index + 1] ?? maxScroll;
    const nextSpan = Math.max(1, nextBoundary - boundary);
    return Math.min(viewportHeight * 0.25, previousSpan * 0.12, nextSpan * 0.12);
  });

  const ranges = Object.fromEntries(
    JOURNEY_SECTIONS.map((section, index) => {
      const incomingBoundary = startsPx[index];
      const incomingBlend = boundaryBlendPx[index];
      const outgoingBoundary = startsPx[index + 1] ?? maxScroll;
      const outgoingBlend = boundaryBlendPx[index + 1] ?? 0;

      const range: JourneyEnvironmentRange = {
        start: index === 0
          ? 0
          : clamp01((incomingBoundary - incomingBlend) / maxScroll),
        activeStart: index === 0
          ? 0
          : clamp01((incomingBoundary + incomingBlend) / maxScroll),
        activeEnd: index === JOURNEY_SECTIONS.length - 1
          ? 1
          : clamp01((outgoingBoundary - outgoingBlend) / maxScroll),
        end: index === JOURNEY_SECTIONS.length - 1
          ? 1
          : clamp01((outgoingBoundary + outgoingBlend) / maxScroll),
      };

      return [section, range];
    }),
  ) as JourneyEnvironmentRanges;

  return { starts, ranges, maxScroll, viewportHeight };
}

export function getEnvironmentProgress(
  progress: number,
  ranges: JourneyEnvironmentRanges,
): JourneyEnvironmentProgress {
  return Object.fromEntries(
    JOURNEY_SECTIONS.map((section) => {
      const range = ranges[section];
      const incoming = range.start === range.activeStart
        ? 1
        : smoothstep(range.start, range.activeStart, progress);
      const outgoing = range.activeEnd === range.end
        ? 1
        : 1 - smoothstep(range.activeEnd, range.end, progress);
      return [section, clamp01(Math.min(incoming, outgoing))];
    }),
  ) as JourneyEnvironmentProgress;
}

function getSectionProgress(
  progress: number,
  starts: JourneySectionProgress,
): JourneySectionProgress {
  return Object.fromEntries(
    JOURNEY_SECTIONS.map((section, index) => {
      const start = starts[section];
      const nextSection = JOURNEY_SECTIONS[index + 1];
      const end = nextSection ? starts[nextSection] : 1;
      const localProgress = end <= start
        ? Number(progress >= end)
        : clamp01((progress - start) / (end - start));
      return [section, localProgress];
    }),
  ) as JourneySectionProgress;
}

function getActiveSection(
  scrollY: number,
  geometry: JourneyGeometry,
): JourneySection {
  const markerProgress = clamp01(
    (scrollY + geometry.viewportHeight * 0.33) / geometry.maxScroll,
  );
  let active: JourneySection = "hero";

  JOURNEY_SECTIONS.forEach((section) => {
    if (geometry.starts[section] <= markerProgress) active = section;
  });

  return active;
}

export function createJourneyState(
  scrollY = 0,
  geometry?: JourneyGeometry,
): JourneyState {
  const resolvedGeometry = geometry ?? {
    starts: {
      hero: 0,
      about: 0.22,
      projects: 0.39,
      skills: 0.66,
      contact: 0.85,
    },
    ranges: DEFAULT_ENVIRONMENT_RANGES,
    maxScroll: 1,
    viewportHeight: 0,
  };
  const progress = clamp01(scrollY / resolvedGeometry.maxScroll);

  return {
    progress,
    section: getActiveSection(scrollY, resolvedGeometry),
    sectionProgress: getSectionProgress(progress, resolvedGeometry.starts),
    environments: getEnvironmentProgress(progress, resolvedGeometry.ranges),
    ranges: resolvedGeometry.ranges,
  };
}

export function createInitialJourneyState(): JourneyState {
  return createJourneyState();
}
