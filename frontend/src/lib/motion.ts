const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Whether the user has requested reduced motion at the OS level. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Subscribe to OS reduced-motion preference changes. */
export function onPrefersReducedMotionChange(
  callback: (prefersReduced: boolean) => void,
): () => void {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = () => callback(mq.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
