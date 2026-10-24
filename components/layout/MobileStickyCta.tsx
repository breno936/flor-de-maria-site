"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { CTA_LABEL } from "@/components/cta/StartServiceCTA";
import { contactChannel, contactHref } from "@/lib/contact/channel";

/**
 * Mobile-only persistent CTA bar — the header's own CTA collapses on small
 * screens (logo + full text + hamburger has no room), so this is where the
 * "always reachable" atendimento entry point lives instead. Appears once
 * the visitor scrolls past DESEJO (its own CTA is already in view before
 * that), and disappears for good once they reach COMPRA — that section's
 * own button is already in view, and the brief is explicit that no fixed
 * bar should sit over the final CTA.
 */
export default function MobileStickyCta() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [visible, setVisible] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (isDesktop) return;
    const heroEl = document.getElementById("desejo");
    const compraEl = document.getElementById("atendimento");
    if (!heroEl || !compraEl) return;

    const update = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      const heroBottom = heroEl.getBoundingClientRect().bottom + y;
      const compraTop = compraEl.getBoundingClientRect().top + y;
      setVisible(y > heroBottom - 80 && y < compraTop - 120);
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
        href={contactHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Iniciar atendimento pelo ${contactChannel.name} (abre em nova aba)`}
        tabIndex={visible ? 0 : -1}
        className="group flex min-h-[52px] items-center justify-center gap-3 px-6 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ivory"
      >
        <span className="h-px w-5 bg-rouge/70 transition-all duration-300 group-active:w-7" aria-hidden="true" />
        {CTA_LABEL}
        <span className="transition-transform duration-[320ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-active:translate-x-[3px]" aria-hidden="true">
          &rarr;
        </span>
      </a>
    </div>
  );
}
