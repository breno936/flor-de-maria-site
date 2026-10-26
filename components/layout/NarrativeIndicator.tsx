"use client";

import { useEffect, useRef, useState } from "react";
import { narrativeSteps } from "@/data/content";

const TOTAL = String(narrativeSteps.length).padStart(2, "0");

/**
 * The discreet chapter "mini menu" on the right edge — the four blocks,
 * every number quietly visible, only the active one with its label and
 * colour (`mix-blend-difference` keeps it legible over dark grounds and
 * photographs alike). Each row is a real link to its block, so it reads
 * and works as a small secondary navigation; the label also appears on
 * hover/focus. Desktop only (≥1280px), stepping aside at Atendimento, where
 * the active label would run over the closing signature.
 *
 * Phones get a passive status chip under the header instead ("02 / 04 —
 * CRIAÇÕES"), hidden at the opening and the closing so it never sits over
 * the main CTAs.
 *
 * The active block comes from a passive, rAF-throttled scroll listener
 * reading live `getBoundingClientRect()` — nothing pins or holds the scroll.
 */
export default function NarrativeIndicator() {
  const [activeId, setActiveId] = useState<string>(narrativeSteps[0].id);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      tickingRef.current = false;
      const line = window.innerHeight * 0.5;
      let current: string = narrativeSteps[0].id;
      for (const step of narrativeSteps) {
        const el = document.getElementById(step.id);
        if (el && el.getBoundingClientRect().top <= line) current = step.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Webfonts swap in after first paint and reflow every heading.
    document.fonts?.ready.then(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active = narrativeSteps.find((step) => step.id === activeId) ?? narrativeSteps[0];
  const showDesktop = active.id !== "atendimento";
  const showMobile = active.id !== "inicio" && active.id !== "atendimento";

  return (
    <>
      <nav
        aria-label="Seções da página"
        aria-hidden={!showDesktop}
        className={`fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end transition-opacity duration-300 xl:flex ${
          showDesktop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {narrativeSteps.map((step) => {
          const isActive = step.id === active.id;
          return (
            <a
              key={step.id}
              href={`#${step.id}`}
              tabIndex={showDesktop ? 0 : -1}
              aria-current={isActive ? "location" : undefined}
              className={`group flex cursor-pointer items-center justify-end gap-2 px-2 py-1.5 ${isActive ? "mix-blend-difference" : ""}`}
            >
              <span
                className={`font-sans text-[10px] uppercase tracking-[0.16em] transition-opacity duration-300 ${
                  isActive ? "text-white opacity-100" : "text-ivory opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {step.label}
              </span>
              <span
                className={`mono-label transition-colors duration-300 ${
                  isActive ? "text-white" : "text-champagne-light/60 group-hover:text-champagne-light"
                }`}
              >
                {step.number}
              </span>
            </a>
          );
        })}
      </nav>

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed right-3 z-30 transition-opacity duration-300 lg:hidden ${
          showMobile ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "calc(var(--header-height-mobile) + 10px)" }}
      >
        <span className="rounded-full border border-champagne/20 bg-noir/70 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-ivory/85 backdrop-blur-sm">
          {active.number} / {TOTAL} — {active.label}
        </span>
      </div>
    </>
  );
}
