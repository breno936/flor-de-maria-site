"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useIsDesktopFinePointer } from "@/lib/accessibility/useMediaQuery";
import { hero, brand } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";

const words = hero.title.split(" ");
const line1 = words.slice(0, -1).join(" ");
const line2 = words.slice(-1).join(" ");

const bgMedia = temporaryMedia["rose-lateral-light"];
const midMedia = temporaryMedia["hands-selecting"];
const fgMedia = temporaryMedia["ribbon-detail"];

/**
 * Scene 1 — "a declaração se abre". A single ScrollTrigger-scrubbed timeline
 * (0–100) drives everything: the clip-path window growing from a small frame
 * sandwiched between the two title lines into a full-bleed image, the lines
 * travelling apart and out of frame, and three real photographs moving at
 * different rates to read as depth rather than one flat zoom. Reduced-motion
 * visitors get `HeroStatic` below instead — no pin, no scrub, full content
 * on first paint.
 */
export default function HeroExpand() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <HeroStatic /> : <HeroMotion />;
}

function HeroMotion() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const taglineGroupRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const bgOuterRef = useRef<HTMLDivElement>(null);
  const bgCursorRef = useRef<HTMLDivElement>(null);
  const midOuterRef = useRef<HTMLDivElement>(null);
  const midCursorRef = useRef<HTMLDivElement>(null);
  const fgOuterRef = useRef<HTMLDivElement>(null);
  const fgCursorRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const finePointer = useIsDesktopFinePointer();

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => buildTimeline({ endPx: () => window.innerHeight * 1.1 }));
    mm.add("(max-width: 767px)", () => buildTimeline({ endPx: () => window.innerHeight * 0.55 }));

    function buildTimeline({ endPx }: { endPx: () => number }) {
        gsap.set(windowRef.current, { clipPath: "inset(30% 15% 30% 15% round 4px)" });
        gsap.set(taglineGroupRef.current, { opacity: 1, y: 0 });
        gsap.set(scrollCueRef.current, { opacity: 1 });

        const trigger = ScrollTrigger.create({
          trigger: outer,
          start: "top top",
          end: () => `+=${endPx()}`,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress * 100;

            const windowP = phase(p, 15, 80);
            const inset = 30 - windowP * 30;
            const insetH = 15 - windowP * 15;
            gsap.set(windowRef.current, {
              clipPath: `inset(${inset}% ${insetH}% ${inset}% ${insetH}% round ${4 - windowP * 4}px)`,
            });

            const travelP = phase(p, 15, 78);
            const ease = travelP * travelP * (3 - 2 * travelP); // smoothstep
            gsap.set(line1Ref.current, { yPercent: -ease * 145, opacity: 1 - phase(p, 55, 78) });
            gsap.set(line2Ref.current, { yPercent: ease * 145, opacity: 1 - phase(p, 55, 78) });

            const fadeP = phase(p, 18, 38);
            gsap.set(eyebrowRef.current, { opacity: 1 - fadeP, y: -fadeP * 12 });
            gsap.set(taglineGroupRef.current, { opacity: 1 - fadeP, y: fadeP * 16 });
            const cueFade = phase(p, 8, 22);
            gsap.set(scrollCueRef.current, { opacity: 1 - cueFade });

            gsap.set(bgOuterRef.current, {
              scale: 1 + windowP * 0.12,
              yPercent: -windowP * 3,
            });
            gsap.set(midOuterRef.current, {
              scale: 1.05 + windowP * 0.28,
              yPercent: -windowP * 9,
              opacity: 0.55 + windowP * 0.45,
            });
            gsap.set(fgOuterRef.current, {
              scale: 1.05 + windowP * 0.22,
              xPercent: -windowP * 6,
              yPercent: windowP * 4,
            });
            gsap.set(scrimRef.current, { opacity: 0.85 - windowP * 0.35 });
          },
        });

      return () => trigger.kill();
    }

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!finePointer) return;
    const sticky = stickyRef.current;
    if (!sticky) return;

    const setters = [
      bgCursorRef.current && gsap.quickTo(bgCursorRef.current, "x", { duration: 0.6, ease: "power2.out" }),
      bgCursorRef.current && gsap.quickTo(bgCursorRef.current, "y", { duration: 0.6, ease: "power2.out" }),
      midCursorRef.current && gsap.quickTo(midCursorRef.current, "x", { duration: 0.5, ease: "power2.out" }),
      midCursorRef.current && gsap.quickTo(midCursorRef.current, "y", { duration: 0.5, ease: "power2.out" }),
      fgCursorRef.current && gsap.quickTo(fgCursorRef.current, "x", { duration: 0.4, ease: "power2.out" }),
      fgCursorRef.current && gsap.quickTo(fgCursorRef.current, "y", { duration: 0.4, ease: "power2.out" }),
    ];
    const [bgX, bgY, midX, midY, fgX, fgY] = setters;

    const onMove = (event: PointerEvent) => {
      const rect = sticky.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      bgX?.(nx * 6);
      bgY?.(ny * 6);
      midX?.(nx * -14);
      midY?.(ny * -14);
      fgX?.(nx * 22);
      fgY?.(ny * 22);
    };
    sticky.addEventListener("pointermove", onMove);
    return () => sticky.removeEventListener("pointermove", onMove);
  }, [finePointer]);

  return (
    <section
      id="topo"
      ref={outerRef}
      className="relative h-[150svh] md:h-[210svh]"
      aria-label="Le Grand Amour — a declaração se abre"
    >
      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden bg-noir">
        <div ref={windowRef} className="absolute inset-0 overflow-hidden">
          <Layer outerRef={bgOuterRef} cursorRef={bgCursorRef}>
            {bgMedia?.temporaryVideo ? (
              <video
                className="h-full w-full object-cover"
                muted
                playsInline
                autoPlay
                loop
                poster={bgMedia.temporaryVideo.poster}
                data-temporary-media="true"
                aria-hidden="true"
              >
                {bgMedia.temporaryVideo.webm && <source src={bgMedia.temporaryVideo.webm} type="video/webm" />}
                <source src={bgMedia.temporaryVideo.mp4} type="video/mp4" />
              </video>
            ) : (
              bgMedia && (
                <Image
                  src={bgMedia.temporaryImage}
                  alt={bgMedia.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                  data-temporary-media="true"
                />
              )
            )}
          </Layer>

          <Layer outerRef={midOuterRef} cursorRef={midCursorRef} className="opacity-60">
            {midMedia && (
              <Image
                src={midMedia.temporaryImage}
                alt=""
                fill
                sizes="80vw"
                className="object-cover object-[65%_40%]"
                data-temporary-media="true"
              />
            )}
          </Layer>

          <Layer
            outerRef={fgOuterRef}
            cursorRef={fgCursorRef}
            className="opacity-60 blur-md"
            style={{ maskImage: "linear-gradient(125deg, black 10%, transparent 48%)", WebkitMaskImage: "linear-gradient(125deg, black 10%, transparent 48%)" }}
          >
            {fgMedia && (
              <Image
                src={fgMedia.temporaryImage}
                alt=""
                fill
                sizes="70vw"
                className="object-cover object-[42%_55%]"
                data-temporary-media="true"
              />
            )}
          </Layer>

          <div
            ref={scrimRef}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(7,5,4,0.95) 0%, rgba(7,5,4,0.55) 32%, rgba(7,5,4,0.25) 55%, rgba(7,5,4,0.45) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p ref={eyebrowRef} className="eyebrow">
            {hero.eyebrow}
          </p>

          <div ref={line1Ref} className="mt-3 will-change-transform">
            <h1 className="font-display text-[2.6rem] leading-[0.95] text-ivory sm:text-6xl lg:text-[5rem]">
              {line1}
            </h1>
          </div>

          <div className="h-[26svh] w-[78vw] max-w-[560px] shrink-0 sm:h-[34svh] md:h-[40svh] md:w-[42vw]" aria-hidden="true" />

          <div ref={line2Ref} className="will-change-transform">
            <h1 className="font-display text-[2.6rem] leading-[0.95] text-ivory sm:text-6xl lg:text-[5rem]">
              {line2}
            </h1>
          </div>

          <div ref={taglineGroupRef} className="mt-5 flex flex-col items-center gap-4">
            <p className="max-w-md font-display text-lg italic text-champagne sm:text-2xl">
              &ldquo;{hero.tagline}&rdquo;
            </p>
            <p className="hidden max-w-md font-sans text-sm text-ivory/75 sm:block">{hero.body}</p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
              <AtelierButton href="#reserva" variant="primary">
                {hero.ctaPrimary}
              </AtelierButton>
              <AtelierButton href="#colecao" variant="secondary">
                {hero.ctaSecondary}
              </AtelierButton>
            </div>
          </div>
        </div>

        <div
          ref={scrollCueRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-ivory/60"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">Role</span>
          <span className="h-8 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>

        <span className="sr-only">{brand.collabLine}</span>
      </div>
    </section>
  );
}

function Layer({
  outerRef,
  cursorRef,
  children,
  className = "",
  style,
}: {
  outerRef: React.RefObject<HTMLDivElement | null>;
  cursorRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div ref={outerRef} className={`absolute inset-0 will-change-transform ${className}`} style={style}>
      <div ref={cursorRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function HeroStatic() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-noir py-32"
      aria-label="Le Grand Amour — abertura da coleção"
    >
      <div className="absolute inset-0">
        {bgMedia && (
          <Image
            src={bgMedia.temporaryImage}
            alt={bgMedia.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            data-temporary-media="true"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,5,4,0.92) 0%, rgba(7,5,4,0.55) 40%, rgba(7,5,4,0.3) 100%)",
          }}
        />
      </div>

      <div className="container-lga relative z-10 max-w-3xl text-center">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] text-ivory sm:text-6xl">{hero.title}</h1>
        <p className="mt-5 font-display text-xl italic text-champagne sm:text-2xl">
          &ldquo;{hero.tagline}&rdquo;
        </p>
        <p className="mt-4 font-sans text-sm text-ivory/80 sm:text-base">{hero.body}</p>
        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <AtelierButton href="#reserva" variant="primary">
            {hero.ctaPrimary}
          </AtelierButton>
          <AtelierButton href="#colecao" variant="secondary">
            {hero.ctaSecondary}
          </AtelierButton>
        </div>
      </div>
    </section>
  );
}
