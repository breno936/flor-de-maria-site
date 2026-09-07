"use client";

import { useEffect, useRef, type MouseEventHandler, type ReactNode } from "react";

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

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-[2px] font-sans text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50";

const shapes: Record<Variant, string> = {
  primary:
    "h-[50px] px-8 min-w-[44px] bg-rouge text-ivory border border-gold/40 hover:border-gold hover:bg-bordeaux",
  secondary: "h-[48px] px-1 min-w-[44px] bg-transparent text-champagne hover:text-ivory",
  text: "h-auto min-h-[44px] px-0 bg-transparent text-champagne/90 underline decoration-gold/40 underline-offset-4 hover:text-ivory hover:decoration-gold",
  header:
    "h-10 px-5 min-w-[44px] bg-transparent text-gold border border-gold/50 hover:border-gold hover:bg-gold/10",
  submit:
    "h-[50px] w-full px-8 sm:w-auto min-w-[44px] bg-rouge text-ivory border border-gold/40 hover:border-gold hover:bg-bordeaux",
};

/**
 * The one CTA system for the whole site. Rectangular, discrete 2px corners
 * (no diagonal cut — that read as tech/gamer UI), a hairline gold border,
 * and a soft gold sweep on hover instead of a neon glow. The magnetic
 * micro-nudge lives on the inner content only (`magnetRef`) — the clickable
 * box itself never moves, so the hit target stays put under the cursor.
 */
export default function AtelierButton(props: AtelierButtonProps) {
  const { variant = "primary", children, className = "", hideArrow = false } = props;
  const showArrow = !hideArrow && variant !== "text";
  const loading = !isAnchor(props) && Boolean(props.loading);
  const rootRef = useRef<HTMLElement | null>(null);
  const magnetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const magnet = magnetRef.current;
    if (!root || !magnet) return;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      magnet.style.transform = `translate(${clamp(dx * 0.1, -5, 5)}px, ${clamp(dy * 0.25, -4, 4)}px)`;
    };
    const onLeave = () => {
      magnet.style.transform = "translate(0, 0)";
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const content = (
    <span ref={magnetRef} className="relative inline-flex items-center justify-center gap-2 transition-transform duration-200 ease-out">
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-ivory/30 border-t-ivory"
        />
      )}
      <span className="relative inline-block">{children}</span>
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
    </span>
  );

  const classes = `${base} ${shapes[variant]} ${className}`;

  if (isAnchor(props)) {
    return (
      <a
        ref={(el) => {
          rootRef.current = el;
        }}
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(el) => {
        rootRef.current = el;
      }}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      aria-label={props["aria-label"]}
      className={classes}
    >
      {content}
    </button>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function GrowingUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-[0.22] bg-gold/50 transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:bg-gold"
    />
  );
}

function GoldSweep() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:translate-x-[420%] group-hover:opacity-100" />
    </span>
  );
}
