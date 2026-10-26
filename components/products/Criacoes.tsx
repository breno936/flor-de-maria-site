"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { findOption, products, type Product } from "@/data/products";
import { criacoes } from "@/data/content";
import { productGalleries } from "@/data/campaign-photos";
import { formatPrice, fromPrice, pricesConfirmed } from "@/lib/price";
import { setChosenVersion } from "@/lib/ui/chosenVersion";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import DetailLightbox from "@/components/gallery/DetailLightbox";
import Reveal from "@/components/motion/Reveal";
import PhotoCarousel from "./PhotoCarousel";

/**
 * CRIAÇÕES (e valores). Lê Bouquet and Lê Cœur Royale, one card each —
 * photograph, name, price, one line, three facts, the versions with their
 * prices and "Pedir pelo WhatsApp" read as a single unit. The price shows
 * "a partir de" the cheapest version until one is chosen, then that
 * version's; the WhatsApp message carries the choice.
 *
 * From 768px (the approved desktop) each creation is one row — photo
 * beside its information, sides alternating — and the photo opens the
 * lightbox. On phones the card is compact and continuous: the four
 * photographs as a swipe gallery, the information right under it, the
 * facts on one line. Nothing pins or holds the scroll; only the desktop
 * photograph has an entrance (Reveal) — prices, versions and buttons are
 * always visible. Each card carries the creation's id as its anchor, so
 * an ad can link straight to the piece it showed (/#le-coeur-royale).
 */
export default function Criacoes() {
  return (
    <section id="criacoes" className="relative bg-noir pb-16 pt-10 md:py-28" aria-labelledby="criacoes-title">
      <div className="container-lga">
        <Reveal className="mb-7 md:mb-16">
          <p className="mono-label text-champagne-light">{criacoes.eyebrow}</p>
          <h2 id="criacoes-title" className="mt-3 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] text-ivory">
            {pricesConfirmed ? "Criações e valores" : "As criações"}
          </h2>
        </Reveal>

        <div className="grid gap-16 md:gap-24 lg:gap-28">
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
  const [optionId, setOptionId] = useState<string>();
  const chosen = findOption(product, optionId);

  function open(index: number, event: MouseEvent<HTMLElement>) {
    setLightbox({ index, origin: event.currentTarget.getBoundingClientRect() });
  }

  return (
    <article
      id={product.id}
      aria-labelledby={`${product.id}-title`}
      className="grid gap-5 md:grid-cols-12 md:items-center md:gap-10 lg:gap-16"
    >
      <div className={`-mx-6 md:col-span-6 md:mx-0 lg:col-span-7 ${flipped ? "md:order-2" : ""}`}>
        <PhotoCarousel title={product.title} photos={gallery} onOpen={open} className="md:hidden" />

        <Reveal className="hidden md:block">
          <button
            type="button"
            onClick={(event) => open(0, event)}
            aria-label={`Ampliar fotos: ${product.title}`}
            className="group relative block aspect-[4/5] w-full overflow-hidden bg-noir-soft lg:aspect-auto lg:h-[min(80vh,780px)]"
          >
            <div className="reveal-zoom absolute inset-0">
              <Image
                src={main.src}
                alt={main.alt}
                fill
                sizes="(max-width: 1023px) 50vw, 760px"
                quality={80}
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                style={{ objectPosition: main.position }}
              />
            </div>
            <span className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-ivory/30 bg-noir/60 px-3.5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-colors group-hover:border-champagne-light group-hover:text-champagne-light group-focus-visible:border-champagne-light">
              {gallery.length} fotos
              <span aria-hidden="true">+</span>
            </span>
          </button>
        </Reveal>
      </div>

      <div className={`md:col-span-6 lg:col-span-5 ${flipped ? "md:order-1" : ""}`}>
        <p className="mono-label hidden text-champagne-light/85 md:block">{product.eyebrow}</p>
        <h3 id={`${product.id}-title`} className="text-[clamp(2.2rem,3.6vw,3.2rem)] leading-[1] text-ivory md:mt-2">
          {product.title}
        </h3>
        <p data-price aria-live="polite" className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 md:mt-3">
          <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.16em] text-champagne-light/85">
            {chosen ? chosen.label : "a partir de"}
          </span>{" "}
          <span className="font-display text-[clamp(1.85rem,2.6vw,2.3rem)] leading-none text-champagne-light">
            {formatPrice(chosen?.amount ?? fromPrice(product))}
          </span>
        </p>

        <p className="mt-2.5 font-display text-[1.12rem] italic leading-snug text-champagne-light md:mt-4 md:text-[1.3rem]">
          {product.tagline}
        </p>

        {/* Phones: the facts as one quiet run of text. From 768px: the approved list. */}
        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-sans text-[0.85rem] leading-snug text-ivory/75 md:mt-6 md:grid md:gap-2.5 md:border-t md:border-champagne-light/20 md:pt-5 md:text-[0.95rem] md:text-ivory/90">
          {product.facts.slice(0, 3).map((fact) => (
            <li key={fact} className="flex items-center gap-1.5 md:gap-3">
              <span className="h-1 w-1 shrink-0 rounded-full bg-champagne-light/60 md:h-px md:w-5 md:rounded-none" aria-hidden="true" />
              {fact}
            </li>
          ))}
        </ul>

        <PriceOptions
          product={product}
          value={optionId}
          onChange={(option) => {
            setOptionId(option);
            setChosenVersion({ creation: product.id, option });
          }}
        />

        <div className="mt-5 md:mt-8">
          <WhatsAppCTA creation={product.id} option={optionId} className="w-full sm:w-auto" />
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

/**
 * The versions of one creation with their prices, all visible at once —
 * a native radio group (arrow keys, one choice, read as "50 rosas,
 * R$ 1.500"), styled as a small price list. Nothing chosen by default: the
 * card says "a partir de" until the visitor picks a version.
 */
function PriceOptions({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string | undefined;
  onChange: (id: string) => void;
}) {
  const columns = product.options.length > 2 ? "grid-cols-3" : "grid-cols-2";

  return (
    // From 1024px the list stops short of the right edge, where the chapter
    // mini menu's active label runs (≥1280px).
    <fieldset className="mt-4 md:mt-7 lg:max-w-[24rem]">
      <legend className="mono-label text-champagne-light/85">{product.optionsLabel}</legend>
      <div className={`mt-2 grid ${columns} gap-2 md:mt-2.5`}>
        {product.options.map((option) => {
          const checked = option.id === value;
          return (
            <label
              key={option.id}
              className={`relative flex min-h-[48px] cursor-pointer flex-col justify-between gap-1 border px-3 py-2 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-champagne md:gap-1.5 md:py-2.5 ${
                checked
                  ? "border-champagne-light bg-champagne-light/[0.09]"
                  : "border-champagne-light/25 [@media(hover:hover)]:hover:border-champagne-light/60"
              }`}
            >
              <input
                type="radio"
                name={`${product.id}-versao`}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span className={`pr-3 font-sans text-[0.82rem] leading-tight ${checked ? "text-ivory" : "text-ivory/80"}`}>
                {option.label}
              </span>{" "}
              <span className="font-display text-[1.08rem] leading-none text-champagne-light md:text-[1.15rem]">
                {formatPrice(option.amount)}
              </span>
              {checked && (
                <span aria-hidden="true" className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-champagne-light" />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
