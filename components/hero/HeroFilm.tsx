"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap/registerGsap";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { hero, brand } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";
import AtelierButton from "@/components/ui/AtelierButton";
import PetalLens from "./PetalLens";

export default function HeroFilm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
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
      tl.to(bgRef.current, { y: 10, scale: 1.03, ease: "none" }, 0).to(
        fgRef.current,
        { y: 24, rotate: 0.4, ease: "none" },
        0
      );
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
      {/* Background plane — the hero film/still itself: hand raising a single rose against a near-black field */}
      <div ref={bgRef} className="absolute inset-0">
        <ManagedVideo
          clipId="rose-lateral-light"
          description="Uma mão ergue uma única rosa vermelha contra um fundo quase preto, atmosfera editorial de alta-costura."
          aspectClassName="h-full w-full"
          priority
        />
      </div>

      {/* Foreground plane — a soft, blurred petal accent in the corner, real texture rather than an abstract blob */}
      <div
        ref={fgRef}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 overflow-hidden rounded-full opacity-50 blur-md"
      >
        <ManagedVideo
          clipId="petal-macro"
          description=""
          aspectClassName="h-full w-full"
          showDebugLabel={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full opacity-70 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(146,9,20,0.35), transparent 70%)" }}
      />

      {/* Legibility scrim — darker on the left where the title sits, darker at the base for the CTA row */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(7,5,4,0.94) 0%, rgba(7,5,4,0.6) 40%, rgba(7,5,4,0.28) 66%, rgba(7,5,4,0.42) 100%), linear-gradient(100deg, rgba(7,5,4,0.75) 0%, rgba(7,5,4,0.35) 38%, rgba(7,5,4,0.05) 62%, transparent 80%)",
        }}
      />

      {isDesktop && !reducedMotion && (
        <PetalLens containerRef={sectionRef} clipId="rose-lateral-light" />
      )}

      <div className="container-lga relative z-10 max-w-3xl pb-16 pt-40 md:pb-24">
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

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <AtelierButton href="#reserva" variant="primary">
            {hero.ctaPrimary}
          </AtelierButton>
          <AtelierButton href="#colecao" variant="secondary">
            {hero.ctaSecondary}
          </AtelierButton>
        </div>

        <p className="mt-8 font-signature text-2xl text-champagne/90">{hero.signature}</p>
        <span className="sr-only">{brand.collabLine}</span>
      </div>
    </section>
  );
}
