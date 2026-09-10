"use client";

import { useEffect, useRef, useState } from "react";
import { ritual } from "@/data/content";
import ManagedVideo from "@/components/media/ManagedVideo";
import type { MediaClipId } from "@/data/media-manifest";

const stepClip: Record<string, MediaClipId> = {
  Seleção: "hands-selecting",
  Preparação: "petal-macro",
  Estrutura: "rose-lateral-light",
  Montagem: "bouquet-assembly",
  Acabamento: "coeur-assembly",
  Fita: "ribbon-detail",
  Cartão: "ribbon-detail",
  Embalagem: "ribbon-detail",
  Entrega: "delivery-moment",
};

export default function CreationRitual() {
  return (
    <section id="ritual" className="py-20 md:py-28" aria-labelledby="ritual-title">
      <div className="container-lga">
        <div className="rule-gold mb-6" />
        <h2 id="ritual-title" className="max-w-2xl font-display text-3xl text-ivory sm:text-4xl">
          {ritual.title}
        </h2>
      </div>

      <div className="mt-12 hidden lg:block">
        <RitualDesktop />
      </div>
      <div className="mt-10 lg:hidden">
        <RitualMobile />
      </div>
    </section>
  );
}

const CROSSFADE_MS = 450;

function RitualDesktop() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const select = (index: number) => {
    if (index === active) return;
    setPrevious(active);
    setActive(index);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPrevious(null), CROSSFADE_MS);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const activeStep = ritual.steps[active];

  return (
    <div className="container-lga grid grid-cols-12 gap-8">
      <div className="relative col-span-8 aspect-[16/9] overflow-hidden">
        {previous !== null && (
          <div className="absolute inset-0" aria-hidden="true">
            <ManagedVideo
              clipId={stepClip[ritual.steps[previous]]}
              description=""
              aspectClassName="h-full w-full"
              showDebugLabel={false}
            />
          </div>
        )}
        <div
          key={active}
          className="absolute inset-0 animate-[ritual-in_450ms_ease-out_forwards]"
        >
          <ManagedVideo
            clipId={stepClip[activeStep]}
            description={`Etapa do ritual de criação: ${activeStep}.`}
            aspectClassName="h-full w-full"
          />
        </div>
      </div>
      <ol className="col-span-4 flex flex-col justify-center gap-1">
        {ritual.steps.map((step, i) => (
          <li key={step}>
            <button
              type="button"
              onClick={() => select(i)}
              aria-current={i === active}
              className={`group flex w-full items-center gap-4 border-b border-gold/10 py-3 text-left font-display text-xl transition-colors ${
                i === active ? "text-gold" : "text-ivory/60 hover:text-ivory"
              }`}
            >
              <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
              {step}
              <span
                className={`ml-auto h-px bg-gold transition-all ${
                  i === active ? "w-8 opacity-100" : "w-0 opacity-0"
                }`}
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RitualMobile() {
  return (
    <div className="flex flex-col gap-10">
      {ritual.steps.map((step, i) => (
        <div key={step} className="container-lga">
          <div className="aspect-video w-full overflow-hidden">
            <ManagedVideo
              clipId={stepClip[step]}
              description={`Etapa do ritual de criação: ${step}.`}
              aspectClassName="h-full w-full"
            />
          </div>
          <p className="mt-3 font-display text-lg text-ivory">
            <span className="mono-label mr-2">
              {String(i + 1).padStart(2, "0")}
            </span>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}
