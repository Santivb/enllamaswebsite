import { useSyncExternalStore } from "react";
import { gsap } from "gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Reactive version of the check above, for components that render differently
 * under reduced motion.
 *
 * The server snapshot is `false` because there is no media query to read
 * during SSR; hydration corrects it on the client. Reading it through
 * useSyncExternalStore rather than an effect keeps the server and client
 * markup in step without a setState-on-mount, and picks up the change if the
 * visitor flips the setting while the page is open.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

/**
 * Scroll-triggered fade/slide reveal that degrades to an instant, fully
 * visible final state when the user prefers reduced motion — the `from`
 * vars are only ever applied when we're also guaranteed to animate to `to`.
 */
export function revealOnScroll(
  targets: gsap.TweenTarget,
  from: gsap.TweenVars,
  to: gsap.TweenVars
) {
  if (prefersReducedMotion()) {
    // Apply only the final visual state — drop timing/trigger config so the
    // element lands exactly where the animation would have ended.
    const { scrollTrigger, duration, ease, stagger, delay, ...finalVars } = to;
    void scrollTrigger;
    void duration;
    void ease;
    void stagger;
    void delay;
    gsap.set(targets, finalVars);
    return;
  }
  gsap.fromTo(targets, from, to);
}
