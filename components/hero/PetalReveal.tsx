"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { brand } from "@/data/content";

const SESSION_KEY = "lga-petal-seen";

/**
 * Opening ritual: gold line draws a petal curve, the petal opens as a
 * clip-path mask, the hero is revealed. Max ~900ms. Runs once per session.
 */
export default function PetalReveal() {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const mask = maskRef.current;
    if (!overlay || !mask) return;

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      gsap.set(overlay, { display: "none" });
      setMounted(false);
    };

    if (reducedMotion) {
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(overlay, { opacity: 0, duration: 0.3, delay: 0.15 });
      return () => {
        tl.kill();
      };
    }

    const path = pathRef.current;
    const wordmark = wordmarkRef.current;
    const length = path?.getTotalLength() ?? 0;

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(wordmark, { opacity: 0, y: 6 });
    gsap.set(mask, { clipPath: "ellipse(0% 0% at 50% 50%)" });

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(path, { strokeDashoffset: 0, duration: 0.32, ease: "power2.inOut" })
      .to(wordmark, { opacity: 1, y: 0, duration: 0.18, ease: "power1.out" }, "-=0.12")
      .to({}, { duration: 0.08 })
      .to(mask, {
        clipPath: "ellipse(140% 140% at 50% 50%)",
        duration: 0.34,
        ease: "power3.inOut",
      })
      .to(overlay, { opacity: 0, duration: 0.08 }, "-=0.04");

    return () => {
      tl.kill();
    };
  }, [mounted, reducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-noir"
      role="presentation"
      aria-hidden="true"
    >
      <div ref={maskRef} className="absolute inset-0 bg-noir" />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <path
            ref={pathRef}
            d="M60 18 C90 42 90 118 60 142 C30 118 30 42 60 18 Z"
            stroke="var(--gold)"
            strokeWidth="1"
          />
        </svg>
        <p
          ref={wordmarkRef}
          className="font-display text-sm tracking-[0.5em] text-gold"
        >
          {brand.name}
        </p>
      </div>
    </div>
  );
}
