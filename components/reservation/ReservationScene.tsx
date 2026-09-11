"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { reservation } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import ReservationForm from "./ReservationForm";
import RoseClosing from "./RoseClosing";

const detailMedia = temporaryMedia["petal-macro"];

/**
 * Cena 7 — "Reserva". "Da emoção ao gesto" (RoseClosing) closes the
 * collection first, then this panel opens the atendimento step: an oxblood
 * ground carrying the editorial introduction and a petal detail, with the
 * form itself set apart on its own well-finished ivory card — the clear
 * contrast the brief asks for, not another dark-on-dark block. `#reserva`
 * targets this section, never the pinned scene above it, so a direct link
 * always lands on a ready form.
 *
 * The thread's closing beat: a single rouge line draws across the top edge
 * as the panel arrives, then the ivory form card's own border (AtelierButton's
 * "submit" ThreadFrame) is where the thread visually settles for good.
 */
export default function ReservationScene() {
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
        tl.to(threadRef.current, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0).to(
          introRef.current,
          { opacity: 1, y: 0, duration: 0.6 },
          0.25
        );
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <>
      <RoseClosing />

      <section ref={sectionRef} id="reserva" className="relative overflow-hidden bg-oxblood py-20 md:py-28">
        <div
          ref={threadRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-rouge via-rouge/70 to-rouge/0"
        />

        <div className="container-lga grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div ref={introRef} className="lg:col-span-5">
            <p className="mono-label text-champagne/80">{reservation.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl">{reservation.title}</h2>
            <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-ivory/70">{reservation.body}</p>

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

            <p className="mono-label mt-10 text-champagne/60">{reservation.note}</p>
          </div>

          <div className="lg:col-span-7">
            <ReservationForm />
          </div>
        </div>
      </section>
    </>
  );
}
