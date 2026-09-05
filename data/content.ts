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
  eyebrow: brand.collabLine,
  title: brand.name,
  tagline: brand.tagline,
  body: "Uma coleção autoral de alta floricultura criada para transformar sentimentos em grandes declarações.",
  ctaPrimary: "Reservar minha declaração",
  ctaSecondary: "Conhecer a coleção",
  signature: brand.signature,
};

export const manifesto = {
  title: brand.manifestoTitle,
  body: "Há sentimentos que pedem presença. Gestos que precisam ocupar espaço. Rosas que não chegam apenas como presente, mas como a lembrança de um momento impossível de ignorar.",
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

export const ritual = {
  title: "Antes de chegar como declaração, cada rosa passa por um ritual.",
  steps: [
    "Seleção",
    "Preparação",
    "Estrutura",
    "Montagem",
    "Acabamento",
    "Fita",
    "Cartão",
    "Embalagem",
    "Entrega",
  ],
};

export const scaleSection = {
  title: "Criado para ser lembrado antes mesmo de ser aberto.",
  /** EDITABLE — confirmed dimensions/weight/lead time not yet provided by client. */
  facts: {
    prazo: "",
    personalizacao: "",
    disponibilidade: "",
    entregaOuRetirada: "",
  },
};

export const reservation = {
  title: "Algumas pessoas merecem mais do que um presente.",
  body: "Conte-nos para quem é a sua declaração. A Flor de Maria prepara o restante.",
  ctaPrimary: "Solicitar atendimento privado",
  ctaSecondary: "Falar diretamente pelo WhatsApp",
  whatsappMessage:
    "Olá! Conheci a coleção Le Grand Amour e gostaria de receber atendimento para escolher minha declaração.",
  successTitle: "Sua declaração começou a tomar forma.",
  successBody: "Nossa equipe entrará em contato para cuidar dos próximos detalhes.",
  privacyConsentLabel:
    "Autorizo o contato da Flor de Maria Ateliê para tratar da minha solicitação, conforme a Política de Privacidade.",
};

export const closing = {
  collabLine: brand.collabLine,
  title: brand.name,
  signature: brand.signature,
};

export const nav = [
  { label: "A coleção", href: "#colecao" },
  { label: "Criações", href: "#criacoes" },
  { label: "Patrícia", href: "#patricia" },
  { label: "Ritual", href: "#ritual" },
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
