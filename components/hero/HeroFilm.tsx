"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { hero, brand } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";
import PetalLens from "./PetalLens";

export default function HeroFilm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    if (!isDesktop || reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      tl.to(bgRef.current, { y: 10, scale: 1.02, ease: "none" }, 0)
        .to(midRef.current, { y: 16, ease: "none" }, 0)
        .to(fgRef.current, { y: 24, rotate: 0.4, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, [isDesktop, reducedMotion]);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative flex min-h-[92svh] w-full items-end overflow-hidden bg-noir md:min-h-[100svh]"
      aria-label="Le Grand Amour — abertura da coleção"
    >
      <div ref={bgRef} className="absolute inset-0">
        <ManagedVideo
          clipId="rose-lateral-light"
          description="Rosas vermelhas recebendo iluminação lateral em atmosfera editorial escura."
          aspectClassName="h-full w-full"
          priority
        />
      </div>

      <div ref={midRef} className="absolute inset-y-0 right-0 hidden w-[52%] md:block">
        <ManagedVideo
          clipId="patricia-film"
          description="Patrícia Marchi ao lado da criação Le Grand Amour, olhando para fora de câmera."
          aspectClassName="h-full w-full"
        />
      </div>

      <div
        ref={fgRef}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full opacity-70 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(146,9,20,0.35), transparent 70%)" }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(7,5,4,0.92) 0%, rgba(7,5,4,0.55) 42%, rgba(7,5,4,0.25) 68%, rgba(7,5,4,0.5) 100%)",
        }}
      />

      {isDesktop && !reducedMotion && (
        <PetalLens containerRef={sectionRef} clipId="patricia-film" />
      )}

      <div className="container-lga relative z-10 pb-16 pt-40 md:pb-24">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="mt-4 font-display text-[3.2rem] leading-[0.95] text-ivory sm:text-[4.5rem] lg:text-[6rem]">
          {hero.title}
        </h1>
        <p className="mt-5 max-w-md font-display text-xl italic text-champagne sm:text-2xl">
          &ldquo;{hero.tagline}&rdquo;
        </p>
        <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ivory/80 sm:text-base">
          {hero.body}
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#reserva"
            className="rounded-full bg-rouge px-7 py-3 text-center font-sans text-xs uppercase tracking-[0.2em] text-ivory shadow-[0_0_0_1px_rgba(181,138,74,0.4)] transition-transform hover:scale-[1.02]"
          >
            {hero.ctaPrimary}
          </a>
          <a
            href="#colecao"
            className="rounded-full border border-ivory/30 px-7 py-3 text-center font-sans text-xs uppercase tracking-[0.2em] text-ivory/90 transition-colors hover:border-gold hover:text-gold"
          >
            {hero.ctaSecondary}
          </a>
        </div>

        <p className="mt-8 font-signature text-2xl text-champagne/90">{hero.signature}</p>
        <span className="sr-only">{brand.collabLine}</span>
      </div>
    </section>
  );
}
