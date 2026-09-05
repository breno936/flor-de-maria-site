import PetalReveal from "@/components/hero/PetalReveal";
import HeroFilm from "@/components/hero/HeroFilm";
import Manifesto from "@/components/manifesto/Manifesto";
import LoveTakesShape from "@/components/experience/LoveTakesShape";
import RedThread from "@/components/experience/RedThread";
import LeBouquet from "@/components/products/LeBouquet";
import LeCoeurRoyale from "@/components/products/LeCoeurRoyale";
import PatriciaFilm from "@/components/ambassador/PatriciaFilm";
import CreationRitual from "@/components/ritual/CreationRitual";
import ScaleDetails from "@/components/scale/ScaleDetails";
import Reservation from "@/components/reservation/Reservation";
import Closing from "@/components/closing/Closing";
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PetalReveal />
      <HeroFilm />
      <Manifesto />
      <LoveTakesShape />
      <LeBouquet />
      <RedThread />
      <LeCoeurRoyale />
      <PatriciaFilm />
      <CreationRitual />
      <ScaleDetails />
      <Reservation />
      <Closing />
    </>
  );
}
