"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { filme } from "@/data/content";
import { campaignFilm } from "@/data/campaign-photos";
import AtelierButton from "@/components/ui/AtelierButton";
import Reveal from "@/components/motion/Reveal";
import FilmDialog, { type FilmDialogHandle } from "@/components/media/FilmDialog";
import SilentLoop from "@/components/media/SilentLoop";
import PlayIcon from "@/components/media/PlayIcon";

const { poster } = campaignFilm;

/**
 * FILME — the campaign film, between the creations and the details: after
 * the prices, a moment of pure image before the closer look. A wide 16:9
 * frame that moves on its own, silently, while it is on screen
 * (SilentLoop — 20 s of the film's own shots); a tap or "Assistir ao
 * filme" opens the whole film (1:00) full screen with sound, from the
 * start (FilmDialog). Nothing of the film itself loads before that.
 *
 * Phones: the frame runs edge to edge under a one-line heading, with a
 * light text action below — under half a screen. From 768px: heading and
 * button on one row above the frame.
 */
export default function Filme() {
  const filmRef = useRef<FilmDialogHandle>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const open = () => filmRef.current?.open();
  const label = `${filme.cta}: ${filme.title} (${campaignFilm.durationLabel}, com som)`;

  return (
    <section id="filme" className="relative border-t border-champagne-light/10 bg-noir py-14 md:py-28" aria-labelledby="filme-title">
      <div className="container-lga">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mono-label text-champagne-light">{filme.eyebrow}</p>
            <h2 id="filme-title" className="mt-2 text-[1.9rem] leading-[1.02] text-ivory md:mt-3 md:text-[clamp(2.2rem,4vw,3.6rem)]">
              {filme.title}
            </h2>
          </div>
          <div className="hidden shrink-0 text-right md:block">
            <AtelierButton onClick={open} aria-label={label}>
              {filme.cta}
            </AtelierButton>
            <p className="mt-3 font-sans text-[0.85rem] text-ivory/70">{campaignFilm.durationLabel} · com som</p>
          </div>
        </div>

        <Reveal className="-mx-6 mt-5 md:mx-0 md:mt-10">
          <button
            type="button"
            onClick={open}
            aria-label={label}
            className="group relative block aspect-video w-full overflow-hidden bg-noir-soft"
            style={{ backgroundImage: `url(${poster.blur})`, backgroundSize: "cover" }}
          >
            <div className="reveal-zoom absolute inset-0">
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]">
                <Image src={poster.src} alt="" fill sizes="(max-width: 1359px) 100vw, 1264px" quality={80} className="object-cover" />
                <SilentLoop src={campaignFilm.teaser} paused={filmOpen} />
              </div>
            </div>
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/45 via-transparent to-transparent" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-champagne-light/80 bg-noir/45 text-champagne-light backdrop-blur-sm transition-colors duration-300 group-hover:bg-champagne-light group-hover:text-noir group-focus-visible:bg-champagne-light group-focus-visible:text-noir md:h-20 md:w-20"
            >
              <PlayIcon />
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-2.5 right-2.5 rounded-full border border-ivory/30 bg-noir/60 px-2.5 py-1 font-sans text-[10px] font-medium tracking-[0.12em] text-ivory backdrop-blur-sm md:bottom-5 md:right-5 md:px-3.5 md:py-2"
            >
              {campaignFilm.duration}
            </span>
          </button>
        </Reveal>

        {/* Phones: a light text action under the frame (the frame is the main one). */}
        <button
          type="button"
          onClick={open}
          aria-label={label}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2.5 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-champagne-light md:hidden"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne-light/70" aria-hidden="true">
            <PlayIcon small />
          </span>
          {filme.cta}
          <span className="font-normal normal-case tracking-normal text-ivory/60">· {campaignFilm.durationLabel}, com som</span>
        </button>
      </div>

      <FilmDialog
        ref={filmRef}
        src={campaignFilm.src}
        poster={poster.src}
        ratio="16/9"
        label={`${filme.title}: o filme`}
        caption={`${filme.title} — o filme da coleção`}
        onOpenChange={setFilmOpen}
      />
    </section>
  );
}
