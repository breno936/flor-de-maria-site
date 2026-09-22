"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { brand, compra } from "@/data/content";
import ReservationForm from "@/components/reservation/ReservationForm";

/**
 * Etapa 06 — COMPRA (pública: "Atendimento Privado"). Purchase happens
 * through private atendimento, not a cart — this is the form's section. Per
 * the brief: "Estabilidade. Legibilidade. Pouco movimento. Foco total no
 * formulário." — one quiet entrance (a thread line + a short fade), nothing
 * scroll-scrubbed, no competing motion near the form itself.
 *
 * The rose photograph that used to sit under the copy has been removed —
 * at this point in the narrative the product, the desire and the authorship
 * have already been shown; the only thing left to do is convert, and a
 * decorative photo competing with the form worked against that. In its
 * place: a quiet wine gradient, the same fine grain texture used elsewhere
 * for a textured dark panel (`VideoPoster`'s technique, reused rather than
 * reinvented), a barely-there red glow, and a faint monogram — never
 * another visual subject.
 */
export default function Compra() {
  const sectionRef = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set(threadRef.current, { scaleX: 1 });
      gsap.set(introRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(threadRef.current, { scaleX: 0 });
    gsap.set(introRef.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(threadRef.current, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0).to(
          introRef.current,
          { opacity: 1, y: 0, duration: 0.5 },
          0.2
        );
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="atendimento"
      className="relative overflow-hidden bg-oxblood py-[120px] lg:py-[144px]"
      aria-labelledby="compra-title"
    >
      {/* Quiet wine ground — no photograph. A soft gradient, a barely-there
          red glow and the same fine grain used for textured dark panels
          elsewhere in the site (see VideoPoster), all well under the
          content so it never competes with the form. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(65% 55% at 82% 12%, rgba(118,13,25,0.16) 0%, transparent 60%), linear-gradient(165deg, #1a0304 0%, #47070e 55%, #0a0203 130%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" focusable="false">
          <filter id="grain-atendimento">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-atendimento)" />
        </svg>
        {/* Faint editorial monogram — the collection's own mark, not a
            second photographic subject. */}
        <div className="absolute bottom-10 right-10 h-20 w-20 sm:h-24 sm:w-24">
          <Image
            src="/assets/le-grand-amour/le-grand-amour-logo.webp"
            alt=""
            fill
            sizes="96px"
            className="object-contain opacity-40 mix-blend-screen"
          />
        </div>
      </div>

      <div
        ref={threadRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-champagne-light via-champagne/70 to-champagne/0"
      />

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-16 px-6 md:px-12 lg:grid-cols-12 lg:items-center lg:gap-x-24">
        <div ref={introRef} className="lg:col-span-5">
          <p className="mono-label text-champagne/80">{compra.eyebrow}</p>
          <h2
            id="compra-title"
            className="mt-4 font-display text-[clamp(2.6rem,4vw,4.6rem)] leading-[0.96] text-ivory"
          >
            {compra.title}
          </h2>
          <p className="mt-5 max-w-md font-sans text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.6] text-ivory/70">
            {compra.body}
          </p>

          {/* Discreet signature — a credit line, not another CTA. */}
          <p className="mt-8 font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-champagne/45">
            {brand.collabLine}
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="mx-auto w-full max-w-[700px] lg:mx-0">
            <ReservationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
