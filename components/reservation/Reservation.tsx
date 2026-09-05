import { reservation, contact } from "@/data/content";
import ReservationForm from "./ReservationForm";
import AtelierButton from "@/components/ui/AtelierButton";

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
            <AtelierButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-8">
              {reservation.ctaSecondary}
            </AtelierButton>
          )}
        </div>

        <div className="lg:col-span-7">
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
