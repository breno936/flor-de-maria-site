type LogoMarkProps = {
  className?: string;
  compact?: boolean;
};

/**
 * Compact typographic wordmark for the header/footer — the real gold logo
 * asset (see `/public/assets/le-grand-amour/le-grand-amour-logo-dourado.webp`) is
 * used as an image in the Hero and the closing signature; the
 * brief is explicit that the big graphic mark shouldn't repeat in every
 * section, so this small text mark carries the brand the rest of the time.
 */
export default function LogoMark({ className = "", compact = false }: LogoMarkProps) {
  return (
    <span
      className={`inline-flex select-none flex-col items-center leading-none text-gold ${className}`}
      aria-label="Le Grand Amour"
    >
      {!compact && (
        <span className="font-display text-[0.55em] tracking-[0.5em]">LE</span>
      )}
      <span className="font-display text-lg tracking-[0.18em]">GRAND AMOUR</span>
    </span>
  );
}
