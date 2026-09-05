"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { brand } from "@/data/content";

const SESSION_KEY = "lga-petal-seen";
const HERO_POSTER = "/media/temporary/hero-editorial-loop-poster.jpg";
const PETAL_POSTER = "/media/temporary/petal-macro-loop-poster.jpg";

/**
 * Dark Bloom — the opening ritual. A gold line sweeps, curves into a petal,
 * a rose macro appears inside it, then the petal opens onto the real hero
 * footage. The critical fix versus the old version: the mask now reveals an
 * actual image (the hero's own poster) instead of another black layer, so
 * the viewer sees something happen instead of staring at black-on-black.
 * ~1.4s total. Runs once per session.
 */
export default function PetalReveal() {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const petalStillRef = useRef<HTMLDivElement>(null);
  const heroStillRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Deliberately deferred to an effect (not a lazy useState initializer):
    // the server always renders `null`, so flipping this synchronously during
    // the client's first render would mismatch hydration output.
    if (sessionStorage.getItem(SESSION_KEY)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      tl.to(overlay, { opacity: 0, duration: 0.25, delay: 0.1 });
      return () => {
        tl.kill();
      };
    }

    const line = lineRef.current;
    const path = pathRef.current;
    const wordmark = wordmarkRef.current;
    const length = path?.getTotalLength() ?? 0;

    gsap.set(line, { strokeDasharray: 60, strokeDashoffset: 60, opacity: 1 });
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    gsap.set(petalStillRef.current, { opacity: 1 });
    gsap.set(heroStillRef.current, { opacity: 0 });
    gsap.set(wordmark, { clipPath: "inset(50% 0 50% 0)", opacity: 0 });
    gsap.set(mask, { clipPath: "ellipse(1% 1% at 50% 46%)" });

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(line, { strokeDashoffset: 0, duration: 0.22, ease: "power2.out" })
      .to(line, { opacity: 0, duration: 0.1 }, "-=0.02")
      .to(path, { opacity: 1, strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.06")
      .to(wordmark, { clipPath: "inset(0% 0 0% 0)", opacity: 1, duration: 0.26, ease: "power2.out" }, "-=0.08")
      .to({}, { duration: 0.12 })
      .to(heroStillRef.current, { opacity: 1, duration: 0.16 }, ">-0.02")
      .to(petalStillRef.current, { opacity: 0, duration: 0.16 }, "<")
      .to(
        mask,
        { clipPath: "ellipse(120% 120% at 50% 46%)", duration: 0.42, ease: "power3.inOut" },
        "-=0.06"
      )
      .to(wordmark, { opacity: 0, duration: 0.12 }, "<0.1")
      .to(overlay, { opacity: 0, duration: 0.1 }, "-=0.02");

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
      {/* The growing petal window — filled with real imagery, never another black layer */}
      <div ref={maskRef} className="absolute inset-0 overflow-hidden bg-noir">
        <div
          ref={petalStillRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PETAL_POSTER})` }}
        />
        <div
          ref={heroStillRef}
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(7,5,4,0.5) 0%, transparent 40%)" }}
        />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-5">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <line ref={lineRef} x1="30" y1="80" x2="90" y2="80" stroke="var(--gold)" strokeWidth="1" />
          <path
            ref={pathRef}
            d="M60 18 C90 42 90 118 60 142 C30 118 30 42 60 18 Z"
            stroke="var(--gold)"
            strokeWidth="1"
          />
        </svg>
        <div ref={wordmarkRef} className="overflow-hidden">
          <p className="font-display text-sm tracking-[0.5em] text-gold">{brand.name}</p>
        </div>
      </div>
    </div>
  );
}
