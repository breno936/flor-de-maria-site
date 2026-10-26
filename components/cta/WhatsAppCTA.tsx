"use client";

import type { MouseEventHandler } from "react";
import AtelierButton from "@/components/ui/AtelierButton";
import { findOption, findProduct, type CreationId } from "@/data/products";
import { contactChannel, contactHref } from "@/lib/contact/channel";
import { useChosenVersion } from "@/lib/ui/chosenVersion";

/** The one commercial action on the site — fixed text, one destination: the conversation itself. */
export const CTA_LABEL = `Pedir pelo ${contactChannel.name}`;

type Variant = "primary" | "secondary" | "header";

type WhatsAppCTAProps = {
  variant?: Variant;
  className?: string;
  /**
   * The creation whose card this button closes — named in the opening
   * message. Without it (header, closing), the button follows the last
   * version chosen on any card, if there is one.
   */
  creation?: CreationId;
  /** The version chosen on that card — named, with its price, in the opening message. */
  option?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  tabIndex?: number;
};

/**
 * Reused at every conversion point (each creation, the closing, the header
 * and the phone's sticky bar once the creations have been seen). Opens the
 * conversation directly (see lib/contact/channel.ts) in a new tab — on a
 * phone, the WhatsApp app itself.
 */
export default function WhatsAppCTA({ variant = "primary", className, creation, option, onClick, tabIndex }: WhatsAppCTAProps) {
  const lastChoice = useChosenVersion();
  const target = creation ? { creation, option } : { creation: lastChoice?.creation, option: lastChoice?.option };
  const product = findProduct(target.creation);
  const chosen = findOption(product, target.option);
  const subject = product ? `: ${product.title}${chosen ? `, ${chosen.label.toLowerCase()}` : ""}` : "";

  return (
    <AtelierButton
      href={contactHref(target.creation, target.option)}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={`${CTA_LABEL}${subject} (abre em nova aba)`}
    >
      {CTA_LABEL}
    </AtelierButton>
  );
}
