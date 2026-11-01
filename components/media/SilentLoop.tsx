"use client";

import { useEffect, useRef, useState } from "react";

type SilentLoopProps = {
  src: string;
  /** Holds it — while the full film is open over it. */
  paused?: boolean;
  /** object-position, to match the photograph underneath. */
  position?: string;
};

/**
 * A short silent loop laid over a cover photograph, filling its parent
 * (browsers only start video on their own without sound). Fetched one
 * screen before it arrives, so it is ready when it does; plays only while
 * it is on screen and not `paused`, and fades in over the photograph once
 * it actually plays. Never with reduced motion or data saving on; where
 * the browser still refuses (iOS Low Power Mode) the photograph stays.
 */
export default function SilentLoop({ src, paused = false, position = "50% 50%" }: SilentLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = false;
    const sync = () => {
      if (!video.getAttribute("src")) return;
      if (onScreen && !paused) video.play().catch(() => {});
      else video.pause();
    };
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        approach.disconnect();
        if (!video.getAttribute("src")) {
          video.muted = true;
          video.preload = "auto";
          video.src = src;
        }
        sync();
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.4 },
    );
    approach.observe(video);
    visible.observe(video);
    return () => {
      approach.disconnect();
      visible.disconnect();
    };
  }, [src, paused]);

  return (
    // The source is set by the effect above, once the block approaches.
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
      style={{ objectPosition: position }}
    />
  );
}
