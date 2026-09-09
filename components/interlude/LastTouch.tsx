"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import ManagedVideo from "@/components/media/ManagedVideo";

const ribbonMedia = "/media/temporary/ribbon-detail.webp";

const HIDDEN_LEFT = "inset(0% 100% 0% 0%)";
const HIDDEN_BOTTOM = "inset(100% 0% 0% 0%)";
const HIDDEN_RIGHT = "inset(0% 0% 0% 100%)";
const OPEN = "inset(0% 0% 0% 0%)";

/**
 * "O último cuidado" — replaces both the drawn red-thread SVG path and the
 * single oversized ribbon photo. Three asymmetric editorial frames, entering
 * once when the section reaches ~70% of the viewport (not scroll-scrubbed):
 * seleção da rosa (video), o gesto de cuidado (video, dominant frame), and o
 * acabamento da fita (photo).
 *
 * No footage exists of hands actively tying a bow — the one direct reference
 * the client pointed to (Pexels 5399933) uses pink/white roses on a bright
 * table with an identifiable model's face, which would misrepresent both the
 * product and risk being mistaken for Patrícia Marchi. Per the brief's own
 * fallback clause, this reuses on-brand library assets honestly captioned
 * for what they actually show, not what a future shoot will show. See
 * MEDIA-MANIFEST.md.
 */
export default function LastTouch() {
  const sectionRef = useRef<HTMLElement>(null);
  const frame1Ref = useRef<HTMLDivElement>(null);
  const frame2Ref = useRef<HTMLDivElement>(null);
  const frame3Ref = useRef<HTMLDivElement>(null);
  const inner1Ref = useRef<HTMLDivElement>(null);
  const inner2Ref = useRef<HTMLDivElement>(null);
  const inner3Ref = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set([frame1Ref.current, frame2Ref.current, frame3Ref.current], { clipPath: OPEN });
      gsap.set(phraseRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(frame1Ref.current, { clipPath: HIDDEN_LEFT });
    gsap.set(frame2Ref.current, { clipPath: HIDDEN_BOTTOM });
    gsap.set(frame3Ref.current, { clipPath: HIDDEN_RIGHT });
    gsap.set(inner1Ref.current, { xPercent: -3 });
    gsap.set(inner2Ref.current, { yPercent: 4 });
    gsap.set(inner3Ref.current, { xPercent: 3 });
    gsap.set(phraseRef.current, { opacity: 0, y: 14 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(frame1Ref.current, { clipPath: OPEN, duration: 0.6 }, 0)
          .to(inner1Ref.current, { xPercent: 0, duration: 0.7 }, 0)
          .fromTo(frame2Ref.current, { clipPath: HIDDEN_BOTTOM }, { clipPath: OPEN, duration: 0.65 }, 0.13)
          .to(inner2Ref.current, { yPercent: 0, duration: 0.75 }, 0.13)
          .to(frame3Ref.current, { clipPath: OPEN, duration: 0.6 }, 0.26)
          .to(inner3Ref.current, { xPercent: 0, duration: 0.7 }, 0.26)
          .to(phraseRef.current, { opacity: 1, y: 0, duration: 0.55 }, 0.45);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:flex md:min-h-[86svh] md:items-center md:py-24"
      aria-label="O último cuidado antes da entrega"
    >
      <div className="container-lga">
        <p className="eyebrow text-center md:text-left">O último cuidado</p>

        <div className="mt-8 flex flex-col gap-6 md:relative md:mt-10 md:grid md:grid-cols-12 md:gap-0">
          <div ref={frame1Ref} className="relative aspect-[4/5] w-full overflow-hidden md:col-start-1 md:col-span-4 md:row-start-1 md:self-start">
            <div ref={inner1Ref} className="absolute inset-[-4%]">
              <ManagedVideo
                clipId="hands-selecting"
                description="Mão selecionando e preparando uma rosa vermelha — referência de gesto, não a filmagem oficial do ritual de seleção."
                aspectClassName="h-full w-full"
                showDebugLabel={false}
              />
            </div>
          </div>

          <p
            ref={phraseRef}
            className="order-first font-display text-2xl italic leading-snug text-champagne sm:text-3xl md:order-none md:col-start-1 md:col-span-4 md:row-start-2 md:mt-8 md:max-w-xs md:self-start"
          >
            &ldquo;O luxo também está no último gesto antes da entrega.&rdquo;
          </p>

          <div
            ref={frame2Ref}
            className="relative aspect-[4/3] w-full overflow-hidden md:col-start-5 md:col-span-6 md:row-start-1 md:row-span-2 md:mt-14 md:aspect-auto md:h-[58svh]"
          >
            <div ref={inner2Ref} className="absolute inset-[-4%]">
              <ManagedVideo
                clipId="rose-lateral-light"
                description="Mão erguendo uma rosa vermelha contra fundo escuro — direção de atmosfera para o gesto de cuidado final; não é a filmagem oficial do ritual."
                aspectClassName="h-full w-full"
                objectPositionClassName="object-[58%_30%]"
                showDebugLabel={false}
              />
            </div>
          </div>

          <div
            ref={frame3Ref}
            className="relative aspect-[3/4] w-full overflow-hidden md:col-start-10 md:col-span-3 md:row-start-1 md:-ml-8 md:mt-4 md:self-start"
          >
            <div ref={inner3Ref} className="absolute inset-[-4%]">
              <Image
                src={ribbonMedia}
                alt="Detalhe da fita de cetim vermelha com borda metálica sobre fundo escuro — referência do acabamento; ainda não é uma filmagem das mãos amarrando o laço."
                fill
                sizes="(max-width: 767px) 100vw, 22vw"
                className="object-cover"
                data-temporary-media="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
