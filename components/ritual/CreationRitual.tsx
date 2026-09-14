"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { ritual } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import type { MediaClipId } from "@/data/media-manifest";

const stepMedia: MediaClipId[] = ["hands-selecting", "bouquet-assembly", "ribbon-detail", "delivery-moment"];
const media = stepMedia.map((id) => temporaryMedia[id]!);

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/**
 * Cena 5 — "O Ritual". Desktop (≥1024px): the original pinned crossfade
 * scene. Mobile/tablet: its own pinned sequence (`RitualMobilePinned`) —
 * shorter (220–250svh vs. 320svh) and built from continuous scale/brightness/
 * vertical-drift instead of a plain crossfade, so each stage reads as its
 * own beat rather than a slideshow. Reduced motion, at any breakpoint, gets
 * `RitualGallery` — a swipeable, user-driven filmstrip with nothing
 * auto-playing.
 */
export default function CreationRitual() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  if (reducedMotion) return <RitualGallery reducedMotion={reducedMotion} />;
  return isDesktop ? <RitualPinned /> : <RitualMobilePinned />;
}

function RitualPinned() {
  const outerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(frameRefs.current[0], { opacity: 1 });
    gsap.set(frameRefs.current.slice(1), { opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 2.2}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const stepCount = stepMedia.length;
        const activeIndex = Math.min(stepCount - 1, Math.floor((p / 100) * stepCount));

        // Crossfade windows are centered ON each boundary and shared by the
        // two neighboring frames (not one window ending exactly where the
        // next begins) — otherwise both frames hit opacity 0 at once and
        // the boundary flashes to black instead of handing off cleanly.
        const half = 6;
        frameRefs.current.forEach((frame, i) => {
          const start = (i / stepCount) * 100;
          const end = ((i + 1) / stepCount) * 100;
          const fadeIn = i === 0 ? 1 : phase(p, start - half, start + half);
          const fadeOut = i === stepCount - 1 ? 1 : 1 - phase(p, end - half, end + half);
          gsap.set(frame, { opacity: Math.min(fadeIn, fadeOut) });
        });

        stepRefs.current.forEach((step, i) => {
          gsap.set(step, { color: i === activeIndex ? "var(--ivory)" : "rgba(216,200,168,0.5)" });
        });
        numberRefs.current.forEach((num, i) => {
          gsap.set(num, { color: i === activeIndex ? "var(--rouge)" : "rgba(163,23,31,0.45)" });
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={outerRef}
      id="ritual"
      className="relative h-[320svh]"
      aria-labelledby="ritual-title"
    >
      <div className="sticky top-0 flex h-svh w-full items-end overflow-hidden bg-noir">
        {media.map((m, i) => (
          <div
            key={m.clipId}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            className="absolute inset-0"
          >
            <Image src={m.temporaryImage} alt={m.alt} fill sizes="100vw" className="object-cover" data-temporary-media="true" />
          </div>
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,6,6,0.92) 0%, rgba(7,6,6,0.55) 42%, rgba(7,6,6,0.35) 70%, rgba(7,6,6,0.6) 100%)",
          }}
        />

        <p className="mono-label absolute left-6 top-24 md:left-12 md:top-28">{ritual.eyebrow}</p>
        <p className="mono-label absolute right-6 top-24 max-w-[10rem] text-right md:right-12 md:top-28">
          {ritual.caption}
        </p>

        <div className="container-lga relative w-full pb-16 pt-24 md:pb-24">
          <h2 id="ritual-title" className="max-w-2xl font-display text-4xl leading-tight text-ivory sm:text-5xl">
            {ritual.title}
          </h2>

          <ol className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-4 sm:gap-x-5">
            {ritual.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3 sm:gap-5">
                <span
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="flex items-baseline gap-2 font-sans text-xs uppercase tracking-[0.18em] text-champagne/50"
                >
                  <span
                    ref={(el) => {
                      numberRefs.current[i] = el;
                    }}
                    className="mono-label text-rouge/50"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step}
                </span>
                {i < ritual.steps.length - 1 && (
                  <span className="text-champagne/30" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// Per-stage vertical entry direction (px) — alternating rather than every
// stage arriving from the same side, so the sequence doesn't read as one
// mechanical repeated move four times.
const ENTRY_DIRECTION = [0, 22, -22, 22];

/**
 * Mobile/tablet pinned sequence. Shorter than desktop (`h-[235svh]`, inside
 * the 220–250svh range) and built from continuous scale + brightness +
 * vertical drift rather than a plain crossfade — the outgoing stage scales
 * up and dims ("perde profundidade"), the incoming stage settles in from
 * its own directional offset, and a fill bar under the step list ties the
 * four stages together as one continuous scroll-driven gesture instead of
 * four isolated appear/disappear beats.
 */
function RitualMobilePinned() {
  const outerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeLabelRef = useRef<HTMLParagraphElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const lastActiveIndex = useRef(0);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    const stepCount = stepMedia.length;

    gsap.set(frameRefs.current[0], { opacity: 1, scale: 1, y: 0, filter: "brightness(1)" });
    frameRefs.current.slice(1).forEach((frame, idx) => {
      gsap.set(frame, { opacity: 0, scale: 1.1, y: ENTRY_DIRECTION[idx + 1], filter: "brightness(0.55)" });
    });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 1.35}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const activeIndex = Math.min(stepCount - 1, Math.floor((p / 100) * stepCount));

        // Wide crossfade windows (18% of the total range, vs. desktop's
        // 12%) so most of each stage's own segment is still transforming —
        // "transformação contínua durante todo o trecho" — with only a
        // brief settled pause at each stage's peak for the title/step
        // label to stay legible.
        const half = 9;
        frameRefs.current.forEach((frame, i) => {
          const start = (i / stepCount) * 100;
          const end = ((i + 1) / stepCount) * 100;
          const fadeIn = i === 0 ? 1 : phase(p, start - half, start + half);
          const fadeOut = i === stepCount - 1 ? 1 : 1 - phase(p, end - half, end + half);
          const settled = Math.min(fadeIn, fadeOut);
          const dir = ENTRY_DIRECTION[i];
          gsap.set(frame, {
            opacity: settled,
            scale: 1.1 - settled * 0.1,
            y: dir * (1 - fadeIn),
            filter: `brightness(${0.55 + settled * 0.45})`,
          });
        });

        numberRefs.current.forEach((num, i) => {
          gsap.set(num, { color: i === activeIndex ? "var(--rouge)" : "rgba(163,23,31,0.45)" });
        });
        gsap.set(progressFillRef.current, { scaleX: p / 100 });

        if (activeIndex !== lastActiveIndex.current && activeLabelRef.current) {
          lastActiveIndex.current = activeIndex;
          const label = activeLabelRef.current;
          label.textContent = ritual.steps[activeIndex];
          gsap.fromTo(label, { opacity: 0.3 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={outerRef} id="ritual" className="relative h-[235svh] lg:hidden" aria-labelledby="ritual-title-mobile">
      <div className="sticky top-0 flex h-svh w-full items-end overflow-hidden bg-noir">
        {media.map((m, i) => (
          <div
            key={m.clipId}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            className="absolute inset-0"
          >
            <Image src={m.temporaryImage} alt={m.alt} fill sizes="100vw" className="object-cover" data-temporary-media="true" />
          </div>
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,6,6,0.94) 0%, rgba(7,6,6,0.55) 45%, rgba(7,6,6,0.3) 72%, rgba(7,6,6,0.65) 100%)",
          }}
        />

        <p className="mono-label absolute left-6 top-20">{ritual.eyebrow}</p>

        <div className="container-lga relative w-full pb-12 pt-20">
          <h2 id="ritual-title-mobile" className="max-w-xs font-display text-3xl leading-[1.15] text-ivory">
            {ritual.title}
          </h2>
          <p className="mt-3 max-w-[13rem] font-sans text-xs leading-relaxed text-champagne/70">{ritual.caption}</p>

          <div className="relative mt-8 h-px w-full bg-champagne/20">
            <div ref={progressFillRef} className="absolute inset-y-0 left-0 h-px w-full origin-left scale-x-0 bg-rouge" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            {ritual.steps.map((step, i) => (
              <span
                key={step}
                ref={(el) => {
                  numberRefs.current[i] = el;
                }}
                className="mono-label text-rouge/50"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
          <p ref={activeLabelRef} className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-ivory">
            {ritual.steps[0]}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Swipeable filmstrip: one full-bleed frame per stage, native CSS scroll-snap
 * (not GSAP-driven — this is deliberately just the browser's own smooth,
 * momentum-correct touch scrolling, the thing mobile visitors already know
 * how to use). A tap on a dot jumps straight there; the active dot tracks
 * scroll position via a plain scroll listener. Used only under reduced
 * motion, at any breakpoint — nothing here auto-plays.
 */
function RitualGallery({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    // `reducedMotion` starts false (server snapshot) and can flip true a
    // moment after mount — always reset to the visible end state here, not
    // just skip, or a stale first pass that set opacity:0 is never undone.
    if (reducedMotion) {
      gsap.set(section, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(section, { opacity: 0, y: 24 });
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const index = Math.round(scroller.scrollLeft / Math.max(1, scroller.clientWidth));
      setActiveIndex(Math.min(stepMedia.length - 1, Math.max(0, index)));
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <section ref={sectionRef} id="ritual" className="relative overflow-hidden bg-noir py-20 md:py-28" aria-labelledby="ritual-title">
      <div className="container-lga">
        <p className="mono-label">{ritual.eyebrow}</p>
        <h2 id="ritual-title" className="mt-4 max-w-md font-display text-3xl leading-[1.1] text-ivory sm:text-4xl">
          {ritual.title}
        </h2>
        <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-champagne/70">{ritual.caption}</p>
      </div>

      <div
        ref={scrollerRef}
        className="mt-10 flex w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {media.map((m, i) => (
          <div key={m.clipId} className="relative aspect-[4/5] w-full shrink-0 snap-center sm:aspect-[3/4]">
            <Image
              src={m.temporaryImage}
              alt={m.alt}
              fill
              sizes="100vw"
              className="object-cover"
              data-temporary-media="true"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(0deg, rgba(7,6,6,0.85) 0%, rgba(7,6,6,0.05) 45%, transparent 70%)" }}
            />
            <div className="absolute bottom-5 left-6 flex items-baseline gap-3">
              <span className="mono-label text-rouge">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivory">{ritual.steps[i]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="container-lga mt-7 flex items-center justify-center gap-3">
        {ritual.steps.map((step, i) => (
          <button
            key={step}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver etapa: ${step}`}
            aria-current={activeIndex === i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "w-7 bg-rouge" : "w-1.5 bg-champagne/30 hover:bg-champagne/55"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
