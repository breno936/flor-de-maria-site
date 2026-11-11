import { findOption, findProduct, type CreationId } from "@/data/products";
import { contactChannel } from "@/lib/contact/channel";

/**
 * Google Analytics 4. The measurement id ("G-…") comes from NEXT_PUBLIC_GA_ID,
 * set on Vercel for Production only — local runs and previews never count.
 * Without a valid id nothing loads (components/analytics/GoogleAnalytics.tsx)
 * and track() does nothing. No consent banner: decided on 2026-11-11.
 *
 * GA4 measures page views, scroll and outbound clicks by itself; the site
 * adds what it can't see:
 * - generate_lead — any "Pedir pelo WhatsApp": where on the page, and the
 *   creation and version (with its price) the message names;
 * - select_item — a version chosen on a card;
 * - video_start — the film or the testimonial opened;
 * - open_photos — a photo enlarged (creation cards, Detalhes).
 */
const id = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";
export const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(id) ? id : "";

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params?: Record<string, unknown>) {
  if (!GA_ID || typeof window === "undefined") return;
  (window as Window & { gtag?: Gtag }).gtag?.("event", name, params);
}

/** Where the button sits: "card", "cabecalho", "menu", "atendimento", "barra-celular". */
export function trackLead(placement: string, creation?: CreationId, optionId?: string) {
  const product = findProduct(creation);
  const option = findOption(product, optionId);
  track("generate_lead", {
    method: contactChannel.id,
    placement,
    creation: product?.title,
    version: option?.label,
    ...(option && { value: option.amount, currency: "BRL" }),
  });
}

export function trackVersion(creation: CreationId, optionId: string) {
  const product = findProduct(creation);
  const option = findOption(product, optionId);
  if (!product || !option) return;
  track("select_item", {
    item_list_name: "Criações e valores",
    items: [{ item_id: product.id, item_name: product.title, item_variant: option.label, price: option.amount }],
  });
}
