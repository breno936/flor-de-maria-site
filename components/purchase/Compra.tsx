"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { compra } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import ReservationForm from "@/components/reservation/ReservationForm";

const detailMedia = temporaryMedia["petal-macro"];

/**
 * Etapa 06 — COMPRA. Purchase happens through private atendimento, not a
 * cart — this is the form's section. Per the brief: "Estabilidade.
 * Legibilidade. Pouco movimento. Foco total no formulário." — one quiet
 * entrance (a thread line + a short fade), nothing scroll-scrubbed, no
 * competing motion near the form itself.
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
    <section ref={sectionRef} id="atendimento" className="relative overflow-hidden bg-oxblood py-20 md:py-28" aria-labelledby="compra-title">
      <div
        ref={threadRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-rouge via-rouge/70 to-rouge/0"
      />

      <div className="container-lga grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div ref={introRef} className="lg:col-span-5">
          <p className="mono-label text-champagne/80">{compra.eyebrow}</p>
          <h2 id="compra-title" className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl">
            {compra.title}
          </h2>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-ivory/70">{compra.body}</p>

          {detailMedia && (
            <div className="relative mt-10 hidden aspect-[3/4] w-full max-w-[220px] overflow-hidden lg:block">
              <Image
                src={detailMedia.temporaryImage}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
                data-temporary-media="true"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
