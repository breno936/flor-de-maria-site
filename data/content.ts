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
  name: "LE GRAND AMOUR",
  /** Full signature as used on official cards/plaques. */
  signatureFull: "LE GRAND AMOUR by Flor de Maria",
};

/** ABERTURA — the campaign photograph, the mark, one line and the way to the creations. */
export const hero = {
  /** Rendered as the official logo image, never reconstructed in a web font. */
  logoAlt: "Le Grand Amour",
  signature: "by Flor de Maria",
  phrase: "Amor em sua forma mais grandiosa.",
};

/** CRIAÇÕES — see data/products.ts for the two pieces and their prices. */
export const criacoes = {
  eyebrow: "Coleção Le Grand Amour",
};

/** DETALHES — a short gallery; captions live with the photos in data/campaign-photos.ts. */
export const detalhes = {
  eyebrow: "Detalhes",
  title: "Feito à mão, do primeiro ao último detalhe.",
};

/**
 * EMBAIXADORA — Patrícia Marchi's video testimonial (sent by the client on
 * 2026-11-01). Only the name and the role already confirmed in the
 * partnership ("musa e embaixadora da coleção"); nothing she says in the
 * film is quoted here.
 */
export const filme = {
  eyebrow: "O filme",
  title: "Le Grand Amour",
  cta: "Assistir ao filme",
};

export const embaixadora = {
  eyebrow: "A embaixadora",
  name: "Patrícia Marchi",
  role: "Musa e embaixadora da coleção Le Grand Amour.",
  cta: "Assistir ao depoimento",
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

/** Indicador lateral de capítulos (mini menu) — os cinco blocos, nesta ordem. */
export const narrativeSteps = [
  { id: "inicio", number: "01", label: "Abertura" },
  { id: "criacoes", number: "02", label: "Criações" },
  { id: "filme", number: "03", label: "Filme" },
  { id: "detalhes", number: "04", label: "Detalhes" },
  { id: "embaixadora", number: "05", label: "Embaixadora" },
  { id: "atendimento", number: "06", label: "Atendimento" },
] as const;

/** Developer credit in the footer — ArpeX's official Instagram, given by the client. */
export const developer = {
  name: "ArpeX Technology",
  url: "https://www.instagram.com/arpextechnology/",
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
  /** Official Le Grand Amour Instagram, given directly by the client. */
  instagramHandle: "legrandamour.ofc",
  atelierLocation: "Hortolândia – SP",
  serviceArea: "Região Metropolitana de Campinas",
  /** EDITABLE — confirmed order lead time, e.g. "Pedidos com 2 dias de antecedência". */
  leadTime: "",
};
