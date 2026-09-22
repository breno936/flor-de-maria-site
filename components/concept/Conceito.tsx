"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { conceito } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_TOP = "inset(0% 0% 100% 0%)";

/**
 * Etapa 02 — CONCEITO. Transforms the initial desejo into meaning — a
 * predominantly typographic scene (a narrow media window, headline, short
 * body, and the occasion sequence formerly known as "Para quem", now folded
 * into this same beat instead of getting its own macrosection). No CTA
 * here: the brief is explicit that conversion isn't asked for until the
 * product has been shown.
 *
 * Desktop (≥1024px) keeps the original scaleY window reveal + horizontal
 * thread. Mobile/tablet gets a top-down clip-mask reveal and a vertical
 * thread instead — same "revealed by mask" language as Hero/Experiência,
 * not a squash.
 */
export default function Conceito() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const verticalThreadRef = useRef<HTMLDivElement>(null);
  const headlineInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const occasionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const allText = [...headlineInnerRefs.current, ...bodyRefs.current, ...occasionRefs.current];

    if (reducedMotion) {
      gsap.set(windowRef.current, { scaleY: 1, clipPath: OPEN_CLIP });
      gsap.set([threadRef.current, verticalThreadRef.current], { scaleX: 1, scaleY: 1 });
      gsap.set(allText, { opacity: 1, y: 0, x: 0 });
      return;
    }

    if (isDesktop) {
      gsap.set(windowRef.current, { scaleY: 0.82, transformOrigin: "top center" });
      gsap.set(threadRef.current, { scaleX: 0 });
      gsap.set(headlineInnerRefs.current, { opacity: 0, y: 18 });
      gsap.set(bodyRefs.current, { opacity: 0, y: 14 });
      gsap.set(occasionRefs.current, { opacity: 0, y: 10 });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 68%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(windowRef.current, { scaleY: 1, duration: 0.9, ease: "power2.out" }, 0)
            .to(threadRef.current, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0.5)
            .to(headlineInnerRefs.current, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.2)
            .to(bodyRefs.current, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.5)
            .to(occasionRefs.current, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 0.85);
        },
      });
      return () => trigger.kill();
    }

    // Mobile/tablet signature: mask-reveal window, per-line phrase stagger,
    // a vertical thread standing in for the desktop's horizontal one.
    gsap.set(windowRef.current, { clipPath: HIDDEN_TOP });
    gsap.set(verticalThreadRef.current, { scaleY: 0 });
    gsap.set(headlineInnerRefs.current, { opacity: 0, y: 16 });
    gsap.set(bodyRefs.current, { opacity: 0, x: -10 });
    gsap.set(occasionRefs.current, { opacity: 0, x: -10 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(windowRef.current, { clipPath: HIDDEN_TOP }, { clipPath: OPEN_CLIP, duration: 0.7, ease: "power2.out" }, 0)
          .to(verticalThreadRef.current, { scaleY: 1, duration: 0.5, ease: "power2.inOut" }, 0.15)
          .to(headlineInnerRefs.current, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.3)
          .to(bodyRefs.current, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 }, 0.55)
          .to(occasionRefs.current, { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 }, 0.9);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion, isDesktop]);

  return (
    <section
      id="conceito"
      ref={sectionRef}
      className="relative overflow-hidden bg-noir py-24 md:py-36"
      aria-labelledby="conceito-title"
    >
      <div className="container-lga relative grid items-start gap-12 md:grid-cols-12 md:gap-10">
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
        </div>

        <div className="md:col-span-8 md:pl-6">
          <p className="mono-label">{conceito.eyebrow}</p>
          <h2 id="conceito-title" className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,4.2vw,4.4rem)] italic leading-[1.08] text-ivory">
            {conceito.headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    headlineInnerRefs.current[i] = el;
                  }}
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <div className="mt-8 max-w-md">
            {conceito.body.map((paragraph, i) => (
              <p
                key={paragraph}
                ref={(el) => {
                  bodyRefs.current[i] = el;
                }}
                className="mt-3 font-sans text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6] text-champagne first:mt-0"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-10 flex max-w-md flex-col gap-2 border-t border-gold/15 pt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2">
            {conceito.occasions.map((line, i) => (
              <li
                key={line}
                ref={(el) => {
                  occasionRefs.current[i] = el;
                }}
                className="font-display text-lg italic text-ivory/90"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
