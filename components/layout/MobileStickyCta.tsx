"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { hero } from "@/data/content";

/**
 * Mobile-only persistent CTA bar — the header's own CTA collapses on small
 * screens (logo + full text + hamburger has no room), so this is where the
 * "always reachable" reservation entry point lives instead. Appears once
 * the visitor scrolls past the Hero (its own CTA is already in view before
 * that, so showing this immediately would be redundant), and disappears for
 * good once they reach the reservation section — no point offering a
 * shortcut to a form the visitor is already looking at.
 */
export default function MobileStickyCta() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [visible, setVisible] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (isDesktop) return;
    const heroEl = document.getElementById("topo");
    const reservaEl = document.getElementById("reserva");
    if (!heroEl || !reservaEl) return;

    const update = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      const heroBottom = heroEl.getBoundingClientRect().bottom + y;
      const reservaTop = reservaEl.getBoundingClientRect().top + y;
      setVisible(y > heroBottom - 80 && y < reservaTop - 120);
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop]);

  if (isDesktop) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-champagne/15 bg-noir/92 backdrop-blur-sm transition-transform duration-400 ease-out lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href="#reserva"
        tabIndex={visible ? 0 : -1}
        className="group flex min-h-[52px] items-center justify-center gap-3 px-6 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition-transform duration-150 active:scale-[0.98]"
      >
        <span className="h-px w-5 bg-rouge/70 transition-all duration-300 group-active:w-7" aria-hidden="true" />
        {hero.ctaPrimary}
        <span className="transition-transform duration-300 group-active:translate-x-1" aria-hidden="true">
          &rarr;
        </span>
      </a>
    </div>
  );
}
