import Image from "next/image";
import { reservation } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import ReservationForm from "./ReservationForm";
import RoseClosing from "./RoseClosing";

const detailMedia = temporaryMedia["petal-macro"];

/**
 * Cena 7 — "Reserva". "Da emoção ao gesto" (RoseClosing) closes the
 * collection first, then this panel opens the atendimento step: an oxblood
 * ground carrying the editorial introduction and a petal detail, with the
 * form itself set apart on its own well-finished ivory card — the clear
 * contrast the brief asks for, not another dark-on-dark block. `#reserva`
 * targets this section, never the pinned scene above it, so a direct link
 * always lands on a ready form.
 */
export default function ReservationScene() {
  return (
    <>
      <RoseClosing />

      <section id="reserva" className="relative overflow-hidden bg-oxblood py-20 md:py-28">
        <div className="container-lga grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="mono-label text-champagne/80">{reservation.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ivory sm:text-4xl">{reservation.title}</h2>
            <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-ivory/70">{reservation.body}</p>

            {detailMedia && (
              <div className="relative mt-10 hidden aspect-[3/4] w-full max-w-[220px] overflow-hidden lg:block">
                <Image
                  src={detailMedia.temporaryImage}
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover"
                  data-temporary-media="true"
                />
              </div>
            )}

            <p className="mono-label mt-10 text-champagne/60">{reservation.note}</p>
          </div>

          <div className="lg:col-span-7">
            <ReservationForm />
          </div>
        </div>
      </section>
    </>
  );
}
