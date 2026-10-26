"use client";

import { useEffect } from "react";

/** Slightly past the desktop opening's last keyframe (styles/motion.css). */
const OPENING_MS = 2600;
const EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * The opening never holds anyone back: if the visitor scrolls, taps or
 * presses a key while it is still playing, it finishes at once — every
 * element jumps to its final frame (`data-opening="skip"` drops the
 * animations). Listens only for what is left of the opening, measured
 * from navigation start, since the CSS has been playing since first paint.
 */
export default function HeroOpeningSkip() {
  useEffect(() => {
    const remaining = OPENING_MS - performance.now();
    const section = document.getElementById("inicio");
    if (remaining <= 0 || !section) return;

    const stop = () => {
      window.clearTimeout(timer);
      EVENTS.forEach((type) => window.removeEventListener(type, skip));
    };
    const skip = () => {
      section.dataset.opening = "skip";
      stop();
    };
    const timer = window.setTimeout(stop, remaining);
    EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }));
    return stop;
  }, []);

  return null;
}
