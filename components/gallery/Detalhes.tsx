"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { detalhes } from "@/data/content";
import { detailGallery } from "@/data/campaign-photos";
import DetailLightbox from "./DetailLightbox";
import Reveal from "@/components/motion/Reveal";

/**
 * DETALHES — a short gallery of finishing, proportion and packaging. On
 * phones it is a native horizontal strip (scroll-snap, the browser's own
 * momentum — vertical scrolling is never captured) with arrow buttons for
 * anyone not swiping; from 1024px, a plain three-column grid. Any photo
 * opens the lightbox, which grows out of it and steps by swipe, arrows or
 * keys.
 */
export default function Detalhes() {
  const stripRef = useRef<HTMLUListElement>(null);
  const [lightbox, setLightbox] = useState<{ index: number; origin: DOMRect | null } | null>(null);

  function open(index: number, event: MouseEvent<HTMLElement>) {
    setLightbox({ index, origin: event.currentTarget.getBoundingClientRect() });
  }

  function scrollStrip(direction: 1 | -1) {
    const strip = stripRef.current;
    const item = strip?.querySelector("li");
    if (!strip || !item) return;
    strip.scrollBy({ left: direction * (item.getBoundingClientRect().width + 16), behavior: "smooth" });
  }

  return (
    <section id="detalhes" className="relative border-t border-champagne-light/10 bg-noir py-20 md:py-28" aria-labelledby="detalhes-title">
      <div className="container-lga">
        <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="mono-label text-champagne-light">{detalhes.eyebrow}</p>
            <h2 id="detalhes-title" className="mt-3 max-w-xl text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] text-ivory">
              {detalhes.title}
            </h2>
          </div>
          <div className="flex shrink-0 gap-2 lg:hidden">
            <StripButton direction={-1} onClick={() => scrollStrip(-1)} />
            <StripButton direction={1} onClick={() => scrollStrip(1)} />
          </div>
        </Reveal>
      </div>

      <Reveal className="lg:mx-auto lg:max-w-[1360px] lg:px-12">
        <ul
          ref={stripRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] md:scroll-px-12 md:px-12 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Galeria de detalhes"
        >
          {detailGallery.map((photo, i) => (
            <li key={photo.src} className="w-[78vw] max-w-[360px] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <button type="button" onClick={(event) => open(i, event)} aria-label={`Ampliar: ${photo.label} — ${photo.caption}`} className="group block w-full text-left">
                <span className="relative block aspect-[4/5] overflow-hidden bg-noir-soft">
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 78vw, 400px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    style={{ objectPosition: photo.position }}
                  />
                </span>
                <span className="mt-3 block">
                  <span className="mono-label block text-champagne-light transition-colors group-hover:text-ivory">{photo.label}</span>
                  <span className="mt-1.5 block font-sans text-[0.9rem] leading-snug text-ivory/80">{photo.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <DetailLightbox
        title="Lê Grand Amour"
        photos={detailGallery}
        index={lightbox?.index ?? null}
        originRect={lightbox?.origin ?? null}
        onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}

function StripButton({ direction, onClick }: { direction: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction < 0 ? "Fotos anteriores" : "Próximas fotos"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne-light/50 text-champagne-light transition-colors hover:border-champagne-light hover:text-ivory active:border-champagne-light active:text-ivory"
    >
      <span aria-hidden="true">{direction < 0 ? "←" : "→"}</span>
    </button>
  );
}
