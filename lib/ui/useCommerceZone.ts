"use client";

import { useEffect, useState } from "react";

type CommerceZone = {
  /** The creations (and their prices) have come into view. */
  seenCreations: boolean;
  /** The closing section, with its own WhatsApp button, is on screen. */
  atClosing: boolean;
};

/**
 * Where the visitor is relative to the selling — drives the persistent
 * WhatsApp shortcuts (header on desktop, bottom bar on phones), which only
 * appear once the price has been presented and step aside at the closing.
 * One rAF-throttled passive scroll listener; nothing is held or pinned.
 */
export function useCommerceZone(): CommerceZone {
  const [zone, setZone] = useState<CommerceZone>({ seenCreations: false, atClosing: false });

  useEffect(() => {
    const creations = document.getElementById("criacoes");
    const closing = document.getElementById("atendimento");
    if (!creations || !closing) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const seenCreations = creations.getBoundingClientRect().top < vh * 0.4;
      const atClosing = closing.getBoundingClientRect().top < vh * 0.85;
      setZone((current) =>
        current.seenCreations === seenCreations && current.atClosing === atClosing ? current : { seenCreations, atClosing }
      );
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return zone;
}
