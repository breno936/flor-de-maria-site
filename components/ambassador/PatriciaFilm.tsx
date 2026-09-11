"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { ambassadorSection } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";

export default function PatriciaFilm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const reveal = revealRef.current;
    const signature = signatureRef.current;
    if (!section || !reveal) return;

    if (reducedMotion) {
      gsap.set(reveal, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(signature, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(reveal, { clipPath: "inset(0% 48% 0% 48%)" });
    gsap.set(signature, { opacity: 0, y: 10 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
        tl.to(reveal, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }).to(
          signature,
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section
      id="patricia"
      ref={sectionRef}
      className="relative flex min-h-[80svh] items-center overflow-hidden"
      aria-labelledby="patricia-title"
    >
      <div ref={revealRef} className="absolute inset-0">
        <ManagedVideo
          clipId="patricia-film"
          description="Patrícia Marchi caminhando e observando a criação Le Grand Amour, tocando as rosas, olhando para fora de câmera."
          aspectClassName="h-full w-full"
        />
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
        <p className="mono-label mb-4">MUSA DA COLEÇÃO</p>
        <div className="rule-gold mb-6" />
        <h2 id="patricia-title" className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
          {ambassadorSection.title}
        </h2>

        {ambassadorSection.testimonialQuote ? (
          <blockquote className="mt-6 border-l border-gold/50 pl-5 font-display text-xl italic text-champagne">
            {ambassadorSection.testimonialQuote}
          </blockquote>
        ) : (
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-muted">
            {ambassadorSection.curatorNote}
          </p>
        )}

        <p
          ref={signatureRef}
          className="mt-8 font-signature text-3xl text-gold"
        >
          {ambassadorSection.signatureLine}
        </p>
      </div>
    </section>
  );
}
