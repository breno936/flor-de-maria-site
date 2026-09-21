import type { MouseEventHandler, ReactNode } from "react";
import AtelierButton from "@/components/ui/AtelierButton";

/** The one commercial CTA on the entire site — fixed text, fixed destination. */
export const CTA_LABEL = "INICIAR ATENDIMENTO";
export const CTA_HREF = "#atendimento";

type Variant = "primary" | "secondary" | "header";

type StartServiceCTAProps = {
  variant?: Variant;
  className?: string;
  hideArrow?: boolean;
  threadRevealDelayMs?: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
  children?: ReactNode;
};

/**
 * Reused at every conversion point (header, hero, after the products, after
 * autoria) instead of each section inventing its own CTA copy. Always an
 * anchor to `#atendimento` — native browser smooth scroll (see
 * `scroll-behavior: smooth` in globals.css), no JS-driven scroll animation
 * to add delay or jank. The form's own submit button is a different control
 * (it submits, it doesn't navigate) and stays a plain AtelierButton — it
 * imports `CTA_LABEL` from here so the copy never drifts apart.
 */
export default function StartServiceCTA({
  variant = "primary",
  className,
  hideArrow,
  threadRevealDelayMs,
  onClick,
  children,
  ...rest
}: StartServiceCTAProps) {
  return (
    <AtelierButton
      href={CTA_HREF}
      variant={variant}
      className={className}
      hideArrow={hideArrow}
      threadRevealDelayMs={threadRevealDelayMs}
      onClick={onClick}
      {...rest}
    >
      {children ?? CTA_LABEL}
    </AtelierButton>
  );
}
