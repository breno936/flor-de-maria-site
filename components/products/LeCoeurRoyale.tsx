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

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Scene 2 — "o presente se revela". At 0% progress the box is already
 * recognizable (scale capped at 1.12, never the near-abstract 2.1 of the
 * previous cut) and the eyebrow/title are always on screen — the visitor
 * never lands on unreadable texture. The camera recedes gently as the
 * visitor scrolls; the bottom-anchored gradient that carries the text holds
 * a fixed strength throughout (not scroll-linked) so contrast never dips
 * below what the scroll-revealed tagline/facts/CTA need once they arrive.
 */
export default function LeCoeurRoyale() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <BoxStatic /> : <BoxReveal />;
}

function BoxReveal() {
  const outerRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(imgWrapRef.current, { scale: 1.12 });
    gsap.set(textRef.current, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 0.7}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const ease = smoothstep(phase(p, 0, 45));

        gsap.set(imgWrapRef.current, { scale: 1.12 - ease * 0.12 });

        const textP = phase(p, 45, 70);
        gsap.set(textRef.current, { opacity: textP, y: 20 - textP * 20 });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={outerRef}
      className="relative h-[135svh] md:h-[145svh]"
      aria-labelledby="le-coeur-title"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-noir">
        <div ref={imgWrapRef} className="absolute inset-0 will-change-transform">
          <Image
            src={boxMedia.temporaryImage}
            alt={boxMedia.alt}
            fill
            sizes="100vw"
            className="object-cover object-[48%_50%]"
            data-temporary-media="true"
            priority
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(7,5,4,0.92) 0%, rgba(7,5,4,0.68) 34%, rgba(7,5,4,0.25) 62%, rgba(7,5,4,0.4) 100%)",
          }}
        />

        <p className="eyebrow absolute left-6 top-8 md:left-12 md:top-12">{product.eyebrow}</p>

        <div className="container-lga absolute inset-x-0 bottom-14 md:bottom-20">
          <h2 id="le-coeur-title" className="font-display text-4xl text-ivory sm:text-5xl">
            {product.name}
          </h2>
          <div ref={textRef}>
            <p className="mt-3 max-w-md font-display text-xl italic text-champagne">{product.tagline}</p>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              {product.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-3 font-sans text-sm text-muted">
                  <span className="h-px w-5 bg-gold/60" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
            <AtelierButton href="?criacao=le-coeur-royale#reserva" variant="secondary" className="mt-7">
              {product.cta}
            </AtelierButton>
          </div>
        </div>
      </div>
    </section>
  );
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
          <AtelierButton href="?criacao=le-coeur-royale#reserva" variant="secondary" className="mt-8">
            {product.cta}
          </AtelierButton>
        </div>
        <div className="relative order-1 mx-auto aspect-[3/2] w-full max-w-xl overflow-hidden lg:order-2 lg:col-span-7">
          <Image
            src={boxMedia.temporaryImage}
            alt={boxMedia.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center"
            data-temporary-media="true"
          />
        </div>
      </div>
    </section>
  );
}
