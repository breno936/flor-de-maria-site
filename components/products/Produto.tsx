"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { products } from "@/data/products";
import { produtoScene } from "@/data/content";
import { productPhotos } from "@/data/campaign-photos";
import StartServiceCTA from "@/components/cta/StartServiceCTA";

/** `mobileSrc`: a portrait frame for the full-bleed mobile scene, where the copy covers the lower half. */
type ProductMedia = { src: string; alt: string; mobileSrc?: string };
type ProductDetail = { src: string; position: string };

const bouquet = products.find((p) => p.id === "le-bouquet")!;
const coeur = products.find((p) => p.id === "le-coeur-royale")!;

const bouquetMedia: ProductMedia = productPhotos.bouquet;
const coeurMedia: ProductMedia = productPhotos.coeur;

// The "recortes" the brief asks for — textures and materials (roses,
// ribbon, wrapping, the gold plaque), each from its own frame of the
// official shoot. Object-position values were picked by eye per file.
const bouquetDetails: ProductDetail[] = productPhotos.bouquetDetails;
const coeurDetails: ProductDetail[] = productPhotos.coeurDetails;

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/**
 * Etapa 03 — PRODUTO. Reveals what's actually being sold: the two real
 * creations, always shown at full shape before any detail, never hidden
 * behind an effect. The two get deliberately different treatments rather
 * than matching cards — Lê Bouquet reads tall, sharp-edged and monumental;
 * Lê Cœur Royale reads smaller, soft-edged and close, an intimate object
 * rather than a second trophy shot. Desktop keeps the pinned camera-move
 * between the two (200svh); mobile/tablet drops the pin entirely — "cada
 * produto em um bloco, imagem completa primeiro, informações abaixo."
 */
export default function Produto() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  if (reducedMotion) return <ProdutoStatic reducedMotion={reducedMotion} />;
  return isDesktop ? <ProdutoFocus /> : <ProdutoMobilePinned />;
}

function DetailStrip({ details, label }: { details: ProductDetail[]; label: string }) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const strip = stripRef.current;
    if (!strip) return;
    const swatches = Array.from(strip.children);
    gsap.set(swatches, { opacity: 0, y: 8 });
    const trigger = ScrollTrigger.create({
      trigger: strip,
      start: "top 90%",
      once: true,
      onEnter: () => gsap.to(swatches, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={stripRef} aria-hidden="true" className="mt-6 flex gap-2">
      {details.map((detail, i) => (
        <div key={detail.src} className="relative aspect-square w-full overflow-hidden border border-champagne/25">
          <Image
            src={detail.src}
            alt=""
            fill
            sizes="160px"
            className="object-cover"
            style={{ objectPosition: detail.position }}
          />
          <span className="sr-only">
            {label} — detalhe {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProdutoFocus() {
  const outerRef = useRef<HTMLDivElement>(null);
  const bouquetFrameRef = useRef<HTMLDivElement>(null);
  const coeurFrameRef = useRef<HTMLDivElement>(null);
  const bouquetCopyRef = useRef<HTMLDivElement>(null);
  const coeurCopyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(bouquetFrameRef.current, { scale: 1, opacity: 1, filter: "brightness(1)" });
    gsap.set(coeurFrameRef.current, { scale: 0.88, opacity: 0.5, filter: "brightness(0.55)" });
    gsap.set(coeurCopyRef.current, { opacity: 0, y: 12 });
    gsap.set(ctaRef.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 1.0}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const focusCoeur = phase(p, 15, 65);

        gsap.set(bouquetFrameRef.current, {
          scale: 1 - focusCoeur * 0.1,
          opacity: 1 - focusCoeur * 0.5,
          filter: `brightness(${1 - focusCoeur * 0.45})`,
        });
        gsap.set(coeurFrameRef.current, {
          scale: 0.88 + focusCoeur * 0.2,
          opacity: 0.5 + focusCoeur * 0.5,
          filter: `brightness(${0.55 + focusCoeur * 0.45})`,
        });

        const bouquetOut = phase(p, 28, 46);
        const coeurIn = phase(p, 40, 58);
        gsap.set(bouquetCopyRef.current, { opacity: 1 - bouquetOut, y: bouquetOut * -10 });
        gsap.set(coeurCopyRef.current, { opacity: coeurIn, y: 12 - coeurIn * 12 });

        const ctaIn = phase(p, 74, 94);
        gsap.set(ctaRef.current, { opacity: ctaIn, y: 14 - ctaIn * 14 });

        const activeIndex = focusCoeur >= 0.5 ? 1 : 0;
        stepRefs.current.forEach((step, i) => {
          gsap.set(step, { color: i === activeIndex ? "var(--ivory)" : "rgba(241,237,229,0.45)" });
        });
        numberRefs.current.forEach((num, i) => {
          gsap.set(num, { color: i === activeIndex ? "var(--champagne)" : "rgba(175,147,103,0.4)" });
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={outerRef} id="produto" className="relative h-[200svh]" aria-labelledby="produto-title">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-oxblood">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 20%, rgba(216,200,168,0.08) 0%, transparent 60%), radial-gradient(70% 60% at 80% 90%, rgba(7,6,6,0.6) 0%, transparent 70%)",
          }}
        />

        <div className="container-lga relative flex h-full flex-col justify-center">
          <p className="mono-label absolute left-6 top-8 md:left-12 md:top-12">{produtoScene.eyebrow}</p>
          <h2 id="produto-title" className="sr-only">
            Lê Bouquet e Lê Cœur Royale — as criações da coleção Lê Grand Amour
          </h2>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-6">
            {/* Lê Bouquet: tall, sharp-edged, monumental — Lê Cœur Royale:
                smaller, soft-cornered, closer — deliberately different
                silhouettes rather than two matching frames. */}
            <div className="relative aspect-[16/12] w-full lg:col-span-8">
              <div
                aria-hidden="true"
                className="absolute inset-x-[6%] bottom-[6%] h-[10%] rounded-[100%] bg-noir/70 blur-2xl"
              />

              <div
                ref={coeurFrameRef}
                className="absolute right-[2%] top-[14%] z-10 h-[48%] w-[36%] overflow-hidden rounded-[2.5rem] border border-champagne/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                <Image
                  src={coeurMedia.src}
                  alt={coeurMedia.alt}
                  fill
                  sizes="30vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 42%" }}
                />
              </div>

              <div
                ref={bouquetFrameRef}
                className="absolute bottom-0 left-0 z-20 h-[92%] w-[46%] overflow-hidden border border-champagne/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                <Image
                  src={bouquetMedia.src}
                  alt={bouquetMedia.alt}
                  fill
                  sizes="45vw"
                  className="object-cover"
                  style={{ objectPosition: "42% 30%" }}
                />
              </div>
            </div>

            <div className="relative lg:col-span-4">
              <ol className="flex gap-8 border-b border-champagne/15 pb-4 sm:gap-10">
                {[bouquet, coeur].map((product, i) => (
                  <li key={product.id}>
                    <span
                      ref={(el) => {
                        stepRefs.current[i] = el;
                      }}
                      className="flex items-baseline gap-2 font-display text-lg"
                    >
                      <span
                        ref={(el) => {
                          numberRefs.current[i] = el;
                        }}
                        className="mono-label"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {product.name}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="relative mt-8 grid">
                <div ref={bouquetCopyRef} className="[grid-area:1/1]">
                  <p className="mono-label">{bouquet.eyebrow}</p>
                  <p className="mt-3 font-display text-2xl italic text-champagne">{bouquet.tagline}</p>
                  <ul className="mt-6 flex flex-col gap-2">
                    {bouquet.facts.map((fact) => (
                      <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
                        <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                  <DetailStrip details={bouquetDetails} label={bouquet.name} />
                </div>
                <div ref={coeurCopyRef} className="[grid-area:1/1]">
                  <p className="mono-label">{coeur.eyebrow}</p>
                  <p className="mt-3 font-display text-2xl italic text-champagne">{coeur.tagline}</p>
                  <ul className="mt-6 flex flex-col gap-2">
                    {coeur.facts.map((fact) => (
                      <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
                        <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                  <DetailStrip details={coeurDetails} label={coeur.name} />
                </div>
              </div>

              <div ref={ctaRef} className="mt-8">
                <StartServiceCTA />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Mobile/tablet: the same mechanism as desktop — a pinned, scroll-scrubbed
 * hand-off between the two creations, not a stack of blocks with decorative
 * motion — just shorter (170svh vs desktop's 200svh) and full-bleed instead
 * of the asymmetric two-frame composition, which needs more width than a
 * phone has to still read as "two distinct silhouettes" rather than "two
 * overlapping thumbnails". This mirrors `ExperienciaMobilePinned` further
 * down this file: this same site's own proof that a pinned scrub reads fine
 * on touch as long as it's shorter and well-tuned, not scroll-jacking.
 */
function ProdutoMobilePinned() {
  const outerRef = useRef<HTMLDivElement>(null);
  const bouquetFrameRef = useRef<HTMLDivElement>(null);
  const coeurFrameRef = useRef<HTMLDivElement>(null);
  const bouquetCopyRef = useRef<HTMLDivElement>(null);
  const coeurCopyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(bouquetFrameRef.current, { opacity: 1, scale: 1, filter: "brightness(1)" });
    gsap.set(coeurFrameRef.current, { opacity: 0, scale: 1.06, filter: "brightness(0.55)" });
    gsap.set(coeurCopyRef.current, { opacity: 0, y: 12 });
    gsap.set(ctaRef.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 0.8}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const focusCoeur = phase(p, 15, 65);

        gsap.set(bouquetFrameRef.current, {
          opacity: 1 - focusCoeur,
          scale: 1 + focusCoeur * 0.05,
          filter: `brightness(${1 - focusCoeur * 0.45})`,
        });
        gsap.set(coeurFrameRef.current, {
          opacity: focusCoeur,
          scale: 1.06 - focusCoeur * 0.06,
          filter: `brightness(${0.55 + focusCoeur * 0.45})`,
        });

        const bouquetOut = phase(p, 28, 46);
        const coeurIn = phase(p, 40, 58);
        gsap.set(bouquetCopyRef.current, { opacity: 1 - bouquetOut, y: bouquetOut * -10 });
        gsap.set(coeurCopyRef.current, { opacity: coeurIn, y: 12 - coeurIn * 12 });

        const ctaIn = phase(p, 74, 94);
        gsap.set(ctaRef.current, { opacity: ctaIn, y: 14 - ctaIn * 14 });

        const activeIndex = focusCoeur >= 0.5 ? 1 : 0;
        stepRefs.current.forEach((step, i) => {
          gsap.set(step, { color: i === activeIndex ? "var(--ivory)" : "rgba(241,237,229,0.45)" });
        });
        numberRefs.current.forEach((num, i) => {
          gsap.set(num, { color: i === activeIndex ? "var(--champagne)" : "rgba(175,147,103,0.4)" });
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={outerRef} id="produto" className="relative h-[170svh] lg:hidden" aria-labelledby="produto-title-mobile">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-oxblood">
        <div ref={bouquetFrameRef} className="absolute inset-0">
          <Image
            src={bouquetMedia.mobileSrc ?? bouquetMedia.src}
            alt={bouquetMedia.alt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "48% 30%" }}
          />
        </div>
        <div ref={coeurFrameRef} className="absolute inset-0">
          <Image
            src={coeurMedia.mobileSrc ?? coeurMedia.src}
            alt={coeurMedia.alt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "50% 40%" }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,6,6,0.92) 0%, rgba(7,6,6,0.55) 42%, rgba(7,6,6,0.2) 68%, rgba(7,6,6,0.58) 100%)",
          }}
        />

        <div className="container-lga relative flex h-full flex-col justify-end pb-10 pt-24">
          <p className="mono-label absolute left-6 top-8">{produtoScene.eyebrow}</p>
          <h2 id="produto-title-mobile" className="sr-only">
            Lê Bouquet e Lê Cœur Royale — as criações da coleção Lê Grand Amour
          </h2>

          <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b border-champagne/15 pb-4">
            {[bouquet, coeur].map((product, i) => (
              <li key={product.id}>
                <span
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="flex items-baseline gap-2 font-display text-base"
                >
                  <span
                    ref={(el) => {
                      numberRefs.current[i] = el;
                    }}
                    className="mono-label"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {product.name}
                </span>
              </li>
            ))}
          </ol>

          <div className="relative mt-6 grid">
            <div ref={bouquetCopyRef} className="[grid-area:1/1]">
              <p className="mono-label">{bouquet.eyebrow}</p>
              <p className="mt-3 font-display text-xl italic text-champagne">{bouquet.tagline}</p>
              <ul className="mt-5 flex flex-col gap-2">
                {bouquet.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
                    <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <DetailStrip details={bouquetDetails} label={bouquet.name} />
            </div>
            <div ref={coeurCopyRef} className="[grid-area:1/1]">
              <p className="mono-label">{coeur.eyebrow}</p>
              <p className="mt-3 font-display text-xl italic text-champagne">{coeur.tagline}</p>
              <ul className="mt-5 flex flex-col gap-2">
                {coeur.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
                    <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <DetailStrip details={coeurDetails} label={coeur.name} />
            </div>
          </div>

          <div ref={ctaRef} className="mt-8">
            <StartServiceCTA />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProdutoStatic({ reducedMotion }: { reducedMotion: boolean }) {
  const [active, setActive] = useState<0 | 1>(0);
  const activeProduct = active === 0 ? bouquet : coeur;
  const activeDetails = active === 0 ? bouquetDetails : coeurDetails;
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    // `reducedMotion` starts false (server snapshot) and can flip true a
    // moment after mount — always reset to the visible end state here, not
    // just skip, or a stale first pass that set opacity:0 is never undone.
    if (reducedMotion) {
      gsap.set([eyebrowRef.current, framesRef.current, asideRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
    gsap.set(framesRef.current, { opacity: 0, y: 20, scale: 0.97 });
    gsap.set(asideRef.current, { opacity: 0, y: 16 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0)
          .to(framesRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.15)
          .to(asideRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.4);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="produto" className="relative overflow-hidden bg-oxblood py-24 md:py-32" aria-labelledby="produto-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(216,200,168,0.08) 0%, transparent 60%), radial-gradient(70% 60% at 80% 90%, rgba(7,6,6,0.6) 0%, transparent 70%)",
        }}
      />

      <div className="container-lga relative">
        <p ref={eyebrowRef} className="mono-label">{produtoScene.eyebrow}</p>
        <h2 id="produto-title" className="sr-only">
          Lê Bouquet e Lê Cœur Royale — as criações da coleção Lê Grand Amour
        </h2>

        <div className="relative mt-10 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div ref={framesRef} className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/12]">
            <div
              aria-hidden="true"
              className="absolute inset-x-[6%] bottom-[6%] h-[10%] rounded-[100%] bg-noir/70 blur-2xl"
            />

            <button
              type="button"
              onClick={() => setActive(1)}
              aria-pressed={active === 1}
              aria-label={`Focar em ${coeur.name}`}
              className={`absolute right-[2%] top-[14%] h-[42%] w-[40%] overflow-hidden rounded-[2rem] border transition-all duration-500 ease-out sm:h-[48%] sm:w-[36%] ${
                active === 1
                  ? "z-20 border-champagne/50 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  : "z-10 border-transparent opacity-55 brightness-[0.55] hover:opacity-75"
              }`}
            >
              <Image
                src={coeurMedia.src}
                alt={active === 1 ? coeurMedia.alt : ""}
                fill
                sizes="(max-width: 1024px) 45vw, 30vw"
                className="object-cover"
                style={{ objectPosition: "50% 42%" }}
              />
            </button>

            <button
              type="button"
              onClick={() => setActive(0)}
              aria-pressed={active === 0}
              aria-label={`Focar em ${bouquet.name}`}
              className={`absolute bottom-0 left-0 h-[92%] w-[46%] overflow-hidden border transition-all duration-500 ease-out ${
                active === 0
                  ? "z-20 border-champagne/50 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  : "z-10 border-transparent opacity-55 brightness-[0.55] hover:opacity-75"
              }`}
            >
              <Image
                src={bouquetMedia.src}
                alt={active === 0 ? bouquetMedia.alt : ""}
                fill
                sizes="(max-width: 1024px) 68vw, 45vw"
                className="object-cover"
                style={{ objectPosition: "42% 30%" }}
              />
            </button>
          </div>

          <div ref={asideRef} className="lg:col-span-4">
            <ol className="flex gap-8 border-b border-champagne/15 pb-4 sm:gap-10">
              {[bouquet, coeur].map((product, i) => (
                <li key={product.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setActive(i as 0 | 1)}
                    aria-current={active === i}
                    className={`flex items-baseline gap-2 font-display text-lg transition-colors ${
                      active === i ? "text-ivory" : "text-ivory/45 hover:text-ivory/70"
                    }`}
                  >
                    <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                    {product.name}
                  </button>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-[17px] h-px origin-left bg-rouge transition-transform duration-400 ease-out ${
                      active === i ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <p className="mono-label">{activeProduct.eyebrow}</p>
              <p className="mt-3 font-display text-2xl italic text-champagne">{activeProduct.tagline}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {activeProduct.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
                    <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <DetailStrip details={activeDetails} label={activeProduct.name} />
            </div>

            <div className="mt-10">
              <StartServiceCTA />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
