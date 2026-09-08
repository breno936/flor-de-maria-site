"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { brand } from "@/data/content";

/**
 * The ribbon that visually connects Le Bouquet to Le Cœur Royale: finish,
 * continuity, the same gesture carried from one creation to the next.
 * Rendered as a wide gradient stroke with a soft satin highlight and a
 * drop shadow for volume — not a thin vector line.
 */
export default function RedThread() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const highlightRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const wrapper = wrapperRef.current;
    const path = pathRef.current;
    const highlight = highlightRef.current;
    if (!wrapper || !path || !highlight) return;

    const length = path.getTotalLength();

    if (reducedMotion) {
      gsap.set([path, highlight], { strokeDasharray: length, strokeDashoffset: 0 });
      return;
    }

    gsap.set([path, highlight], { strokeDasharray: length, strokeDashoffset: length });

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 85%",
      end: "bottom 60%",
      scrub: 0.4,
      onUpdate: (self) => {
        const offset = length * (1 - self.progress);
        gsap.set([path, highlight], { strokeDashoffset: offset });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <div ref={wrapperRef} className="relative mx-auto h-[36vh] max-w-4xl md:h-[44vh]" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="ribbon-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bordeaux)" />
            <stop offset="45%" stopColor="var(--rouge)" />
            <stop offset="100%" stopColor="var(--wine-shadow)" />
          </linearGradient>
          <filter id="ribbon-shadow" x="-50%" y="-20%" width="200%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#070504" floodOpacity="0.55" />
          </filter>
        </defs>
        <path
          ref={pathRef}
          d="M40 0 C120 80, 20 180, 100 260 C180 340, 30 420, 100 500 C140 550, 90 580, 100 600"
          stroke="url(#ribbon-gradient)"
          strokeWidth="13"
          strokeLinecap="round"
          filter="url(#ribbon-shadow)"
        />
        <path
          ref={highlightRef}
          d="M40 0 C120 80, 20 180, 100 260 C180 340, 30 420, 100 500 C140 550, 90 580, 100 600"
          stroke="var(--champagne)"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform="translate(-2.5, -2.5)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <p className="max-w-sm font-display text-xl italic text-champagne/90 sm:text-2xl">
          &ldquo;{brand.signature}&rdquo;
        </p>
      </div>
    </div>
  );
}
