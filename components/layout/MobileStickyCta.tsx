"use client";

import { CTA_LABEL } from "@/components/cta/WhatsAppCTA";
import { contactHref } from "@/lib/contact/channel";
import { useCommerceZone } from "@/lib/ui/useCommerceZone";

/**
 * Phones and tablets: a persistent WhatsApp bar that appears only once the
 * visitor has reached the creations (the price comes before the
 * conversation) and steps aside at the closing, whose own button is then
 * in view — so it never sits over the final CTA or the footer.
 */
export default function MobileStickyCta() {
  const { seenCreations, atClosing } = useCommerceZone();
  const visible = seenCreations && !atClosing;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-champagne/15 bg-noir/92 backdrop-blur-sm transition-transform duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={contactHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${CTA_LABEL} (abre em nova aba)`}
        tabIndex={visible ? 0 : -1}
        className="group flex min-h-[52px] items-center justify-center gap-3 px-6 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-champagne-light active:bg-champagne-light/10"
      >
        <span className="h-px w-5 bg-champagne-light/70 transition-all duration-300 group-active:w-7" aria-hidden="true" />
        {CTA_LABEL}
        <span className="transition-transform duration-[320ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-active:translate-x-[3px]" aria-hidden="true">
          &rarr;
        </span>
      </a>
    </div>
  );
}
