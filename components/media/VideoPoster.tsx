import type { MediaClipId } from "@/data/media-manifest";
import { mediaClips } from "@/data/media-manifest";

type VideoPosterProps = {
  clipId: MediaClipId;
  className?: string;
  /** Set false for small accent/detail insets where the debug caption would overflow. */
  showDebugLabel?: boolean;
};

/**
 * Elegant stand-in for a clip that has not been shot/delivered yet.
 * Reads as an intentional dark, textured panel — never a broken-media icon.
 * Shows a dev-only label (never in production builds) naming what's missing.
 */
export default function VideoPoster({ clipId, className = "", showDebugLabel = true }: VideoPosterProps) {
  const clip = mediaClips[clipId];

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-noir-soft ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 20%, rgba(146,9,20,0.16), transparent 60%), radial-gradient(90% 70% at 80% 90%, rgba(181,138,74,0.10), transparent 55%), linear-gradient(160deg, #0d0807 0%, #070504 60%, #230407 140%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
        focusable="false"
      >
        <filter id={`grain-${clipId}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${clipId})`} />
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-16 w-16 rounded-full border border-gold/25"
      />
      {process.env.NODE_ENV !== "production" && showDebugLabel ? (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 overflow-hidden rounded border border-gold/20 bg-noir/70 px-3 py-2 text-[10px] leading-snug text-champagne/80">
          <p className="truncate font-sans uppercase tracking-[0.14em] text-gold/80">
            mídia pendente · {clipId}
          </p>
          <p className="mt-1 line-clamp-2 font-sans normal-case text-muted">{clip.brief}</p>
        </div>
      ) : null}
    </div>
  );
}
