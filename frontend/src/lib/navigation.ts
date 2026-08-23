import type React from "react";
import type Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

let globalLenis: Lenis | null = null;

export function setGlobalLenis(instance: Lenis | null): void {
  globalLenis = instance;
}

export function getGlobalLenis(): Lenis | null {
  return globalLenis;
}

export function scrollToSection(
  target: string | HTMLElement,
  options?: { updateHash?: boolean; immediate?: boolean },
): void {
  const shouldUpdateHash = options?.updateHash ?? true;
  const isImmediate = options?.immediate ?? prefersReducedMotion();

  let targetId = "";
  let targetEl: HTMLElement | null = null;

  if (typeof target === "string") {
    targetId = target.replace(/^#/, "");
    targetEl = document.getElementById(targetId);
  } else if (target instanceof HTMLElement) {
    targetEl = target;
    targetId = target.id;
  }

  const hash = targetId ? `#${targetId}` : "";

  if (shouldUpdateHash && hash && window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }

  if (targetId === "hero") {
    if (globalLenis && !isImmediate) {
      globalLenis.scrollTo(0, {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: isImmediate ? "auto" : "smooth",
      });
    }
    return;
  }

  if (!targetEl) return;

  if (globalLenis && !isImmediate) {
    globalLenis.scrollTo(targetEl, {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: targetTop,
      behavior: isImmediate ? "auto" : "smooth",
    });
  }
}

export function handleSectionNav(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  hrefOrId: string,
  onComplete?: () => void,
): void {
  e.preventDefault();
  scrollToSection(hrefOrId);
  onComplete?.();
}
