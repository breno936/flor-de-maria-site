"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { brand, roseClosing, reservation, contact } from "@/data/content";
import AtelierButton from "@/components/ui/AtelierButton";

const IMAGE = "/media/temporary/closing-editorial.webp";
const IMAGE_MOBILE = "/media/temporary/closing-editorial-mobile.webp";
const IMAGE_ALT =
  "Imagem conceitual provisória: rosa vermelha isolada em fundo preto, luz lateral — encerramento editorial da campanha antes do atendimento, referência de atmosfera.";

function buildWhatsAppUrl() {
  if (!contact.whatsappNumber) return null;
  const message = encodeURIComponent(reservation.whatsappMessage);
  return `https://wa.me/${contact.whatsappNumber}?text=${message}`;
}

function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * "Da emoção ao gesto" — restored from the original scroll-driven closing
 * scene: one continuous photograph anchors the frame at full scale, then
 * docks into a left-hand editorial panel as the closing title, phrase and
 * WhatsApp CTA arrive on the right. Same image throughout, scale-only, no
 * crossfade between two photos and no crop that would cut the rose out of
 * frame. The atendimento form itself lives outside this pinned track, in
 * normal flow below (`RoseClosing.tsx` never owns `#reserva`) so a direct
 * `/#reserva` load always lands on a ready, usable form.
 */
export default function RoseClosing() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const whatsappUrl = buildWhatsAppUrl();

  return reducedMotion || !isDesktop ? (
    <RoseStatic whatsappUrl={whatsappUrl} reducedMotion={reducedMotion} />
  ) : (
    <RoseReveal whatsappUrl={whatsappUrl} />
  );
}

function RoseReveal({ whatsappUrl }: { whatsappUrl: string | null }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    gsap.set(imageRef.current, { scale: 1, transformOrigin: "6% 44%" });
    gsap.set(titleRef.current, { opacity: 0 });
    gsap.set(bodyRef.current, { opacity: 0, y: 16 });
    gsap.set(quoteRef.current, { opacity: 1 });
    gsap.set(eyebrowRef.current, { opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: () => `+=${window.innerHeight * 0.9}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress * 100;
        const dock = smoothstep(phase(p, 20, 70));

        // The whole photo shrinks toward its left edge instead of being
        // cropped — the rose sits centered in the source photo, so clipping
        // one side away would slice through the bloom. Scaling keeps it
        // intact, just smaller, and it is the same image the whole time.
        gsap.set(imageRef.current, { scale: 1 - dock * 0.56 });

        const fadeOut = phase(p, 15, 35);
        gsap.set(scrimRef.current, { opacity: 1 - fadeOut });
        gsap.set(quoteRef.current, { opacity: 1 - fadeOut });
        gsap.set(eyebrowRef.current, { opacity: phase(p, 15, 30) });

        const titleP = phase(p, 55, 68);
        const bodyP = phase(p, 72, 88);
        gsap.set(titleRef.current, { opacity: titleP });
        gsap.set(bodyRef.current, { opacity: bodyP, y: 16 - bodyP * 16 });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={outerRef} className="relative h-[150svh]" aria-label="Da emoção ao gesto">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-noir">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image src={IMAGE} alt={IMAGE_ALT} fill sizes="100vw" className="object-cover" data-temporary-media="true" />
          <div
            ref={scrimRef}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 45% at 50% 50%, rgba(7,5,4,0.55) 0%, transparent 70%), linear-gradient(0deg, rgba(7,5,4,0.5) 0%, transparent 25%)",
            }}
          />
        </div>

        <p ref={eyebrowRef} className="eyebrow absolute left-12 top-12">
          {brand.collabLine}
        </p>

        <div ref={quoteRef} className="container-lga absolute inset-0 flex items-center justify-center text-center">
          <p className="max-w-xl font-display text-3xl italic text-ivory sm:text-4xl">&ldquo;{roseClosing.phrase}&rdquo;</p>
        </div>

        <div className="container-lga absolute inset-x-0 bottom-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" aria-hidden="true" />
          <div className="max-w-md lg:col-span-7">
            <div className="rule-gold mb-6" />
            <h2 ref={titleRef} className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
              {roseClosing.title}
            </h2>
            <div ref={bodyRef}>
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
    </div>
  );
}

function RoseStatic({ whatsappUrl, reducedMotion }: { whatsappUrl: string | null; reducedMotion: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const content = contentRef.current;
    if (!content) return;

    // `reducedMotion` starts false (server snapshot) and can flip true a
    // moment after mount — always reset to the visible end state here, not
    // just skip, or a stale first pass that set opacity:0 is never undone.
    if (reducedMotion) {
      gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(content, { opacity: 0, y: 20 });
    const trigger = ScrollTrigger.create({
      trigger: content,
      start: "top 82%",
      once: true,
      onEnter: () => gsap.to(content, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:hidden">
        <Image
          src={IMAGE_MOBILE}
          alt={IMAGE_ALT}
          fill
          sizes="100vw"
          className={`object-cover ${reducedMotion ? "" : "animate-kenburns"}`}
          data-temporary-media="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(7,5,4,0.85) 0%, rgba(7,5,4,0.3) 50%, rgba(7,5,4,0.2) 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-6 px-6 text-center">
          <p className="font-display text-2xl italic text-ivory">&ldquo;{roseClosing.phrase}&rdquo;</p>
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
          <p className="font-display text-3xl italic text-ivory">&ldquo;{roseClosing.phrase}&rdquo;</p>
        </div>
      </div>

      <div className="container-lga py-14 md:py-20">
        <div ref={contentRef} className="max-w-xl">
          <p className="eyebrow">{brand.collabLine}</p>
          <div className="rule-gold my-6" />
          <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl">{roseClosing.title}</h2>
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
