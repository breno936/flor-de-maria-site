"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { products, type Product } from "@/data/products";
import { produtoScene } from "@/data/content";
import { productGalleries, type GalleryPhoto } from "@/data/campaign-photos";
import StartServiceCTA from "@/components/cta/StartServiceCTA";
import DetailLightbox from "./DetailLightbox";

const HIDDEN_FROM_BOTTOM = "inset(100% 0% 0% 0%)";
const OPEN = "inset(0% 0% 0% 0%)";

/**
 * Etapa 03 — PRODUTO. A collection of only two pieces, so each gets its own
 * full scene instead of sharing a split composition where one was always
 * dimmed: a large photograph of the whole piece in someone's hands (scale
 * reads at a glance), the name at editorial scale in an upright serif (the
 * italic is kept for the emotional line), composition and finishing, close
 * details that open full screen (DetailLightbox), and a CTA that opens the
 * conversation already naming the piece. The scenes alternate side and
 * ground (noir, then oxblood) — monumental, then intimate.
 */
export default function Produto() {
  return (
    <section id="produto" className="relative bg-noir" aria-labelledby="produto-title">
      <h2 id="produto-title" className="sr-only">
        Lê Bouquet e Lê Cœur Royale — as criações da coleção Lê Grand Amour
      </h2>
      {products.map((product, i) => (
        <CreationScene key={product.id} product={product} gallery={productGalleries[product.id]} order={i} />
      ))}
    </section>
  );
}

function CreationScene({ product, gallery, order }: { product: Product; gallery: GalleryPhoto[]; order: number }) {
  const sceneRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [lightbox, setLightbox] = useState<{ index: number; origin: DOMRect | null } | null>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const flipped = order % 2 === 1;
  const main = gallery[0];
  const details = gallery.slice(1);
  const titleId = `${product.id}-title`;

  useEffect(() => {
    registerGsap();
    const scene = sceneRef.current;
    if (!scene) return;
    const copy = Array.from(scene.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reducedMotion) {
      gsap.set(maskRef.current, { clipPath: OPEN });
      gsap.set(zoomRef.current, { scale: 1 });
      gsap.set(parallaxRef.current, { yPercent: 0 });
      gsap.set(nameRef.current, { yPercent: 0 });
      gsap.set(copy, { opacity: 1, y: 0 });
      return;
    }

    // Both breakpoints share the reveal; `isDesktop` hydrates false, so
    // every value either branch touches is (re)set here on each run.
    gsap.set(maskRef.current, { clipPath: HIDDEN_FROM_BOTTOM });
    gsap.set(zoomRef.current, { scale: 1.16 });
    gsap.set(parallaxRef.current, { yPercent: 0 });
    gsap.set(nameRef.current, { yPercent: 105 });
    gsap.set(copy, { opacity: 0, y: 16 });

    let tl: gsap.core.Timeline | null = null;
    const reveal = ScrollTrigger.create({
      trigger: scene,
      start: "top 78%",
      once: true,
      onEnter: () => {
        tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(maskRef.current, { clipPath: HIDDEN_FROM_BOTTOM }, { clipPath: OPEN, duration: 1.1, ease: "power3.inOut" }, 0)
          .to(zoomRef.current, { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
          .to(nameRef.current, { yPercent: 0, duration: 0.8 }, 0.35)
          .to(copy, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.55);
      },
    });

    // A slow drift on the photograph while the scene crosses the viewport —
    // desktop only; on a phone the frame is already the whole screen width.
    const drift = isDesktop
      ? ScrollTrigger.create({
          trigger: scene,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => gsap.set(parallaxRef.current, { yPercent: (self.progress - 0.5) * 6 }),
        })
      : null;

    return () => {
      reveal.kill();
      drift?.kill();
      tl?.kill();
    };
  }, [reducedMotion, isDesktop]);

  function openAt(index: number, event: MouseEvent<HTMLElement>) {
    setLightbox({ index, origin: event.currentTarget.getBoundingClientRect() });
  }

  return (
    <article
      ref={sceneRef}
      aria-labelledby={titleId}
      className={`relative overflow-hidden ${flipped ? "bg-oxblood" : "bg-noir"}`}
    >
      {flipped && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 75% 30%, rgba(216,200,168,0.07) 0%, transparent 60%), linear-gradient(180deg, rgba(7,6,6,0.35) 0%, transparent 25%, transparent 75%, rgba(7,6,6,0.45) 100%)",
          }}
        />
      )}

      <div className="container-lga relative grid gap-10 pb-20 pt-16 md:pb-28 md:pt-24 lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-24">
        <div className={`-mx-6 md:mx-0 lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
          <button
            type="button"
            onClick={(event) => openAt(0, event)}
            aria-label={`Ampliar em tela cheia: ${main.alt}`}
            className="group relative block aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-[84svh]"
          >
            <div ref={maskRef} className="absolute inset-0">
              <div ref={parallaxRef} className="absolute inset-[-4%_0]">
                <div ref={zoomRef} className="absolute inset-0">
                  <Image
                    src={main.src}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 100vw, 56vw"
                    quality={80}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                    style={{ objectPosition: main.position }}
                  />
                </div>
              </div>
            </div>
            <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-ivory/30 bg-noir/55 px-3.5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-colors group-hover:border-champagne-light group-hover:text-champagne-light md:bottom-6 md:right-6">
              Ver em tela cheia
              <span aria-hidden="true">+</span>
            </span>
          </button>
        </div>

        <div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
          {order === 0 && (
            <p data-reveal className="mono-label mb-8 text-champagne-light lg:mb-12">
              {produtoScene.eyebrow}
            </p>
          )}
          <p data-reveal className="mono-label text-champagne-light/85">
            {String(order + 1).padStart(2, "0")} — {product.eyebrow}
          </p>
          <h3
            id={titleId}
            className="mt-4 overflow-hidden pb-[0.08em] font-display text-[clamp(3.1rem,6.2vw,6.4rem)] leading-[0.95] tracking-[-0.02em] text-ivory"
          >
            <span ref={nameRef} className="block">
              {product.title}
            </span>
          </h3>
          <p
            data-reveal
            className="mt-5 max-w-md font-display text-[clamp(1.35rem,1.9vw,1.8rem)] italic leading-snug text-champagne-light"
          >
            {product.tagline}
          </p>

          <div data-reveal className="mt-9 border-t border-champagne-light/20 pt-6">
            <p className="mono-label">Composição e acabamento</p>
            <ul className="mt-4 grid gap-2.5">
              {product.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-3 font-sans text-[0.95rem] text-ivory/90">
                  <span className="h-px w-5 shrink-0 bg-champagne-light/60" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-9">
            <p className="mono-label">Detalhes</p>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {details.map((detail, i) => (
                <li key={detail.src}>
                  <button
                    type="button"
                    onClick={(event) => openAt(i + 1, event)}
                    aria-label={`Ampliar detalhe: ${detail.label} — ${detail.caption}`}
                    className="group block w-full text-left"
                  >
                    <span className="relative block aspect-square overflow-hidden border border-champagne-light/25 transition-colors group-hover:border-champagne-light/70">
                      <Image
                        src={detail.src}
                        alt=""
                        fill
                        sizes="(max-width: 1023px) 30vw, 160px"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                        style={{ objectPosition: detail.position }}
                      />
                    </span>
                    <span className="mt-2 flex items-center justify-between font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ivory/80 transition-colors group-hover:text-champagne-light">
                      {detail.label}
                      <span aria-hidden="true">+</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-10">
            <StartServiceCTA creation={product.id} />
          </div>
        </div>
      </div>

      <DetailLightbox
        title={product.title}
        photos={gallery}
        index={lightbox?.index ?? null}
        originRect={lightbox?.origin ?? null}
        onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        onClose={() => setLightbox(null)}
      />
    </article>
  );
}
