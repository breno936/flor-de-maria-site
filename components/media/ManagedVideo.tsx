"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaClipId } from "@/data/media-manifest";
import { mediaClips } from "@/data/media-manifest";
import { AVAILABLE_CLIPS } from "@/lib/video/availableClips";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useSaveData } from "@/lib/accessibility/useMediaQuery";
import VideoPoster from "./VideoPoster";

export type ManagedVideoProps = {
  clipId: MediaClipId;
  /** Accessible description of what the clip shows. Required — video is never the only carrier of essential info. */
  description: string;
  aspectClassName?: string;
  className?: string;
  loop?: boolean;
  /** Hero-level clip: preload metadata instead of none. */
  priority?: boolean;
  objectPositionClassName?: string;
  /** Set false for small accent/detail insets where the debug caption would overflow. */
  showDebugLabel?: boolean;
};

/**
 * Single source of truth for how every decorative film clip behaves:
 * lazy-loads near viewport, autoplays muted only when visible, pauses
 * off-screen and on tab blur, respects reduced-motion and Save-Data,
 * and degrades to an art-directed placeholder when the file isn't ready.
 */
export default function ManagedVideo({
  clipId,
  description,
  aspectClassName = "aspect-[4/5]",
  className = "",
  loop = true,
  priority = false,
  objectPositionClassName = "",
  showDebugLabel = true,
}: ManagedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const reducedMotion = useReducedMotion();
  const saveData = useSaveData();

  const clip = mediaClips[clipId];
  const isAvailable = AVAILABLE_CLIPS.has(clipId) && !hasError;
  const shouldRenderVideo = isAvailable && !reducedMotion && !saveData;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !shouldRenderVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldRenderVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldRenderVideo) return;

    if (isInView) {
      video.play().catch(() => {
        /* autoplay can be rejected before user gesture on some browsers — safe to ignore, poster remains visible */
      });
    } else {
      video.pause();
    }
  }, [isInView, shouldRenderVideo]);

  useEffect(() => {
    if (!shouldRenderVideo) return;
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else if (isInView) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isInView, shouldRenderVideo]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectClassName} ${className}`}
      role="img"
      aria-label={description}
    >
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${objectPositionClassName}`}
          muted
          playsInline
          loop={loop}
          preload={priority ? "metadata" : "none"}
          poster={`${clip.basePath}/poster.jpg`}
          onError={() => setHasError(true)}
          aria-hidden="true"
        >
          <source
            media="(max-width: 767px)"
            src={`${clip.basePath}/mobile.mp4`}
            type="video/mp4"
          />
          <source src={`${clip.basePath}/desktop.webm`} type="video/webm" />
          <source src={`${clip.basePath}/desktop.mp4`} type="video/mp4" />
        </video>
      ) : (
        <VideoPoster clipId={clipId} showDebugLabel={showDebugLabel} />
      )}
    </div>
  );
}
