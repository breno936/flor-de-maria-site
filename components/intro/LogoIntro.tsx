"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";

const SESSION_KEY = "lga-intro-shown";

function resolveShouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return false;
  } catch {
    return false;
  }
  return true;
}
const shouldPlayOnLoad = resolveShouldPlay();

function subscribeNever() {
  return () => {};
}

/**
 * A brief, once-per-session branded opening: black frame, a thin gold line
 * draws in, the official logo fades/scales up, then the whole overlay
 * fades to reveal the Hero underneath — total budget ~1.5s. Purely a
 * decorative visual layer: `pointer-events-none` throughout and never
 * touches `document.body` overflow, so it can't block scroll, clicks, or
 * keyboard navigation even for the instant it's on screen. Skipped
 * entirely under `prefers-reduced-motion` and on every visit after the
 * first one this session (`sessionStorage`, not `localStorage` — a
 * deliberate campaign moment each session, not a one-time-ever splash).
 */
export default function LogoIntro() {
  const reducedMotion = useReducedMotion();
  const playOpening = useSyncExternalStore(
    subscribeNever,
    () => shouldPlayOnLoad && !reducedMotion,
    () => false
  );

  if (!playOpening) return null;
  return <LogoIntroSequence />;
}

function LogoIntroSequence() {
  const [revealed, setRevealed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private browsing / storage disabled — the intro just replays next
      // visit, which is harmless.
    }
    const raf = requestAnimationFrame(() => setRevealed(true));
    const outTimer = window.setTimeout(() => setFadingOut(true), 950);
    const unmountTimer = window.setTimeout(() => setMounted(false), 1500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(outTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-noir transition-opacity duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <span
          className={`h-px bg-gradient-to-r from-transparent via-champagne-light to-transparent transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            revealed ? "w-44 sm:w-56" : "w-0"
          }`}
        />
        <div
          className={`relative h-20 w-20 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-24 sm:w-24 ${
            revealed ? "scale-100 opacity-100" : "scale-[0.92] opacity-0"
          }`}
        >
          <Image
            src="/assets/le-grand-amour/le-grand-amour-logo.webp"
            alt=""
            fill
            sizes="96px"
            className="object-contain mix-blend-screen"
            priority
          />
        </div>
      </div>
    </div>
  );
}
