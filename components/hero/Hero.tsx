"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { hero } from "@/data/content";
import { campaignStills } from "@/data/campaign-photos";
import ManagedVideo from "@/components/media/ManagedVideo";
import StartServiceCTA from "@/components/cta/StartServiceCTA";

const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_BOTTOM = "inset(100% 0% 0% 0%)";
const HIDDEN_CENTER = "inset(0% 50% 0% 50%)";

const petalMedia = campaignStills["petal-macro"];
const ribbonMedia = campaignStills["ribbon-detail"];
const heroMedia = campaignStills["rose-lateral-light"];

/**
 * Etapa 01 — DESEJO. A single ≤2.3s GSAP timeline, not tied to scroll:
 * matéria (petal) → acabamento (fita) → presença (mão e rosa, cortina
 * central) → assinatura (eyebrow, título, frase principal, texto de apoio,
 * CTA). See MEDIA-MANIFEST.md for reference-source notes.
 *
 * The base composition — main film, eyebrow, title, phrase, support text,
 * CTA — is always in the DOM with its final, fully visible values; only
 * when `playOpening` is true (resolved client-side, after hydration) do the
 * opening layers mount and the base layer's own curtain mask starts closed.
 * No JS, reduced motion, or a direct anchor load all land on that same base
 * state with nothing missing — every essential text stays legible even if
 * the animation never runs. That's also what guards against the opening
 * ever leaving a text element stuck at opacity 0: nothing here is hidden by
 * a JSX `style` prop (which would be re-applied — and silently undo any
 * GSAP tween — on every re-render), only by this one-time `useLayoutEffect`
 * write, gone for good the moment `playOpening` is false.
 */
function resolveShouldPlayOpening(): boolean {
  if (typeof window === "undefined") return false;
  const hasHash = Boolean(window.location.hash) && window.location.hash !== "#desejo";
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
  const logoInnerRef = useRef<HTMLSpanElement>(null);
  const signatureInnerRef = useRef<HTMLSpanElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
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
  useLayoutEffect(() => {
    if (!playOpening) return;

    gsap.set(curtainMaskRef.current, { clipPath: HIDDEN_CENTER });
    // The rose "surges" into view — starts visibly smaller (0.88) than its
    // resting size, not just a subtle settle-down, per the brief's own values.
    gsap.set(curtainInnerRef.current, { scale: 0.88 });
    gsap.set(logoInnerRef.current, { opacity: 0, scale: 1.04 });
    gsap.set(signatureInnerRef.current, { yPercent: 110 });
    gsap.set([phraseRef.current, supportRef.current, ctaRef.current], { opacity: 0, y: 16 });
    gsap.set(petalInnerRef.current, { yPercent: -3, scale: 1.04 });
    gsap.set(ribbonMaskRef.current, { clipPath: HIDDEN_BOTTOM });
    gsap.set(ribbonInnerRef.current, { yPercent: 3 });
    if (isDesktop) gsap.set(threadTieRef.current, { scaleY: 0, opacity: 1 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    tl.to(petalInnerRef.current, { yPercent: 0, scale: 1, duration: 0.4 }, 0)
      // Mask (clip-path wipe) and inner content (counter-drift) read as one
      // motion — a mismatched ease between the two made the photo look like
      // it "slipped" relative to its own reveal window. Same explicit ease
      // on both keeps the wipe edge and the image locked together.
      //
      // Both clip-path tweens use `.fromTo()` with an explicit starting
      // string rather than `.to()`: HIDDEN_BOTTOM/HIDDEN_CENTER are
      // symmetric insets, and browsers serialize symmetric inset() values
      // into a shorter canonical form GSAP can't reliably infer a start
      // value from — passing the from-value as our own literal sidesteps
      // that round-trip entirely.
      .fromTo(ribbonMaskRef.current, { clipPath: HIDDEN_BOTTOM }, { clipPath: OPEN_CLIP, duration: 0.6, ease: "power2.out" }, 0.22)
      .to(ribbonInnerRef.current, { yPercent: 0, duration: 0.6, ease: "power2.out" }, 0.22)
      .fromTo(curtainMaskRef.current, { clipPath: HIDDEN_CENTER }, { clipPath: OPEN_CLIP, duration: 0.7, ease: "power2.inOut" }, 0.65)
      .to(curtainInnerRef.current, { scale: 1, duration: 0.85, ease: "power2.out" }, 0.65)
      .set([petalMaskRef.current, ribbonMaskRef.current], { autoAlpha: 0 }, 1.35)
      .call(() => setOverlaysDone(true), [], 1.35)
      .to(logoInnerRef.current, { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 1.0)
      .to(signatureInnerRef.current, { yPercent: 0, duration: 0.4 }, 1.3)
      .to(phraseRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.3)
      .to(supportRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.5)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.68)
      // Belt-and-suspenders: guarantee every essential text element lands
      // exactly at its final visible value, even if a slow device dropped
      // frames mid-tween — nothing essential is allowed to end up stuck
      // between states.
      .set([logoInnerRef.current], { opacity: 1, scale: 1 })
      .set([signatureInnerRef.current], { yPercent: 0 })
      .set([phraseRef.current, supportRef.current, ctaRef.current], { opacity: 1, y: 0 })
      .call(() => setOpeningComplete(true), [], 2.15);

    // The thread — it "prende a cortina": a single red line appears to hold
    // the curtain seam as it starts to part, drawn in as the curtain opens,
    // then released (fades) the instant the curtain is fully open.
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
    // connection can open the curtain onto a frozen poster frame. Gate
    // playback start on the film actually being ready (`canplay`), capped
    // by a short fallback so a very slow connection still gets the opening.
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
  // Mobile gets a noticeably smaller amplitude than desktop, not zero.
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
      id="desejo"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-noir"
      aria-label="Lê Grand Amour — amor em sua forma mais grandiosa"
    >
      {/* Base composition — always rendered with its final values, z-[3]
          for the film itself; every essential text lives in a higher
          stacking context (z-10) so it can never end up visually trapped
          behind the curtain, thread or overlay layers below it. */}
      <div ref={curtainMaskRef} className="absolute inset-0 z-[3] overflow-hidden">
        <div ref={curtainInnerRef} className="absolute inset-0">
          <ManagedVideo
            clipId="rose-lateral-light"
            description={heroMedia?.alt ?? "Campanha Lê Grand Amour: buquê de rosas vermelhas sobre fundo escuro."}
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
        {/* Strengthened, always-on scrim (not tied to the opening
            animation) — guarantees contrast for the text column
            regardless of the underlying frame's brightness, on both the
            left-aligned desktop layout and the bottom-centered mobile one. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,5,4,0.78) 0%, rgba(7,5,4,0.42) 42%, rgba(7,5,4,0.12) 68%, transparent 100%), linear-gradient(0deg, rgba(7,5,4,0.8) 0%, rgba(7,5,4,0.28) 34%, transparent 55%, transparent 75%, rgba(7,5,4,0.5) 100%)",
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

      {/* Text content — same elements whether the opening plays or is
          skipped, always above every visual layer (z-10). */}
      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 md:justify-center md:pb-0 md:pl-16 lg:pl-24">
        <div className="max-w-lg text-center md:text-left">
          {/* O logotipo oficial é usado como imagem — nunca reconstruído em
              fonte web. Funciona como o h1 da página: a imagem carrega o
              nome da marca, o texto alternativo entrega o nome acessível. */}
          <h1 className="inline-block">
            <span
              ref={logoInnerRef}
              className="relative inline-block h-[4.2rem] w-[13rem] sm:h-[5.4rem] sm:w-[16.5rem] lg:h-[6.4rem] lg:w-[19.5rem]"
            >
              {/* The official logo ships as a flattened JPEG on a black
                  canvas. `mix-blend-screen` can't drop that canvas here —
                  this text column is its own stacking context (z-10), so
                  the blend never reaches the photo underneath and a dark
                  "tile" showed. The -alpha file is the same artwork with
                  the black canvas baked out to transparency instead. */}
              <Image
                src="/assets/le-grand-amour/le-grand-amour-logo-alpha.webp"
                alt={hero.logoAlt}
                fill
                priority
                sizes="(max-width: 640px) 13rem, (max-width: 1024px) 16.5rem, 19.5rem"
                className="object-contain object-left"
              />
            </span>
          </h1>
          <div className="mt-2 overflow-hidden">
            <span ref={signatureInnerRef} className="mono-label block">
              {hero.signature}
            </span>
          </div>

          {/* Frase principal — entrega o significado; o logotipo apenas
              apresenta a campanha, nunca disputam o mesmo protagonismo. */}
          <p ref={phraseRef} className="mt-6 max-w-md font-display text-[clamp(2.2rem,4vw,3.2rem)] italic leading-[1.05] text-champagne">
            {hero.phraseLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <p ref={supportRef} className="mt-5 max-w-sm font-sans text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6] text-ivory/75">
            {hero.support}
          </p>

          <div ref={ctaRef} className="mt-8 flex justify-center md:justify-start">
            <StartServiceCTA />
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
                  src={ribbonMedia.image}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
          {/* Petal (matéria) — the very first thing the visitor sees, so it
              is already fully open on mount; only scale/drift animate. */}
          <div ref={petalMaskRef} className="absolute inset-0 z-[1] overflow-hidden">
            <div ref={petalInnerRef} className="absolute inset-[-8%_0_-8%_0]">
              {petalMedia && (
                <Image
                  src={petalMedia.image}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
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
