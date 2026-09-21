import Hero from "@/components/hero/Hero";
import Conceito from "@/components/concept/Conceito";
import Produto from "@/components/products/Produto";
import CreationRitual from "@/components/ritual/CreationRitual";
import PatriciaFilm from "@/components/ambassador/PatriciaFilm";
import Compra from "@/components/purchase/Compra";
import { contact } from "@/data/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  name: "Flor de Maria Ateliê",
  description:
    "Alta floricultura autoral. Coleção Le Grand Amour, em parceria com Patrícia Marchi.",
  areaServed: contact.serviceArea,
  address: {
    "@type": "PostalAddress",
    addressLocality: contact.atelierLocation,
    addressCountry: "BR",
  },
};

/**
 * Narrative order — client-approved, exact:
 * DESEJO → CONCEITO → PRODUTO → EXPERIÊNCIA → AUTORIA → COMPRA.
 * No macrosections between these six stages.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Conceito />
      <Produto />
      <CreationRitual />
      <PatriciaFilm />
      <Compra />
    </>
  );
}
