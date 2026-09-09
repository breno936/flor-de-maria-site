import Hero from "@/components/hero/Hero";
import Manifesto from "@/components/manifesto/Manifesto";
import LastTouch from "@/components/interlude/LastTouch";
import LeBouquet from "@/components/products/LeBouquet";
import LeCoeurRoyale from "@/components/products/LeCoeurRoyale";
import PatriciaFilm from "@/components/ambassador/PatriciaFilm";
import CreationRitual from "@/components/ritual/CreationRitual";
import ScaleDetails from "@/components/scale/ScaleDetails";
import ReservationScene from "@/components/reservation/ReservationScene";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Manifesto />
      <LeBouquet />
      <LastTouch />
      <LeCoeurRoyale />
      <PatriciaFilm />
      <CreationRitual />
      <ScaleDetails />
      <ReservationScene />
    </>
  );
}
