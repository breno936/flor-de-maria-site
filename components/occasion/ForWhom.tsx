import Image from "next/image";
import { paraQuem } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import AtelierButton from "@/components/ui/AtelierButton";

const media = temporaryMedia["delivery-moment"]!;

/**
 * Cena 6 — "Para quem é". An emotional, occasion-identification scene —
 * distinct in purpose (and in composition) from the Patrícia Marchi
 * ambassador scene that follows it: this is about the visitor's own
 * reason to buy, not the collection's curator.
 */
export default function ForWhom() {
  return (
    <section id="para-quem" className="relative overflow-hidden bg-noir" aria-labelledby="para-quem-title">
      <div className="grid min-h-[90svh] lg:grid-cols-2">
        <div className="relative order-2 min-h-[46svh] lg:order-1 lg:min-h-full">
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
              {paraQuem.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 font-sans text-sm leading-relaxed text-muted">{paraQuem.support}</p>
            <AtelierButton href="#reserva" variant="secondary" className="mt-8">
              {paraQuem.cta}
            </AtelierButton>
          </div>
        </div>
      </div>
    </section>
  );
}
