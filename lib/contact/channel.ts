import { contact } from "@/data/content";
import { findOption, findProduct, type CreationId } from "@/data/products";
import { formatPrice } from "@/lib/price";

/**
 * Where every "Pedir pelo WhatsApp" leads: straight into a conversation —
 * no form to fill in, nothing to wait for. The ateliê serves through
 * WhatsApp, directly with the person responsible, and each button opens it
 * with the first message already written: the creation, and the version
 * chosen on its card with that version's price, so the conversation starts
 * where the page left off. If `contact.whatsappNumber` is ever emptied,
 * the same buttons open the official Instagram's Direct instead, which
 * takes no pre-written message — never a dead link.
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

export function contactMessage(creation?: CreationId, optionId?: string) {
  const product = findProduct(creation);
  if (!product) return "Olá! Vim pelo site da Lê Grand Amour e gostaria de consultar disponibilidade.";
  const option = findOption(product, optionId);
  // Plain spaces in the message (Intl puts a no-break space after "R$").
  const choice = option ? ` (${option.label.toLowerCase()}, ${formatPrice(option.amount).replace(/\s/g, " ")})` : "";
  return `Olá! Vi o ${product.title}${choice} no site e gostaria de consultar disponibilidade.`;
}

export function contactHref(creation?: CreationId, optionId?: string) {
  return whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contactMessage(creation, optionId))}`
    : `https://ig.me/m/${contact.instagramHandle}`;
}
