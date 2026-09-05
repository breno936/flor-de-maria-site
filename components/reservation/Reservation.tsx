import { reservation, contact } from "@/data/content";
import ReservationForm from "./ReservationForm";

function buildWhatsAppUrl() {
  if (!contact.whatsappNumber) return null;
  const message = encodeURIComponent(reservation.whatsappMessage);
  return `https://wa.me/${contact.whatsappNumber}?text=${message}`;
}

export default function Reservation() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <section id="reserva" className="py-20 md:py-28" aria-labelledby="reserva-title">
      <div className="container-lga grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rule-gold mb-6" />
          <h2 id="reserva-title" className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
            {reservation.title}
          </h2>
          <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{reservation.body}</p>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-noir"
            >
              {reservation.ctaSecondary}
            </a>
          )}
        </div>

        <div className="lg:col-span-7">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
