import type Lenis from "lenis";

/**
 * Shared handle on the page's Lenis instance.
 *
 * Lenis takes over the scroller, which leaves two things broken for anything
 * that wants to scroll programmatically: `window.scrollTo` with
 * `behavior: "smooth"` is swallowed and never moves the page, and a plain
 * anchor jump can land somewhere other than the element's scroll-margin
 * because Lenis is tracking a target of its own. Routing jumps through the
 * instance avoids both.
 *
 * SmoothScroll only creates Lenis when the visitor has not asked for reduced
 * motion, so `instance` stays null in that case and callers fall back to a
 * native scroll — which is the right behaviour there anyway.
 */
let instance: Lenis | null = null;

export function registerSmoothScroll(lenis: Lenis | null) {
  instance = lenis;
}

/**
 * Scrolls so `el` comes to rest `offset` pixels below the top of the viewport.
 *
 * The jump is instant rather than animated on purpose: these targets are
 * thousands of pixels apart, and watching the entire menu stream past is both
 * slower and more disorienting than simply arriving. Going through Lenis when
 * it is running keeps its internal target in sync, so it does not animate the
 * page back out from under the reader afterwards.
 */
export function scrollToElement(el: HTMLElement, offset: number) {
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  if (instance) {
    instance.scrollTo(top, { immediate: true });
  } else {
    window.scrollTo({ top });
  }
}
