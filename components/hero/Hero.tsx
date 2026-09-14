"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { hero } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";
import ManagedVideo from "@/components/media/ManagedVideo";

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
 *
 * Plays on every full page load (including refresh) — deliberately not
 * gated behind a "seen once this session" flag. A direct anchor load
 * (e.g. `/#reserva`) still skips it, since the visitor is arriving to see
 * that section, not the top of the page.
 */
function resolveShouldPlayOpening(): boolean {
  if (typeof window === "undefined") return false;
  const hasHash = Boolean(window.location.hash) && window.location.hash !== "#topo";
  return !hasHash;
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
  const sectionRef = useRef<HTMLElement>(null);
  const curtainMaskRef = useRef<HTMLDivElement>(null);
  const curtainInnerRef = useRef<HTMLDivElement>(null);
  const petalMaskRef = useRef<HTMLDivElement>(null);
  const petalInnerRef = useRef<HTMLDivElement>(null);
  const ribbonMaskRef = useRef<HTMLDivElement>(null);
  const ribbonInnerRef = useRef<HTMLDivElement>(null);
  const threadTieRef = useRef<HTMLDivElement>(null);
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
  const [threadDone, setThreadDone] = useState(false);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const showOverlayLayers = playOpening && !overlaysDone;
  // The "tying the curtain" flourish is a desktop-only grace note — on
  // mobile the brief asks to simplify the thread, not reproduce every beat.
  const showThreadTie = playOpening && !threadDone && isDesktop;

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
    // The rose "surges" into view — starts visibly smaller (0.88) than its
    // resting size, not just a subtle settle-down, per the brief's own values.
    gsap.set(curtainInnerRef.current, { scale: 0.88 });
    gsap.set([eyebrowInnerRef.current, line1InnerRef.current, line2InnerRef.current], { yPercent: 110 });
    gsap.set([taglineRef.current, ctaRef.current], { opacity: 0, y: 16 });
    gsap.set(petalInnerRef.current, { yPercent: -3, scale: 1.04 });
    gsap.set(ribbonMaskRef.current, { clipPath: HIDDEN_BOTTOM });
    gsap.set(ribbonInnerRef.current, { yPercent: 3 });
    if (isDesktop) gsap.set(threadTieRef.current, { scaleY: 0, opacity: 1 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    tl.to(petalInnerRef.current, { yPercent: 0, scale: 1, duration: 0.4 }, 0)
      // Mask (clip-path wipe) and inner content (counter-drift) read as one
      // motion — a mismatched ease between the two made the photo look like
      // it "slipped" relative to its own reveal window, most visible right
      // at the tail where the two curves diverge most. Same explicit ease
      // on both keeps the wipe edge and the image locked together.
      //
      // Both clip-path tweens use `.fromTo()` with an explicit starting
      // string rather than `.to()`. The reason: HIDDEN_BOTTOM/HIDDEN_CENTER
      // are symmetric (e.g. left inset === right inset), and the browser
      // serializes symmetric inset() values into a shorter canonical form
      // (`inset(0% 50% 0% 50%)` reads back as `inset(0% 50%)`). `.to()`
      // infers its start value from that serialized computed style, so it
      // was tweening from a 2-token value toward a 4-token target — GSAP's
      // interpolator can't align mismatched token counts, so one axis
      // snapped straight to its end value instead of animating, producing
      // a visible jump partway through the reveal. Passing the from-value
      // as our own literal sidesteps the round-trip through the DOM entirely.
      .fromTo(ribbonMaskRef.current, { clipPath: HIDDEN_BOTTOM }, { clipPath: OPEN_CLIP, duration: 0.6, ease: "power2.out" }, 0.22)
      .to(ribbonInnerRef.current, { yPercent: 0, duration: 0.6, ease: "power2.out" }, 0.22)
      .fromTo(curtainMaskRef.current, { clipPath: HIDDEN_CENTER }, { clipPath: OPEN_CLIP, duration: 0.7, ease: "power2.inOut" }, 0.65)
      .to(curtainInnerRef.current, { scale: 1, duration: 0.85, ease: "power2.out" }, 0.65)
      .set([petalMaskRef.current, ribbonMaskRef.current], { autoAlpha: 0 }, 1.35)
      .call(() => setOverlaysDone(true), [], 1.35)
      .to(eyebrowInnerRef.current, { yPercent: 0, duration: 0.4 }, 1.0)
      .to(line1InnerRef.current, { yPercent: 0, duration: 0.42 }, 1.12)
      .to(line2InnerRef.current, { yPercent: 0, duration: 0.42 }, 1.24)
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.4)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.55)
      .call(() => setOpeningComplete(true), [], 2.05);

    // The thread — it "prende a cortina": a single red line appears to hold
    // the curtain seam as it starts to part, drawn in as the curtain opens,
    // then released (fades) the instant the curtain is fully open. It never
    // touches the CTA directly; the CTA's own double frame (AtelierButton's
    // ThreadFrame, with `threadRevealDelayMs` below) picks the motif back up
    // as its payoff, so the thread reads as one continuous idea in two beats.
    if (isDesktop) {
      tl.to(threadTieRef.current, { scaleY: 1, duration: 0.55, ease: "power2.out" }, 0.55).to(
        threadTieRef.current,
        { opacity: 0, duration: 0.35, ease: "power1.in" },
        1.3
      );
    }
    tl.call(() => setThreadDone(true), [], 1.65);

    timelineRef.current = tl;

    // The whole choreography runs on a fixed clock, but the curtain (0.65s
    // in) uncovers the hero film underneath — starting on schedule
    // regardless of the video's own state means a still-buffering
    // connection can open the curtain onto a frozen poster frame, then
    // visibly "pop" into motion once the video catches up. Gate playback
    // start on the film actually being ready (`canplay`), capped by a short
    // fallback so a very slow connection still gets the opening rather than
    // an indefinite stall. On a typical connection the video is already
    // ready by the time this runs, so `start()` fires immediately below.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tl.play();
    };
    const video = videoElRef.current;
    const fallback = window.setTimeout(start, 550);
    if (video && video.readyState < 3) {
      video.addEventListener("canplay", start, { once: true });
    } else {
      start();
    }

    return () => {
      window.clearTimeout(fallback);
      video?.removeEventListener("canplay", start);
      tl.kill();
      timelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Controlled parallax: the main film drifts a few px slower than the
  // scroll, only across the hero's own height, never under reduced motion.
  // Independent of the opening timeline (different property — y, not scale
  // — so nothing fights over the same value). Mobile gets a noticeably
  // smaller amplitude ("muito sutil") than desktop, not zero — enough to
  // read as alive when the visitor's thumb starts the scroll, not enough to
  // fight the curtain's own settle or shift the crop distractingly on a
  // narrow viewport.
  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const section = sectionRef.current;
    const media = curtainInnerRef.current;
    if (!section || !media) return;

    const amplitude = isDesktop ? 48 : 16;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => gsap.set(media, { y: self.progress * amplitude }),
    });
    return () => trigger.kill();
  }, [reducedMotion, isDesktop]);

  const showVideoToggle = hasVideo && (!playOpening || openingComplete);

  return (
    <section
      id="topo"
      ref={sectionRef}
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
            objectPositionClassName="object-[55%_30%] md:object-[64%_34%]"
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

      {/* The thread tying the curtain shut — desktop-only grace note, gone
          the instant it has released (see showThreadTie above). */}
      {showThreadTie && (
        <div
          ref={threadTieRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-[4] h-32 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-rouge via-rouge/80 to-rouge/0"
        />
      )}

      {/* Text content — same elements whether the opening plays or is skipped */}
      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 md:justify-center md:pb-0 md:pl-16 lg:pl-24">
        <div className="max-w-lg text-center md:text-left">
          <div className="overflow-hidden">
            <span ref={eyebrowInnerRef} className="eyebrow block">
              {hero.eyebrowTop}
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
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-champagne/80">{hero.eyebrow}</p>
          <p ref={taglineRef} className="mt-5 max-w-md font-display text-lg italic text-champagne sm:text-2xl">
            {hero.tagline}
          </p>
          <div ref={ctaRef} className="mt-7 flex justify-center md:justify-start">
            <AtelierButton
              href="#reserva"
              variant="primary"
              threadRevealDelayMs={playOpening ? 1700 : undefined}
            >
              {hero.ctaPrimary}
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
                <Image
                  src={ribbonMedia.temporaryImage}
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

      <p className="mono-label absolute bottom-5 left-5 z-20 hidden sm:block md:bottom-8 md:left-16 lg:left-24">
        ATELIÊ · SP — EDIÇÃO AUTORAL
      </p>

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
