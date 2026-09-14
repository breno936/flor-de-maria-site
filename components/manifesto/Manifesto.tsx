"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { entendimento } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_TOP = "inset(0% 0% 100% 0%)";

/**
 * Cena 2 — "O Entendimento". A predominantly typographic scene, like a
 * magazine spread: a narrow vertical media window on one side, the
 * headline and short support lines on the other. Deliberately NOT a
 * full-bleed background image behind the text — that pattern is reserved
 * for the cinematic scenes (Hero, Ritual, Coleção).
 *
 * Desktop (≥1024px) keeps its original scaleY window reveal + horizontal
 * thread exactly as before. Mobile/tablet gets its own signature: the
 * window opens via a top-down clip mask (the same "revealed by mask"
 * language as Hero/Ritual, not a squash), each support line lands as its
 * own beat instead of one shared block, and the link waits until last —
 * the section's own conclusion, not part of the group above it.
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const verticalThreadRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineInnerRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const linkGroupRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set([windowRef.current, headlineInnerRef.current, ...lineRefs.current, linkGroupRef.current], {
        opacity: 1,
        y: 0,
        clipPath: OPEN_CLIP,
        scaleY: 1,
      });
      gsap.set([threadRef.current, verticalThreadRef.current], { scaleX: 1, scaleY: 1 });
      return;
    }

    if (isDesktop) {
      gsap.set(windowRef.current, { scaleY: 0.82, transformOrigin: "top center" });
      gsap.set(threadRef.current, { scaleX: 0 });
      gsap.set(headlineInnerRef.current, { opacity: 0, y: 18 });
      gsap.set(lineRefs.current, { opacity: 0, y: 14 });
      gsap.set(linkGroupRef.current, { opacity: 0, y: 14 });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 68%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(windowRef.current, { scaleY: 1, duration: 0.9, ease: "power2.out" }, 0)
            .to(threadRef.current, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0.5)
            .to(headlineInnerRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
            .to(lineRefs.current, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.35)
            .to(linkGroupRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.6);
        },
      });
      return () => trigger.kill();
    }

    // Mobile/tablet signature: mask-reveal window, per-line phrase stagger,
    // a vertical thread standing in for the desktop's horizontal one, link
    // as the section's closing beat.
    gsap.set(windowRef.current, { clipPath: HIDDEN_TOP });
    gsap.set(verticalThreadRef.current, { scaleY: 0 });
    gsap.set(headlineInnerRef.current, { opacity: 0, y: 16 });
    gsap.set(lineRefs.current, { opacity: 0, x: -10 });
    gsap.set(linkGroupRef.current, { opacity: 0, y: 10 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(windowRef.current, { clipPath: HIDDEN_TOP }, { clipPath: OPEN_CLIP, duration: 0.7, ease: "power2.out" }, 0)
          .to(verticalThreadRef.current, { scaleY: 1, duration: 0.5, ease: "power2.inOut" }, 0.15)
          .to(headlineInnerRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.3)
          .to(lineRefs.current, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 }, 0.45)
          .to(linkGroupRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.85);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion, isDesktop]);

  return (
    <section
      id="entendimento"
      ref={sectionRef}
      className="relative overflow-hidden bg-noir py-24 md:py-36"
      aria-labelledby="entendimento-title"
    >
      <div className="container-lga relative grid items-center gap-12 md:grid-cols-12 md:gap-10">
        <div
          ref={threadRef}
          aria-hidden="true"
          className="absolute left-[30%] top-1/3 hidden h-px w-[16%] origin-left bg-gradient-to-r from-rouge to-rouge/0 md:block"
        />
        <div className="relative md:col-span-4">
          <div
            ref={verticalThreadRef}
            aria-hidden="true"
            className="absolute -left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-rouge to-rouge/0 md:hidden"
          />
          <div ref={windowRef} className="aspect-[3/4] w-full max-w-[280px] overflow-hidden">
            <ManagedVideo
              clipId="hands-selecting"
              description="Mão selecionando e preparando uma rosa vermelha — referência de gesto."
              aspectClassName="h-full w-full"
              showDebugLabel={false}
            />
          </div>
          <p className="mono-label mt-4">{entendimento.windowLabel}</p>
        </div>

        <div className="md:col-span-8 md:pl-6">
          <p className="mono-label">{entendimento.eyebrow}</p>
          <h2
            ref={headlineRef}
            id="entendimento-title"
            className="mt-4 max-w-lg overflow-hidden font-display text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-6xl"
          >
            <span ref={headlineInnerRef} className="block">
              {entendimento.headline}
            </span>
          </h2>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              {entendimento.support.map((line, i) => (
                <p
                  key={line}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="font-sans text-base leading-snug text-champagne"
                >
                  {line}
                </p>
              ))}
            </div>
            <div ref={linkGroupRef} className="flex flex-col gap-4 sm:items-end sm:text-right">
              <div className="rule-gold sm:ml-auto" />
              <a
                href={entendimento.secondaryHref}
                className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-champagne/90 transition-colors hover:text-ivory"
              >
                {entendimento.secondaryCta}
                <span
                  className="relative inline-block transition-transform duration-300 ease-out group-hover:translate-x-[4px]"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
