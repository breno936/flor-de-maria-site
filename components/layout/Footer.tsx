import { brand, contact, nav, reservation } from "@/data/content";

function buildWhatsAppUrl() {
  if (!contact.whatsappNumber) return null;
  const message = encodeURIComponent(reservation.whatsappMessage);
  return `https://wa.me/${contact.whatsappNumber}?text=${message}`;
}

/**
 * Closing signature of the campaign, not a second reservation scene — no
 * repeated giant CTA, no restatement of the interlude's phrase. Continues
 * the same dark ground as the page above it; separation comes from spacing
 * and a hairline rule, not a background or color change. Two areas: the
 * signature (brand + partnership, large and quiet) and the practical
 * information a visitor actually needs (nav, contact, location, legal).
 */
export default function Footer() {
  const whatsappUrl = buildWhatsAppUrl();
  const hasContacts = Boolean(whatsappUrl || contact.instagramHandle);

  return (
    <footer className="border-t border-gold/10 bg-noir">
      <div className="container-lga py-16 text-center md:py-24">
        <p className="font-display text-3xl tracking-[0.08em] text-ivory sm:text-4xl md:text-5xl">{brand.name}</p>
        <div className="rule-gold mx-auto my-6" />
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted">{brand.collabLine}</p>
      </div>

      <div className="border-t border-gold/10">
        <div className="container-lga grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-3 md:py-14">
          <div>
            <p className="mono-label mb-4">Navegação</p>
            <nav className="flex flex-col gap-2" aria-label="Navegação do rodapé">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-sans text-sm text-muted transition-colors hover:text-gold"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {hasContacts && (
            <div>
              <p className="mono-label mb-4">Atendimento</p>
              <ul className="flex flex-col gap-2">
                {whatsappUrl && (
                  <li>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-muted transition-colors hover:text-gold"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
                {contact.instagramHandle && (
                  <li>
                    <a
                      href={`https://instagram.com/${contact.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-muted transition-colors hover:text-gold"
                    >
                      @{contact.instagramHandle}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div>
            <p className="mono-label mb-4">Localização</p>
            <p className="font-sans text-sm text-muted">{contact.atelierLocation}</p>
            <p className="mt-1 font-sans text-sm text-muted">{contact.serviceArea}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="container-lga flex flex-col items-center gap-2 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-sans text-[11px] text-muted/70">
            © {new Date().getFullYear()} Flor de Maria Ateliê × Patrícia Marchi. Todos os direitos reservados.
          </p>
          <p className="font-sans text-[11px] text-muted/70">Coleção Le Grand Amour</p>
        </div>
      </div>
    </footer>
  );
}
