"use client";

import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text" | "header" | "submit";

type SharedProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Hide the trailing arrow (shown by default on every variant except `text`). */
  hideArrow?: boolean;
  "aria-label"?: string;
};

type AnchorProps = SharedProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ButtonProps = SharedProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
};

export type AtelierButtonProps = AnchorProps | ButtonProps;

function isAnchor(props: AtelierButtonProps): props is AnchorProps {
  return typeof props.href === "string";
}

const cornerClipStyle = {
  clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 0 100%)",
};

const base =
  "group relative inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50";

const shapes: Record<Variant, string> = {
  primary:
    "h-[48px] px-7 min-w-[44px] bg-rouge text-ivory border border-gold/40 hover:border-gold/85 hover:bg-rouge/90",
  secondary: "h-[48px] px-1 min-w-[44px] bg-transparent text-champagne hover:text-ivory",
  text: "h-auto min-h-[44px] px-0 bg-transparent text-champagne/90 underline decoration-gold/40 underline-offset-4 hover:text-ivory hover:decoration-gold",
  header:
    "h-10 px-5 min-w-[44px] bg-transparent text-gold border border-gold/50 hover:border-gold hover:bg-gold/10",
  submit:
    "h-[50px] w-full px-8 sm:w-auto min-w-[44px] bg-rouge text-ivory border border-gold/40 hover:border-gold/85 hover:bg-rouge/90",
};

/**
 * The one CTA system for the whole site — replaces the old ad-hoc
 * `rounded-full` capsules. Corners are a 3px couture-label clip (with a
 * small cut corner), the gold outline is a hairline, and hover reads as a
 * light sweep rather than a neon glow. `submit` adds real loading/disabled
 * affordances for forms; never announce success before the endpoint answers.
 */
export default function AtelierButton(props: AtelierButtonProps) {
  const { variant = "primary", children, className = "", hideArrow = false } = props;
  const showArrow = !hideArrow && variant !== "text";
  const loading = !isAnchor(props) && Boolean(props.loading);

  const content = (
    <>
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-ivory/30 border-t-ivory"
        />
      )}
      <span className="relative inline-block transition-transform duration-300 ease-out group-hover:-translate-x-[2px]">
        {children}
      </span>
      {showArrow && (
        <span
          aria-hidden="true"
          className="relative inline-block transition-transform duration-300 ease-out group-hover:translate-x-[5px]"
        >
          &rarr;
        </span>
      )}
      {(variant === "primary" || variant === "submit") && <GoldSweep />}
      {variant === "secondary" && <GrowingUnderline />}
    </>
  );

  const cornerClip = variant === "primary" || variant === "submit" ? cornerClipStyle : undefined;
  const classes = `${base} ${shapes[variant]} ${className}`;

  if (isAnchor(props)) {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        className={classes}
        style={cornerClip}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      aria-label={props["aria-label"]}
      className={classes}
      style={cornerClip}
    >
      {content}
    </button>
  );
}

function GrowingUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-[0.22] bg-gold/50 transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:bg-gold"
    />
  );
}

function GoldSweep() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:translate-x-[420%] group-hover:opacity-100" />
    </span>
  );
}
