"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { especial } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";

const media = temporaryMedia["bouquet-assembly"]!;

/**
 * Cena 4 — "O que torna especial". The one deliberately light pause in the
 * experience: an ivory ground, a large partially-cropped photograph, and
 * four short facts arranged around it. The oxblood line down the photo's
 * inner edge draws top-to-bottom once on scroll-enter, each fact fading in
 * roughly as the line "reaches" its row — a single once:true timeline, so
 * it lands correctly even on a fast scroll past the section.
 */
export default function WhatMakesItSpecial() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const factRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set(lineRef.current, { scaleY: 1 });
      gsap.set(factRefs.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(lineRef.current, { scaleY: 0 });
    gsap.set(factRefs.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 62%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(lineRef.current, { scaleY: 1, duration: 1.1, ease: "power2.inOut" }, 0);
        factRefs.current.forEach((fact, i) => {
          const row = Math.floor(i / 2);
          tl.to(fact, { opacity: 1, y: 0, duration: 0.5 }, 0.25 + row * 0.35);
        });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section
      id="especial"
      ref={sectionRef}
      className="relative bg-ivory py-24 md:py-32"
      aria-labelledby="especial-title"
    >
      <div className="container-lga">
        <h2 id="especial-title" className="max-w-2xl font-display text-3xl leading-tight text-noir sm:text-4xl">
          {especial.eyebrow}
        </h2>

        <div className="relative mt-14 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-4">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[5/4] w-full overflow-hidden lg:aspect-[4/3]">
              <Image
                src={media.temporaryImage}
                alt={media.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                data-temporary-media="true"
              />
            </div>
            <div
              ref={lineRef}
              aria-hidden="true"
              className="absolute -right-3 top-6 bottom-6 hidden w-px origin-top bg-oxblood/70 lg:block"
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:pl-6">
            {especial.facts.map((fact, i) => (
              <div
                key={fact.label}
                ref={(el) => {
                  factRefs.current[i] = el;
                }}
              >
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-oxblood">
                  {fact.label}
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-noir/70">{fact.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
