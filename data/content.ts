/**
 * Confirmed copy only. Every string here traces back to the client brief
 * or the "Le Grand Amour" partnership presentation (Flor de Maria × Patrícia Marchi).
 * Fields marked EDITABLE_* are intentionally empty — they require real
 * business data the client has not supplied yet (phone numbers, launch
 * date, studio deliverables). Do not fill them with invented values.
 *
 * Narrative restructure (client-approved direction): the page now follows
 * exactly six stages — DESEJO → CONCEITO → PRODUTO → EXPERIÊNCIA → AUTORIA →
 * COMPRA. Each export below is grouped under its stage.
 */

export const brand = {
  collabLine: "Flor de Maria Ateliê × Patrícia Marchi",
  name: "LE GRAND AMOUR",
  signature: "Amor que se vê. Presença que fica.",
};

/** Etapa 01 — DESEJO (o hero). Impacto emocional antes de explicar o produto. */
export const hero = {
  eyebrow: brand.collabLine,
  title: brand.name,
  /** "Frase principal" — entregue em duas linhas, nunca disputando protagonismo com o título. */
  phraseLines: ["Amor que se vê.", "Presença que fica."],
  support: "Uma declaração floral criada para transformar uma entrega em acontecimento.",
};

/** Etapa 02 — CONCEITO. Transforma o desejo inicial em significado; incorpora o antigo "Para quem". */
export const conceito = {
  eyebrow: "02 — CONCEITO",
  headlineLines: ["Não é apenas um buquê.", "É uma declaração."],
  body: [
    "Algumas histórias pedem mais do que um presente.",
    "Le Grand Amour nasce para transformar sentimentos em presença: na escolha das flores, na composição, no acabamento e na forma como cada criação chega.",
  ],
  occasions: [
    "Para dizer eu te amo.",
    "Para celebrar.",
    "Para pedir perdão.",
    "Para marcar um dia que merece ser lembrado.",
  ],
};

/** Etapa 03 — PRODUTO. Revela claramente o que está sendo vendido — ver data/products.ts para as duas criações. */
export const produtoScene = {
  eyebrow: "03 — PRODUTO",
};

/** Etapa 04 — EXPERIÊNCIA. Por que comprar a coleção é diferente de comprar flores comuns (antigo Ritual). */
export const experiencia = {
  eyebrow: "04 — EXPERIÊNCIA",
  title: "Cada detalhe prepara a presença.",
  caption: "O amor também se reconhece nos detalhes.",
  steps: [
    { label: "ESCOLHA", text: "Flores selecionadas no auge da beleza." },
    { label: "CRIAÇÃO", text: "Composição preparada de forma autoral para cada declaração." },
    { label: "ACABAMENTO", text: "Cada detalhe finalizado à mão, com tempo e cuidado." },
    {
      label: "ENTREGA",
      text: "Apresentação e logística pensadas para que a chegada também faça parte do acontecimento.",
    },
  ],
};

/** Etapa 05 — AUTORIA. Origem e legitimidade da coleção (antigo "Patrícia Marchi"). */
export const autoria = {
  eyebrow: "05 — AUTORIA",
  title: "Uma criação feita para ocupar presença.",
  curatorNote:
    "Projeto idealizado e assinado por Susan, Diretora Criativa da Flor de Maria Ateliê, com Patrícia Marchi como musa e embaixadora da coleção.",
  signatureLine: "by Patrícia Marchi",
  /** EDITABLE — real, authorized quote from Patrícia Marchi. Do not invent. */
  testimonialQuote: "",
};

/**
 * Etapa 06 — COMPRA (nome interno do funil). Ao público, esta etapa se
 * apresenta como "Atendimento Privado" — é assim que a compra realmente
 * começa, sem carrinho tradicional.
 */
export const compra = {
  eyebrow: "06 — ATENDIMENTO PRIVADO",
  title: "Vamos criar a sua declaração.",
  body: "Informe seu nome e WhatsApp. A Flor de Maria entrará em contato para entender o momento e conduzir cada detalhe.",
  note: "Seus dados serão utilizados exclusivamente para iniciar este atendimento.",
  successTitle: "Atendimento iniciado.",
  successBody: "Recebemos seus dados e entraremos em contato pelo WhatsApp.",
};

/** Indicador narrativo editorial — as seis etapas aprovadas, nesta ordem exata. */
export const narrativeSteps = [
  { id: "desejo", number: "01", label: "DESEJO" },
  { id: "conceito", number: "02", label: "CONCEITO" },
  { id: "produto", number: "03", label: "PRODUTO" },
  { id: "experiencia", number: "04", label: "EXPERIÊNCIA" },
  { id: "autoria", number: "05", label: "AUTORIA" },
  { id: "atendimento", number: "06", label: "ATENDIMENTO" },
] as const;

/** Navegação principal — "Desejo" é o próprio início e não precisa de item de menu; a logo leva ao topo. */
export const nav = [
  { label: "Conceito", href: "#conceito" },
  { label: "Produtos", href: "#produto" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Autoria", href: "#autoria" },
  { label: "Orçamento", href: "#atendimento" },
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
