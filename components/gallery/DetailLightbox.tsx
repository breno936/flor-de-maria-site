"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import type { GalleryPhoto } from "@/data/campaign-photos";

type DetailLightboxProps = {
  title: string;
  photos: GalleryPhoto[];
  /** Open photo, or null when closed. */
  index: number | null;
  /** Rect of the thumbnail that opened it — the photo grows out of it. */
  originRect: DOMRect | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 48;

/**
 * "Inspeção de ateliê": a full-screen look at one creation's details. A
 * native modal <dialog> (focus trap, Esc, focus restore all come from the
 * platform), page scroll locked while open. The photo grows out of the
 * thumbnail that was selected; arrows, ←/→ keys and a horizontal swipe step
 * through the gallery; each frame carries a one-line caption saying what
 * the detail shows. Reduced motion gets the same dialog with no movement.
 */
export default function DetailLightbox({
  title,
  photos,
  index,
  originRect,
  onIndexChange,
  onClose,
}: DetailLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const isOpen = index !== null;
  const photo = index !== null ? photos[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    if (!isOpen) document.documentElement.style.overflow = "";
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Grow out of the thumbnail on open — measured before paint so the first
  // frame is already at the thumbnail's position, never a flash at full size.
  useLayoutEffect(() => {
    if (!isOpen || reducedMotion) return;
    const stage = stageRef.current;
    const el = photoRef.current;
    if (!stage || !el) return;
    gsap.fromTo(dialogRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    if (!originRect) return;
    const target = stage.getBoundingClientRect();
    const scale = Math.max(originRect.width / target.width, originRect.height / target.height);
    gsap.fromTo(
      el,
      {
        x: originRect.left + originRect.width / 2 - (target.left + target.width / 2),
        y: originRect.top + originRect.height / 2 - (target.top + target.height / 2),
        scale,
        opacity: 0.6,
      },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
    // Only the opening frame grows from the thumbnail; later steps crossfade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function step(delta: number) {
    if (index === null) return;
    const next = (index + delta + photos.length) % photos.length;
    onIndexChange(next);
    if (!reducedMotion && photoRef.current) {
      gsap.fromTo(photoRef.current, { opacity: 0, x: delta * 24 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
    }
  }

  function close() {
    const dialog = dialogRef.current;
    if (!dialog || reducedMotion) {
      onClose();
      return;
    }
    gsap.to(dialog, { opacity: 0, duration: 0.2, ease: "power1.in", onComplete: onClose });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;
    const dx = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) step(dx < 0 ? 1 : -1);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title}: detalhes em tela cheia`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-noir/[0.97] p-0 text-ivory backdrop:bg-noir/80"
    >
      {photo && index !== null && (
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-6">
            <p className="mono-label text-champagne-light">{title} — detalhes</p>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne-light/50 text-champagne-light transition-colors hover:border-champagne-light hover:text-ivory"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <div
            ref={stageRef}
            className="relative min-h-0 flex-1 touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div ref={photoRef} className="absolute inset-0 mx-4 md:mx-24">
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                loading="eager"
                quality={80}
                className="object-contain"
                draggable={false}
              />
            </div>
            {photos.length > 1 && (
              <>
                <StepButton direction="prev" onClick={() => step(-1)} />
                <StepButton direction="next" onClick={() => step(1)} />
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 px-5 pb-7 pt-5 md:flex-row md:items-end md:justify-between md:px-10 md:pb-9">
            <div className="max-w-2xl">
              <p className="mono-label text-champagne-light">{photo.label}</p>
              <p className="mt-2 font-sans text-[1.05rem] leading-relaxed text-ivory/90 md:text-lg" aria-live="polite">
                {photo.caption}
              </p>
            </div>
            <p className="mono-label shrink-0 text-ivory/70">
              {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}
    </dialog>
  );
}

function StepButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Detalhe anterior" : "Próximo detalhe"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne-light/50 bg-noir/60 text-champagne-light backdrop-blur-sm transition-colors hover:border-champagne-light hover:text-ivory md:h-12 md:w-12 ${
        isPrev ? "left-2 md:left-8" : "right-2 md:right-8"
      }`}
    >
      <span aria-hidden="true">{isPrev ? "←" : "→"}</span>
    </button>
  );
}
