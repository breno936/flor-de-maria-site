import type { MouseEventHandler, ReactNode } from "react";
import AtelierButton from "@/components/ui/AtelierButton";
import type { CreationId } from "@/data/products";
import { contactChannel, contactHref, creationTitle } from "@/lib/contact/channel";

/** The one commercial CTA on the entire site — fixed text, one destination: the conversation itself. */
export const CTA_LABEL = "INICIAR ATENDIMENTO";

type Variant = "primary" | "secondary" | "header";

type StartServiceCTAProps = {
  variant?: Variant;
  className?: string;
  hideArrow?: boolean;
  /** The creation whose scene this CTA closes — named in the opening message. */
  creation?: CreationId;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
  children?: ReactNode;
};

/**
 * Reused at every conversion point (header, hero, each creation, autoria,
 * atendimento) instead of each section inventing its own CTA copy. Opens
 * the conversation directly (see lib/contact/channel.ts) in a new tab — on
 * a phone, the WhatsApp/Instagram app itself — so getting in touch is one
 * tap, not a form and a wait for a call back.
 */
export default function StartServiceCTA({
  variant = "primary",
  className,
  hideArrow,
  creation,
  onClick,
  children,
  "aria-label": ariaLabel,
}: StartServiceCTAProps) {
  const title = creationTitle(creation);

  return (
    <AtelierButton
      href={contactHref(creation)}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      className={className}
      hideArrow={hideArrow}
      onClick={onClick}
      aria-label={
        ariaLabel ??
        `Iniciar atendimento${title ? ` para ${title}` : ""} pelo ${contactChannel.name} (abre em nova aba)`
      }
    >
      {children ?? CTA_LABEL}
    </AtelierButton>
  );
}
