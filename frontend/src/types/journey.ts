export const JOURNEY_SECTIONS = [
  "hero",
  "about",
  "projects",
  "skills",
  "contact",
] as const;

export type JourneySection = (typeof JOURNEY_SECTIONS)[number];

export type JourneySectionProgress = Record<JourneySection, number>;
export type JourneyEnvironmentProgress = Record<JourneySection, number>;

export interface JourneyEnvironmentRange {
  start: number;
  activeStart: number;
  activeEnd: number;
  end: number;
}

export type JourneyEnvironmentRanges = Record<
  JourneySection,
  JourneyEnvironmentRange
>;

export interface JourneyState {
  progress: number;
  section: JourneySection;
  sectionProgress: JourneySectionProgress;
  environments: JourneyEnvironmentProgress;
  ranges: JourneyEnvironmentRanges;
}

export type JourneyListener = (state: JourneyState) => void;

export interface JourneyController {
  stateRef: { current: JourneyState };
  subscribe: (listener: JourneyListener) => () => void;
}
