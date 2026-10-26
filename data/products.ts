export type CreationId = "le-bouquet" | "le-coeur-royale";

export type ProductPrice = {
  /** In reais, e.g. 1290. */
  amount: number;
  /**
   * True only when a real starting configuration sells for exactly this
   * amount and bigger ones cost more — shown as "a partir de".
   */
  from?: boolean;
};

export type Product = {
  id: CreationId;
  eyebrow: string;
  name: string;
  /** Upright editorial display form of `name` — the card's headline. */
  title: string;
  tagline: string;
  /** At most three concrete facts that help the purchase decision. */
  facts: string[];
  /**
   * EDITABLE — the confirmed price. While empty, no price, "a partir de" or
   * placeholder appears anywhere on the page, and the WhatsApp message
   * leaves the value out.
   */
  price?: ProductPrice;
  /** EDITABLE — confirmed price variations / extra costs, one short sentence. */
  priceNote?: string;
};

/**
 * Only facts explicitly confirmed in the client brief / partnership deck.
 * No pricing, dimensions, or availability invented — prices come only from
 * the person responsible for the ateliê, never deduced from the campaign's
 * approximate ticket.
 */
export const products: Product[] = [
  {
    id: "le-bouquet",
    eyebrow: "Criação I",
    name: "LÊ BOUQUET",
    title: "Lê Bouquet",
    tagline: "Uma presença impossível de ignorar.",
    facts: ["Aproximadamente 50 a 100 rosas selecionadas", "Buquê monumental de design autoral", "Acabamento premium"],
  },
  {
    id: "le-coeur-royale",
    eyebrow: "Criação II",
    name: "LÊ CŒUR ROYALE",
    title: "Lê Cœur Royale",
    tagline: "O amor em sua forma mais emblemática.",
    facts: ["Aproximadamente 60 a 70 rosas", "Caixa rígida autoral em formato de coração", "Acabamento premium"],
  },
];

export function findProduct(id?: CreationId) {
  return id ? products.find((p) => p.id === id) : undefined;
}
