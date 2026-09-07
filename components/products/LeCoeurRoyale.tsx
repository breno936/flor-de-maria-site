"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { products } from "@/data/products";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";

const product = products.find((p) => p.id === "le-coeur-royale")!;
const boxMedia = temporaryMedia["coeur-assembly"]!;

/**
 * Scene 2 — "o presente se revela". Only one real photograph of the box
 * exists (see MEDIA-MANIFEST.md — no lid-open shot was found under a
 * license we can use, and nothing is fabricated to fake one). What IS real
 * here: the camera pulls back from a tight detail of the ribbon to the full
 * box as the visitor scrolls, and the name/description/CTA arrive once the
 * box is fully framed and then hold — not a fade between unrelated photos.
 * The physical lid-opening motion is intentionally not implemented; see the
 * delivery notes for what a future studio shoot needs to complete it.
 */
export default function LeCoeurRoyale() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <BoxStatic /> : <BoxReveal />;
}

function BoxReveal() {
  const outerRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(imgWrapRef.current, { scale: 1.85, xPercent: 6, yPercent: -4 });
    gsap.set(textRef.current, { opacity: 0, y: 28 });
    gsap.set(eyebrowRef.current, { opacity: 0.001 });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => build(() => window.innerHeight * 0.9));
    mm.add("(max-width: 767px)", () => build(() => window.innerHeight * 0.55));

    function build(endPx: () => number) {
      const trigger = ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: () => `+=${endPx()}`,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress * 100;
          const reveal = phase(p, 8, 78);
          const ease = reveal * reveal * (3 - 2 * reveal);

          gsap.set(imgWrapRef.current, {
            scale: 1.85 - ease * 0.85,
            xPercent: 6 - ease * 6,
            yPercent: -4 + ease * 4,
          });
          gsap.set(scrimRef.current, { opacity: 0.35 + phase(p, 60, 90) * 0.45 });
          gsap.set(eyebrowRef.current, { opacity: 0.001 + phase(p, 4, 20) });

          const textP = phase(p, 78, 94);
          gsap.set(textRef.current, { opacity: textP, y: 28 - textP * 28 });
        },
      });
      return () => trigger.kill();
    }

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={outerRef}
      className="relative h-[130svh] md:h-[180svh]"
      aria-labelledby="le-coeur-title"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-noir">
        <div ref={imgWrapRef} className="absolute inset-0 will-change-transform">
          <Image
            src={boxMedia.temporaryImage}
            alt={boxMedia.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            data-temporary-media="true"
            priority
          />
        </div>
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,5,4,0.96) 0%, rgba(7,5,4,0.5) 42%, rgba(7,5,4,0.15) 68%, rgba(7,5,4,0.35) 100%)",
          }}
        />

        <p ref={eyebrowRef} className="eyebrow absolute left-6 top-8 md:left-12 md:top-12">
          {product.eyebrow}
        </p>

        <div ref={textRef} className="container-lga absolute inset-x-0 bottom-14 md:bottom-20">
          <h2 id="le-coeur-title" className="font-display text-4xl text-ivory sm:text-5xl">
            {product.name}
          </h2>
          <p className="mt-3 max-w-md font-display text-xl italic text-champagne">{product.tagline}</p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {product.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-3 font-sans text-sm text-muted">
                <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
          <AtelierButton href="#reserva" variant="secondary" className="mt-7">
            {product.cta}
          </AtelierButton>
        </div>
      </div>
    </section>
  );
}

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function BoxStatic() {
  return (
    <section id="criacoes" className="relative py-20 md:py-28" aria-labelledby="le-coeur-title">
      <div className="container-lga grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="eyebrow">{product.eyebrow}</p>
          <h2 id="le-coeur-title" className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
            {product.name}
          </h2>
          <p className="mt-3 font-display text-xl italic text-champagne">{product.tagline}</p>
          <ul className="mt-6 flex flex-col gap-2">
            {product.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-3 font-sans text-sm text-muted">
                <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
          <AtelierButton href="#reserva" variant="secondary" className="mt-8">
            {product.cta}
          </AtelierButton>
        </div>
        <div className="relative order-1 mx-auto aspect-square w-full max-w-xl overflow-hidden lg:order-2 lg:col-span-7">
          <Image
            src={boxMedia.temporaryImage}
            alt={boxMedia.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
            data-temporary-media="true"
          />
        </div>
      </div>
    </section>
  );
}
