"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { manifesto, colecaoScene } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";

const bouquet = products.find((p) => p.id === "le-bouquet")!;
const coeur = products.find((p) => p.id === "le-coeur-royale")!;
const bouquetMedia = temporaryMedia["bouquet-assembly"]!;
const coeurMedia = temporaryMedia["coeur-assembly"]!;

/**
 * Cena 3 — "A Coleção". One staged production, not two symmetric cards:
 * both creations share a single oxblood stage, at different scales and
 * depths, with a vertical 01/02 selector that shifts focus between them
 * (click-driven for now — a scroll-linked camera move belongs to Fase 3).
 */
export default function Colecao() {
  const [active, setActive] = useState<0 | 1>(0);
  const activeProduct = active === 0 ? bouquet : coeur;

  return (
    <section id="colecao" className="relative overflow-hidden bg-oxblood py-24 md:py-32" aria-labelledby="colecao-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(216,200,168,0.08) 0%, transparent 60%), radial-gradient(70% 60% at 80% 90%, rgba(7,6,6,0.6) 0%, transparent 70%)",
        }}
      />

      <div className="container-lga relative">
        <p className="mono-label">{colecaoScene.eyebrow}</p>
        <h2 id="colecao-title" className="sr-only">
          A Coleção Le Grand Amour
        </h2>
        <p className="mt-4 max-w-md font-display text-xl italic text-champagne/90">{manifesto.title}</p>

        <div className="relative mt-16 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-6">
          {/* The stage */}
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/11]">
            <div
              aria-hidden="true"
              className="absolute inset-x-[6%] bottom-[6%] h-[10%] rounded-[100%] bg-noir/70 blur-2xl"
            />

            <button
              type="button"
              onClick={() => setActive(1)}
              aria-pressed={active === 1}
              aria-label={`Focar em ${coeur.name}`}
              className={`absolute right-[4%] top-[8%] h-[52%] w-[42%] overflow-hidden border transition-all duration-500 ease-out sm:h-[58%] sm:w-[38%] ${
                active === 1
                  ? "z-20 border-champagne/50 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  : "z-10 border-transparent opacity-55 brightness-[0.55] hover:opacity-75"
              }`}
            >
              <Image
                src={coeurMedia.temporaryImage}
                alt={active === 1 ? coeurMedia.alt : ""}
                fill
                sizes="(max-width: 1024px) 45vw, 30vw"
                className="object-cover object-center"
                data-temporary-media="true"
              />
            </button>

            <button
              type="button"
              onClick={() => setActive(0)}
              aria-pressed={active === 0}
              aria-label={`Focar em ${bouquet.name}`}
              className={`absolute bottom-0 left-0 h-[78%] w-[68%] overflow-hidden border transition-all duration-500 ease-out ${
                active === 0
                  ? "z-20 border-champagne/50 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  : "z-10 border-transparent opacity-55 brightness-[0.55] hover:opacity-75"
              }`}
            >
              <Image
                src={bouquetMedia.temporaryImage}
                alt={active === 0 ? bouquetMedia.alt : ""}
                fill
                sizes="(max-width: 1024px) 68vw, 45vw"
                className="object-cover object-center"
                data-temporary-media="true"
              />
            </button>
          </div>

          {/* Selector + active product copy */}
          <div className="lg:col-span-4">
            <ol className="flex gap-8 border-b border-champagne/15 pb-4 sm:gap-10">
              {[bouquet, coeur].map((product, i) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i as 0 | 1)}
                    aria-current={active === i}
                    className={`flex items-baseline gap-2 font-display text-lg transition-colors ${
                      active === i ? "text-ivory" : "text-ivory/45 hover:text-ivory/70"
                    }`}
                  >
                    <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                    {product.name}
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <p className="mono-label">{activeProduct.eyebrow}</p>
              <p className="mt-3 font-display text-2xl italic text-champagne">{activeProduct.tagline}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {activeProduct.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
                    <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <AtelierButton href={`?criacao=${activeProduct.id}#reserva`} variant="secondary" className="mt-8">
                {activeProduct.cta}
              </AtelierButton>
            </div>

            <AtelierButton href="#reserva" variant="primary" className="mt-10">
              {colecaoScene.cta}
            </AtelierButton>
          </div>
        </div>
      </div>
    </section>
  );
}
