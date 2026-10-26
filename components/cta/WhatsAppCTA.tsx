import type { MouseEventHandler } from "react";
import AtelierButton from "@/components/ui/AtelierButton";
import { findProduct, type CreationId } from "@/data/products";
import { contactChannel, contactHref } from "@/lib/contact/channel";

/** The one commercial action on the site — fixed text, one destination: the conversation itself. */
export const CTA_LABEL = `Pedir pelo ${contactChannel.name}`;

type Variant = "primary" | "secondary" | "header";

type WhatsAppCTAProps = {
  variant?: Variant;
  className?: string;
  /** The creation whose card this button closes — named, with its price, in the opening message. */
  creation?: CreationId;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  tabIndex?: number;
};

/**
 * Reused at every conversion point (each creation, the closing, the header
 * and the phone's sticky bar once the creations have been seen). Opens the
 * conversation directly (see lib/contact/channel.ts) in a new tab — on a
 * phone, the WhatsApp app itself.
 */
export default function WhatsAppCTA({ variant = "primary", className, creation, onClick, tabIndex }: WhatsAppCTAProps) {
  const title = findProduct(creation)?.title;

  return (
    <AtelierButton
      href={contactHref(creation)}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={`${CTA_LABEL}${title ? `: ${title}` : ""} (abre em nova aba)`}
    >
      {CTA_LABEL}
    </AtelierButton>
  );
}
