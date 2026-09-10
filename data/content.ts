/**
 * Confirmed copy only. Every string here traces back to the client brief
 * or the "Le Grand Amour" partnership presentation (Flor de Maria × Patrícia Marchi).
 * Fields marked EDITABLE_* are intentionally empty — they require real
 * business data the client has not supplied yet (phone numbers, launch
 * date, studio deliverables). Do not fill them with invented values.
 */

export const brand = {
  collabLine: "Flor de Maria Ateliê × Patrícia Marchi",
  name: "LE GRAND AMOUR",
  tagline: "Há amores que não foram feitos para ser discretos.",
  signature: "Amor que se vê. Presença que fica.",
  manifestoTitle: "Le Grand Amour não é apenas uma coleção. É uma declaração.",
  directionName: "A DECLARAÇÃO VIVA",
  narrativeArc: ["sentir", "revelar", "criar", "declarar", "entregar", "permanecer"],
};

export const hero = {
  eyebrowTop: "Flores também contam grandes histórias",
  eyebrow: brand.collabLine,
  title: brand.name,
  tagline: "Uma declaração floral criada para transformar uma entrega em acontecimento.",
  ctaPrimary: "Reservar minha declaração",
  signature: brand.signature,
};

/**
 * Cena 2 — "O Entendimento". Typographic scene, not a second hero: a
 * headline, one short support line, and a secondary link forward to the
 * Ritual scene (where "a experiência" is actually shown).
 */
export const entendimento = {
  eyebrow: "A EXPERIÊNCIA",
  headline: "Não é apenas um buquê.",
  support: ["É a escolha das flores.", "A composição.", "O acabamento.", "A forma como chega."],
  secondaryCta: "Entender a experiência",
  secondaryHref: "#ritual",
  windowLabel: "BELEZA ESCOLHIDA COM PROPÓSITO",
};

/** Kept for the original client manifesto copy — no longer the loudest text on screen, folded into the Coleção scene as a quieter secondary line. */
export const manifesto = {
  title: brand.manifestoTitle,
  body: "Uma coleção autoral de alta floricultura criada para transformar sentimentos em grandes declarações. Há sentimentos que pedem presença. Gestos que precisam ocupar espaço. Rosas que não chegam apenas como presente, mas como a lembrança de um momento impossível de ignorar.",
};

/** Cena 3 — "A Coleção". Staged presentation of both creations together, not two symmetric cards. */
export const colecaoScene = {
  eyebrow: "A COLEÇÃO",
  cta: "Escolher minha declaração",
};

export const loveTakesShape = {
  eyebrow: "O Amor Toma Forma",
  stages: [
    {
      id: "origem",
      range: [0, 20] as [number, number],
      text: "Toda grande declaração começa em um detalhe.",
    },
    {
      id: "gesto",
      range: [20, 45] as [number, number],
      text: "Cada rosa é escolhida para ocupar seu lugar.",
    },
    {
      id: "composicao",
      range: [45, 72] as [number, number],
      text: "O sentimento ganha forma, volume e presença.",
    },
    {
      id: "revelacao",
      range: [72, 90] as [number, number],
      text: "Uma declaração não precisa ser explicada. Precisa ser sentida.",
    },
    {
      id: "hold",
      range: [90, 100] as [number, number],
      text: "",
      cta: "Conhecer as criações",
    },
  ],
};

export const ambassadorSection = {
  title: "Uma coleção sobre presença, apresentada por quem sabe ocupá-la.",
  signatureLine: "by Patrícia Marchi",
  curatorNote:
    "Projeto idealizado e assinado por Susan, Diretora Criativa da Flor de Maria, que apresenta oficialmente Patrícia Marchi como musa e embaixadora da coleção.",
  /** EDITABLE — real, authorized quote from Patrícia Marchi. Do not invent. */
  testimonialQuote: "",
};

/** Cena 4 — "O que torna especial". The one deliberately light (ivory) pause in the experience. */
export const especial = {
  eyebrow: "O que torna Le Grand Amour especial",
  facts: [
    { label: "Flores selecionadas", body: "Variedades nobres, escolhidas no auge da beleza." },
    {
      label: "Composição autoral",
      body: "Arranjos exclusivos, criados por Flor de Maria Ateliê × Patrícia Marchi.",
    },
    { label: "Acabamento manual", body: "Cada detalhe é finalizado à mão, com tempo e cuidado." },
    {
      label: "Entrega preparada para o momento",
      body: "Embalagem, apresentação e logística pensadas para uma chegada impecável.",
    },
  ],
};

/** Cena 5 — "O Ritual". One pinned full-bleed scene, four stages — not a 9-item list. */
export const ritual = {
  eyebrow: "O RITUAL",
  title: "Cada detalhe prepara a presença.",
  caption: "O amor também se reconhece nos detalhes.",
  steps: ["Escolha", "Criação", "Acabamento", "Entrega"],
};

/** Cena 6 — "Para quem é". Occasion-identification, distinct from the Patrícia ambassador scene. */
export const paraQuem = {
  eyebrow: "PARA QUEM",
  sideLabel: "Algumas histórias merecem flores.",
  lines: [
    "Para dizer eu te amo.",
    "Para celebrar.",
    "Para pedir perdão.",
    "Ou para marcar um dia que merece ser lembrado.",
  ],
  support: "Cada declaração é preparada sob medida.",
  cta: "Falar sobre a minha",
};

/**
 * Closing rose scene ("Da emoção ao gesto") — the emotional hinge between
 * the collection and the atendimento form. Kept separate from `reservation`
 * below: this is the campaign's closing statement, the form section has its
 * own, more practical heading.
 */
export const roseClosing = {
  title: "Algumas pessoas merecem mais do que um presente.",
  phrase: brand.signature,
};

export const reservation = {
  eyebrow: "VAMOS CRIAR",
  title: "Vamos criar a sua declaração.",
  body: "Conte-nos a ocasião e cuidaremos do restante.",
  note: "Atendimento personalizado com todo o sigilo.",
  ctaPrimary: "Solicitar atendimento",
  ctaSecondary: "Falar diretamente pelo WhatsApp",
  whatsappMessage:
    "Olá! Conheci a coleção Le Grand Amour e gostaria de receber atendimento para escolher minha declaração.",
  successTitle: "Recebemos sua solicitação.",
  successBody: "Vamos conversar sobre a sua declaração.",
  privacyConsentLabel:
    "Autorizo o contato da Flor de Maria Ateliê para tratar da minha solicitação, conforme a Política de Privacidade.",
  privacyNote: "Suas informações são tratadas com segurança e utilizadas apenas para atendimento.",
  messageLabel: "O que você deseja dizer?",
  detailsToggle: "Adicionar detalhes do presente",
  creationOptions: [
    { value: "le-bouquet", label: "Le Bouquet" },
    { value: "le-coeur-royale", label: "Le Cœur Royale" },
    { value: "ainda-nao-decidi", label: "Quero orientação" },
  ] as const,
};

export const closing = {
  collabLine: brand.collabLine,
  title: brand.name,
  signature: brand.signature,
};

export const nav = [
  { label: "A coleção", href: "#colecao" },
  { label: "A experiência", href: "#ritual" },
  { label: "Para quem", href: "#para-quem" },
  { label: "Reserva", href: "#reserva" },
];

/**
 * Contact channels. Florence Boutique de Rosas' WhatsApp/site (found in the
 * supplier catalog) belong to a different company and must never be used
 * here. Flor de Maria's own number has not been supplied yet.
 */
export const contact = {
  /** EDITABLE — Flor de Maria's own WhatsApp number, digits only, e.g. "5519999999999". */
  whatsappNumber: "",
  /** EDITABLE — Flor de Maria's own Instagram handle for Le Grand Amour. */
  instagramHandle: "",
  atelierLocation: "Hortolândia – SP",
  serviceArea: "Região Metropolitana de Campinas",
};
