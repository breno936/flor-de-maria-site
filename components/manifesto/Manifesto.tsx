"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { manifesto } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

/**
 * The pause after the hero's declaration — a single spacious phrase, not a
 * second hero. The background film is intentionally quiet (low opacity,
 * very slow) so it reads as atmosphere behind the words, not a competing
 * subject. `manifesto.title`/`body` (the client's original manifesto
 * copy) stay as smaller, secondary text beneath the phrase — kept, not
 * replaced, just no longer the loudest thing on screen.
 */
export default function Manifesto() {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 0 });
      gsap.set(secondaryRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 });
    gsap.set(secondaryRef.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(line1Ref.current, { yPercent: 0, duration: 0.7 }, 0)
          .to(line2Ref.current, { yPercent: 0, duration: 0.7 }, 0.12)
          .to(secondaryRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.5);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="colecao" ref={sectionRef} className="relative overflow-hidden py-28 md:py-40" aria-labelledby="manifesto-title">
      <div aria-hidden="true" className="absolute inset-0 opacity-25">
        <ManagedVideo
          clipId="petal-macro"
          description=""
          aspectClassName="h-full w-full"
          showDebugLabel={false}
        />
        <div className="absolute inset-0 bg-noir/70" />
      </div>

      <div className="container-lga relative">
        <h2 id="manifesto-title" className="max-w-3xl font-display text-3xl italic leading-[1.25] text-ivory sm:text-4xl lg:text-[2.75rem]">
          <span className="block overflow-hidden">
            <span ref={line1Ref} className="block">
              Há presentes que não chegam apenas às mãos.
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line2Ref} className="block">
              Chegam à memória.
            </span>
          </span>
        </h2>

        <div ref={secondaryRef} className="mt-12 max-w-xl">
          <div className="rule-gold mb-5" />
          <p className="font-display text-xl text-champagne">{manifesto.title}</p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{manifesto.body}</p>
        </div>
      </div>
    </section>
  );
}
