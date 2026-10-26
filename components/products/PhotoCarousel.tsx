"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/data/campaign-photos";

type PhotoCarouselProps = {
  title: string;
  photos: GalleryPhoto[];
  className?: string;
  onOpen: (index: number, event: MouseEvent<HTMLElement>) => void;
};

/**
 * Phones: a creation's four photographs as a native swipe gallery — one
 * frame per screen width, scroll-snap and the browser's own momentum, so a
 * vertical swipe always scrolls the page and nothing is ever held. Dots
 * and "1 / 4" say where you are (the dots also step to a photo); a tap
 * opens the full-screen lightbox on that frame. No JS motion of its own,
 * so there is nothing to clean up or to conflict on resize — from 768px
 * the card shows its single photograph instead (see Criacoes).
 */
export default function PhotoCarousel({ title, photos, className = "", onOpen }: PhotoCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const index = Math.round(list.scrollLeft / Math.max(1, list.clientWidth));
      setActive(Math.min(photos.length - 1, Math.max(0, index)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [photos.length]);

  function go(index: number) {
    const list = listRef.current;
    if (!list) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: index * list.clientWidth, behavior: reduced ? "instant" : "smooth" });
  }

  return (
    <div className={`relative ${className}`}>
      <ul
        ref={listRef}
        aria-label={`Fotos: ${title}`}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <li key={photo.src} className="w-full shrink-0 snap-center [scroll-snap-stop:always]">
            <button
              type="button"
              onClick={(event) => onOpen(i, event)}
              className="relative block aspect-square max-h-[46svh] w-full overflow-hidden bg-noir-soft"
            >
              <span className="sr-only">
                Ampliar foto {i + 1} de {photos.length}:{" "}
              </span>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                quality={80}
                draggable={false}
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-noir/60 to-transparent px-3 pb-2 pt-12">
        <div className="pointer-events-auto flex items-center">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver foto ${i + 1} de ${photos.length}`}
              aria-current={i === active ? "true" : undefined}
              className="flex h-9 w-7 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  i === active ? "w-4 bg-champagne-light" : "w-1.5 bg-ivory/60"
                }`}
              />
            </button>
          ))}
        </div>
        <span
          aria-hidden="true"
          className="mb-1.5 mr-1 rounded-full border border-ivory/30 bg-noir/60 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm"
        >
          {active + 1} / {photos.length}
        </span>
      </div>
    </div>
  );
}
