"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { brand, reservation, contact } from "@/data/content";
import AtelierButton from "@/components/ui/AtelierButton";
import ReservationForm from "./ReservationForm";

const IMAGE = "/media/temporary/closing-editorial.webp";
const IMAGE_MOBILE = "/media/temporary/closing-editorial-mobile.webp";
const IMAGE_ALT =
  "Imagem conceitual provisória: rosa vermelha isolada em fundo preto, luz lateral — encerramento editorial da campanha, referência de atmosfera.";

function buildWhatsAppUrl() {
  if (!contact.whatsappNumber) return null;
  const message = encodeURIComponent(reservation.whatsappMessage);
  return `https://wa.me/${contact.whatsappNumber}?text=${message}`;
}

/**
 * Scene 3 — "da emoção ao gesto". One continuous image anchors the frame,
 * then docks into a left-hand panel as the reservation title/body/WhatsApp
 * CTA arrive on the right — never two photos crossfading into different
 * positions. The form itself is deliberately outside the pinned track (see
 * `#reserva` below) so `href="#reserva"` always lands on a usable, stable
 * form rather than mid-animation.
 */
export default function ReservationScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <>
      {reducedMotion || !isDesktop ? (
        <TransitionStatic whatsappUrl={whatsappUrl} />
      ) : (
        <TransitionDesktop whatsappUrl={whatsappUrl} />
      )}

      <section id="reserva" className="py-20 md:py-28">
        <div className="container-lga grid gap-10 lg:grid-cols-12">
          <div className="hidden lg:col-span-5 lg:block" aria-hidden="true" />
          <div className="max-w-2xl lg:col-span-7">
            <ReservationForm />
          </div>
        </div>
      </section>
    </>
  );
}

function TransitionDesktop({ whatsappUrl }: { whatsappUrl: string | null }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(imageRef.current, { scale: 1, transformOrigin: "6% 44%" });
    gsap.set(panelRef.current, { opacity: 0, y: 24 });
    gsap.set(quoteRef.current, { opacity: 1 });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 0.85}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const dock = phase(p, 15, 72);
        const ease = dock * dock * (3 - 2 * dock);
        // The whole photo shrinks toward its left edge instead of being
        // cropped — the rose sits centered in the source photo, so clipping
        // one side away would slice through the bloom. Scaling keeps it
        // intact, just smaller.
        gsap.set(imageRef.current, { scale: 1 - ease * 0.56 });
        gsap.set(scrimRef.current, { opacity: 1 - phase(p, 5, 20) });
        gsap.set(quoteRef.current, { opacity: 1 - phase(p, 5, 20) });

        const panelP = phase(p, 52, 82);
        gsap.set(panelRef.current, { opacity: panelP, y: 24 - panelP * 24 });
        gsap.set(eyebrowRef.current, { opacity: phase(p, 4, 18) });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={outerRef} className="relative h-[160svh]" aria-label="Da emoção ao gesto">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-noir">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image src={IMAGE} alt={IMAGE_ALT} fill sizes="100vw" className="object-cover" data-temporary-media="true" />
          <div
            ref={scrimRef}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 45% at 50% 50%, rgba(7,5,4,0.55) 0%, transparent 70%), linear-gradient(0deg, rgba(7,5,4,0.4) 0%, transparent 25%)",
            }}
          />
        </div>

        <p ref={eyebrowRef} className="eyebrow absolute left-12 top-12">
          {brand.collabLine}
        </p>

        <div ref={quoteRef} className="container-lga absolute inset-0 flex items-center justify-center text-center">
          <p className="max-w-xl font-display text-3xl italic text-ivory sm:text-4xl">
            &ldquo;{brand.signature}&rdquo;
          </p>
        </div>

        <div ref={panelRef} className="container-lga absolute inset-x-0 bottom-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" aria-hidden="true" />
          <div className="max-w-md lg:col-span-7">
            <div className="rule-gold mb-6" />
            <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl">{reservation.title}</h2>
            <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{reservation.body}</p>
            {whatsappUrl && (
              <AtelierButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-8">
                {reservation.ctaSecondary}
              </AtelierButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function TransitionStatic({ whatsappUrl }: { whatsappUrl: string | null }) {
  return (
    <div className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:hidden">
        <Image src={IMAGE_MOBILE} alt={IMAGE_ALT} fill sizes="100vw" className="object-cover" data-temporary-media="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(7,5,4,0.85) 0%, rgba(7,5,4,0.3) 50%, rgba(7,5,4,0.2) 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-6 px-6 text-center">
          <p className="font-display text-2xl italic text-ivory">&ldquo;{brand.signature}&rdquo;</p>
        </div>
      </div>

      <div className="relative hidden aspect-[21/9] w-full overflow-hidden lg:block">
        <Image src={IMAGE} alt={IMAGE_ALT} fill sizes="100vw" className="object-cover" data-temporary-media="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(7,5,4,0.7) 0%, rgba(7,5,4,0.2) 60%, transparent 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-10 text-center">
          <p className="font-display text-3xl italic text-ivory">&ldquo;{brand.signature}&rdquo;</p>
        </div>
      </div>

      <div className="container-lga py-14 md:py-20">
        <div className="max-w-xl">
          <p className="eyebrow">{brand.collabLine}</p>
          <div className="rule-gold my-6" />
          <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl">{reservation.title}</h2>
          <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{reservation.body}</p>
          {whatsappUrl && (
            <AtelierButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-8">
              {reservation.ctaSecondary}
            </AtelierButton>
          )}
        </div>
      </div>
    </div>
  );
}
