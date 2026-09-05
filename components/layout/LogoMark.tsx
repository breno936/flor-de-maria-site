type LogoMarkProps = {
  className?: string;
  compact?: boolean;
};

/**
 * Typographic stand-in for the real Le Grand Amour vector logo (gold
 * wordmark + lotus/chalice glyph, seen only as a flattened chat image so
 * far). Swap for /public/media/brand/le-grand-amour-logo.svg the moment
 * it's supplied — same footprint, no layout changes required.
 */
export default function LogoMark({ className = "", compact = false }: LogoMarkProps) {
  return (
    <span
      className={`inline-flex select-none flex-col items-center leading-none text-gold ${className}`}
      aria-label="Le Grand Amour"
    >
      {!compact && (
        <span className="font-display text-[0.55em] tracking-[0.5em]">LÊ</span>
      )}
      <span className="font-display text-lg tracking-[0.18em]">GRAND AMOUR</span>
    </span>
  );
}
