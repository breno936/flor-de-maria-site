"use client";

import { useRef } from "react";
import { products } from "@/data/products";
import ManagedVideo from "@/components/media/ManagedVideo";
import ProductCursorLabel from "./ProductCursorLabel";

const product = products.find((p) => p.id === "le-bouquet")!;

export default function LeBouquet() {
  const mediaRef = useRef<HTMLDivElement>(null);

  return (
    <section id="criacoes" className="relative py-20 md:py-28" aria-labelledby="le-bouquet-title">
      <div className="container-lga grid gap-10 lg:grid-cols-12 lg:items-center">
        <div ref={mediaRef} className="relative lg:col-span-7">
          <div className="aspect-[4/5] w-full overflow-hidden md:aspect-[16/11]">
            <ManagedVideo
              clipId="bouquet-assembly"
              description="Pessoa recebendo e segurando o buquê monumental Le Bouquet, rosas e fita visíveis, escala perceptível."
              aspectClassName="h-full w-full"
              className="cursor-none"
            />
          </div>
          <ProductCursorLabel containerRef={mediaRef} label={product.cursorLabel} />

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

          <a
            href="#reserva"
            className="mt-8 inline-block rounded-full bg-rouge px-7 py-3 font-sans text-xs uppercase tracking-[0.2em] text-ivory transition-transform hover:scale-[1.02]"
          >
            {product.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
