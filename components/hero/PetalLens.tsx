"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { MediaClipId } from "@/data/media-manifest";
import { useIsDesktopFinePointer } from "@/lib/accessibility/useMediaQuery";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import ManagedVideo from "@/components/media/ManagedVideo";

type PetalLensProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  clipId: MediaClipId;
};

const LENS_SIZE = 180; // within the 140–220px brief

/**
 * A cursor-linked "second exposure" of the hero footage — warmer, closer,
 * revealed through an organic petal-shaped aperture. Desktop pointer:fine
 * only, purely decorative, never intercepts clicks.
 */
export default function PetalLens({ containerRef, clipId }: PetalLensProps) {
  const enabled = useIsDesktopFinePointer();
  const reducedMotion = useReducedMotion();
  const lensRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const targetEl = event.target as HTMLElement | null;
      if (targetEl?.closest("a, button, input, textarea, select")) {
        setVisible(false);
        return;
      }
      target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.16;
      current.current.y += (target.current.y - current.current.y) * 0.16;
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${current.current.x - LENS_SIZE / 2}px, ${
          current.current.y - LENS_SIZE / 2
        }px, 0)`;
      }
      if (innerRef.current) {
        const rect = container.getBoundingClientRect();
        innerRef.current.style.transform = `translate3d(${-(current.current.x - LENS_SIZE / 2)}px, ${-(
          current.current.y -
          LENS_SIZE / 2
        )}px, 0)`;
        innerRef.current.style.width = `${rect.width}px`;
        innerRef.current.style.height = `${rect.height}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, reducedMotion, containerRef]);

  if (!enabled || reducedMotion) return null;

  return (
    <div
      ref={lensRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-30 overflow-hidden transition-opacity duration-300"
      style={{
        width: LENS_SIZE,
        height: LENS_SIZE,
        opacity: visible ? 1 : 0,
        clipPath:
          "path('M90 4 C140 30 150 110 90 176 C30 110 40 30 90 4 Z')",
        boxShadow: "0 0 40px rgba(181,138,74,0.25)",
      }}
    >
      <div
        ref={innerRef}
        className="absolute left-0 top-0"
        style={{ filter: "saturate(1.6) brightness(1.12) contrast(1.05) hue-rotate(-4deg)" }}
      >
        <ManagedVideo
          clipId={clipId}
          description=""
          aspectClassName="h-full w-full"
          loop
          showDebugLabel={false}
        />
      </div>
    </div>
  );
}
