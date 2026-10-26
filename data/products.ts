export type CreationId = "le-bouquet" | "le-coeur-royale";

/** One version of a creation and what it costs — a choice on the card. */
export type PriceOption = {
  id: string;
  /** What the visitor is choosing, as the ateliê names it: "50 rosas", "Rosas e chocolate". */
  label: string;
  /** In reais, e.g. 1500. */
  amount: number;
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
  /** Legend of the option group — what the options vary in. */
  optionsLabel: string;
  /**
   * EDITABLE — the official price list, in the ateliê's own order. Each
   * entry is one selectable version; the card shows "a partir de" the
   * lowest until one is chosen, and the WhatsApp message carries the
   * chosen one. Never deduced or rounded: only values the client sent.
   */
  options: PriceOption[];
  /** EDITABLE — confirmed price conditions / extra costs, one short sentence. */
  priceNote?: string;
};

/**
 * Only facts explicitly confirmed in the client brief / partnership deck,
 * and the official price list the client sent on 2026-10-26. No
 * dimensions or availability invented.
 */
export const products: Product[] = [
  {
    id: "le-bouquet",
    eyebrow: "Criação I",
    name: "LÊ BOUQUET",
    title: "Lê Bouquet",
    tagline: "Uma presença impossível de ignorar.",
    facts: ["Buquê monumental de design autoral", "Rosas selecionadas", "Acabamento premium"],
    optionsLabel: "Quantidade de rosas",
    options: [
      { id: "30-rosas", label: "30 rosas", amount: 999 },
      { id: "50-rosas", label: "50 rosas", amount: 1500 },
      { id: "60-rosas", label: "60 rosas", amount: 1800 },
      { id: "70-rosas", label: "70 rosas", amount: 2000 },
      { id: "80-rosas", label: "80 rosas", amount: 2300 },
      { id: "100-rosas", label: "100 rosas", amount: 2900 },
    ],
  },
  {
    id: "le-coeur-royale",
    eyebrow: "Criação II",
    name: "LÊ CŒUR ROYALE",
    title: "Lê Cœur Royale",
    tagline: "O amor em sua forma mais emblemática.",
    facts: ["Aproximadamente 60 a 70 rosas", "Caixa rígida autoral em formato de coração", "Acabamento premium"],
    optionsLabel: "Versão",
    options: [
      { id: "rosas-e-chocolate", label: "Rosas e chocolate", amount: 1350 },
      { id: "rosas", label: "Rosas", amount: 1500 },
    ],
  },
];

export function findProduct(id?: CreationId) {
  return id ? products.find((p) => p.id === id) : undefined;
}

export function findOption(product: Product | undefined, optionId?: string) {
  return optionId ? product?.options.find((o) => o.id === optionId) : undefined;
}
