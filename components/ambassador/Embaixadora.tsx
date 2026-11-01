"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { embaixadora } from "@/data/content";
import { ambassadorFilm } from "@/data/campaign-photos";
import AtelierButton from "@/components/ui/AtelierButton";
import Reveal from "@/components/motion/Reveal";

const { poster } = ambassadorFilm;

/**
 * EMBAIXADORA — Patrícia Marchi and her video testimonial, between the
 * details and the closing. The block itself is only a cover and two
 * lines; the film (2:35, with sound) opens in a full-screen native
 * <dialog> — focus trap, Esc and focus return come from the platform —
 * and starts in the same click, so browsers let it play with sound.
 * Nothing of the film loads until then (preload="none"). Closing pauses
 * it and puts the page back exactly where it was; reopening resumes.
 *
 * Phones: a compact row — the vertical cover beside the name — so the
 * block costs under half a screen. From 768px: the text on the left and a
 * 4:5 cover on the right (clear of the chapter mini menu's labels), with
 * the same entrance as the creations' photographs.
 */
export default function Embaixadora() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollYBeforeOpen = useRef(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Every way out (button, backdrop, Esc) ends in the dialog's own close event.
    const onClose = () => {
      videoRef.current?.pause();
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: scrollYBeforeOpen.current, behavior: "instant" });
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  function open() {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video || dialog.open) return;
    scrollYBeforeOpen.current = window.scrollY;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    // Inside the click itself — that is what lets it play with sound.
    video.play().catch(() => {});
  }

  function close() {
    dialogRef.current?.close();
  }

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
            type="button"
            onClick={open}
            aria-label={label}
            className="group relative block aspect-[9/16] w-full overflow-hidden bg-noir-soft md:aspect-[4/5]"
            style={{ backgroundImage: `url(${poster.blur})`, backgroundSize: "cover", backgroundPosition: "50% 30%" }}
          >
            <div className="reveal-zoom absolute inset-0">
              <Image
                src={poster.src}
                alt=""
                fill
                sizes="(max-width: 767px) 42vw, (max-width: 1023px) 40vw, 400px"
                quality={80}
                className="object-cover object-[50%_30%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </div>
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/55 via-transparent to-transparent" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center md:top-[66%] justify-center rounded-full border border-champagne-light/80 bg-noir/45 text-champagne-light backdrop-blur-sm transition-colors duration-300 group-hover:bg-champagne-light group-hover:text-noir group-focus-visible:bg-champagne-light group-focus-visible:text-noir md:h-16 md:w-16"
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

      <dialog
        ref={dialogRef}
        aria-label={`${embaixadora.name}: depoimento em vídeo`}
        onClick={(event) => {
          // A click on the dark surround (the dialog itself, not its content) closes it.
          if (event.target === event.currentTarget) close();
        }}
        className="embaixadora-dialog fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-noir p-0 text-ivory backdrop:bg-noir"
      >
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-4 px-4 pb-6 pt-20 md:pb-8 md:pt-24">
          <video
            ref={videoRef}
            src={ambassadorFilm.src}
            poster={poster.src}
            controls
            playsInline
            preload="none"
            controlsList="nodownload"
            className="pointer-events-auto block aspect-[9/16] h-auto bg-noir-soft"
            style={{ width: "min(100%, calc((100dvh - 9.5rem) * 9 / 16))" }}
          >
            Seu navegador não reproduz este vídeo.
          </video>
          <p className="mono-label text-center text-champagne-light">{embaixadora.name} — embaixadora da coleção</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Fechar o vídeo"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-champagne-light/50 text-champagne-light transition-colors hover:border-champagne-light hover:text-ivory md:right-8 md:top-6"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </dialog>
    </section>
  );
}

function PlayIcon({ small = false }: { small?: boolean }) {
  const size = small ? 9 : 14;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className="translate-x-[1px]">
      <path d="M2.5 1.5v9l7-4.5-7-4.5Z" fill="currentColor" />
    </svg>
  );
}
