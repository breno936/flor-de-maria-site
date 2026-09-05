"use client";

import { useState } from "react";
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

function RitualDesktop() {
  const [active, setActive] = useState(0);
  const activeStep = ritual.steps[active];

  return (
    <div className="container-lga grid grid-cols-12 gap-8">
      <div className="col-span-8 aspect-[16/9] overflow-hidden">
        <ManagedVideo
          key={activeStep}
          clipId={stepClip[activeStep]}
          description={`Etapa do ritual de criação: ${activeStep}.`}
          aspectClassName="h-full w-full"
        />
      </div>
      <ol className="col-span-4 flex flex-col justify-center gap-1">
        {ritual.steps.map((step, i) => (
          <li key={step}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              className={`group flex w-full items-center gap-4 border-b border-gold/10 py-3 text-left font-display text-xl transition-colors ${
                i === active ? "text-gold" : "text-ivory/60 hover:text-ivory"
              }`}
            >
              <span className="font-sans text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
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
            <span className="mr-2 font-sans text-xs text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}
