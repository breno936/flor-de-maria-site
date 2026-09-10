import Image from "next/image";
import { ritual } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";

const media = temporaryMedia["ribbon-detail"]!;

/**
 * Cena 5 — "O Ritual". One full-bleed macro scene (hands, ribbon,
 * medallion), a single headline, and a four-stage line at the bottom —
 * not a list of nine clickable steps. Static for Fase 1; the pin +
 * scroll-linked video progression is a Fase 3 effect once real footage
 * or the thread system is in place.
 */
export default function CreationRitual() {
  return (
    <section
      id="ritual"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-noir"
      aria-labelledby="ritual-title"
    >
      <Image
        src={media.temporaryImage}
        alt={media.alt}
        fill
        sizes="100vw"
        className="object-cover"
        data-temporary-media="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(7,6,6,0.92) 0%, rgba(7,6,6,0.55) 42%, rgba(7,6,6,0.35) 70%, rgba(7,6,6,0.6) 100%)",
        }}
      />

      <p className="mono-label absolute left-6 top-24 md:left-12 md:top-28">{ritual.eyebrow}</p>
      <p className="mono-label absolute right-6 top-24 max-w-[10rem] text-right md:right-12 md:top-28">
        {ritual.caption}
      </p>

      <div className="container-lga relative w-full pb-16 pt-24 md:pb-24">
        <h2 id="ritual-title" className="max-w-2xl font-display text-4xl leading-tight text-ivory sm:text-5xl">
          {ritual.title}
        </h2>

        <ol className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-4 sm:gap-x-5">
          {ritual.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3 sm:gap-5">
              <span className="flex items-baseline gap-2 font-sans text-xs uppercase tracking-[0.18em] text-champagne">
                <span className="mono-label text-rouge">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </span>
              {i < ritual.steps.length - 1 && (
                <span className="text-champagne/40" aria-hidden="true">
                  &rarr;
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
