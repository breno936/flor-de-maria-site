import Image from "next/image";
import { reservation } from "@/data/content";
import { temporaryMedia } from "@/data/temporary-media";
import ReservationForm from "./ReservationForm";

const detailMedia = temporaryMedia["petal-macro"];

/**
 * "Sua declaração começa aqui." Editorial introduction on the left, the form
 * on the right, both on the same dark ground as the rest of the page — no
 * scroll-driven transition, no docking image, no pin. The section is stable
 * while filling the form: nothing nearby animates continuously.
 */
export default function ReservationScene() {
  return (
    <section id="reserva" className="relative py-20 md:py-28">
      <div className="container-lga grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="rule-gold mb-6" />
          <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl">{reservation.title}</h2>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-muted">{reservation.body}</p>

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
        </div>

        <div className="lg:col-span-7">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
