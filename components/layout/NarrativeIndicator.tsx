"use client";

import { useEffect, useRef, useState } from "react";
import { narrativeSteps } from "@/data/content";

/**
 * Discreet editorial indicator of the six approved narrative stages. Purely
 * a status readout — decorative, redundant with the page's own headings
 * and nav, so it's `aria-hidden` throughout and never competes with real
 * content for focus or space.
 *
 * Tracks the active section with a passive, rAF-throttled scroll listener
 * reading live `getBoundingClientRect()` — the same technique already used
 * by `MobileStickyCta`. Both IntersectionObserver and ScrollTrigger were
 * tried first and each cached a stale position for the pinned Produto/
 * Experiência scenes (several viewport-heights tall, `svh`-based, with a
 * `position: sticky` descendant): IntersectionObserver stopped re-firing
 * for them after the very first check, and ScrollTrigger's own cached
 * start/end — even force-refreshed — kept reflecting an earlier, unsettled
 * layout measurement. Reading the live rect on every scroll frame instead
 * of trusting a cached value sidesteps that whole class of bug, at the
 * cost of one extra layout read per section per frame — negligible for six
 * elements. Purely a read, never touches scroll behavior itself.
 */
export default function NarrativeIndicator() {
  const [activeId, setActiveId] = useState<string>(narrativeSteps[0].id);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      tickingRef.current = false;
      const line = window.innerHeight * 0.5;
      let current: string = narrativeSteps[0].id;
      // Looked up fresh on every read rather than cached once at mount:
      // Produto and Experiência each briefly render a different DOM
      // subtree right after hydration (their own `isDesktop`/reduced-motion
      // detection starts false and self-corrects), which replaces their
      // `#produto`/`#experiencia` element. A reference captured before that
      // swap would point at a now-detached node — whose
      // `getBoundingClientRect()` always reports an all-zero rect, which
      // satisfies "top <= line" unconditionally and pins the indicator on
      // that section forever, regardless of real scroll position.
      for (let i = 0; i < narrativeSteps.length; i += 1) {
        const el = document.getElementById(narrativeSteps[i].id);
        if (el && el.getBoundingClientRect().top <= line) {
          current = narrativeSteps[i].id;
        }
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Produto and Experiência's own `isDesktop`/reduced-motion detection
    // starts `false` and self-corrects a moment after mount, swapping in a
    // taller or shorter DOM subtree. This first `update()` call can land
    // squarely inside that transient, wrong-for-this-viewport layout — a
    // *correct* read of temporarily-wrong geometry, not a stale reference,
    // so re-querying fresh (above) doesn't help. It's only caught by
    // reading again once that swap has settled: after fonts are ready (they
    // also reflow every heading) and after a couple of extra frames.
    const timers: number[] = [];
    document.fonts?.ready.then(update);
    requestAnimationFrame(() => requestAnimationFrame(update));
    timers.push(window.setTimeout(update, 600));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const activeIndex = Math.max(0, narrativeSteps.findIndex((step) => step.id === activeId));
  const active = narrativeSteps[activeIndex];
  // No indicator during the hero itself (redundant with the opening) or
  // during Atendimento — "não manter uma barra fixa sobre os CTAs" on
  // mobile, and on desktop the lateral indicator's own ivory label would
  // otherwise sit directly over the form panel's cream background right
  // where the active step ("ATENDIMENTO") reads widest — illegible against
  // a light ground, and exactly the overlap the brief calls out avoiding.
  const showIndicator = active.id !== "desejo" && active.id !== "atendimento";

  return (
    <>
      {/* Desktop — lateral, discreet: every stage's number stays quietly
          visible, only the active one gains its label and color. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed right-7 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-300 xl:flex ${
          showIndicator ? "opacity-100" : "opacity-0"
        }`}
      >
        {narrativeSteps.map((step) => {
          const isActive = step.id === activeId;
          return (
            <div key={step.id} className="flex items-center justify-end gap-2">
              <span
                className={`font-sans text-[10px] uppercase tracking-[0.16em] text-ivory transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                {step.label}
              </span>
              <span
                className={`mono-label transition-colors duration-300 ${isActive ? "text-rouge" : "text-champagne/35"}`}
              >
                {step.number}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile — compact, current step only, no fixed height added. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed right-3 z-30 transition-opacity duration-300 lg:hidden ${
          showIndicator ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "calc(var(--header-height-mobile) + 10px)" }}
      >
        <span className="rounded-full border border-champagne/20 bg-noir/70 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-ivory/85 backdrop-blur-sm">
          {active.number} / 06 — {active.label}
        </span>
      </div>
    </>
  );
}
