import { products, type ProductPrice } from "@/data/products";

export function formatPrice({ amount }: ProductPrice) {
  const cents = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: cents,
    maximumFractionDigits: cents,
  }).format(amount);
}

/** Both creations have a confirmed price — only then does the page talk about "valores". */
export const pricesConfirmed = products.every((p) => p.price);

/**
 * The lowest confirmed price, for the opening's "a partir de". Only when
 * every creation is priced: with one value missing, the cheapest piece
 * could be the unknown one and "a partir de" would not be true.
 */
export const startingPrice: ProductPrice | null = pricesConfirmed
  ? { amount: Math.min(...products.map((p) => p.price!.amount)) }
  : null;
