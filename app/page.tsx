import Hero from "@/components/hero/Hero";
import Criacoes from "@/components/products/Criacoes";
import Detalhes from "@/components/gallery/Detalhes";
import Atendimento from "@/components/purchase/Atendimento";
import { contact } from "@/data/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  name: "Flor de Maria Ateliê",
  description:
    "Alta Floricultura. Amor em sua forma mais grandiosa. Coleção Lê Grand Amour, em parceria com Patrícia Marchi.",
  areaServed: contact.serviceArea,
  address: {
    "@type": "PostalAddress",
    addressLocality: contact.atelierLocation,
    addressCountry: "BR",
  },
};

/**
 * Four blocks, in this order: ABERTURA → CRIAÇÕES (e valores) → DETALHES →
 * ATENDIMENTO. Contemplative in the photographs, objective in the selling;
 * nothing pins or holds the scroll.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Criacoes />
      <Detalhes />
      <Atendimento />
    </>
  );
}
