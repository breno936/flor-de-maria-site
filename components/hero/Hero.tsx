"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { hero } from "@/data/content";
import { campaignStills, heroRevealDetail } from "@/data/campaign-photos";
import { introPlaysOnLoad } from "@/components/intro/LogoIntro";
import ManagedVideo from "@/components/media/ManagedVideo";
import StartServiceCTA from "@/components/cta/StartServiceCTA";

const heroMedia = campaignStills["rose-lateral-light"];

// Where the bouquet sits in each framing (see the object-position classes on
// the ManagedVideo below) — the camera pulls back from that point. Desktop
// and tablet show IMG_4521, phones IMG_4480.
const REVEAL_ORIGIN_DESKTOP = "64% 31%";
const REVEAL_ORIGIN_MOBILE = "28% 52%";
const REVEAL_SCALE_DESKTOP = 2.4;
const REVEAL_SCALE_MOBILE = 2.2;

/**
 * Etapa 01 — DESEJO. "Revelação monumental": a single ~2.6s GSAP timeline,
 * not tied to scroll. It opens on the petals (a close frame of the same
 * look — red roses, black lace glove), then the camera pulls back out of
 * the main photograph, from the bouquet outward, until the whole figure
 * holding it is in frame — the piece's real scale is the reveal. Signature,
 * phrase, support text and CTA follow in one short sequence. When the
 * branded LogoIntro covers this page load, the opening waits for it to
 * start fading instead of playing unseen underneath it.
 *
 * The base composition — main photograph, logo, phrase, support text, CTA
 * — is always in the DOM with its final, fully visible values; only when
 * `playOpening` is true (resolved client-side, after hydration) does the
 * petal layer mount and the base start zoomed in. No JS, reduced motion, or
 * a direct anchor load all land on that same base state with nothing
 * missing. Nothing here is hidden by a JSX `style` prop (which would be
 * re-applied — and silently undo any GSAP tween — on every re-render), only
 * by this one-time `useLayoutEffect` write.
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
  const curtainInnerRef = useRef<HTMLDivElement>(null);
  const detailMaskRef = useRef<HTMLDivElement>(null);
  const detailInnerRef = useRef<HTMLDivElement>(null);
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
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const showDetailLayer = playOpening && !overlaysDone;

  // useLayoutEffect (not useEffect): the starting values below must land
  // before the browser paints, and this whole block must run exactly once
  // when `playOpening` flips true and never again.
  useLayoutEffect(() => {
    if (!playOpening) return;

    // Read the breakpoint directly: `isDesktop` hydrates as false and this
    // effect intentionally doesn't re-run when it settles.
    const wide = window.matchMedia("(min-width: 768px)").matches;
    gsap.set(curtainInnerRef.current, {
      scale: wide ? REVEAL_SCALE_DESKTOP : REVEAL_SCALE_MOBILE,
      transformOrigin: wide ? REVEAL_ORIGIN_DESKTOP : REVEAL_ORIGIN_MOBILE,
    });
    gsap.set(detailInnerRef.current, { scale: 1.12 });
    gsap.set(logoInnerRef.current, { opacity: 0, y: 12 });
    gsap.set(signatureInnerRef.current, { yPercent: 110 });
    gsap.set([phraseRef.current, supportRef.current, ctaRef.current], { opacity: 0, y: 16 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    // Petals first — a slow settle, then they dissolve into the (still
    // zoomed) bouquet underneath while the camera keeps pulling back.
    tl.to(detailInnerRef.current, { scale: 1, duration: 1.1, ease: "power2.out" }, 0)
      .to(detailMaskRef.current, { opacity: 0, duration: 0.7, ease: "power1.inOut" }, 0.55)
      .to(curtainInnerRef.current, { scale: 1, duration: 1.9, ease: "power3.inOut" }, 0.35)
      .call(() => setOverlaysDone(true), [], 1.3)
      .to(logoInnerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.45)
      .to(signatureInnerRef.current, { yPercent: 0, duration: 0.45 }, 1.75)
      .to(phraseRef.current, { opacity: 1, y: 0, duration: 0.45 }, 1.85)
      .to(supportRef.current, { opacity: 1, y: 0, duration: 0.45 }, 2.0)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.45 }, 2.15)
      // Belt-and-suspenders: every essential element lands exactly at its
      // final visible value, even if a slow device dropped frames.
      .set(curtainInnerRef.current, { scale: 1 })
      .set(logoInnerRef.current, { opacity: 1, y: 0 })
      .set(signatureInnerRef.current, { yPercent: 0 })
      .set([phraseRef.current, supportRef.current, ctaRef.current], { opacity: 1, y: 0 })
      .call(() => setOpeningComplete(true), [], 2.65);

    timelineRef.current = tl;

    // Start only once the media the opening shows is actually there — the
    // petal frame and the hero photograph (or its film can play) — otherwise
    // the pull-back plays over an empty black frame on a cold connection.
    // Never before the branded intro starts fading either, or it would play
    // unseen behind it. A cap keeps a very slow connection from waiting
    // forever: the timeline then runs on whatever has arrived.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tl.play();
    };
    const introDelay = introPlaysOnLoad ? 900 : 0;
    const video = videoElRef.current;
    const images = Array.from(sectionRef.current?.querySelectorAll<HTMLImageElement>("img") ?? []).filter(
      (img) => img.getBoundingClientRect().width > 0
    );
    const ready = Promise.all([
      ...images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))),
      video && video.readyState < 3
        ? new Promise<void>((resolve) => video.addEventListener("canplay", () => resolve(), { once: true }))
        : Promise.resolve(),
    ]);
    const timers: number[] = [];
    const introDone = new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, introDelay)));
    Promise.all([ready, introDone]).then(start);
    timers.push(window.setTimeout(start, introDelay + 2500));

    return () => {
      started = true;
      timers.forEach((t) => window.clearTimeout(t));
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

  // Controlled parallax: the main photograph drifts a few px slower than the
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
          for the photograph itself; every essential text lives in a higher
          stacking context (z-10) so it can never end up visually trapped
          behind the petal layer. */}
      <div className="absolute inset-0 z-[3] overflow-hidden">
        <div ref={curtainInnerRef} className="absolute inset-0">
          <ManagedVideo
            clipId="rose-lateral-light"
            description={heroMedia?.alt ?? "Campanha Lê Grand Amour: buquê de rosas vermelhas sobre fundo escuro."}
            aspectClassName="h-full w-full"
            objectPositionClassName="object-[55%_30%] md:object-[64%_34%]"
            // Larger than the viewport on purpose: the opening starts at
            // 2.2–2.4× on the bouquet and has to stay sharp there.
            sizes="240vw"
            mobileSizes="230vw"
            priority
            showDebugLabel={false}
            onVideoElement={(el) => {
              videoElRef.current = el;
              setHasVideo(Boolean(el));
            }}
          />
        </div>
        {/* Always-on scrim (not tied to the opening) — guarantees contrast
            for the text: a left-hand column on desktop, a bottom block on
            phones (where the logo sits over the bouquet, so the vertical
            gradient carries further up and the side one would only dim the
            figure). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,5,4,0.9) 0%, rgba(7,5,4,0.62) 38%, rgba(7,5,4,0.22) 62%, transparent 76%, rgba(7,5,4,0.5) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,5,4,0.78) 0%, rgba(7,5,4,0.42) 42%, rgba(7,5,4,0.12) 68%, transparent 100%), linear-gradient(0deg, rgba(7,5,4,0.8) 0%, rgba(7,5,4,0.28) 34%, transparent 55%, transparent 75%, rgba(7,5,4,0.5) 100%)",
          }}
        />
      </div>

      {/* Petal layer — the first thing the visitor sees, mounted only while
          the opening plays and removed from the tree right after it has
          dissolved (never left invisible). */}
      {showDetailLayer && (
        <div ref={detailMaskRef} aria-hidden="true" className="absolute inset-0 z-[4] overflow-hidden">
          <div ref={detailInnerRef} className="absolute inset-0">
            <Image
              src={heroRevealDetail.src}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={80}
              className="object-cover"
              style={{ objectPosition: "52% 40%" }}
            />
          </div>
        </div>
      )}

      {/* Text content — same elements whether the opening plays or is
          skipped, always above every visual layer (z-10). */}
      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 md:justify-center md:pb-0 md:pl-16 lg:pl-24">
        <div className="max-w-xl text-center md:text-left">
          {/* The official logo is used as an image — never rebuilt in a web
              font — tightly cropped from the transparent export so the mark
              itself, not an empty square canvas, sets the size. It works as
              the page's h1: the image carries the name, the alt text gives
              the accessible name. */}
          <h1 className="inline-block">
            <span
              ref={logoInnerRef}
              className="relative inline-block aspect-[1171/530] w-[16rem] sm:w-[20rem] lg:w-[24rem]"
            >
              <Image
                src="/assets/le-grand-amour/le-grand-amour-wordmark.webp"
                alt={hero.logoAlt}
                fill
                priority
                sizes="(max-width: 640px) 16rem, (max-width: 1024px) 20rem, 24rem"
                className="object-contain object-center md:object-left"
              />
            </span>
          </h1>
          <div className="mt-3 overflow-hidden">
            <span ref={signatureInnerRef} className="mono-label block text-champagne-light/85">
              {hero.signature}
            </span>
          </div>

          {/* Frase principal — entrega o significado; o logotipo apresenta
              a campanha, nunca disputam o mesmo protagonismo. */}
          <p ref={phraseRef} className="mt-7 max-w-md font-display text-[clamp(2rem,3.6vw,3rem)] italic leading-[1.05] text-champagne-light md:max-w-lg">
            {hero.phraseLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <p ref={supportRef} className="mx-auto mt-5 max-w-sm font-sans text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6] text-ivory/85 md:mx-0">
            {hero.support}
          </p>

          <div ref={ctaRef} className="mt-8 flex justify-center md:justify-start">
            <StartServiceCTA />
          </div>
        </div>
      </div>

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
