"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MediaClipId } from "@/data/media-manifest";
import { mediaClips } from "@/data/media-manifest";
import { temporaryMedia } from "@/data/temporary-media";
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
  /** Escape hatch for callers that need imperative control (e.g. a visible pause/play toggle). Called with the live <video> element, or null when none is rendered (image/gradient tier). */
  onVideoElement?: (video: HTMLVideoElement | null) => void;
};

/**
 * Single source of truth for how every decorative film clip behaves.
 *
 * Render priority:
 *   1. official clip (AVAILABLE_CLIPS)      — the real studio footage, once shot;
 *   2. temporary video (data/temporary-media) — a licensed-stock Ken Burns loop;
 *   3. temporary image (data/temporary-media) — a graded editorial still;
 *   4. VideoPoster                           — last-resort art-directed gradient.
 *
 * Tiers 2–3 are marked `data-temporary-media="true"` and carry an honest,
 * non-misleading alt/description — see MEDIA-MANIFEST.md. The moment an id is
 * added to AVAILABLE_CLIPS, it wins automatically and the temporary tier is
 * never consulted for that clip again — no other code needs to change.
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
  onVideoElement,
}: ManagedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [tempVideoError, setTempVideoError] = useState(false);
  const reducedMotion = useReducedMotion();
  const saveData = useSaveData();

  const clip = mediaClips[clipId];
  const temp = temporaryMedia[clipId];
  const isOfficialAvailable = AVAILABLE_CLIPS.has(clipId) && !hasError;
  const canPlayMotion = !reducedMotion && !saveData;

  const showOfficialVideo = isOfficialAvailable;
  const showTemporaryVideo =
    !showOfficialVideo && Boolean(temp?.temporaryVideo) && canPlayMotion && !tempVideoError;
  const showTemporaryImage =
    !showOfficialVideo && !showTemporaryVideo && Boolean(temp?.temporaryImage);

  const shouldObserve = showOfficialVideo || showTemporaryVideo;

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    onVideoElement?.(el);
  };

  useEffect(() => {
    if (!shouldObserve) onVideoElement?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldObserve]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !shouldObserve) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldObserve]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldObserve) return;

    if (isInView) {
      video.play().catch(() => {
        /* autoplay can be rejected before user gesture on some browsers — safe to ignore, poster remains visible */
      });
    } else {
      video.pause();
    }
  }, [isInView, shouldObserve]);

  useEffect(() => {
    if (!shouldObserve) return;
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else if (isInView) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isInView, shouldObserve]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectClassName} ${className}`}
      role="img"
      aria-label={description}
    >
      {showOfficialVideo ? (
        <video
          ref={setVideoRef}
          className={`h-full w-full object-cover ${objectPositionClassName}`}
          muted
          playsInline
          loop={loop}
          preload={priority ? "metadata" : "none"}
          poster={`${clip.basePath}/poster.jpg`}
          onError={() => setHasError(true)}
          aria-hidden="true"
        >
          <source media="(max-width: 767px)" src={`${clip.basePath}/mobile.mp4`} type="video/mp4" />
          <source src={`${clip.basePath}/desktop.webm`} type="video/webm" />
          <source src={`${clip.basePath}/desktop.mp4`} type="video/mp4" />
        </video>
      ) : showTemporaryVideo && temp?.temporaryVideo ? (
        <video
          ref={setVideoRef}
          className={`h-full w-full object-cover ${objectPositionClassName}`}
          muted
          playsInline
          loop={loop}
          preload={priority ? "metadata" : "none"}
          poster={temp.temporaryVideo.poster}
          onError={() => setTempVideoError(true)}
          aria-hidden="true"
          data-temporary-media="true"
        >
          {temp.temporaryVideo.webm && <source src={temp.temporaryVideo.webm} type="video/webm" />}
          <source src={temp.temporaryVideo.mp4} type="video/mp4" />
        </video>
      ) : showTemporaryImage && temp ? (
        <>
          <Image
            src={temp.temporaryImage}
            alt={temp.alt}
            fill
            sizes="(max-width: 767px) 100vw, 60vw"
            className={`object-cover ${objectPositionClassName} ${temp.mobileImage ? "hidden md:block" : ""}`}
            priority={priority}
            data-temporary-media="true"
            quality={80}
          />
          {temp.mobileImage && (
            <Image
              src={temp.mobileImage}
              alt={temp.alt}
              fill
              sizes="100vw"
              className={`object-cover md:hidden ${objectPositionClassName}`}
              priority={priority}
              data-temporary-media="true"
              quality={80}
            />
          )}
        </>
      ) : (
        <VideoPoster clipId={clipId} showDebugLabel={showDebugLabel} />
      )}
    </div>
  );
}
