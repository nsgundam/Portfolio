import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import {
  createInitialJourneyState,
  createJourneyState,
  resolveJourneyGeometry,
} from "../lib/journey";
import { scrollToSection } from "../lib/navigation";
import type {
  JourneyController,
  JourneyListener,
  JourneySection,
} from "../types/journey";

export function useJourneyState(enabled: boolean): JourneyController {
  const stateRef = useRef(createInitialJourneyState());
  const listenersRef = useRef(new Set<JourneyListener>());
  const stableSectionRef = useRef<JourneySection>("hero");

  const controller = useMemo<JourneyController>(
    () => ({
      stateRef,
      subscribe: (listener) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!enabled) return;

    let geometry = resolveJourneyGeometry();

    let sectionToPreserve: JourneySection | null = null;
    let resizeFrame = 0;
    let refreshFrame = 0;
    // ScrollTrigger exposes this runtime flag, but its published type omits it.
    const scrollTriggerRuntime = ScrollTrigger as typeof ScrollTrigger & {
      isRefreshing?: boolean;
    };

    const publish = (scrollY: number, updateStableSection: boolean) => {
      const nextState = createJourneyState(scrollY, geometry);
      stateRef.current = nextState;
      if (updateStableSection) stableSectionRef.current = nextState.section;
      listenersRef.current.forEach((listener) => listener(nextState));
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "journey-master",
        trigger: document.documentElement,
        start: "top top",
        end: "max",
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          // ScrollTrigger invokes onRefresh while pin spacers are still being
          // reconciled. Measuring section tops in that callback can collapse
          // every start to zero and make Contact appear active on the Hero.
          // Re-measure after ScrollTrigger's own post-refresh frame has also
          // restored the final pin-spacer geometry.
          window.cancelAnimationFrame(refreshFrame);
          refreshFrame = window.requestAnimationFrame(() => {
            refreshFrame = window.requestAnimationFrame(() => {
              geometry = resolveJourneyGeometry();
              publish(self.scroll(), false);
            });
          });
        },
        onUpdate: (self) => publish(
          self.scroll(),
          !scrollTriggerRuntime.isRefreshing && sectionToPreserve === null,
        ),
      });
    });

    geometry = resolveJourneyGeometry();
    publish(window.scrollY, true);
    ScrollTrigger.refresh();

    const mobileMedia = window.matchMedia("(max-width: 767px)");
    const desktopMedia = window.matchMedia("(min-width: 1025px)");

    const preserveSectionAcrossBreakpoint = () => {
      sectionToPreserve = stableSectionRef.current;
      ScrollTrigger.refresh();
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        if (!sectionToPreserve) return;
        scrollToSection(sectionToPreserve, {
          updateHash: false,
          immediate: true,
        });
        sectionToPreserve = null;
        geometry = resolveJourneyGeometry();
        publish(window.scrollY, true);
      });
    };

    mobileMedia.addEventListener("change", preserveSectionAcrossBreakpoint);
    desktopMedia.addEventListener("change", preserveSectionAcrossBreakpoint);

    return () => {
      mobileMedia.removeEventListener("change", preserveSectionAcrossBreakpoint);
      desktopMedia.removeEventListener("change", preserveSectionAcrossBreakpoint);
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [enabled]);

  return controller;
}
