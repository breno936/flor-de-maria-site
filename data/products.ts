export type Product = {
  id: "le-bouquet" | "le-coeur-royale";
  eyebrow: string;
  name: string;
  tagline: string;
  facts: string[];
};

/**
 * Only facts explicitly confirmed in the client brief / partnership deck.
 * No pricing, dimensions, or availability invented.
 */
export const products: Product[] = [
  {
    id: "le-bouquet",
    eyebrow: "Criação I",
    name: "LÊ BOUQUET",
    tagline: "Uma presença impossível de ignorar.",
    facts: [
      "Buquê monumental",
      "Aproximadamente 50 a 100 rosas selecionadas",
      "Design floral autoral",
      "Acabamento premium",
    ],
  },
  {
    id: "le-coeur-royale",
    eyebrow: "Criação II",
    name: "LÊ CŒUR ROYALE",
    tagline: "O amor em sua forma mais emblemática.",
    facts: [
      "Caixa rígida autoral",
      "Formato de coração",
      "Aproximadamente 60 a 70 rosas",
      "Acabamento premium",
    ],
  },
];
