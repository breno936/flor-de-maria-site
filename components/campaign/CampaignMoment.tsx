"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { hero } from "@/data/content";

const OPEN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_CENTER = "inset(0% 6% 0% 6%)";

/**
 * The campaign's first great editorial moment, immediately after the
 * opening — not its own narrative stage (no `id`, so the indicator and nav
 * keep reading this as still part of 01 — DESEJO), just the second beat of
 * the same emotional opening. The photograph already carries the
 * logotype, the manifesto line and the campaign date baked in, so nothing
 * is layered on top of it — adding our own text here would just repeat
 * what the image already says, and duplicating "11.11" outside the
 * approved art isn't something to do without the client confirming it.
 *
 * Desktop shows the frame close to its native ratio, near full width — the
 * image is never cropped. Mobile favors the woman and the bouquet (the
 * photograph's real subjects) over the right-hand caption block, which is
 * how the date ends up de-emphasized on narrow screens without needing a
 * second, HTML-authored instance of it.
 */
export default function CampaignMoment() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set(maskRef.current, { clipPath: OPEN_CLIP });
      gsap.set(innerRef.current, { scale: 1 });
      return;
    }

    gsap.set(maskRef.current, { clipPath: HIDDEN_CENTER });
    gsap.set(innerRef.current, { scale: 1.04 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(maskRef.current, { clipPath: HIDDEN_CENTER }, { clipPath: OPEN_CLIP, duration: 1.1, ease: "power2.inOut" }, 0)
          .to(innerRef.current, { scale: 1, duration: 1.3, ease: "power2.out" }, 0);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <div ref={sectionRef} className="relative w-full bg-noir">
      <div
        ref={maskRef}
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[16/8.9]"
      >
        <div ref={innerRef} className="absolute inset-0">
          <Image
            src="/assets/le-grand-amour/campanha-buque-branco.webp"
            alt={hero.campaignAlt}
            fill
            sizes="100vw"
            className="object-cover object-[32%_38%] sm:object-[40%_center] lg:object-center"
          />
        </div>
      </div>
    </div>
  );
}
