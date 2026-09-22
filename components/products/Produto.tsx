"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { products, type Product } from "@/data/products";
import { produtoScene } from "@/data/content";
import StartServiceCTA from "@/components/cta/StartServiceCTA";

type ProductMedia = { src: string; alt: string };

const bouquet = products.find((p) => p.id === "le-bouquet")!;
const coeur = products.find((p) => p.id === "le-coeur-royale")!;

const bouquetMedia: ProductMedia = {
  src: "/assets/le-grand-amour/le-bouquet-vermelho.webp",
  alt: "Lê Bouquet com rosas vermelhas e embalagem preta da Lê Grand Amour.",
};
const coeurMedia: ProductMedia = {
  src: "/assets/le-grand-amour/le-coeur-royale.webp",
  alt: "Lê Cœur Royale com rosas vermelhas em caixa preta no formato de coração.",
};

// Small editorial crops of the same approved photographs — not a second
// photoshoot, just different framings of what's already there (roses,
// ribbon, the gold plaque) standing in for the "recortes" the brief asks
// for. Object-position values were picked by eye against each source file.
const bouquetDetails = ["18% 22%", "55% 15%", "38% 78%"];
const coeurDetails = ["70% 30%", "25% 65%", "50% 85%"];

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
  return isDesktop ? <ProdutoFocus /> : <ProdutoMobile />;
}

function DetailStrip({ media, crops, label }: { media: ProductMedia; crops: string[]; label: string }) {
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
      {crops.map((position, i) => (
        <div key={position} className="relative aspect-square w-full overflow-hidden border border-champagne/25">
          <Image
            src={media.src}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            style={{ objectPosition: position }}
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
                  <DetailStrip media={bouquetMedia} crops={bouquetDetails} label={bouquet.name} />
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
                  <DetailStrip media={coeurMedia} crops={coeurDetails} label={coeur.name} />
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

const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_LEFT = "inset(0% 0% 0% 100%)";

/**
 * Mobile/tablet: no pin. Each creation is its own block — full photo first
 * (the complete bouquet/box, never a macro crop), facts below. Lê Bouquet
 * keeps a vertical curtain-style wipe; Lê Cœur Royale gets a slow-approach
 * scale-in instead, so the two blocks don't read as the same reveal twice.
 */
function ProdutoMobile() {
  return (
    <section id="produto" className="relative bg-oxblood py-20" aria-labelledby="produto-title-mobile">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 10%, rgba(216,200,168,0.08) 0%, transparent 60%), radial-gradient(70% 60% at 80% 90%, rgba(7,6,6,0.6) 0%, transparent 70%)",
        }}
      />
      <div className="container-lga relative">
        <p className="mono-label">{produtoScene.eyebrow}</p>
        <h2 id="produto-title-mobile" className="sr-only">
          Lê Bouquet e Lê Cœur Royale — as criações da coleção Lê Grand Amour
        </h2>

        <div className="mt-10 flex flex-col gap-16">
          <ProdutoBlock index={0} product={bouquet} media={bouquetMedia} crops={bouquetDetails} variant="curtain" />
          <ProdutoBlock index={1} product={coeur} media={coeurMedia} crops={coeurDetails} variant="approach" />
        </div>

        <div className="mt-14 flex justify-center">
          <StartServiceCTA />
        </div>
      </div>
    </section>
  );
}

function ProdutoBlock({
  index,
  product,
  media,
  crops,
  variant,
}: {
  index: number;
  product: Product;
  media: ProductMedia;
  crops: string[];
  variant: "curtain" | "approach";
}) {
  const blockRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const block = blockRef.current;
    if (!block) return;

    if (variant === "curtain") {
      gsap.set(imageRef.current, { clipPath: HIDDEN_LEFT });
    } else {
      gsap.set(imageRef.current, { clipPath: OPEN_CLIP, scale: 1.12, opacity: 0.4 });
    }
    gsap.set(copyRef.current, { opacity: 0, y: 12 });

    const trigger = ScrollTrigger.create({
      trigger: block,
      start: "top 78%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (variant === "curtain") {
          tl.fromTo(imageRef.current, { clipPath: HIDDEN_LEFT }, { clipPath: OPEN_CLIP, duration: 0.8, ease: "power2.out" }, 0);
        } else {
          tl.to(imageRef.current, { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" }, 0);
        }
        tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.45 }, 0.35);
      },
    });

    return () => trigger.kill();
  }, [variant]);

  return (
    <div ref={blockRef} className="flex flex-col">
      <div
        ref={imageRef}
        className={`relative w-full overflow-hidden border border-champagne/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
          variant === "curtain" ? "aspect-[4/5]" : "aspect-square rounded-[2rem]"
        }`}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: variant === "curtain" ? "40% 25%" : "50% 40%" }}
        />
      </div>
      <div ref={copyRef} className="mt-6">
        <p className="mono-label">
          {String(index + 1).padStart(2, "0")} — {product.eyebrow}
        </p>
        <p className="mt-3 font-display text-2xl italic text-champagne">{product.name}</p>
        <p className="mt-1 font-display text-xl italic text-champagne/85">{product.tagline}</p>
        <ul className="mt-5 flex flex-col gap-2">
          {product.facts.map((fact) => (
            <li key={fact} className="flex items-center gap-3 font-sans text-sm text-ivory/75">
              <span className="h-px w-5 bg-rouge/70" aria-hidden="true" />
              {fact}
            </li>
          ))}
        </ul>
        <DetailStrip media={media} crops={crops} label={product.name} />
      </div>
    </div>
  );
}

function ProdutoStatic({ reducedMotion }: { reducedMotion: boolean }) {
  const [active, setActive] = useState<0 | 1>(0);
  const activeProduct = active === 0 ? bouquet : coeur;
  const activeMedia = active === 0 ? bouquetMedia : coeurMedia;
  const activeCrops = active === 0 ? bouquetDetails : coeurDetails;
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
              <DetailStrip media={activeMedia} crops={activeCrops} label={activeProduct.name} />
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
