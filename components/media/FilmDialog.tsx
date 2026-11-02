"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { CSSProperties, Ref } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import PlayIcon from "./PlayIcon";

export type FilmDialogHandle = {
  /**
   * Opens the film. `from` is the cover it grows out of and shrinks back
   * into; `opener` is the button that was pressed, which gets the focus back.
   */
  open: (origin: { from: HTMLElement | null; opener: HTMLElement | null }) => void;
};

type FilmDialogProps = {
  ref?: Ref<FilmDialogHandle>;
  src: string;
  poster: string;
  /** A tiny blurred copy of the cover, painted under the frame from the very first frame. */
  blur?: string;
  /** The film's own proportion: 9:16 (the testimonial) or 16:9 (the campaign film). */
  ratio: "9/16" | "16/9";
  /** The cover's object-position, so the first frame of the opening crops exactly like it. */
  coverPosition?: string;
  /** The dialog's accessible name. */
  label: string;
  caption: string;
  onOpenChange?: (open: boolean) => void;
};

type Phase = "loading" | "ready" | "blocked" | "error";

const OPEN_S = 0.42;
const CLOSE_S = 0.36;
const EASE_OPEN = "power3.out";
const EASE_CLOSE = "power2.inOut";
/** The clip at rest: past the frame's edges, so its hairline and shadow show. */
const CLIP_OPEN = "inset(-120px -120px -120px -120px)";
const FRAME_PROPS = "transform,transformOrigin,clipPath,opacity";

/**
 * A film in a frame over the page, with sound — the cover that was pressed
 * grows into the player and shrinks back into it on close (FLIP: the frame
 * is laid out at its final size and animated, with one uniform scale and a
 * clip, from the cover's box; the image never stretches, and a 4:5 cover
 * opens out to the full 9:16 picture from its own crop). Behind it the page
 * darkens progressively and, from 768px, blurs slightly, staying faintly
 * visible.
 *
 * The cover's own image (already loaded) holds the frame until the film
 * has its first frame on screen, then the film fades in over it — no black
 * frame while loading. Playback starts inside the click, which is what
 * lets browsers play with sound; if one still refuses, a clear "Reproduzir"
 * button takes over. Closing pauses at once, shrinks back to the cover,
 * restores the scroll exactly and gives the focus back to the button that
 * opened it. Native modal <dialog>: focus stays inside, Esc closes.
 * Reduced motion: the same, without the movement.
 *
 * The frame is sized by the available height, caption included, and never
 * wider than the screen minus a small margin; a thin champagne rule and a
 * soft shadow give it its edge. The close button sits at the frame's top
 * corner — outside it, beside the corner, for the vertical film from
 * 768px; inside it elsewhere — always 44 × 44 px.
 */
export default function FilmDialog({ ref, src, poster, blur, ratio, coverPosition = "50% 50%", label, caption, onOpenChange }: FilmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLCanvasElement>(null);
  const origin = useRef<{ from: HTMLElement | null; opener: HTMLElement | null }>({ from: null, opener: null });
  const scrollYBeforeOpen = useRef(0);
  const closing = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const slowTimer = useRef(0);
  const onOpenChangeRef = useRef(onOpenChange);
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [slow, setSlow] = useState(false);
  const [coverSrc, setCoverSrc] = useState("");
  const portrait = ratio === "9/16";

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  // The film is on screen once its first frame is painted, not merely "playing".
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlaying = () => {
      if (typeof video.requestVideoFrameCallback === "function") video.requestVideoFrameCallback(() => setPhase("ready"));
      else setPhase("ready");
    };
    const onError = () => setPhase("error");
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
    };
  }, []);

  /** Where the frame must start (or end) to sit exactly on the cover, cropped like it. */
  function coverPose() {
    const frame = frameRef.current;
    const from = origin.current.from;
    if (!frame || !from) return null;
    const c = from.getBoundingClientRect();
    if (c.width < 2 || c.bottom < 0 || c.top > window.innerHeight) return null;
    // The frame's place at rest: its untransformed parent starts where it does (even mid-animation).
    const f = (frame.parentElement ?? frame).getBoundingClientRect();
    const fw = frame.offsetWidth;
    const fh = frame.offsetHeight;
    const s = Math.max(c.width / fw, c.height / fh);
    const [px, py] = coverPosition.split(" ").map((v) => parseFloat(v) / 100);
    const ox = fw * s - c.width;
    const oy = fh * s - c.height;
    return {
      x: c.left - ox * px - f.left,
      y: c.top - oy * py - f.top,
      scale: s,
      clipPath: `inset(${(oy * py) / s}px ${(ox * (1 - px)) / s}px ${(oy * (1 - py)) / s}px ${(ox * px) / s}px)`,
    };
  }

  function play() {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch((error: DOMException) => {
      if (error.name === "NotAllowedError") setPhase("blocked");
    });
  }

  useImperativeHandle(
    ref,
    () => ({
      open({ from, opener }) {
        const dialog = dialogRef.current;
        const video = videoRef.current;
        if (!dialog || !video || dialog.open) return;
        origin.current = { from, opener };
        closing.current = false;
        scrollYBeforeOpen.current = window.scrollY;
        const img = from?.querySelector("img");
        setCoverSrc(img?.currentSrc || poster);
        setPhase("loading");
        setSlow(false);
        // Still loading after a moment: a quiet ring over the cover image.
        window.clearTimeout(slowTimer.current);
        slowTimer.current = window.setTimeout(() => setSlow(true), 600);

        dialog.showModal();
        timeline.current?.kill();
        const pose = reducedMotion ? null : coverPose();
        document.documentElement.style.overflow = "hidden";
        closeRef.current?.focus({ preventScroll: true });
        // Inside the click itself — that is what lets it play with sound.
        play();
        onOpenChangeRef.current?.(true);
        if (from && pose) from.style.visibility = "hidden";
        const tl = gsap.timeline();
        if (reducedMotion) {
          tl.set([shadeRef.current, chromeRef.current], { opacity: 1 });
        } else {
          tl.fromTo(shadeRef.current, { opacity: 0 }, { opacity: 1, duration: OPEN_S, ease: "power2.out" }, 0);
          if (pose) {
            tl.fromTo(
              frameRef.current,
              { ...pose, transformOrigin: "0 0" },
              { x: 0, y: 0, scale: 1, clipPath: CLIP_OPEN, duration: OPEN_S, ease: EASE_OPEN },
              0,
            );
          } else {
            tl.fromTo(frameRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: OPEN_S, ease: EASE_OPEN }, 0);
          }
          tl.fromTo(chromeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.out" }, OPEN_S * 0.6);
        }
        tl.set(frameRef.current, { clearProps: FRAME_PROPS });
        timeline.current = tl;
      },
    }),
  );

  /** Every way out — the button, the surround, Esc — comes through here first. */
  function requestClose() {
    const dialog = dialogRef.current;
    if (!dialog?.open || closing.current) return;
    closing.current = true;
    // Sound stops now, not after the animation.
    const video = videoRef.current;
    video?.pause();
    timeline.current?.kill();
    // The film and its controls leave the frame at once; a still of its current picture takes
    // its place and dissolves into the cover image while the frame shrinks.
    const still = stillRef.current;
    let hasStill = false;
    if (video && still && phase === "ready" && video.readyState >= 2) {
      try {
        still.width = Math.round(still.clientWidth * window.devicePixelRatio);
        still.height = Math.round(still.clientHeight * window.devicePixelRatio);
        still.getContext("2d")?.drawImage(video, 0, 0, still.width, still.height);
        hasStill = true;
      } catch {
        hasStill = false;
      }
    }
    gsap.set(still, { opacity: hasStill ? 1 : 0 });
    gsap.set(video, { visibility: "hidden" });
    if (reducedMotion) {
      dialog.close();
      return;
    }
    const pose = coverPose();
    // The cover comes back now, under the shade, so it is already painted when the frame
    // lands on it — shown only at the end, it can take a few frames to appear (a gap).
    const from = origin.current.from;
    if (from) from.style.visibility = "";
    const tl = gsap.timeline({ onComplete: () => dialog.close() });
    tl.to(chromeRef.current, { opacity: 0, duration: 0.12, ease: "power1.in" }, 0);
    // Back to the cover image while shrinking, so it lands on the cover as it was.
    if (hasStill) tl.to(still, { opacity: 0, duration: 0.24, ease: "power1.inOut" }, 0.06);
    if (pose) {
      tl.set(frameRef.current, { clipPath: CLIP_OPEN }, 0);
      tl.to(frameRef.current, { ...pose, transformOrigin: "0 0", duration: CLOSE_S, ease: EASE_CLOSE }, 0.06);
    } else {
      tl.to(frameRef.current, { opacity: 0, scale: 0.96, duration: CLOSE_S, ease: EASE_CLOSE }, 0.06);
    }
    tl.to(shadeRef.current, { opacity: 0, duration: CLOSE_S, ease: "power2.in" }, 0.06);
    timeline.current = tl;
  }

  // The dialog's own close event: the one place the page is put back,
  // however it closed (also if the browser closed it without asking).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      window.clearTimeout(slowTimer.current);
      timeline.current?.kill();
      timeline.current = null;
      closing.current = false;
      videoRef.current?.pause();
      gsap.set(frameRef.current, { clearProps: FRAME_PROPS });
      gsap.set([shadeRef.current, chromeRef.current, stillRef.current], { clearProps: "opacity" });
      gsap.set(videoRef.current, { clearProps: "visibility" });
      const { from, opener } = origin.current;
      if (from) from.style.visibility = "";
      document.documentElement.style.overflow = "";
      window.scrollTo({ top: scrollYBeforeOpen.current, behavior: "instant" });
      opener?.focus({ preventScroll: true });
      onOpenChangeRef.current?.(false);
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      window.clearTimeout(slowTimer.current);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const frameStyle = { "--film-ratio": ratio.replace("/", " / ") } as CSSProperties;
  const closeButtonPlace = portrait
    ? "right-2 top-2 bg-noir/55 md:-right-3 md:top-0 md:translate-x-full md:bg-transparent"
    : "right-2 top-2 bg-noir/55 md:right-3 md:top-3";

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-ivory backdrop:bg-transparent"
    >
      {/* The page behind: darkened, and from 768px slightly blurred (phones: a deeper shade
          instead of the blur, which costs too much there). A click on it closes. */}
      <div
        ref={shadeRef}
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 bg-noir/[0.93] md:bg-noir/[0.78] md:backdrop-blur-[6px]"
      />

      <div className="film-stage pointer-events-none relative flex h-full w-full flex-col items-center justify-center">
        <div className="relative">
          <div
            ref={frameRef}
            style={{ ...frameStyle, backgroundImage: blur ? `url(${blur})` : undefined }}
            aria-busy={phase === "loading"}
            className="film-frame pointer-events-auto relative overflow-hidden bg-noir-soft bg-cover bg-center shadow-[0_32px_90px_-28px_rgba(0,0,0,0.9)] ring-1 ring-champagne-light/25"
          >
            {/* The cover's own image (already loaded) holds the frame until the film's first frame is up. */}
            {coverSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverSrc} alt="" aria-hidden="true" decoding="sync" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <video
              ref={videoRef}
              src={src}
              controls={phase === "ready"}
              playsInline
              preload="none"
              controlsList="nodownload"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${phase === "ready" ? "opacity-100" : "opacity-0"}`}
            >
              Seu navegador não reproduz este vídeo.
            </video>
            <canvas ref={stillRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />

            {phase === "loading" && slow && (
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 motion-safe:animate-spin rounded-full border border-champagne-light/25 border-t-champagne-light" />
            )}
            {phase === "blocked" && (
              <button
                type="button"
                onClick={play}
                className="absolute left-1/2 top-1/2 flex min-h-[44px] -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-champagne-light/80 bg-noir/60 px-5 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-champagne-light backdrop-blur-sm"
              >
                <PlayIcon small />
                Reproduzir com som
              </button>
            )}
            {phase === "error" && (
              <p role="alert" className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center font-sans text-[0.9rem] text-ivory/90">
                Não foi possível carregar o vídeo agora.
              </p>
            )}
          </div>

          <div ref={chromeRef}>
            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              aria-label="Fechar o vídeo"
              className={`pointer-events-auto absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border border-champagne-light/60 text-champagne-light backdrop-blur-sm transition-colors hover:border-champagne-light hover:text-ivory ${closeButtonPlace}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <p className="film-caption mono-label text-center text-champagne-light">{caption}</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
