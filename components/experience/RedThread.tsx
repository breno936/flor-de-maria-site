"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { brand } from "@/data/content";

/**
 * The ribbon that visually connects Le Bouquet to Le Cœur Royale: finish,
 * continuity, the same gesture carried from one creation to the next.
 */
export default function RedThread() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const wrapper = wrapperRef.current;
    const path = pathRef.current;
    if (!wrapper || !path) return;

    const length = path.getTotalLength();

    if (reducedMotion) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      return;
    }

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 85%",
      end: "bottom 60%",
      scrub: 0.4,
      onUpdate: (self) => {
        gsap.set(path, { strokeDashoffset: length * (1 - self.progress) });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <div ref={wrapperRef} className="relative mx-auto h-[46vh] max-w-4xl md:h-[56vh]" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={pathRef}
          d="M40 0 C120 80, 20 180, 100 260 C180 340, 30 420, 100 500 C140 550, 90 580, 100 600"
          stroke="var(--rouge)"
          strokeWidth="2"
          strokeLinecap="round"
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
