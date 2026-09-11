"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { paraQuem } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";

const media = temporaryMedia["petal-macro"]!;
const OPEN = "inset(0% 0% 0% 0%)";
const HIDDEN_LEFT = "inset(0% 0% 0% 100%)";

/**
 * Cena 6 — "Para quem é". An emotional, occasion-identification scene —
 * distinct in purpose (and in composition) from the Patrícia Marchi
 * ambassador scene that follows it: this is about the visitor's own
 * reason to buy, not the collection's curator. The image wipes open and
 * each occasion line lands in turn, once, on scroll-enter.
 */
export default function ForWhom() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set(imageRef.current, { clipPath: OPEN });
      gsap.set(lineRefs.current, { opacity: 1, x: 0 });
      gsap.set([supportRef.current, ctaRef.current], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(imageRef.current, { clipPath: HIDDEN_LEFT });
    gsap.set(lineRefs.current, { opacity: 0, x: 16 });
    gsap.set([supportRef.current, ctaRef.current], { opacity: 0, y: 12 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 65%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(imageRef.current, { clipPath: OPEN, duration: 1, ease: "power2.inOut" }, 0);
        lineRefs.current.forEach((line, i) => {
          tl.to(line, { opacity: 1, x: 0, duration: 0.45 }, 0.15 + i * 0.12);
        });
        tl.to(supportRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.15 + lineRefs.current.length * 0.12)
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4 }, ">-=0.1");
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="para-quem" ref={sectionRef} className="relative overflow-hidden bg-noir" aria-labelledby="para-quem-title">
      <div className="grid min-h-[90svh] lg:grid-cols-2">
        <div className="relative order-2 min-h-[46svh] overflow-hidden lg:order-1 lg:min-h-full">
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={media.temporaryImage}
              alt={media.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              data-temporary-media="true"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent 60%, rgba(7,6,6,0.55) 100%)" }}
            />
          </div>
          <p
            className="mono-label absolute bottom-8 left-6 hidden [writing-mode:vertical-rl] lg:block"
            aria-hidden="true"
          >
            {paraQuem.sideLabel}
          </p>
        </div>

        <div className="order-1 flex items-center px-6 py-16 sm:px-10 md:px-16 lg:order-2 lg:py-0">
          <div className="max-w-md">
            <p className="mono-label">{paraQuem.eyebrow}</p>
            <h2
              id="para-quem-title"
              className="mt-5 font-display text-3xl leading-[1.2] text-ivory sm:text-4xl lg:text-[2.75rem]"
            >
              {paraQuem.lines.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <span
                    ref={(el) => {
                      lineRefs.current[i] = el;
                    }}
                    className="block"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p ref={supportRef} className="mt-6 font-sans text-sm leading-relaxed text-muted">
              {paraQuem.support}
            </p>
            <div ref={ctaRef}>
              <AtelierButton href="#reserva" variant="secondary" className="mt-8">
                {paraQuem.cta}
              </AtelierButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
