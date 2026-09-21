"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { autoria } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";
import StartServiceCTA from "@/components/cta/StartServiceCTA";

/**
 * Etapa 05 — AUTORIA. Demonstrates the origin and legitimacy of the
 * collection — a calmer, more human beat right after the intensity of
 * Experiência. The center-out clip-path reveal + signature fade is shared
 * by every breakpoint, untouched from before. Mobile/tablet only adds: a
 * brightness lift woven into the same reveal, a very subtle scroll
 * parallax on the film once revealed, and a portrait-tuned crop so
 * Patrícia stays framed in a narrow viewport. Closes with the shared CTA —
 * this section previously had none, but the brief asks every stage from
 * PRODUTO onward to resolve toward "iniciar atendimento".
 */
export default function PatriciaFilm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const reveal = revealRef.current;
    const signature = signatureRef.current;
    if (!section || !reveal) return;

    if (reducedMotion) {
      gsap.set(reveal, { clipPath: "inset(0% 0% 0% 0%)", filter: "brightness(1)" });
      gsap.set([signature, ctaRef.current], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(reveal, { clipPath: "inset(0% 48% 0% 48%)" });
    gsap.set(signature, { opacity: 0, y: 10 });
    gsap.set(ctaRef.current, { opacity: 0, y: 12 });
    if (!isDesktop) gsap.set(reveal, { filter: "brightness(0.65)" });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
        tl.to(reveal, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }, 0);
        if (!isDesktop) tl.to(reveal, { filter: "brightness(1)", duration: 1.1, ease: "power2.out" }, 0);
        tl.to(signature, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2").to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.1"
        );
      },
    });

    return () => trigger.kill();
  }, [reducedMotion, isDesktop]);

  // Subtle parallax on the film once it's on screen — mobile/tablet only,
  // desktop keeps its current (static) behavior exactly as before.
  useEffect(() => {
    if (reducedMotion || isDesktop) return;
    registerGsap();
    const section = sectionRef.current;
    const film = filmRef.current;
    if (!section || !film) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => gsap.set(film, { y: (self.progress - 0.5) * 24 }),
    });
    return () => trigger.kill();
  }, [reducedMotion, isDesktop]);

  return (
    <section
      id="autoria"
      ref={sectionRef}
      className="relative flex min-h-[80svh] items-center overflow-hidden"
      aria-labelledby="autoria-title"
    >
      <div ref={revealRef} className="absolute inset-0">
        <div ref={filmRef} className="absolute inset-[-6%_0]">
          <ManagedVideo
            clipId="patricia-film"
            description="Patrícia Marchi caminhando e observando a criação Le Grand Amour, tocando as rosas, olhando para fora de câmera."
            aspectClassName="h-full w-full"
            objectPositionClassName="object-[50%_24%] lg:object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,5,4,0.9) 0%, rgba(7,5,4,0.55) 40%, rgba(7,5,4,0.15) 75%)",
          }}
        />
      </div>

      <div className="container-lga relative z-10 max-w-xl py-24">
        <p className="mono-label mb-4">{autoria.eyebrow}</p>
        <div className="rule-gold mb-6" />
        <h2 id="autoria-title" className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
          {autoria.title}
        </h2>

        {autoria.testimonialQuote ? (
          <blockquote className="mt-6 border-l border-gold/50 pl-5 font-display text-xl italic text-champagne">
            {autoria.testimonialQuote}
          </blockquote>
        ) : (
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-muted">{autoria.curatorNote}</p>
        )}

        <p ref={signatureRef} className="mt-8 font-display text-3xl italic text-gold lg:text-2xl">
          {autoria.signatureLine}
        </p>

        <div ref={ctaRef} className="mt-10">
          <StartServiceCTA />
        </div>
      </div>
    </section>
  );
}
