import Hero from "@/components/hero/Hero";
import Criacoes from "@/components/products/Criacoes";
import Filme from "@/components/film/Filme";
import Detalhes from "@/components/gallery/Detalhes";
import Embaixadora from "@/components/ambassador/Embaixadora";
import Atendimento from "@/components/purchase/Atendimento";
import { contact } from "@/data/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  name: "Flor de Maria Ateliê",
  description:
    "Alta Floricultura. Amor em sua forma mais grandiosa. Coleção Le Grand Amour, em parceria com Patrícia Marchi.",
  areaServed: contact.serviceAreas.map((area) => area.region),
  address: {
    "@type": "PostalAddress",
    addressLocality: contact.atelierLocation,
    addressCountry: "BR",
  },
};

/**
 * Six blocks, in this order: ABERTURA → CRIAÇÕES (e valores) → FILME →
 * DETALHES → EMBAIXADORA → ATENDIMENTO. Contemplative in the photographs, objective in the selling;
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
      <Filme />
      <Detalhes />
      <Embaixadora />
      <Atendimento />
    </>
  );
}
