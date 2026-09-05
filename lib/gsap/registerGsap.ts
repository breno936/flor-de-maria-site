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
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return gsap;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;

  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts) {
    document.fonts.ready.then(refresh);
  }
  window.addEventListener("load", refresh, { once: true });

  return gsap;
}

export { gsap, ScrollTrigger };
