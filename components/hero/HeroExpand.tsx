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
const fgMedia = temporaryMedia["ribbon-detail"];

/**
 * Scene 1 — "a declaração se abre". At rest (0%) this reads as a finished
 * campaign cover: the two title lines sit tight together as one name, a
 * substantial photograph already fills the middle of the frame (not a thin
 * strip), and the CTA row sits on solid dark ground below it — nothing is
 * overlaid on the photo, so nothing can look forgotten there.
 *
 * On scroll, the photo's clip-path grows from that already-large frame to
 * full-bleed, eating the dark bands above and below it; the title exits
 * upward (the two lines drifting apart from each other as they go) and the
 * CTA group exits downward, in sync with the frame's edges reaching them —
 * so nothing lingers as a half-faded residue once the photo takes over.
 *
 * Only two real photographs are layered (background + a soft blurred
 * foreground accent) — an earlier version also layered a second crop of the
 * same hand-and-rose photo as a "midground", which produced a visible
 * double-exposure/duplicated-hand artifact. Fewer coherent layers beat more
 * layers that fight each other.
 */
export default function HeroExpand() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <HeroStatic /> : <HeroMotion />;
}

function HeroMotion() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const titleZoneRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ctaZoneRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const bgOuterRef = useRef<HTMLDivElement>(null);
  const bgCursorRef = useRef<HTMLDivElement>(null);
  const fgOuterRef = useRef<HTMLDivElement>(null);
  const fgCursorRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const finePointer = useIsDesktopFinePointer();

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () =>
      buildTimeline({ endPx: () => window.innerHeight * 1.05, topInset: 30, bottomInset: 17, sideInset: 11 })
    );
    mm.add("(max-width: 767px)", () =>
      buildTimeline({ endPx: () => window.innerHeight * 0.6, topInset: 27, bottomInset: 20, sideInset: 7 })
    );

    function buildTimeline({
      endPx,
      topInset,
      bottomInset,
      sideInset,
    }: {
      endPx: () => number;
      topInset: number;
      bottomInset: number;
      sideInset: number;
    }) {
      gsap.set(windowRef.current, {
        clipPath: `inset(${topInset}% ${sideInset}% ${bottomInset}% ${sideInset}% round 3px)`,
      });

      const trigger = ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: () => `+=${endPx()}`,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress * 100;

          const growP = phase(p, 15, 68);
          const growEase = growP * growP * (3 - 2 * growP);
          const sideP = phase(p, 15, 48);
          const sideEase = sideP * sideP * (3 - 2 * sideP);
          gsap.set(windowRef.current, {
            clipPath: `inset(${topInset - growEase * topInset}% ${sideInset - sideEase * sideInset}% ${
              bottomInset - growEase * bottomInset
            }% ${sideInset - sideEase * sideInset}% round ${3 - growEase * 3}px)`,
          });

          gsap.set(line1Ref.current, { yPercent: -growEase * 120, opacity: 1 - phase(p, 14, 30) });
          gsap.set(line2Ref.current, { yPercent: -growEase * 85, opacity: 1 - phase(p, 17, 33) });
          gsap.set(eyebrowRef.current, { opacity: 1 - phase(p, 8, 18), yPercent: -growEase * 60 });

          gsap.set(ctaZoneRef.current, { yPercent: growEase * 55, opacity: 1 - phase(p, 14, 30) });
          gsap.set(scrollCueRef.current, { opacity: 1 - phase(p, 4, 12) });

          gsap.set(bgOuterRef.current, { scale: 1 + growEase * 0.08, yPercent: -growEase * 2 });
          gsap.set(fgOuterRef.current, {
            scale: 1.05 + growEase * 0.18,
            xPercent: -growEase * 5,
            yPercent: growEase * 3,
          });
          gsap.set(scrimRef.current, { opacity: 0.55 - growEase * 0.3 + phase(p, 85, 100) * 0.25 });
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

    const bgX = bgCursorRef.current && gsap.quickTo(bgCursorRef.current, "x", { duration: 0.6, ease: "power2.out" });
    const bgY = bgCursorRef.current && gsap.quickTo(bgCursorRef.current, "y", { duration: 0.6, ease: "power2.out" });
    const fgX = fgCursorRef.current && gsap.quickTo(fgCursorRef.current, "x", { duration: 0.4, ease: "power2.out" });
    const fgY = fgCursorRef.current && gsap.quickTo(fgCursorRef.current, "y", { duration: 0.4, ease: "power2.out" });

    const onMove = (event: PointerEvent) => {
      const rect = sticky.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      bgX?.(nx * 5);
      bgY?.(ny * 5);
      fgX?.(nx * 18);
      fgY?.(ny * 18);
    };
    sticky.addEventListener("pointermove", onMove);
    return () => sticky.removeEventListener("pointermove", onMove);
  }, [finePointer]);

  return (
    <section
      id="topo"
      ref={outerRef}
      className="relative h-[160svh] md:h-[205svh]"
      aria-label="Le Grand Amour — a declaração se abre"
    >
      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden bg-noir">
        <div ref={windowRef} className="absolute inset-0 overflow-hidden">
          <Layer outerRef={bgOuterRef} cursorRef={bgCursorRef}>
            {bgMedia && (
              <Image
                src={bgMedia.temporaryImage}
                alt={bgMedia.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[50%_38%]"
                data-temporary-media="true"
              />
            )}
          </Layer>

          <Layer
            outerRef={fgOuterRef}
            cursorRef={fgCursorRef}
            className="opacity-55 blur-md"
            style={{
              maskImage: "linear-gradient(125deg, black 8%, transparent 42%)",
              WebkitMaskImage: "linear-gradient(125deg, black 8%, transparent 42%)",
            }}
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
                "linear-gradient(180deg, rgba(7,5,4,0.35) 0%, transparent 22%, transparent 78%, rgba(7,5,4,0.4) 100%)",
            }}
          />
        </div>

        <div ref={titleZoneRef} className="absolute inset-x-0 top-0 z-10 pt-24 text-center sm:pt-24 md:pt-28">
          <p ref={eyebrowRef} className="eyebrow">
            {hero.eyebrow}
          </p>
          <div className="mt-3 will-change-transform">
            <h1 className="font-display text-[2.5rem] leading-[0.98] text-ivory sm:text-6xl lg:text-[4.6rem]">
              <span ref={line1Ref} className="block will-change-transform">
                {line1}
              </span>
              <span ref={line2Ref} className="block will-change-transform">
                {line2}
              </span>
            </h1>
          </div>
        </div>

        <div
          ref={ctaZoneRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-6 pb-14 text-center will-change-transform sm:pb-16 md:pb-20"
        >
          <p className="max-w-md font-display text-lg italic text-champagne sm:text-2xl">
            &ldquo;{hero.tagline}&rdquo;
          </p>
          <p className="hidden max-w-md font-sans text-sm text-ivory/75 sm:block">{hero.body}</p>
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center">
            <AtelierButton href="#reserva" variant="primary">
              {hero.ctaPrimary}
            </AtelierButton>
            <AtelierButton href="#colecao" variant="secondary">
              {hero.ctaSecondary}
            </AtelierButton>
          </div>
        </div>

        <div
          ref={scrollCueRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-3 z-10 hidden flex-col items-center gap-1.5 text-ivory/60 sm:flex"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">Role</span>
          <span className="h-6 w-px bg-gradient-to-b from-gold to-transparent" />
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
            className="object-cover object-[50%_38%]"
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
