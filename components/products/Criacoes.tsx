"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { products, type Product } from "@/data/products";
import { criacoes } from "@/data/content";
import { productGalleries } from "@/data/campaign-photos";
import { formatPrice, pricesConfirmed } from "@/lib/price";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import DetailLightbox from "@/components/gallery/DetailLightbox";
import Reveal from "@/components/motion/Reveal";

/**
 * CRIAÇÕES (e valores). Lê Bouquet and Lê Cœur Royale, one card each —
 * photograph of the whole piece, name, price, one line, three facts and
 * "Pedir pelo WhatsApp" read as a single unit: from 768px each creation is
 * one row (photo beside its information, sides alternating), so the whole
 * set fits one screen; on phones, a square photo with the information
 * right under it. Nothing pins or holds the scroll; only the photograph
 * has an entrance (Reveal), the commercial information is always visible.
 * Each card carries the creation's id as its anchor, so an ad can link
 * straight to the piece it showed (/#le-coeur-royale).
 */
export default function Criacoes() {
  return (
    <section id="criacoes" className="relative bg-noir py-20 md:py-28" aria-labelledby="criacoes-title">
      <div className="container-lga">
        <Reveal className="mb-12 md:mb-16">
          <p className="mono-label text-champagne-light">{criacoes.eyebrow}</p>
          <h2 id="criacoes-title" className="mt-3 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] text-ivory">
            {pricesConfirmed ? "Criações e valores" : "As criações"}
          </h2>
        </Reveal>

        <div className="grid gap-20 md:gap-24 lg:gap-28">
          {products.map((product, i) => (
            <CreationCard key={product.id} product={product} flipped={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CreationCard({ product, flipped }: { product: Product; flipped: boolean }) {
  const gallery = productGalleries[product.id];
  const main = gallery[0];
  const [lightbox, setLightbox] = useState<{ index: number; origin: DOMRect | null } | null>(null);

  function open(event: MouseEvent<HTMLElement>) {
    setLightbox({ index: 0, origin: event.currentTarget.getBoundingClientRect() });
  }

  return (
    <article
      id={product.id}
      aria-labelledby={`${product.id}-title`}
      className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10 lg:gap-16"
    >
      <Reveal className={`-mx-6 md:col-span-6 md:mx-0 lg:col-span-7 ${flipped ? "md:order-2" : ""}`}>
        <button
          type="button"
          onClick={open}
          aria-label={`Ampliar fotos: ${product.title}`}
          className="group relative block aspect-square w-full overflow-hidden bg-noir-soft md:aspect-[4/5] lg:aspect-auto lg:h-[min(80vh,780px)]"
        >
          <div className="reveal-zoom absolute inset-0">
            <Image
              src={main.src}
              alt={main.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 760px"
              quality={80}
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              style={{ objectPosition: main.position }}
            />
          </div>
          <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-ivory/30 bg-noir/60 px-3.5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-colors group-hover:border-champagne-light group-hover:text-champagne-light group-focus-visible:border-champagne-light md:bottom-5 md:right-5">
            {gallery.length} fotos
            <span aria-hidden="true">+</span>
          </span>
        </button>
      </Reveal>

      <div className={`md:col-span-6 lg:col-span-5 ${flipped ? "md:order-1" : ""}`}>
        <p className="mono-label text-champagne-light/85">{product.eyebrow}</p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 id={`${product.id}-title`} className="text-[clamp(2.2rem,3.6vw,3.2rem)] leading-[1] text-ivory">
            {product.title}
          </h3>
          {product.price && (
            <p className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-none text-champagne-light">
              {product.price.from && (
                <span className="mr-2 font-sans text-[0.72rem] font-medium uppercase tracking-[0.16em] text-champagne-light/85">
                  a partir de
                </span>
              )}
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        <p className="mt-4 font-display text-[1.3rem] italic leading-snug text-champagne-light">{product.tagline}</p>

        <ul className="mt-5 grid gap-2 border-t border-champagne-light/20 pt-4 md:mt-6 md:gap-2.5 md:pt-5">
          {product.facts.slice(0, 3).map((fact) => (
            <li key={fact} className="flex items-center gap-3 font-sans text-[0.95rem] text-ivory/90">
              <span className="h-px w-5 shrink-0 bg-champagne-light/60" aria-hidden="true" />
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-7 md:mt-8">
          <WhatsAppCTA creation={product.id} className="w-full sm:w-auto" />
          {product.priceNote && <p className="mt-3 font-sans text-[0.85rem] text-ivory/70">{product.priceNote}</p>}
        </div>
      </div>

      <DetailLightbox
        title={product.title}
        photos={gallery}
        index={lightbox?.index ?? null}
        originRect={lightbox?.origin ?? null}
        onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        onClose={() => setLightbox(null)}
      />
    </article>
  );
}
