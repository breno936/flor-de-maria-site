"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers ScrollTrigger exactly once, client-side only, and refreshes
 * trigger positions once webfonts finish swapping in. Cormorant Garamond
 * loads with font-display: swap, so every heading's line-height changes
 * after first paint — without this, downstream sections (Patrícia, the
 * reservation form) end up with scroll-trigger start positions computed
 * against the fallback-font layout and drift out of reach.
 *
 * The refresh itself is deferred to an idle moment (falling back to a
 * short timeout where requestIdleCallback isn't available, e.g. Safari) —
 * `ScrollTrigger.refresh()` walks every registered trigger and forces
 * layout, and firing it the instant fonts/load resolve can land in the
 * middle of the Hero's own opening animation on a slow connection,
 * competing for the same main thread.
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return gsap;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;

  const scheduleRefresh = () => {
    const run = () => ScrollTrigger.refresh();
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(run, { timeout: 1500 });
    } else {
      window.setTimeout(run, 300);
    }
  };

  if (document.fonts) {
    document.fonts.ready.then(scheduleRefresh);
  }
  window.addEventListener("load", scheduleRefresh, { once: true });

  // iOS Safari can report stale viewport/toolbar dimensions for a beat
  // right after an orientation change — refreshing immediately can lock in
  // those stale values. A short settle delay avoids that.
  window.addEventListener("orientationchange", () => {
    window.setTimeout(() => ScrollTrigger.refresh(), 250);
  });

  return gsap;
}

export { gsap, ScrollTrigger };
