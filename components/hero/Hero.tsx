"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { hero } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";
import ManagedVideo from "@/components/media/ManagedVideo";

const SESSION_KEY = "lga-hero-opened";
const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const OPEN_CLIP = "inset(0% 0% 0% 0%)";

const words = hero.title.split(" ");
const line1 = words.slice(0, -1).join(" ");
const line2 = words.slice(-1).join(" ");

const petalMedia = temporaryMedia["petal-macro"];
const ribbonMedia = temporaryMedia["ribbon-detail"];
const heroMedia = temporaryMedia["hero-bouquet"];

/**
 * "Dos detalhes à grande declaração" — a single ~2s GSAP timeline, not tied
 * to scroll, that reveals three scales in sequence (petal → ribbon/finish
 * detail → the main bouquet film) using the Codrops "Rapid Layers Animation"
 * reveal trick: each layer is a clip-path mask that wipes open while its own
 * image counter-drifts a few percent, so mask and image read as one
 * coordinated movement rather than a hard cut. Layers overlap in time
 * (layer N+1 starts revealing before layer N is fully covered) so nothing
 * reads as a blank flash between them. See MEDIA-MANIFEST.md for what of the
 * Codrops reference could/couldn't be inspected — this reimplements the
 * described behaviour in GSAP (already the project's animation system), not
 * a port of their source.
 *
 * Plays once per browser session (sessionStorage), never on a direct anchor
 * load (`location.hash` set), and never with `prefers-reduced-motion` — all
 * three land straight on the final, fully-formed hero with no timeline at
 * all. There is no scroll-trigger, no pin, no scroll-linked property here;
 * scrolling is never intercepted.
 */
// Evaluated once when this module is instantiated: on the server that's a
// no-op (no window), on the client it's once per full page load — exactly
// the granularity "once per session, resolved before first interactive
// render" needs, without re-reading sessionStorage on every render (which
// would make useSyncExternalStore's snapshot unstable — see below).
function resolveShouldPlayOpening(): boolean {
  if (typeof window === "undefined") return false;
  const hasHash = Boolean(window.location.hash) && window.location.hash !== "#topo";
  const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
  return !hasHash && !alreadySeen;
}
const shouldPlayOpeningOnLoad = resolveShouldPlayOpening();

function subscribeNever() {
  return () => {};
}

export default function Hero() {
  const reducedMotion = useReducedMotion();
  // useSyncExternalStore (not a state+effect pair) so the browser-only
  // decision — sessionStorage / location.hash — never needs a setState call
  // inside an effect: the server snapshot is always "don't play," and React
  // reconciles the real client value itself right after hydration.
  const playOpening = useSyncExternalStore(
    subscribeNever,
    () => shouldPlayOpeningOnLoad && !reducedMotion,
    () => false
  );

  useEffect(() => {
    if (playOpening) sessionStorage.setItem(SESSION_KEY, "1");
  }, [playOpening]);

  return <HeroShell playOpening={playOpening} />;
}

function HeroShell({ playOpening = false }: { playOpening?: boolean }) {
  const petalMaskRef = useRef<HTMLDivElement>(null);
  const petalInnerRef = useRef<HTMLDivElement>(null);
  const ribbonMaskRef = useRef<HTMLDivElement>(null);
  const ribbonInnerRef = useRef<HTMLDivElement>(null);
  const mainMaskRef = useRef<HTMLDivElement>(null);
  const mainInnerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  // Derived, not its own seeded state: `playOpening` starts false on every
  // render (server snapshot) and flips true right after hydration when it
  // should actually play, so a `useState(playOpening)` initial value would
  // permanently miss that later flip and the button would never appear.
  const [openingComplete, setOpeningComplete] = useState(false);
  const showSkip = playOpening && !openingComplete;
  const [videoPaused, setVideoPaused] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const textEls = [eyebrowRef.current, line1Ref.current, line2Ref.current, taglineRef.current, ctaRef.current];

    if (!playOpening) {
      gsap.set([petalMaskRef.current, ribbonMaskRef.current], { autoAlpha: 0 });
      gsap.set(mainMaskRef.current, { clipPath: OPEN_CLIP });
      gsap.set(mainInnerRef.current, { yPercent: 0 });
      gsap.set(textEls, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(petalMaskRef.current, { clipPath: HIDDEN_CLIP, autoAlpha: 1 });
    gsap.set(petalInnerRef.current, { yPercent: -8 });
    gsap.set(ribbonMaskRef.current, { clipPath: HIDDEN_CLIP, autoAlpha: 1 });
    gsap.set(ribbonInnerRef.current, { yPercent: -8 });
    gsap.set(mainMaskRef.current, { clipPath: HIDDEN_CLIP });
    gsap.set(mainInnerRef.current, { yPercent: -8 });
    gsap.set(textEls, { opacity: 0, y: 14 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(petalMaskRef.current, { clipPath: OPEN_CLIP, duration: 0.35, ease: "power2.out" }, 0)
      .to(petalInnerRef.current, { yPercent: 0, duration: 0.4 }, 0)
      .to(ribbonMaskRef.current, { clipPath: OPEN_CLIP, duration: 0.6, ease: "power2.out" }, 0.25)
      .to(ribbonInnerRef.current, { yPercent: 0, duration: 0.6 }, 0.25)
      .to(petalInnerRef.current, { yPercent: 5, duration: 0.5 }, 0.32)
      .to(mainMaskRef.current, { clipPath: OPEN_CLIP, duration: 0.75, ease: "power2.out" }, 0.75)
      .to(mainInnerRef.current, { yPercent: 0, duration: 0.85 }, 0.75)
      .to(ribbonInnerRef.current, { yPercent: 5, duration: 0.5 }, 0.85)
      .set([petalMaskRef.current, ribbonMaskRef.current], { autoAlpha: 0 }, 1.55)
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.3)
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.55 }, 1.4)
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.55 }, 1.5)
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.65)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.8)
      .call(() => setOpeningComplete(true));

    timelineRef.current = tl;
    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [playOpening]);

  function handleSkip() {
    timelineRef.current?.progress(1);
    setOpeningComplete(true);
  }

  function toggleVideo() {
    const video = videoElRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setVideoPaused(false);
    } else {
      video.pause();
      setVideoPaused(true);
    }
  }

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-noir"
      aria-label="Le Grand Amour — dos detalhes à grande declaração"
    >
      {/* Layer 3 — the settled hero: main film, always present */}
      <div ref={mainMaskRef} className="absolute inset-0 z-[3] overflow-hidden">
        <div ref={mainInnerRef} className="absolute inset-[-8%_0_-8%_0]">
          <ManagedVideo
            clipId="hero-bouquet"
            description={heroMedia?.alt ?? "Filme da coleção Le Grand Amour: buquê de rosas vermelhas."}
            aspectClassName="h-full w-full"
            objectPositionClassName="object-[62%_38%]"
            priority
            showDebugLabel={false}
            onVideoElement={(el) => {
              videoElRef.current = el;
              setHasVideo(Boolean(el));
            }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,5,4,0.68) 0%, rgba(7,5,4,0.32) 38%, transparent 62%), linear-gradient(0deg, rgba(7,5,4,0.55) 0%, transparent 30%, transparent 78%, rgba(7,5,4,0.4) 100%)",
          }}
        />
      </div>

      {/* Layer 2 — packaging/ribbon finish detail, covers layer 3 during the opening */}
      <div ref={ribbonMaskRef} className="absolute inset-0 z-[2] overflow-hidden">
        <div ref={ribbonInnerRef} className="absolute inset-[-8%_0_-8%_0]">
          {ribbonMedia && (
            <Image
              src={ribbonMedia.temporaryImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              data-temporary-media="true"
            />
          )}
        </div>
      </div>

      {/* Layer 1 — petal detail, first thing visible */}
      <div ref={petalMaskRef} className="absolute inset-0 z-[1] overflow-hidden">
        <div ref={petalInnerRef} className="absolute inset-[-8%_0_-8%_0]">
          {petalMedia && (
            <Image
              src={petalMedia.temporaryImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              data-temporary-media="true"
            />
          )}
        </div>
      </div>

      {/* Text content — same elements whether the opening plays or is skipped */}
      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 md:justify-center md:pb-0 md:pl-16 lg:pl-24">
        <div className="max-w-lg text-center md:text-left">
          <p ref={eyebrowRef} className="eyebrow">
            {hero.eyebrow}
          </p>
          <h1 className="mt-3 font-display leading-[0.95] text-ivory text-[2.75rem] sm:text-6xl lg:text-[4.75rem]">
            <span ref={line1Ref} className="block">
              {line1}
            </span>
            <span ref={line2Ref} className="block">
              {line2}
            </span>
          </h1>
          <p ref={taglineRef} className="mt-5 max-w-md font-display text-lg italic text-champagne sm:text-2xl">
            &ldquo;{hero.tagline}&rdquo;
          </p>
          <div ref={ctaRef} className="mt-7 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <AtelierButton href="#reserva" variant="primary">
              {hero.ctaPrimary}
            </AtelierButton>
            <AtelierButton href="#colecao" variant="secondary">
              {hero.ctaSecondary}
            </AtelierButton>
          </div>
        </div>
      </div>

      {showSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute right-5 top-24 z-20 rounded-[2px] border border-ivory/25 bg-noir/50 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.16em] text-ivory/80 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-ivory sm:top-28"
        >
          Pular abertura
        </button>
      )}

      {hasVideo && (
        <button
          type="button"
          onClick={toggleVideo}
          aria-pressed={videoPaused}
          className="absolute bottom-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 bg-noir/50 text-ivory/80 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-ivory"
          aria-label={videoPaused ? "Reproduzir o filme de fundo" : "Pausar o filme de fundo"}
        >
          {videoPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
      )}
    </section>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" fill="currentColor" />
      <rect x="7" y="1" width="3" height="10" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 1.5v9l7-4.5-7-4.5Z" fill="currentColor" />
    </svg>
  );
}
