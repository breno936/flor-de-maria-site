"use client";

import { useEffect, useState } from "react";
import { nav, hero } from "@/data/content";
import LogoMark from "./LogoMark";
import AtelierButton from "@/components/ui/AtelierButton";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-noir/85 backdrop-blur-sm border-b border-gold/10" : "bg-transparent"
      }`}
      style={{ height: "var(--header-height-mobile)" }}
    >
      <div className="container-lga flex h-[72px] items-center justify-between md:h-[88px]">
        <a href="#topo" className="flex items-center gap-2">
          <LogoMark compact />
          <span className="sr-only">Le Grand Amour — página inicial</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-xs uppercase tracking-[0.2em] text-ivory/80 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block">
            <AtelierButton href="#reserva" variant="header">
              {hero.ctaPrimary}
            </AtelierButton>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-gold transition-transform ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-4 bg-gold transition-transform ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[72px] z-40 flex flex-col bg-noir px-6 py-10 lg:hidden"
        >
          <nav className="flex flex-col gap-6" aria-label="Navegação mobile">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl text-ivory transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <AtelierButton
            href="#reserva"
            variant="primary"
            onClick={() => setMenuOpen(false)}
            className="mt-10 w-full"
          >
            {hero.ctaPrimary}
          </AtelierButton>
        </div>
      )}
    </header>
  );
}
