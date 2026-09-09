"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { brand } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";

const media = temporaryMedia["ribbon-detail"];

/**
 * "O último cuidado" — replaces the drawn red-thread SVG path. A compact,
 * non-scroll-linked interlude: the finishing gesture on the gift's ribbon,
 * given one short discreet reveal when the section enters view (not a
 * timeline scrubbed by scroll position) and then left alone.
 *
 * No footage of hands finishing a bow was found under a usable license with
 * this collection's dark background and red roses (the one direct reference
 * the client pointed to — Pexels 5399933 — uses pink/white roses on a bright
 * white table with an identifiable model's face, which would misrepresent
 * both the product and risk being mistaken for Patrícia Marchi). Per the
 * brief's own fallback clause, this uses the same on-brand ribbon photograph
 * already in the library instead of forcing a mismatched clip — a real
 * photograph of the actual finishing material, not an abstract illustration.
 * The hands-tying gesture itself remains a pending shoot; see MEDIA-MANIFEST.md.
 */
export default function LastTouch() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set([frameRef.current, phraseRef.current], { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    gsap.set(frameRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(phraseRef.current, { opacity: 0, y: 12 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(frameRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, 0).to(
          phraseRef.current,
          { opacity: 1, y: 0, duration: 0.7 },
          0.35
        );
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24"
      aria-label="O último cuidado antes da entrega"
    >
      <div className="container-lga grid items-center gap-8 md:grid-cols-3 md:gap-10">
        <div ref={frameRef} className="relative aspect-[16/10] w-full overflow-hidden md:col-span-2">
          {media && (
            <Image
              src={media.temporaryImage}
              alt="Fotografia conceitual provisória: detalhe da fita de cetim vermelha sobre fundo escuro — representa o cuidado do acabamento final; ainda não é uma filmagem das mãos amarrando o laço."
              fill
              sizes="(max-width: 767px) 100vw, 66vw"
              className="object-cover"
              data-temporary-media="true"
            />
          )}
        </div>

        <p
          ref={phraseRef}
          className="font-display text-2xl italic leading-snug text-champagne sm:text-3xl md:col-span-1"
        >
          &ldquo;{brand.signature}&rdquo;
        </p>
      </div>
    </section>
  );
}
