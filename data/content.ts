/**
 * Confirmed copy only. Every string here traces back to the client brief,
 * the official Instagram (@legrandamour.ofc) or the approved product
 * photography. Fields marked EDITABLE are intentionally empty — they
 * require real business data the client has not supplied yet. Do not fill
 * them with invented values.
 *
 * Commercial pass (Oct 2026): visitors arrive from Instagram and ads,
 * already drawn in by the campaign, so the page is four blocks —
 * ABERTURA → CRIAÇÕES (e valores) → DETALHES → ATENDIMENTO — contemplative
 * in the photographs, objective in the selling. The former Conceito,
 * Experiência and Autoria stages survive as gallery captions and a compact
 * signature, in their approved wording.
 */

export const brand = {
  collabLine: "Flor de Maria Ateliê × Patrícia Marchi",
  name: "LÊ GRAND AMOUR",
  /** Full signature as used on official cards/plaques. */
  signatureFull: "LÊ GRAND AMOUR by Flor de Maria",
};

/** ABERTURA — the campaign photograph, the mark, one line and the way to the creations. */
export const hero = {
  /** Rendered as the official logo image, never reconstructed in a web font. */
  logoAlt: "Lê Grand Amour",
  signature: "by Flor de Maria",
  phrase: "Amor em sua forma mais grandiosa.",
};

/** CRIAÇÕES — see data/products.ts for the two pieces and their prices. */
export const criacoes = {
  eyebrow: "Coleção Lê Grand Amour",
};

/** DETALHES — a short gallery; captions live with the photos in data/campaign-photos.ts. */
export const detalhes = {
  eyebrow: "Detalhes",
  title: "Feito à mão, do primeiro ao último detalhe.",
};

/** ATENDIMENTO — the closing: a compact brand signature and the way to WhatsApp. */
export const atendimento = {
  eyebrow: "Atendimento",
  title: "Faça seu pedido.",
  body: {
    whatsapp: "Direto com o responsável pelo ateliê, pelo WhatsApp.",
    instagram: "Direto com o ateliê, pelo Instagram.",
  },
  /** Autoria, compact — the approved curator note, kept as the closing signature. */
  authorship:
    "Projeto idealizado e assinado por Susan, Diretora Criativa da Flor de Maria Ateliê, com Patrícia Marchi como musa e embaixadora da coleção.",
  signatureLine: "by Patrícia Marchi",
};

export const nav = [
  { label: "Criações", href: "#criacoes" },
  { label: "Detalhes", href: "#detalhes" },
  { label: "Atendimento", href: "#atendimento" },
];

/**
 * Contact channels. Florence Boutique de Rosas' WhatsApp/site (found in the
 * supplier catalog) belong to a different company and must never be used
 * here.
 */
export const contact = {
  /**
   * The ateliê's own WhatsApp number, digits only with country code
   * (supplied by the client on 2026-10-26). Every "Pedir pelo WhatsApp"
   * opens it; if emptied, they open the Instagram Direct below instead.
   */
  whatsappNumber: "5519982465984",
  /** Official Lê Grand Amour Instagram, given directly by the client. */
  instagramHandle: "legrandamour.ofc",
  atelierLocation: "Hortolândia – SP",
  serviceArea: "Região Metropolitana de Campinas",
  /** EDITABLE — confirmed order lead time, e.g. "Pedidos com 2 dias de antecedência". */
  leadTime: "",
};
