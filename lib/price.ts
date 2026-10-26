import { products, type Product } from "@/data/products";

export function formatPrice(amount: number) {
  const cents = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: cents,
    maximumFractionDigits: cents,
  }).format(amount);
}

/** The cheapest version of one creation — its "a partir de". */
export function fromPrice(product: Product) {
  return Math.min(...product.options.map((o) => o.amount));
}

/** Every creation has its price list — only then does the page talk about "valores". */
export const pricesConfirmed = products.every((p) => p.options.length > 0);

/**
 * The lowest price across the collection, for the opening's "a partir de".
 * Only when every creation is priced: with one list missing, the cheapest
 * piece could be the unknown one and "a partir de" would not be true.
 */
export const startingPrice: number | null = pricesConfirmed ? Math.min(...products.map(fromPrice)) : null;
