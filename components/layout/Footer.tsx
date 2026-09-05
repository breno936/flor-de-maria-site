import { contact, nav } from "@/data/content";
import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-noir py-10">
      <div className="container-lga flex flex-col items-center gap-6 text-center">
        <LogoMark />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Navegação do rodapé">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-muted">
          {contact.atelierLocation} · {contact.serviceArea}
        </p>
        <p className="font-sans text-[11px] text-muted/70">
          © {new Date().getFullYear()} Flor de Maria Ateliê × Patrícia Marchi. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
