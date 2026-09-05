"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useIsDesktopFinePointer } from "@/lib/accessibility/useMediaQuery";

type ProductCursorLabelProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  label: string;
};

const SIZE = 100; // within the 110px brief ceiling

/** Contextual "VER LE BOUQUET" / "VER LE CŒUR" badge that trails the cursor over clickable media. */
export default function ProductCursorLabel({ containerRef, label }: ProductCursorLabelProps) {
  const enabled = useIsDesktopFinePointer();
  const badgeRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.2;
      current.current.y += (target.current.y - current.current.y) * 0.2;
      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${current.current.x - SIZE / 2}px, ${
          current.current.y - SIZE / 2
        }px, 0)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, containerRef]);

  if (!enabled) return null;

  return (
    <div
      ref={badgeRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-center rounded-full border border-gold/60 bg-noir/75 text-center font-sans text-[10px] uppercase tracking-[0.16em] text-gold shadow-[inset_0_0_0_1px_rgba(181,138,74,0.15)] backdrop-blur-sm transition-opacity duration-300"
      style={{ width: SIZE, height: SIZE, opacity: visible ? 1 : 0 }}
    >
      {label}
    </div>
  );
}
