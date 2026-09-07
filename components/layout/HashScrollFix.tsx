"use client";

import { useEffect } from "react";

/**
 * `scroll-behavior: smooth` (globals.css) can strand the browser's native
 * initial hash-jump mid-flight: it starts animating toward `#reserva` (or
 * any anchor) before webfonts swap in, the swap shifts every section's
 * height underneath it, and the animation stops wherever it happened to be
 * instead of continuing to the real target. Re-issuing the jump once fonts
 * and the full page have settled corrects it without affecting same-session
 * clicks, which already land correctly.
 */
export default function HashScrollFix() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    const jump = () => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    Promise.all([loaded, fontsReady]).then(jump);
    const fallback = window.setTimeout(jump, 700);
    return () => window.clearTimeout(fallback);
  }, []);

  return null;
}
