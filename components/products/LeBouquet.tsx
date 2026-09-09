"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { products } from "@/data/products";
import ManagedVideo from "@/components/media/ManagedVideo";
import AtelierButton from "@/components/ui/AtelierButton";

const product = products.find((p) => p.id === "le-bouquet")!;

export default function LeBouquet() {
  const zoomRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const zoom = zoomRef.current;
    if (!zoom || reducedMotion) return;

    gsap.set(zoom, { scale: 1 });
    const trigger = ScrollTrigger.create({
      trigger: zoom,
      start: "top 85%",
      end: "top 30%",
      scrub: 0.6,
      onUpdate: (self) => gsap.set(zoom, { scale: 1 + self.progress * 0.035 }),
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="criacoes" className="relative py-20 md:py-28" aria-labelledby="le-bouquet-title">
      <div className="container-lga grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-7">
          <div className="aspect-[4/5] w-full overflow-hidden md:aspect-[16/11]">
            <div ref={zoomRef} className="h-full w-full">
              <ManagedVideo
                clipId="bouquet-assembly"
                description="Buquê real de rosas vermelhas com embalagem em papel kraft, referência de material e cor para Le Bouquet."
                aspectClassName="h-full w-full"
              />
            </div>
          </div>

          <div className="absolute -bottom-8 left-6 hidden h-28 w-28 overflow-hidden border border-gold/20 sm:block">
            <ManagedVideo
              clipId="ribbon-detail"
              description="Detalhe da fita e do acabamento do buquê."
              aspectClassName="h-full w-full"
              showDebugLabel={false}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow">{product.eyebrow}</p>
          <h2 id="le-bouquet-title" className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
            {product.name}
          </h2>
          <p className="mt-3 font-display text-xl italic text-champagne">{product.tagline}</p>

          <ul className="mt-6 flex flex-col gap-2">
            {product.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-3 font-sans text-sm text-muted">
                <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>

          <AtelierButton href="?criacao=le-bouquet#reserva" variant="primary" className="mt-8">
            {product.cta}
          </AtelierButton>
        </div>
      </div>
    </section>
  );
}
