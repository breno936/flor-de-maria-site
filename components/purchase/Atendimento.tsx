import Image from "next/image";
import { atendimento, brand, contact } from "@/data/content";
import { contactChannel } from "@/lib/contact/channel";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import Reveal from "@/components/motion/Reveal";

/**
 * ATENDIMENTO — the closing. Left: one line, the WhatsApp button (with the
 * number, for anyone without WhatsApp on this device) and only practical,
 * confirmed facts that help the order. Right: the brand signature, compact
 * — the former Autoria stage reduced to its approved curator note. Quiet
 * wine ground (gradient + fine grain), no photograph: by now the pieces
 * have been seen; this is where the visitor acts.
 */
export default function Atendimento() {
  const practical = [
    { label: "Região atendida", value: contact.serviceArea },
    { label: "Ateliê", value: contact.atelierLocation },
    { label: "Antecedência", value: contact.leadTime },
  ].filter((item) => item.value);

  return (
    <section id="atendimento" className="relative overflow-hidden bg-oxblood py-20 md:py-28" aria-labelledby="atendimento-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(65% 55% at 82% 12%, rgba(118,13,25,0.16) 0%, transparent 60%), linear-gradient(165deg, #1a0304 0%, #47070e 55%, #0a0203 130%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" focusable="false">
          <filter id="grain-atendimento">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-atendimento)" />
        </svg>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-champagne-light via-champagne/70 to-champagne/0" />

      <div className="container-lga relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-x-16">
        <div className="lg:col-span-6">
          <p className="mono-label text-champagne-light">{atendimento.eyebrow}</p>
          <h2 id="atendimento-title" className="mt-3 text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[1] text-ivory">
            {atendimento.title}
          </h2>
          <p className="mt-4 max-w-md font-sans text-[1.05rem] leading-relaxed text-ivory/85">
            {atendimento.body[contactChannel.id]}
          </p>

          <div className="mt-8">
            <WhatsAppCTA className="w-full sm:w-auto" />
            <p className="mt-4 font-sans text-sm text-champagne-light">{contactChannel.detail}</p>
          </div>

          {practical.length > 0 && (
            <dl className="mt-10 grid gap-4 border-t border-champagne-light/20 pt-6 sm:grid-cols-2">
              {practical.map((item) => (
                <div key={item.label}>
                  <dt className="mono-label text-champagne-light/85">{item.label}</dt>
                  <dd className="mt-1.5 font-sans text-[0.95rem] text-ivory/90">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div className="border-t border-champagne-light/20 pt-10 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
            <span className="relative block aspect-[1171/530] w-[12rem] sm:w-[14rem]">
              <Image
                src="/assets/le-grand-amour/le-grand-amour-wordmark.webp"
                alt={brand.signatureFull}
                fill
                sizes="14rem"
                className="object-contain object-left"
              />
            </span>
            <p className="mt-6 max-w-sm font-sans text-[0.92rem] leading-relaxed text-ivory/80">{atendimento.authorship}</p>
            <p className="mt-5 font-display text-[1.7rem] italic text-champagne-light">{atendimento.signatureLine}</p>
            <p className="mt-6 font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-champagne-light/80">
              {brand.collabLine}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
