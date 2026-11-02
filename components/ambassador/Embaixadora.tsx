"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { embaixadora } from "@/data/content";
import { ambassadorFilm } from "@/data/campaign-photos";
import AtelierButton from "@/components/ui/AtelierButton";
import Reveal from "@/components/motion/Reveal";
import FilmDialog, { type FilmDialogHandle } from "@/components/media/FilmDialog";
import SilentLoop from "@/components/media/SilentLoop";
import PlayIcon from "@/components/media/PlayIcon";

const { poster } = ambassadorFilm;

/**
 * EMBAIXADORA — Patrícia Marchi and her video testimonial, between the
 * details and the closing. The block itself is only a cover and two
 * lines; the cover grows into the player (2:35, with sound — FilmDialog)
 * and the film starts in the same click. While the block is on screen the cover itself
 * moves — a short silent loop cut from the film (SilentLoop), held while
 * the film is open.
 *
 * Phones: a compact row — the vertical cover beside the name — so the
 * block costs under half a screen. From 768px: the text on the left and a
 * 4:5 cover on the right (clear of the chapter mini menu's labels), with
 * the same entrance as the creations' photographs.
 */
export default function Embaixadora() {
  const filmRef = useRef<FilmDialogHandle>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  // The player always grows out of the cover; focus returns to whichever button was pressed.
  const open = (event: MouseEvent<HTMLElement>) => filmRef.current?.open({ from: coverRef.current, opener: event.currentTarget });
  const label = `${embaixadora.cta}: ${embaixadora.name} (${ambassadorFilm.durationLabel}, com som)`;

  return (
    <section
      id="embaixadora"
      className="relative border-t border-champagne-light/10 bg-noir py-14 md:py-28"
      aria-labelledby="embaixadora-title"
    >
      <div className="container-lga grid grid-cols-[minmax(0,42%)_minmax(0,1fr)] items-center gap-5 md:grid-cols-12 md:gap-10 lg:gap-16">
        <Reveal className="md:order-2 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8">
          <button
            ref={coverRef}
            type="button"
            onClick={open}
            aria-label={label}
            className="group relative block aspect-[9/16] w-full overflow-hidden bg-noir-soft md:aspect-[4/5]"
            style={{ backgroundImage: `url(${poster.blur})`, backgroundSize: "cover", backgroundPosition: "50% 30%" }}
          >
            <div className="reveal-zoom absolute inset-0">
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                <Image
                  src={poster.src}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 42vw, (max-width: 1023px) 40vw, 400px"
                  quality={80}
                  className="object-cover object-[50%_30%]"
                />
                <SilentLoop src={ambassadorFilm.teaser} paused={filmOpen} position="50% 30%" />
              </div>
            </div>
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/55 via-transparent to-transparent" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[66%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-champagne-light/80 bg-noir/45 text-champagne-light backdrop-blur-sm transition-colors duration-300 group-hover:bg-champagne-light group-hover:text-noir group-focus-visible:bg-champagne-light group-focus-visible:text-noir md:h-16 md:w-16"
            >
              <PlayIcon />
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-2.5 right-2.5 rounded-full border border-ivory/30 bg-noir/60 px-2.5 py-1 font-sans text-[10px] font-medium tracking-[0.12em] text-ivory backdrop-blur-sm md:bottom-5 md:right-5 md:px-3.5 md:py-2"
            >
              {ambassadorFilm.duration}
            </span>
          </button>
        </Reveal>

        <div className="md:order-1 md:col-span-6 md:col-start-1 lg:col-span-5 lg:col-start-2">
          <p className="mono-label text-champagne-light">{embaixadora.eyebrow}</p>
          <h2 id="embaixadora-title" className="mt-2 text-[1.9rem] leading-[1.02] text-ivory md:mt-3 md:text-[clamp(2.4rem,4.4vw,4.2rem)]">
            {embaixadora.name}
          </h2>
          <p className="mt-3 font-display text-[1.05rem] italic leading-snug text-champagne-light md:mt-5 md:text-[1.35rem]">
            {embaixadora.role}
          </p>

          {/* Phones: a light text action (the cover is the main one). */}
          <button
            type="button"
            onClick={open}
            aria-label={label}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2.5 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-champagne-light md:hidden"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne-light/70" aria-hidden="true">
              <PlayIcon small />
            </span>
            Assistir
          </button>
          <div className="mt-8 hidden md:block">
            <AtelierButton onClick={open} aria-label={label}>
              {embaixadora.cta}
            </AtelierButton>
            <p className="mt-3 font-sans text-[0.85rem] text-ivory/70">{ambassadorFilm.durationLabel} · com som</p>
          </div>
        </div>
      </div>

      <FilmDialog
        ref={filmRef}
        src={ambassadorFilm.src}
        poster={poster.src}
        blur={poster.blur}
        ratio="9/16"
        coverPosition="50% 30%"
        label={`${embaixadora.name}: depoimento em vídeo`}
        caption={`${embaixadora.name} — embaixadora da coleção`}
        onOpenChange={setFilmOpen}
      />
    </section>
  );
}
