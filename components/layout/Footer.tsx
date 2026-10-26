import Image from "next/image";
import { brand, contact } from "@/data/content";

/**
 * Closing line of the page — the brand signature already lives in the
 * Atendimento block just above, so this stays to the practical minimum:
 * the name, the official Instagram, rights, and the developer's credit.
 * The ArpeX mark rests in quiet greyscale and takes its own colours on
 * hover (on touch screens, which can't hover, it simply shows them).
 */
export default function Footer() {
  return (
    <footer className="border-t border-champagne-light/10 bg-noir">
      <div className="container-lga flex flex-col items-center gap-4 py-12 text-center md:flex-row md:justify-between md:text-left">
        <p className="font-display text-2xl tracking-[0.08em] text-ivory">{brand.name}</p>
        {contact.instagramHandle && (
          <a
            href={`https://instagram.com/${contact.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center font-sans text-sm text-muted transition-colors hover:text-champagne-light"
          >
            Instagram @{contact.instagramHandle}
          </a>
        )}
      </div>

      <div className="border-t border-champagne-light/10">
        <div className="container-lga flex flex-col items-center gap-5 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-sans text-[11px] text-muted">
            © {new Date().getFullYear()} {brand.collabLine}. Todos os direitos reservados.
          </p>
          <p className="group flex items-center gap-3 font-sans text-[11px] text-muted">
            Desenvolvido por
            <span className="relative block aspect-[836/244] w-[4.25rem] cursor-pointer opacity-100 transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:opacity-60 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:grayscale-0">
              <Image src="/assets/arpex/arpex-logo.webp" alt="ArpeX Technology" fill sizes="68px" className="object-contain" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
