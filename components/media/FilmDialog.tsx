"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import type { Ref } from "react";

export type FilmDialogHandle = { open: () => void };

type FilmDialogProps = {
  ref?: Ref<FilmDialogHandle>;
  src: string;
  poster: string;
  /** The film's own proportion: 9:16 (the testimonial) or 16:9 (the campaign film). */
  ratio: "9/16" | "16/9";
  /** The dialog's accessible name. */
  label: string;
  caption: string;
  onOpenChange?: (open: boolean) => void;
};

/**
 * A film in full screen, with sound — a native modal <dialog> on black
 * (focus trap, Esc and focus return come from the platform), the video as
 * large as the screen allows at its own proportion. `open()` must be
 * called from the click itself: playing inside the gesture is what lets
 * browsers start it with sound. Nothing loads until then
 * (preload="none"). Every way out — the button, the dark surround, Esc —
 * pauses it and puts the page back exactly where it was; reopening
 * resumes.
 */
export default function FilmDialog({ ref, src, poster, ratio, label, caption, onOpenChange }: FilmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollYBeforeOpen = useRef(0);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  useImperativeHandle(
    ref,
    () => ({
      open() {
        const dialog = dialogRef.current;
        const video = videoRef.current;
        if (!dialog || !video || dialog.open) return;
        scrollYBeforeOpen.current = window.scrollY;
        dialog.showModal();
        document.documentElement.style.overflow = "hidden";
        // Inside the click itself — that is what lets it play with sound.
        video.play().catch(() => {});
        onOpenChangeRef.current?.(true);
      },
    }),
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Every way out (button, backdrop, Esc) ends in the dialog's own close event.
    const onClose = () => {
      videoRef.current?.pause();
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: scrollYBeforeOpen.current, behavior: "instant" });
      onOpenChangeRef.current?.(false);
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Below the close button and above the caption: 9.5rem of the height is theirs.
  const [w, h] = ratio === "9/16" ? [9, 16] : [16, 9];
  const width = `min(100%, calc((100dvh - 9.5rem) * ${w} / ${h}))`;

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClick={(event) => {
        // A click on the dark surround (the dialog itself, not its content) closes it.
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="film-dialog fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-noir p-0 text-ivory backdrop:bg-noir"
    >
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-4 px-4 pb-6 pt-20 md:pb-8 md:pt-24">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          controlsList="nodownload"
          className={`pointer-events-auto block h-auto bg-noir-soft ${ratio === "9/16" ? "aspect-[9/16]" : "aspect-video"}`}
          style={{ width }}
        >
          Seu navegador não reproduz este vídeo.
        </video>
        <p className="mono-label text-center text-champagne-light">{caption}</p>
      </div>
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        aria-label="Fechar o vídeo"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-champagne-light/50 text-champagne-light transition-colors hover:border-champagne-light hover:text-ivory md:right-8 md:top-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </dialog>
  );
}
