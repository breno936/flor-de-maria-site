import type { CreationId } from "./products";

/**
 * Official campaign photography — the Lê Grand Amour studio shoot
 * (photographer Rafael Gimenes, Oct 2026). Every file in
 * /public/assets/le-grand-amour/campanha/ is a colour-managed (Adobe RGB →
 * sRGB) WebP export of one original frame; the IMG_ number on each entry is
 * the source file in the delivered shoot. See MEDIA-MANIFEST.md.
 *
 * Alt texts describe what each frame shows without naming the person in it:
 * which model is Patrícia Marchi is not confirmed yet.
 */

const BASE = "/assets/le-grand-amour/campanha";

export type CampaignPhoto = { src: string; alt: string };

/**
 * The opening photograph — IMG_4521 on tablet/desktop, IMG_4480 (portrait)
 * on phones. `blur` is a 24px-wide copy of each, shown blurred under the
 * photo so the very first frame is already the campaign's colours, never a
 * black screen, on a slow connection.
 */
export const heroPhoto = {
  desktop: { src: `${BASE}/abertura-desktop.webp`, width: 2560, height: 1707 },
  mobile: { src: `${BASE}/abertura-mobile.webp`, width: 1290, height: 1935 },
  alt: "Campanha Lê Grand Amour: modelo de vestido preto, capa branca e véu de tule segurando um grande buquê de rosas vermelhas, sobre fundo escuro.",
  blur: {
    desktop:
      "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAwBACdASoYABAAPrVKnkonJCKhsAgA4BaJQBYdjSwzWB3q6Nv+5XLVXhgA/v6IJR+KpaYAvHTXP1XMZuSKtk2A3kQH1i2GKVwXfmMKe9VzMgRL8PTQHlTsBDlUOOdj5UZiV/RnVja3TBzCZARr6vC2BMTUV19mdsBfnluWwAMCWIhYppr0uAAA",
    mobile:
      "data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAAAQBgCdASoYACQAPqVCmEmmI6IhNUgAwBSJQBfte1iL5imJOn+rIVwgJhn5NzA7Cz+W8QO7JHwbR6AA/vkSyYeTemm7L4fpQABBiCJhV0aSuvqg+4L5Ad+YhO5uUwRJ1GYBZeXc1X80VC7E+0n2A3QX2GaZ0bUiVOFZPxvmR1bKj6a4N30ntDRvPBBQVd9HJChkopbAg/rzsIRrwlyBZKk/Qm31H70GDE7FLhYxFmV+1B+12PXHwyMuvZ9es4Xwovo+WG9cswoxZhAAAAA=",
  },
};

export type GalleryPhoto = CampaignPhoto & {
  label: string;
  caption: string;
  /** object-position for the cropped frame. */
  position: string;
};

/**
 * One gallery per creation. Item 0 is the card's main photograph — the
 * whole piece in someone's hands, so its real scale reads at a glance; the
 * rest open from it in the lightbox. Captions only describe what the frame
 * shows.
 */
export const productGalleries: Record<CreationId, GalleryPhoto[]> = {
  "le-bouquet": [
    // IMG_4606
    {
      src: `${BASE}/produto-bouquet-escala.webp`,
      alt: "Lê Bouquet nas mãos de uma modelo de vestido preto e capa branca, de corpo inteiro: o buquê ocupa todo o torso.",
      label: "Escala",
      caption: "O buquê inteiro nas mãos: a dimensão real da criação.",
      position: "50% 30%",
    },
    // IMG_4629
    {
      src: `${BASE}/detalhe-bouquet-rosas.webp`,
      alt: "Close das rosas vermelhas do Lê Bouquet, com uma mão de luva de renda pousada sobre elas.",
      label: "Rosas",
      caption: "Rosas vermelhas em composição densa, do centro à borda.",
      position: "50% 55%",
    },
    // IMG_4621
    {
      src: `${BASE}/bouquet-embalagem.webp`,
      alt: "O Lê Bouquet envolto em embalagem preta com bordas douradas.",
      label: "Embalagem",
      caption: "Embalagem preta com bordas douradas envolvendo todo o volume.",
      position: "56% 50%",
    },
    // IMG_4646
    {
      src: `${BASE}/detalhe-rosa-luva.webp`,
      alt: "Uma rosa vermelha em destaque sobre o buquê, segurada por uma mão de luva de renda preta.",
      label: "Pétalas",
      caption: "Cada rosa aberta no auge: pétalas firmes e cor profunda.",
      position: "52% 40%",
    },
  ],
  "le-coeur-royale": [
    // IMG_4413
    {
      src: `${BASE}/produto-coeur-escala.webp`,
      alt: "Lê Cœur Royale nas mãos de uma modelo de roupa preta: a caixa em formato de coração repleta de rosas vermelhas.",
      label: "Escala",
      caption: "A caixa nas mãos: o coração inteiro preenchido por rosas.",
      position: "50% 55%",
    },
    // IMG_4407
    {
      src: `${BASE}/detalhe-coeur-fita.webp`,
      alt: "Rosas vermelhas preenchendo a caixa em formato de coração, com a fita preta Lê Grand Amour.",
      label: "Rosas",
      caption: "Rosas vermelhas preenchendo todo o formato de coração.",
      position: "50% 40%",
    },
    // IMG_3926
    {
      src: `${BASE}/fita-caixa.webp`,
      alt: "Fita de cetim vermelha e o logotipo Lê Grand Amour na caixa em formato de coração.",
      label: "Fita",
      caption: "Fita de cetim vermelha e a assinatura Lê Grand Amour na caixa.",
      position: "40% 62%",
    },
    // IMG_4387
    {
      src: `${BASE}/experiencia-acabamento.webp`,
      alt: "Mãos sobre a caixa Lê Cœur Royale, com a fita preta que leva o logotipo Lê Grand Amour.",
      label: "Assinatura",
      caption: "A fita com o logotipo Lê Grand Amour contornando a caixa rígida.",
      position: "68% 70%",
    },
  ],
};

export type DetailPhoto = GalleryPhoto & { orientation: "portrait" | "landscape" };

/**
 * Detalhes — a short gallery of proportion, finishing and packaging. Chosen
 * to differ from one another and from the cards above (scale, background,
 * subject): full figure, still life, the box on a light ground, the stems,
 * the embossed signature, the hand-over — never six close-ups of roses.
 * Portrait and landscape alternate so the desktop mosaic reads P·L / L·P /
 * P·L. The Entrega caption keeps the approved Experiência wording.
 */
export const detailGallery: DetailPhoto[] = [
  // IMG_4697
  {
    src: `${BASE}/detalhe-proporcao.webp`,
    alt: "Modelo de vestido preto ajoelhada no estúdio, com o buquê de rosas vermelhas no ombro e a capa branca estendida no chão.",
    label: "Proporção",
    caption: "O buquê diante do corpo inteiro: a dimensão real da criação.",
    position: "50% 45%",
    orientation: "portrait",
  },
  // IMG_3902
  {
    src: `${BASE}/detalhe-caixa-laco.webp`,
    alt: "Lê Cœur Royale sobre uma mesa: caixa preta em formato de coração repleta de rosas vermelhas, com laço de cetim vermelho e a placa Lê Grand Amour na frente.",
    label: "Caixa",
    caption: "Lê Cœur Royale: caixa rígida com laço de cetim vermelho e a assinatura Lê Grand Amour.",
    position: "60% 55%",
    orientation: "landscape",
  },
  // IMG_4087
  {
    src: `${BASE}/detalhe-escala-coeur.webp`,
    alt: "Lê Cœur Royale nas mãos de uma modelo de roupa branca, sobre fundo claro: o coração inteiro preenchido por rosas vermelhas e o laço de cetim.",
    label: "Escala",
    caption: "Lê Cœur Royale nas mãos: o coração inteiro preenchido por rosas.",
    position: "45% 50%",
    orientation: "landscape",
  },
  // IMG_4513
  {
    src: `${BASE}/detalhe-hastes.webp`,
    alt: "Mãos de luva de renda segurando o buquê de cabeça para baixo atrás das costas: hastes longas amarradas com fitas pretas Lê Grand Amour.",
    label: "Hastes",
    caption: "Rosas de haste longa, amarradas com as fitas pretas Lê Grand Amour.",
    position: "50% 50%",
    orientation: "portrait",
  },
  // IMG_4183
  {
    src: `${BASE}/detalhe-assinatura.webp`,
    alt: "Uma rosa vermelha pousada sobre a assinatura Lê Grand Amour gravada em relevo dourado.",
    label: "Assinatura",
    caption: "A assinatura Lê Grand Amour, gravada em relevo.",
    position: "50% 60%",
    orientation: "portrait",
  },
  // IMG_4583, retouched version supplied by the client (1536px, 2026-10-26)
  {
    src: `${BASE}/detalhe-entrega.webp`,
    alt: "O momento da entrega: o buquê Lê Grand Amour passando de uma mão para outra.",
    label: "Entrega",
    caption: "Apresentação e logística pensadas para que a chegada também faça parte do acontecimento.",
    position: "52% 50%",
    orientation: "landscape",
  },
];
