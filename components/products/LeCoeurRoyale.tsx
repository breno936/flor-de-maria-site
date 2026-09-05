"use client";

import { useRef } from "react";
import { products } from "@/data/products";
import ManagedVideo from "@/components/media/ManagedVideo";
import ProductCursorLabel from "./ProductCursorLabel";

const product = products.find((p) => p.id === "le-coeur-royale")!;

export default function LeCoeurRoyale() {
  const mediaRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-20 md:py-28" aria-labelledby="le-coeur-title">
      <div ref={mediaRef} className="relative mx-4 aspect-[3/4] overflow-hidden md:mx-auto md:aspect-[21/9] md:max-w-6xl">
        <ManagedVideo
          clipId="coeur-assembly"
          description="Caixa Le Cœur Royale sendo revelada, tampa se abrindo, rosas em formato de coração, detalhe do acabamento."
          aspectClassName="h-full w-full"
        />
        <ProductCursorLabel containerRef={mediaRef} label={product.cursorLabel} />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,5,4,0.92) 0%, rgba(7,5,4,0.35) 45%, transparent 75%)",
          }}
        />

        <div className="absolute right-6 top-6 hidden h-24 w-24 overflow-hidden rounded-full border border-gold/30 md:block">
          <ManagedVideo
            clipId="ribbon-detail"
            description="Detalhe do laço e acabamento da caixa Le Cœur Royale."
            aspectClassName="h-full w-full"
            showDebugLabel={false}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:max-w-xl md:p-12">
          <p className="eyebrow">{product.eyebrow}</p>
          <h2 id="le-coeur-title" className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
            {product.name}
          </h2>
          <p className="mt-3 font-display text-xl italic text-champagne">{product.tagline}</p>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {product.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2 font-sans text-sm text-muted">
                <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>

          <a
            href="#reserva"
            className="mt-7 inline-block rounded-full border border-gold px-7 py-3 font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-noir"
          >
            {product.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
