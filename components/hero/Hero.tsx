"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { hero } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";
import ManagedVideo from "@/components/media/ManagedVideo";

const SESSION_KEY = "lga-hero-opened";
const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_BOTTOM = "inset(100% 0% 0% 0%)";
const HIDDEN_CENTER = "inset(0% 50% 0% 50%)";

const words = hero.title.split(" ");
const line1 = words.slice(0, -1).join(" ");
const line2 = words.slice(-1).join(" ");

const petalMedia = temporaryMedia["petal-macro"];
const ribbonMedia = temporaryMedia["ribbon-detail"];
const heroMedia = temporaryMedia["rose-lateral-light"];

/**
 * "Dos detalhes à grande declaração" — a single ≤2s GSAP timeline, not tied
 * to scroll, reinterpreting the Codrops "Rapid Layers Animation" idea for
 * this collection: matéria (petal) → acabamento (fita) → presença (mão e
 * rosa, cortina central) → assinatura (texto). See MEDIA-MANIFEST.md for
 * what of the reference could/couldn't be inspected.
 *
 * The base composition — main film, title, tagline, CTAs — is always in the
 * DOM with its final, fully visible values; only when `playOpening` is true
 * (resolved client-side, after hydration) do the opening layers mount and
 * the base layer's own curtain mask starts closed. No JS, reduced motion,
 * or a direct anchor load all land on that same base state with nothing
 * missing — the opening is a rendered-on-top enhancement, never a
 * prerequisite for seeing a complete hero.
 */
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
  const playOpening = useSyncExternalStore(
    subscribeNever,
    () => shouldPlayOpeningOnLoad && !reducedMotion,
    () => false
  );
  return <HeroShell playOpening={playOpening} />;
}

function HeroShell({ playOpening }: { playOpening: boolean }) {
  const curtainMaskRef = useRef<HTMLDivElement>(null);
  const curtainInnerRef = useRef<HTMLDivElement>(null);
  const petalMaskRef = useRef<HTMLDivElement>(null);
  const petalInnerRef = useRef<HTMLDivElement>(null);
  const ribbonMaskRef = useRef<HTMLDivElement>(null);
  const ribbonInnerRef = useRef<HTMLDivElement>(null);
  const eyebrowInnerRef = useRef<HTMLSpanElement>(null);
  const line1InnerRef = useRef<HTMLSpanElement>(null);
  const line2InnerRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  const [overlaysDone, setOverlaysDone] = useState(false);
  const [openingComplete, setOpeningComplete] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const showOverlayLayers = playOpening && !overlaysDone;

  // useLayoutEffect (not useEffect): the hidden starting values below must
  // land before the browser paints, and — critically — this whole block
  // must run exactly once when `playOpening` flips true and never again.
  // These elements carry no `style` prop of their own in the JSX (see
  // render below), so once GSAP has written a value here, no later
  // re-render (e.g. the `setOverlaysDone`/`setOpeningComplete` calls below,
  // which do trigger re-renders of this component) can reset it — a
  // JSX-declared `style={{ ... playOpening ... }}` would be reapplied on
  // every one of those re-renders and silently undo whatever GSAP had
  // already animated, which is exactly the bug this replaced: the title
  // and eyebrow lines were snapping back to their hidden position the
  // instant the timeline's own completion callback fired a state update.
  useLayoutEffect(() => {
    if (!playOpening) return;

    gsap.set(curtainMaskRef.current, { clipPath: HIDDEN_CENTER });
    gsap.set(curtainInnerRef.current, { scale: 1.04 });
    gsap.set([eyebrowInnerRef.current, line1InnerRef.current, line2InnerRef.current], { yPercent: 110 });
    gsap.set([taglineRef.current, ctaRef.current], { opacity: 0, y: 16 });
    gsap.set(petalInnerRef.current, { yPercent: -3, scale: 1.04 });
    gsap.set(ribbonMaskRef.current, { clipPath: HIDDEN_BOTTOM });
    gsap.set(ribbonInnerRef.current, { yPercent: 3 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(petalInnerRef.current, { yPercent: 0, scale: 1, duration: 0.4 }, 0)
      .to(ribbonMaskRef.current, { clipPath: OPEN_CLIP, duration: 0.6, ease: "power2.out" }, 0.22)
      .to(ribbonInnerRef.current, { yPercent: 0, duration: 0.6 }, 0.22)
      .to(curtainMaskRef.current, { clipPath: OPEN_CLIP, duration: 0.7, ease: "power2.inOut" }, 0.65)
      .to(curtainInnerRef.current, { scale: 1, duration: 0.75 }, 0.65)
      .set([petalMaskRef.current, ribbonMaskRef.current], { autoAlpha: 0 }, 1.35)
      .call(() => setOverlaysDone(true), [], 1.35)
      .to(eyebrowInnerRef.current, { yPercent: 0, duration: 0.4 }, 1.0)
      .to(line1InnerRef.current, { yPercent: 0, duration: 0.42 }, 1.12)
      .to(line2InnerRef.current, { yPercent: 0, duration: 0.42 }, 1.24)
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.4)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.55)
      .call(
        () => {
          setOpeningComplete(true);
          sessionStorage.setItem(SESSION_KEY, "1");
        },
        [],
        1.95
      );

    timelineRef.current = tl;
    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [playOpening]);

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

  const showVideoToggle = hasVideo && (!playOpening || openingComplete);

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-noir"
      aria-label="Le Grand Amour — dos detalhes à grande declaração"
    >
      {/* Base composition — always rendered with its final values; this is
          exactly what a no-JS or reduced-motion visitor sees immediately. */}
      <div ref={curtainMaskRef} className="absolute inset-0 z-[3] overflow-hidden">
        <div ref={curtainInnerRef} className="absolute inset-0">
          <ManagedVideo
            clipId="rose-lateral-light"
            description={heroMedia?.alt ?? "Filme da coleção Le Grand Amour: mão erguendo uma rosa vermelha contra fundo escuro."}
            aspectClassName="h-full w-full"
            objectPositionClassName="object-[64%_34%]"
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
              "linear-gradient(90deg, rgba(7,5,4,0.7) 0%, rgba(7,5,4,0.35) 40%, transparent 64%), linear-gradient(0deg, rgba(7,5,4,0.55) 0%, transparent 30%, transparent 78%, rgba(7,5,4,0.4) 100%)",
          }}
        />
      </div>

      {/* Text content — same elements whether the opening plays or is skipped */}
      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 md:justify-center md:pb-0 md:pl-16 lg:pl-24">
        <div className="max-w-lg text-center md:text-left">
          <div className="overflow-hidden">
            <span ref={eyebrowInnerRef} className="eyebrow block">
              {hero.eyebrow}
            </span>
          </div>
          <h1 className="mt-3 font-display leading-[0.95] text-ivory text-[2.75rem] sm:text-6xl lg:text-[4.75rem]">
            <span className="block overflow-hidden">
              <span ref={line1InnerRef} className="block">
                {line1}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={line2InnerRef} className="block">
                {line2}
              </span>
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

      {/* Opening overlays — mounted only while the opening plays, fully
          removed from the render tree afterwards (never left invisible). */}
      {showOverlayLayers && (
        <>
          <div ref={ribbonMaskRef} className="absolute inset-0 z-[2] overflow-hidden">
            <div ref={ribbonInnerRef} className="absolute inset-[-8%_0_-8%_0]">
              {ribbonMedia && (
                <Image src={ribbonMedia.temporaryImage} alt="" fill sizes="100vw" className="object-cover" data-temporary-media="true" />
              )}
            </div>
          </div>
          {/* Petal (matéria) — the very first thing the visitor sees, so it
              is already fully open on mount (no wipe-from-nothing at t=0);
              only scale/drift animate. Everything above covers it in turn. */}
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
        </>
      )}

      {showVideoToggle && (
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
