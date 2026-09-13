"use client";

import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "text" | "header" | "submit";

type SharedProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Hide the trailing arrow (shown by default on every variant except `text`). */
  hideArrow?: boolean;
  /** Delay (ms) the inner thread frame's first reveal — for a CTA arriving as the payoff of a scripted entrance (e.g. the Hero opening), instead of it just sitting there idle from first paint. */
  threadRevealDelayMs?: number;
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
  "group relative inline-flex items-center justify-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50";

const shapes: Record<Variant, string> = {
  primary: "h-[52px] px-8 min-w-[44px] text-ivory border border-champagne/45 hover:border-champagne",
  secondary: "h-[50px] px-1 min-w-[44px] bg-transparent text-champagne hover:text-ivory",
  text: "h-auto min-h-[44px] px-0 bg-transparent text-champagne/90 underline decoration-champagne/40 underline-offset-4 hover:text-ivory hover:decoration-champagne",
  header:
    "h-10 px-5 min-w-[44px] bg-transparent text-champagne border border-champagne/45 hover:border-champagne hover:bg-champagne/5",
  // Only used inside the ivory reservation-form card — dark text/border, not the dark-ground champagne pairing.
  submit:
    "h-[52px] w-full px-8 sm:w-auto min-w-[44px] text-noir border border-oxblood/40 hover:border-rouge",
};

/**
 * The one CTA system for the whole site. No fill, no gradient, no glow —
 * a double thin frame (outer champagne hairline + inner rouge line, "o fio")
 * on a transparent ground. Hover moves the inner line, not the box: it
 * grows from a short dash to the full inner frame. The magnetic micro-nudge
 * lives on the inner content only (`magnetRef`) — the clickable box itself
 * never moves, so the hit target stays put under the cursor.
 */
export default function AtelierButton(props: AtelierButtonProps) {
  const { variant = "primary", children, className = "", hideArrow = false, threadRevealDelayMs } = props;
  const showArrow = !hideArrow && variant !== "text";
  const loading = !isAnchor(props) && Boolean(props.loading);
  const rootRef = useRef<HTMLElement | null>(null);
  const magnetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const magnet = magnetRef.current;
    if (!root || !magnet) return;

    // Nudge (dx/dy) is mouse-only — no hover on touch. Press (scale) is
    // every pointer type — the tactile "give" a touch tap needs, since
    // there's no hover state to signal the button registered the tap.
    // Both live on the same transform string so they never fight over it.
    let dx = 0;
    let dy = 0;
    let pressed = false;

    const apply = () => {
      magnet.style.transform = `translate(${dx}px, ${dy}px) scale(${pressed ? 0.96 : 1})`;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      const rawDx = event.clientX - (rect.left + rect.width / 2);
      const rawDy = event.clientY - (rect.top + rect.height / 2);
      dx = clamp(rawDx * 0.1, -5, 5);
      dy = clamp(rawDy * 0.25, -4, 4);
      apply();
    };
    const onLeave = () => {
      dx = 0;
      dy = 0;
      pressed = false;
      apply();
    };
    const onDown = () => {
      pressed = true;
      apply();
    };
    const onUp = () => {
      pressed = false;
      apply();
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const content = (
    <span ref={magnetRef} className="relative inline-flex items-center justify-center gap-2 transition-transform duration-200 ease-out">
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-current/30 border-t-current"
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
    </span>
  );

  const classes = `${base} ${shapes[variant]} ${className}`;
  const showThreadFrame = variant === "primary" || variant === "submit";

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
        {showThreadFrame && <ThreadFrame revealDelayMs={threadRevealDelayMs} />}
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
      {showThreadFrame && <ThreadFrame revealDelayMs={threadRevealDelayMs} />}
      {content}
    </button>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * The inner half of the double frame — a thin rouge line ("o fio") set
 * inside the champagne outer border. Idle, it's a short dash centered on
 * the left edge; on hover it grows into the full inner rectangle. This is
 * the line-displacement interaction the brief asks for instead of scale.
 *
 * With `revealDelayMs`, the dash itself doesn't exist until that delay has
 * passed — for the Hero's primary CTA, so the frame reads as being "formed
 * by the thread" the instant the button appears, not present from t=0.
 */
function ThreadFrame({ revealDelayMs }: { revealDelayMs?: number }) {
  const [revealed, setRevealed] = useState(revealDelayMs === undefined);

  useEffect(() => {
    if (revealDelayMs === undefined) return;
    const timer = setTimeout(() => setRevealed(true), revealDelayMs);
    return () => clearTimeout(timer);
  }, [revealDelayMs]);

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-[5px] origin-left border border-rouge/70 transition-[transform,opacity] duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 ${
        revealed ? "scale-x-[0.08] opacity-70" : "scale-x-0 opacity-0"
      }`}
    />
  );
}
