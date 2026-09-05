"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/registerGsap";
import { useMediaQuery } from "@/lib/accessibility/useMediaQuery";
import { useReducedMotion } from "@/lib/accessibility/useReducedMotion";
import { loveTakesShape } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";
import LogoMark from "@/components/layout/LogoMark";
import type { MediaClipId } from "@/data/media-manifest";

type Layer = {
  clipId: MediaClipId;
  description: string;
  keyframes: [number, number, number, number]; // fadeInStart, fullStart, fullEnd, fadeOutEnd (0-100)
};

const layers: Layer[] = [
  {
    clipId: "petal-macro",
    description: "Macro de uma única rosa surgindo do breu.",
    keyframes: [0, 4, 16, 22],
  },
  {
    clipId: "hands-selecting",
    description: "Mãos selecionando e preparando rosas, uma a uma.",
    keyframes: [16, 22, 42, 48],
  },
  {
    clipId: "bouquet-assembly",
    description: "A composição ganha volume até revelar a criação completa.",
    keyframes: [42, 48, 100, 100],
  },
];

function trapezoid(progress: number, [inStart, fullStart, fullEnd, outEnd]: number[]) {
  if (progress <= inStart || progress >= outEnd) return 0;
  if (progress < fullStart) return (progress - inStart) / (fullStart - inStart);
  if (progress <= fullEnd) return 1;
  return 1 - (progress - fullEnd) / (outEnd - fullEnd);
}

export default function LoveTakesShape() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();

  if (!isDesktop || reducedMotion) {
    return <LoveTakesShapeMobile />;
  }
  return <LoveTakesShapeDesktop />;
}

function LoveTakesShapeDesktop() {
  const outerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [activeStage, setActiveStage] = useState(loveTakesShape.stages[0]);
  const lastStageId = useRef(loveTakesShape.stages[0].id);

  useEffect(() => {
    registerGsap();
    const outer = outerRef.current;
    if (!outer) return;

    const setters = layerRefs.current.map((el) => (el ? gsap.quickSetter(el, "opacity") : null));

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = self.progress * 100;

        layers.forEach((layer, i) => {
          setters[i]?.(trapezoid(progress, layer.keyframes));
        });

        if (logoRef.current) {
          gsap.set(logoRef.current, { opacity: trapezoid(progress, [70, 78, 100, 100]) });
        }
        if (ctaRef.current) {
          gsap.set(ctaRef.current, { opacity: trapezoid(progress, [88, 92, 100, 100]) });
        }

        const stage = loveTakesShape.stages.find(
          (s) => progress >= s.range[0] && progress < s.range[1]
        ) ?? loveTakesShape.stages[loveTakesShape.stages.length - 1];
        if (stage.id !== lastStageId.current) {
          lastStageId.current = stage.id;
          setActiveStage(stage);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      id="criacao-forma"
      ref={outerRef}
      className="relative"
      style={{ height: "200svh" }}
      aria-label="O amor toma forma — do detalhe à declaração completa"
    >
      <div
        className="sticky overflow-hidden bg-noir"
        style={{ top: "var(--header-height)", height: "calc(100svh - var(--header-height))" }}
      >
        {layers.map((layer, i) => (
          <div
            key={layer.clipId}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <ManagedVideo
              clipId={layer.clipId}
              description={layer.description}
              aspectClassName="h-full w-full"
              priority={i === 0}
            />
          </div>
        ))}

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,5,4,0.75) 0%, rgba(7,5,4,0.15) 30%, rgba(7,5,4,0.15) 70%, rgba(7,5,4,0.85) 100%)",
          }}
        />

        <div
          ref={logoRef}
          className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2"
          style={{ opacity: 0 }}
        >
          <LogoMark />
        </div>

        <div className="eyebrow absolute left-6 top-8 md:left-12">{loveTakesShape.eyebrow}</div>

        <div className="container-lga absolute inset-x-0 bottom-16 flex flex-col items-start gap-6">
          <p
            key={activeStage.id}
            className="reveal reveal-in max-w-xl font-display text-2xl leading-snug text-ivory sm:text-3xl"
          >
            {activeStage.text}
          </p>
          {activeStage.cta && (
            <a
              ref={ctaRef}
              href="#criacoes"
              style={{ opacity: 0 }}
              className="rounded-full border border-gold px-7 py-3 font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-noir"
            >
              {activeStage.cta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function LoveTakesShapeMobile() {
  const moments = [
    { clipId: layers[0].clipId, text: loveTakesShape.stages[0].text },
    { clipId: layers[1].clipId, text: loveTakesShape.stages[1].text },
    { clipId: layers[2].clipId, text: loveTakesShape.stages[2].text },
    { clipId: layers[2].clipId, text: loveTakesShape.stages[3].text },
  ];

  return (
    <section id="criacao-forma" className="py-20" aria-label="O amor toma forma">
      <div className="container-lga mb-8">
        <p className="eyebrow">{loveTakesShape.eyebrow}</p>
      </div>
      <div className="flex flex-col gap-16">
        {moments.map((moment, i) => (
          <div key={i} className="container-lga">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <ManagedVideo
                clipId={moment.clipId}
                description={moment.text}
                aspectClassName="h-full w-full"
              />
            </div>
            <p className="mt-5 font-display text-xl leading-snug text-ivory">{moment.text}</p>
          </div>
        ))}
        <div className="container-lga">
          <a
            href="#criacoes"
            className="inline-block rounded-full border border-gold px-7 py-3 font-sans text-xs uppercase tracking-[0.2em] text-gold"
          >
            {loveTakesShape.stages[loveTakesShape.stages.length - 1].cta}
          </a>
        </div>
      </div>
    </section>
  );
}
