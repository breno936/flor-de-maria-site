import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text" | "header";

type SharedProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Hide the trailing arrow (shown by default on every variant except `text`). */
  hideArrow?: boolean;
  "aria-label"?: string;
  tabIndex?: number;
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
};

export type AtelierButtonProps = AnchorProps | ButtonProps;

function isAnchor(props: AtelierButtonProps): props is AnchorProps {
  return typeof props.href === "string";
}

const TRANSITION = "transition-[color,transform] duration-[320ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]";

const base =
  `group relative inline-flex items-center overflow-hidden font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] ${TRANSITION} focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50`;

// One border only — light champagne on the dark ground. No inner frame, no
// second border of any kind. The dark ground variants carry a faint
// noir backing so label and border keep their contrast over photographs.
const shapes: Record<Variant, string> = {
  primary: "h-[54px] pl-7 pr-14 min-w-[44px] border border-champagne-light/80 bg-noir/35 text-champagne-light backdrop-blur-[2px] hover:text-noir focus-visible:text-noir active:text-noir",
  secondary: "h-[50px] pl-6 pr-12 min-w-[44px] border border-champagne-light/80 bg-noir/35 text-champagne-light backdrop-blur-[2px] hover:text-noir focus-visible:text-noir active:text-noir",
  text: "h-auto min-h-[44px] px-0 bg-transparent text-champagne-light underline decoration-champagne-light/50 underline-offset-4 hover:decoration-champagne-light",
  header: "h-10 pl-5 pr-9 min-w-[44px] border border-champagne-light/80 text-champagne-light hover:text-noir focus-visible:text-noir active:text-noir",
};

const arrowPosition: Record<Variant, string> = {
  primary: "right-6",
  secondary: "right-5",
  text: "",
  header: "right-3",
};

// The hover "fill" — a single flat champagne layer, no border of its own,
// sweeping in from the left. Every bordered variant shares the same warm
// gold tone so the CTA reads consistently wherever it sits.
const FILL_COLOR = "#D7BD88";

/**
 * The one CTA system for the whole site. A single hairline border, no inner
 * frame, no scale, no text movement. Hover is a flat-color sweep filling in
 * from the left behind the label — the only thing that moves is the arrow,
 * 3px to the right. Keyboard focus and a finger's press get the same state
 * (Tailwind's `hover:` only applies on devices that can hover).
 */
export default function AtelierButton(props: AtelierButtonProps) {
  const { variant = "primary", children, className = "", hideArrow = false } = props;
  const showArrow = !hideArrow && variant !== "text";
  const showFill = variant !== "text";

  const content = <span className="relative z-10 inline-block">{children}</span>;

  const arrow = showArrow && (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 inline-block ${TRANSITION} group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px] group-active:translate-x-[3px] ${arrowPosition[variant]}`}
    >
      &rarr;
    </span>
  );

  const fill = showFill && (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 transition-transform duration-[320ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:scale-x-100"
      style={{ background: FILL_COLOR }}
    />
  );

  const classes = `${base} ${shapes[variant]} ${variant === "text" ? "" : "justify-center"} ${className}`;

  if (isAnchor(props)) {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        tabIndex={props.tabIndex}
        className={classes}
      >
        {fill}
        {content}
        {arrow}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
      tabIndex={props.tabIndex}
      className={classes}
    >
      {fill}
      {content}
      {arrow}
    </button>
  );
}
