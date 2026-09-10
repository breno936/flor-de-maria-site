import Image from "next/image";
import { especial } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";

const media = temporaryMedia["bouquet-assembly"]!;

/**
 * Cena 4 — "O que torna especial". The one deliberately light pause in the
 * experience: an ivory ground, a large partially-cropped photograph, and
 * four short facts arranged around it — not a paragraph, not icon cards.
 * A single oxblood line runs down the photo's inner edge (static for now;
 * the brief's point-by-point reveal-on-line-arrival is a Fase 3 effect).
 */
export default function WhatMakesItSpecial() {
  return (
    <section id="especial" className="relative bg-ivory py-24 md:py-32" aria-labelledby="especial-title">
      <div className="container-lga">
        <h2 id="especial-title" className="max-w-2xl font-display text-3xl leading-tight text-noir sm:text-4xl">
          {especial.eyebrow}
        </h2>

        <div className="relative mt-14 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-4">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[5/4] w-full overflow-hidden lg:aspect-[4/3]">
              <Image
                src={media.temporaryImage}
                alt={media.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                data-temporary-media="true"
              />
            </div>
            <div aria-hidden="true" className="absolute -right-3 top-6 bottom-6 hidden w-px bg-oxblood/70 lg:block" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:pl-6">
            {especial.facts.map((fact) => (
              <div key={fact.label}>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-oxblood">
                  {fact.label}
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-noir/70">{fact.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
