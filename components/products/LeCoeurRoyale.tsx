"use client";

import { useRef } from "react";
import { products } from "@/data/products";
import ManagedVideo from "@/components/media/ManagedVideo";
import AtelierButton from "@/components/ui/AtelierButton";
import ProductCursorLabel from "./ProductCursorLabel";

const product = products.find((p) => p.id === "le-coeur-royale")!;

// objectBoundingBox coordinates (0–1) so the heart scales with the box, any aspect ratio.
const HEART_PATH =
  "M0.5 0.94 C0.14 0.7 0 0.46 0 0.28 C0 0.07 0.17 -0.03 0.33 0.03 C0.43 0.07 0.5 0.15 0.5 0.15 C0.5 0.15 0.57 0.07 0.67 0.03 C0.83 -0.03 1 0.07 1 0.28 C1 0.46 0.86 0.7 0.5 0.94 Z";

export default function LeCoeurRoyale() {
  const mediaRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-20 md:py-28" aria-labelledby="le-coeur-title">
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="heart-clip-lga" clipPathUnits="objectBoundingBox">
            <path d={HEART_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="container-lga grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="eyebrow">{product.eyebrow}</p>
          <h2 id="le-coeur-title" className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
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

          <AtelierButton href="#reserva" variant="secondary" className="mt-8">
            {product.cta}
          </AtelierButton>
        </div>

        <div ref={mediaRef} className="relative order-1 mx-auto w-full max-w-xl lg:order-2 lg:col-span-7">
          <div
            className="relative aspect-square w-full cursor-none overflow-hidden"
            style={{ clipPath: "url(#heart-clip-lga)" }}
          >
            <ManagedVideo
              clipId="coeur-assembly"
              description="Rosas vermelhas densamente compostas, referência de atmosfera para a caixa em formato de coração Le Cœur Royale."
              aspectClassName="h-full w-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 12%, rgba(181,138,74,0.18), transparent 55%), linear-gradient(0deg, rgba(7,5,4,0.55) 0%, transparent 45%)",
              }}
            />
          </div>
          <ProductCursorLabel containerRef={mediaRef} label={product.cursorLabel} />

          <div className="absolute -right-4 -top-4 h-24 w-24 overflow-hidden rounded-full border border-gold/30 sm:-right-8 sm:-top-8 sm:h-28 sm:w-28">
            <ManagedVideo
              clipId="ribbon-detail"
              description="Detalhe do laço e acabamento da caixa Le Cœur Royale."
              aspectClassName="h-full w-full"
              showDebugLabel={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
