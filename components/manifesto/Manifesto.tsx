"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { entendimento } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

/**
 * Cena 2 — "O Entendimento". A predominantly typographic scene, like a
 * magazine spread: a narrow vertical media window on one side, the
 * headline and short support lines on the other. Deliberately NOT a
 * full-bleed background image behind the text — that pattern is reserved
 * for the cinematic scenes (Hero, Ritual, Coleção).
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set([windowRef.current, headlineRef.current, linesRef.current], { opacity: 1, y: 0, scaleY: 1 });
      gsap.set(threadRef.current, { scaleX: 1 });
      return;
    }

    gsap.set(windowRef.current, { scaleY: 0.82, transformOrigin: "top center" });
    gsap.set(threadRef.current, { scaleX: 0 });
    gsap.set(headlineRef.current, { opacity: 0, y: 18 });
    gsap.set(linesRef.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 68%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(windowRef.current, { scaleY: 1, duration: 0.9, ease: "power2.out" }, 0)
          .to(threadRef.current, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0.5)
          .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
          .to(linesRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.35);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

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
        <div className="md:col-span-4">
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
            className="mt-4 max-w-lg font-display text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-6xl"
          >
            {entendimento.headline}
          </h2>

          <div ref={linesRef} className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              {entendimento.support.map((line) => (
                <p key={line} className="font-sans text-base leading-snug text-champagne">
                  {line}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:items-end sm:text-right">
              <div className="rule-gold sm:ml-auto" />
              <a
                href={entendimento.secondaryHref}
                className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-champagne/90 transition-colors hover:text-ivory"
              >
                {entendimento.secondaryCta}
                <span className="relative inline-block transition-transform duration-300 ease-out group-hover:translate-x-[4px]" aria-hidden="true">
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
