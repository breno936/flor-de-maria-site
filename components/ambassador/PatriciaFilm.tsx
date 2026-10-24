"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { autoria, brand } from "@/data/content";
import { campaignStills } from "@/data/campaign-photos";
import { AVAILABLE_CLIPS } from "@/lib/video/availableClips";
import ManagedVideo from "@/components/media/ManagedVideo";
import StartServiceCTA from "@/components/cta/StartServiceCTA";

const frameStill = campaignStills["patricia-film"];
// The caption belongs to the still standing in the frame; once the real
// film exists it speaks for itself.
const frameCaption = AVAILABLE_CLIPS.has("patricia-film") ? null : frameStill?.caption;

/**
 * Etapa 05 — AUTORIA. Demonstrates the origin and legitimacy of the
 * collection — a calmer, more human beat right after the intensity of
 * Experiência. The image sits in a controlled editorial frame beside the
 * text (not a full-bleed background, which cropped any portrait down to a
 * fragment): today a real frame of the campaign's creative process, later
 * the authorised portrait or film, same frame. Center-out clip reveal, a
 * very subtle drift inside the frame, then the signature and the shared CTA
 * — every stage from PRODUTO onward resolves toward "iniciar atendimento".
 */
export default function PatriciaFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const reveal = revealRef.current;
    if (!section || !reveal) return;

    if (reducedMotion) {
      gsap.set(reveal, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(filmRef.current, { yPercent: 0 });
      gsap.set([signatureRef.current, ctaRef.current], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(reveal, { clipPath: "inset(0% 48% 0% 48%)" });
    gsap.set([signatureRef.current, ctaRef.current], { opacity: 0, y: 10 });

    let tl: gsap.core.Timeline | null = null;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
        tl.to(reveal, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }, 0)
          .to(signatureRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.15");
      },
    });

    const drift = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => gsap.set(filmRef.current, { yPercent: (self.progress - 0.5) * 6 }),
    });

    return () => {
      trigger.kill();
      drift.kill();
      tl?.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      id="autoria"
      ref={sectionRef}
      className="relative overflow-hidden bg-noir py-24 md:py-32"
      aria-labelledby="autoria-title"
    >
      <div className="container-lga grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:order-2 lg:col-span-6 lg:col-start-7">
          <div
            ref={revealRef}
            className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden border border-champagne-light/20 lg:mx-0"
          >
            <div ref={filmRef} className="absolute inset-[-6%_0]">
              <ManagedVideo
                clipId="patricia-film"
                description={frameStill?.alt ?? "Lê Grand Amour — autoria da coleção."}
                aspectClassName="h-full w-full"
                objectPositionClassName="object-center"
                sizes="(max-width: 1023px) 92vw, 520px"
                showDebugLabel={false}
              />
            </div>
          </div>
          {frameCaption && (
            <figcaption className="mono-label mx-auto mt-4 max-w-[520px] lg:mx-0">{frameCaption}</figcaption>
          )}
        </figure>

        <div className="lg:order-1 lg:col-span-5">
          <p className="mono-label mb-4 text-champagne-light">{autoria.eyebrow}</p>
          <div className="rule-gold mb-6" />
          <h2 id="autoria-title" className="font-display text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
            {autoria.title}
          </h2>

          {autoria.testimonialQuote ? (
            <blockquote className="mt-6 border-l border-gold/50 pl-5 font-display text-xl italic text-champagne-light">
              {autoria.testimonialQuote}
            </blockquote>
          ) : (
            <p className="mt-6 max-w-md font-sans text-[0.95rem] leading-relaxed text-ivory/80">{autoria.curatorNote}</p>
          )}

          <p className="mt-6 font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-champagne-light/80">
            {brand.signatureFull}
          </p>

          <p ref={signatureRef} className="mt-4 font-display text-3xl italic text-gold lg:text-[2rem]">
            {autoria.signatureLine}
          </p>

          <div ref={ctaRef} className="mt-10">
            <StartServiceCTA />
          </div>
        </div>
      </div>
    </section>
  );
}
