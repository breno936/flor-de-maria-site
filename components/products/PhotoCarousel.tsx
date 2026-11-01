"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/data/campaign-photos";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";

/** How long each creation photograph stays before the next one comes in. */
export const PHOTO_INTERVAL_MS = 3000;

type PhotoCarouselProps = {
  title: string;
  photos: GalleryPhoto[];
  className?: string;
  /** Holds the rotation — while the lightbox is open over it. */
  paused?: boolean;
  onOpen: (index: number, event: MouseEvent<HTMLElement>) => void;
};

/**
 * Phones: a creation's four photographs as a native swipe gallery — one
 * frame per screen width, scroll-snap and the browser's own momentum, so a
 * vertical swipe always scrolls the page and nothing is ever held. Dots
 * and "1 / 4" say where you are (the dots also step to a photo); a tap
 * opens the full-screen lightbox on that frame. From 768px the card shows
 * its single photograph instead (see Criacoes).
 *
 * The photographs also move on their own, one every 3 s, always forward:
 * the strip ends with a copy of the first photo, swapped for the real one
 * once the scroll rests on it. The rotation only runs while the gallery is
 * on screen, and holds while it is touched, hovered or keyboard-focused,
 * while the lightbox is open, and with reduced motion.
 */
export default function PhotoCarousel({ title, photos, className = "", paused = false, onOpen }: PhotoCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const count = photos.length;

  // Scroll position → dots and counter; and the loop seam.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    let settle = 0;
    let touching = false;
    const position = () => Math.round(list.scrollLeft / Math.max(1, list.clientWidth));
    const update = () => {
      frame = 0;
      setActive(Math.min(count, Math.max(0, position())) % count);
    };
    const seam = () => {
      if (!touching && position() >= count) list.scrollTo({ left: 0, behavior: "instant" });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      clearTimeout(settle);
      settle = window.setTimeout(seam, 150);
    };
    const onTouchStart = () => {
      touching = true;
    };
    const onTouchEnd = () => {
      touching = false;
      clearTimeout(settle);
      settle = window.setTimeout(seam, 150);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    list.addEventListener("touchstart", onTouchStart, { passive: true });
    list.addEventListener("touchend", onTouchEnd, { passive: true });
    list.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      list.removeEventListener("touchstart", onTouchStart);
      list.removeEventListener("touchend", onTouchEnd);
      list.removeEventListener("touchcancel", onTouchEnd);
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [count]);

  // The rotation.
  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list || paused || reducedMotion || count < 2) return;
    let timer = 0;
    let onScreen = false;
    let held = false;
    const schedule = () => {
      clearTimeout(timer);
      if (onScreen && !held && !document.hidden) timer = window.setTimeout(next, PHOTO_INTERVAL_MS);
    };
    const next = () => {
      const width = Math.max(1, list.clientWidth);
      list.scrollTo({ left: (Math.round(list.scrollLeft / width) + 1) * width, behavior: "smooth" });
      schedule();
    };
    const hold = () => {
      held = true;
      clearTimeout(timer);
    };
    const release = () => {
      held = false;
      schedule();
    };
    const onPointerEnter = (event: PointerEvent) => event.pointerType === "mouse" && hold();
    const onPointerLeave = (event: PointerEvent) => event.pointerType === "mouse" && release();
    const onFocusIn = (event: FocusEvent) => (event.target as Element).matches(":focus-visible") && hold();
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.5 },
    );
    observer.observe(list);
    root.addEventListener("touchstart", hold, { passive: true });
    root.addEventListener("touchend", release, { passive: true });
    root.addEventListener("touchcancel", release, { passive: true });
    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", release);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      root.removeEventListener("touchstart", hold);
      root.removeEventListener("touchend", release);
      root.removeEventListener("touchcancel", release);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", release);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [count, paused, reducedMotion]);

  function go(index: number) {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ left: index * list.clientWidth, behavior: reducedMotion ? "instant" : "smooth" });
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <ul
        ref={listRef}
        aria-label={`Fotos: ${title}`}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <Slide key={photo.src} photo={photo} label={`Ampliar foto ${i + 1} de ${count}: `} onOpen={(event) => onOpen(i, event)} />
        ))}
        {count > 1 && <Slide photo={photos[0]} copy onOpen={(event) => onOpen(0, event)} />}
      </ul>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-noir/60 to-transparent px-3 pb-2 pt-12">
        <div className="pointer-events-auto flex items-center">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver foto ${i + 1} de ${count}`}
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
          {active + 1} / {count}
        </span>
      </div>
    </div>
  );
}

/** One frame of the strip; `copy` is the loop's repeat of the first — hidden from assistive tech and the tab order. */
function Slide({
  photo,
  label,
  copy = false,
  onOpen,
}: {
  photo: GalleryPhoto;
  label?: string;
  copy?: boolean;
  onOpen: (event: MouseEvent<HTMLElement>) => void;
}) {
  return (
    <li aria-hidden={copy || undefined} className="w-full shrink-0 snap-center [scroll-snap-stop:always]">
      <button
        type="button"
        onClick={onOpen}
        tabIndex={copy ? -1 : undefined}
        className="relative block aspect-square max-h-[46svh] w-full overflow-hidden bg-noir-soft"
      >
        {label && <span className="sr-only">{label}</span>}
        <Image
          src={photo.src}
          alt={copy ? "" : photo.alt}
          fill
          sizes="100vw"
          quality={80}
          draggable={false}
          className="object-cover"
          style={{ objectPosition: photo.position }}
        />
      </button>
    </li>
  );
}
