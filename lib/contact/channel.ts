import { contact } from "@/data/content";
import { products, type CreationId } from "@/data/products";

/**
 * Where every "Iniciar atendimento" leads: straight into a conversation —
 * no form to fill in, nothing to wait for. The ateliê serves through
 * WhatsApp, directly with the person responsible, and each CTA opens it
 * with the first message already written (naming the piece when the
 * visitor came from a creation's scene). Until `contact.whatsappNumber` is
 * filled in, the same CTAs open the official Instagram's Direct instead,
 * which takes no pre-written message — never a dead link.
 */
const whatsappNumber = contact.whatsappNumber.replace(/\D/g, "");

/** "5519982465984" → "(19) 98246-5984", for visitors without WhatsApp on this device. */
function formatPhone(digits: string) {
  const parts = digits.replace(/^55/, "").match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return parts ? `(${parts[1]}) ${parts[2]}-${parts[3]}` : `+${digits}`;
}

export const contactChannel = whatsappNumber
  ? ({ id: "whatsapp", name: "WhatsApp", detail: formatPhone(whatsappNumber) } as const)
  : ({ id: "instagram", name: "Instagram", detail: `@${contact.instagramHandle}` } as const);

export function creationTitle(creation?: CreationId) {
  return creation ? products.find((p) => p.id === creation)?.title : undefined;
}

export function contactMessage(creation?: CreationId) {
  const title = creationTitle(creation);
  return title
    ? `Olá! Vim pelo site da Lê Grand Amour e gostaria de conversar sobre o ${title}.`
    : "Olá! Vim pelo site da Lê Grand Amour e gostaria de iniciar um atendimento.";
}

export function contactHref(creation?: CreationId) {
  return whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contactMessage(creation))}`
    : `https://ig.me/m/${contact.instagramHandle}`;
}
