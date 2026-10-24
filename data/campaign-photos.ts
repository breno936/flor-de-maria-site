import type { MediaClipId } from "./media-manifest";

/**
 * Official campaign photography — the Lê Grand Amour studio shoot
 * (photographer Rafael Gimenes, Oct 2026). Every file in
 * /public/assets/le-grand-amour/campanha/ is a colour-managed (Adobe RGB →
 * sRGB) WebP export of one original frame; the IMG_ number on each entry is
 * the source file in the delivered shoot. See MEDIA-MANIFEST.md.
 *
 * The shoot delivered stills only, no footage — so `campaignStills` slots in
 * ahead of the stock placeholders in ManagedVideo, and the real film (once
 * delivered) still wins over both via AVAILABLE_CLIPS.
 *
 * Alt texts describe what each frame shows without naming the person in it:
 * which model is Patrícia Marchi is not confirmed yet.
 */

const BASE = "/assets/le-grand-amour/campanha";

export type CampaignPhoto = { src: string; alt: string };

export type CampaignStill = {
  image: string;
  mobileImage?: string;
  alt: string;
};

export const campaignStills: Partial<Record<MediaClipId, CampaignStill>> = {
  // IMG_4521 (desktop) / IMG_4480 (mobile)
  "rose-lateral-light": {
    image: `${BASE}/hero-desktop.webp`,
    mobileImage: `${BASE}/hero-mobile.webp`,
    alt: "Campanha Lê Grand Amour: modelo de vestido preto, capa branca e véu de tule segurando um grande buquê de rosas vermelhas, sobre fundo escuro.",
  },
  // IMG_4415
  "petal-macro": {
    image: `${BASE}/abertura-rosas.webp`,
    alt: "Rosas vermelhas da coleção Lê Grand Amour vistas de perto, preenchendo a caixa em formato de coração.",
  },
  // IMG_3926
  "ribbon-detail": {
    image: `${BASE}/fita-caixa.webp`,
    alt: "Fita de cetim vermelha e o logotipo Lê Grand Amour na caixa em formato de coração.",
  },
  // IMG_4652
  "hands-selecting": {
    image: `${BASE}/conceito-luva-rosa.webp`,
    alt: "Mão com luva de renda preta segurando uma rosa vermelha sobre o buquê da coleção.",
  },
};

export const productPhotos = {
  // IMG_4605
  bouquet: {
    src: `${BASE}/bouquet.webp`,
    alt: "Lê Bouquet: buquê de rosas vermelhas em embalagem preta com borda dourada, nas mãos de uma modelo de vestido preto e capa branca.",
  },
  // IMG_4410 (desktop) / IMG_4399 (mobile)
  coeur: {
    src: `${BASE}/coeur.webp`,
    mobileSrc: `${BASE}/coeur-retrato.webp`,
    alt: "Lê Cœur Royale: caixa preta em formato de coração repleta de rosas vermelhas, com a fita Lê Grand Amour.",
  },
  // IMG_4629, IMG_4513, IMG_4621
  bouquetDetails: [
    { src: `${BASE}/bouquet-luva.webp`, position: "50% 45%" },
    { src: `${BASE}/bouquet-hastes.webp`, position: "50% 62%" },
    { src: `${BASE}/bouquet-embalagem.webp`, position: "56% 50%" },
  ],
  // IMG_3926, IMG_3902, IMG_4089
  coeurDetails: [
    { src: `${BASE}/fita-caixa.webp`, position: "40% 70%" },
    { src: `${BASE}/coeur-placa.webp`, position: "62% 60%" },
    { src: `${BASE}/coeur-rosas.webp`, position: "50% 70%" },
  ],
};

/** Experiência — one real frame per stage: Escolha, Criação, Acabamento, Entrega. */
export const experienciaPhotos: (CampaignPhoto & { position: string })[] = [
  // IMG_4655
  {
    src: `${BASE}/experiencia-escolha.webp`,
    alt: "Uma rosa vermelha escolhida entre as demais, na mão de luva de renda.",
    position: "58% 45%",
  },
  // IMG_4621
  {
    src: `${BASE}/bouquet-embalagem.webp`,
    alt: "A composição do Lê Bouquet: rosas vermelhas envoltas em embalagem preta e dourada.",
    position: "56% 50%",
  },
  // IMG_4387
  {
    src: `${BASE}/experiencia-acabamento.webp`,
    alt: "Mãos ajustando a caixa Lê Cœur Royale, com a fita que leva o logotipo Lê Grand Amour.",
    position: "20% 60%",
  },
  // IMG_4583
  {
    src: `${BASE}/experiencia-entrega.webp`,
    alt: "O momento da entrega: o buquê Lê Grand Amour passando de uma mão para outra.",
    position: "52% 50%",
  },
];
