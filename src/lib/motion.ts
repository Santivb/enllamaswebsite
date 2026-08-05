import { gsap } from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
