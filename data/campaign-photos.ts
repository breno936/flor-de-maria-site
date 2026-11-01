import type { CreationId } from "./products";

/**
 * Official campaign photography — the Le Grand Amour studio shoot
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
  alt: "Campanha Le Grand Amour: modelo de vestido preto, capa branca e véu de tule segurando um grande buquê de rosas vermelhas, sobre fundo escuro.",
  blur: {
    desktop:
      "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAwBACdASoYABAAPrVKnkonJCKhsAgA4BaJQBYdjSwzWB3q6Nv+5XLVXhgA/v6IJR+KpaYAvHTXP1XMZuSKtk2A3kQH1i2GKVwXfmMKe9VzMgRL8PTQHlTsBDlUOOdj5UZiV/RnVja3TBzCZARr6vC2BMTUV19mdsBfnluWwAMCWIhYppr0uAAA",
    mobile:
      "data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAAAQBgCdASoYACQAPqVCmEmmI6IhNUgAwBSJQBfte1iL5imJOn+rIVwgJhn5NzA7Cz+W8QO7JHwbR6AA/vkSyYeTemm7L4fpQABBiCJhV0aSuvqg+4L5Ad+YhO5uUwRJ1GYBZeXc1X80VC7E+0n2A3QX2GaZ0bUiVOFZPxvmR1bKj6a4N30ntDRvPBBQVd9HJChkopbAg/rzsIRrwlyBZKk/Qm31H70GDE7FLhYxFmV+1B+12PXHwyMuvZ9es4Xwovo+WG9cswoxZhAAAAA=",
  },
};

/**
 * IMG_4646 — the petals the opening starts on, before the camera pulls back
 * out of the bouquet to the whole figure. Same file as the Le Bouquet's
 * "Pétalas" frame; `blur` is its 24px copy, so the first frame is already
 * red petals on a slow connection.
 */
export const heroPetals = {
  src: `${BASE}/detalhe-rosa-luva.webp`,
  position: "52% 40%",
  blur: "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdDBRAJ929fM6l3TJKf4mAAP5Lnfga8j9tE/oLC0SQj5VYwalp96pAyeVbGjSms6Pg9CKjlPBRCWr3qDKwe2Ycmv1dE3+0NtZ1KHHp2WET74fQkpP2d4eb1XNvctnHJruChKRvCmxqBIUYw69p3u9/8y6OzC0SdLymrWxHmT/+mIAAAA==",
};

/**
 * Patrícia Marchi's testimonial (IMG_9777.MOV, iPhone, vertical 4K, 2:35,
 * sent by the client on 2026-11-01), re-encoded for the web as H.264/AAC
 * 9:16 with the moov atom up front, so it starts playing while it loads.
 * Nothing is downloaded until the visitor presses play. The cover is the
 * frame at 2:31 — looking at the camera, crown, sash and the roses.
 *
 * `teaser` is what moves on the cover, silent, while the block is on
 * screen (browsers only start video on their own without sound): 13.6 s
 * cut from the same film — the smile at 2:28–2:35, then the kiss and the
 * roses lifted at 1:18–1:25 — with a dissolve at both joins, so the loop
 * never shows a cut. 720×1280, no audio track, 2.2 MB, fetched only when
 * the block is about to arrive.
 */
export const ambassadorFilm = {
  src: "/media/embaixadora/patricia-marchi-depoimento.mp4",
  teaser: "/media/embaixadora/patricia-marchi-trecho.mp4",
  durationLabel: "2 min 35 s",
  duration: "2:35",
  poster: {
    src: "/assets/le-grand-amour/embaixadora/patricia-marchi-capa.webp",
    width: 1080,
    height: 1920,
    alt: "Patrícia Marchi de coroa e faixa, sorrindo para a câmera, com um buquê de rosas vermelhas.",
    blur: "data:image/webp;base64,UklGRkwBAABXRUJQVlA4IEABAADwBgCdASoYACsAPtFaqU+oJKOiKrgIAQAaCWYAqSdfb0Ez4g0ALQS/RAPZKC51XPeWgH4azvEJwLmDyjKHAraAAP76+p0rgnchvbwifa/IirkEFoaKocYDeYSIBr0EXr1BpxPoTaqhZ3hHPRSuSTiXC3756XQXVDH8pXS4v76lvHHM7kUpzunK42Z1U+UsyzSe2+wOOenkRFO7axlmBqza0Z9upeFLYSaqGB6UbLaWIx1KX0BkeH6yu2V/3Wc7yxr5e475A8wOfnTw+5JNhDYOdyjFZWJ94N84sldWY7TeLBdV/6MbXVjtyuMDAo36I7QCGZuSc1KCZjV+VSmq8AaP3R346R2GO5i0oLuoZQhfPRDAF5SeDG1exbyuva/WVu/Rx+UJx0dNAJcD8k28RDLNAi1PuCsVIOCCEHo8RGAAAA==",
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
      alt: "Le Bouquet nas mãos de uma modelo de vestido preto e capa branca, de corpo inteiro: o buquê ocupa todo o torso.",
      label: "Escala",
      caption: "O buquê inteiro nas mãos: a dimensão real da criação.",
      position: "50% 30%",
    },
    // IMG_4629
    {
      src: `${BASE}/detalhe-bouquet-rosas.webp`,
      alt: "Close das rosas vermelhas do Le Bouquet, com uma mão de luva de renda pousada sobre elas.",
      label: "Rosas",
      caption: "Rosas vermelhas em composição densa, do centro à borda.",
      position: "50% 55%",
    },
    // IMG_4621
    {
      src: `${BASE}/bouquet-embalagem.webp`,
      alt: "O Le Bouquet envolto em embalagem preta com bordas douradas.",
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
      alt: "Le Coeur Royale nas mãos de uma modelo de roupa preta: a caixa em formato de coração repleta de rosas vermelhas.",
      label: "Escala",
      caption: "A caixa nas mãos: o coração inteiro preenchido por rosas.",
      position: "50% 55%",
    },
    // IMG_4407
    {
      src: `${BASE}/detalhe-coeur-fita.webp`,
      alt: "Rosas vermelhas preenchendo a caixa em formato de coração, com a fita preta Le Grand Amour.",
      label: "Rosas",
      caption: "Rosas vermelhas preenchendo todo o formato de coração.",
      position: "50% 40%",
    },
    // IMG_3926
    {
      src: `${BASE}/fita-caixa.webp`,
      alt: "Fita de cetim vermelha e o logotipo Le Grand Amour na caixa em formato de coração.",
      label: "Fita",
      caption: "Fita de cetim vermelha e a assinatura Le Grand Amour na caixa.",
      position: "40% 62%",
    },
    // IMG_4387
    {
      src: `${BASE}/experiencia-acabamento.webp`,
      alt: "Mãos sobre a caixa Le Coeur Royale, com a fita preta que leva o logotipo Le Grand Amour.",
      label: "Assinatura",
      caption: "A fita com o logotipo Le Grand Amour contornando a caixa rígida.",
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
    alt: "Le Coeur Royale sobre uma mesa: caixa preta em formato de coração repleta de rosas vermelhas, com laço de cetim vermelho e a placa Le Grand Amour na frente.",
    label: "Caixa",
    caption: "Le Coeur Royale: caixa rígida com laço de cetim vermelho e a assinatura Le Grand Amour.",
    position: "60% 55%",
    orientation: "landscape",
  },
  // IMG_4087
  {
    src: `${BASE}/detalhe-escala-coeur.webp`,
    alt: "Le Coeur Royale nas mãos de uma modelo de roupa branca, sobre fundo claro: o coração inteiro preenchido por rosas vermelhas e o laço de cetim.",
    label: "Escala",
    caption: "Le Coeur Royale nas mãos: o coração inteiro preenchido por rosas.",
    position: "45% 50%",
    orientation: "landscape",
  },
  // IMG_4513
  {
    src: `${BASE}/detalhe-hastes.webp`,
    alt: "Mãos de luva de renda segurando o buquê de cabeça para baixo atrás das costas: hastes longas amarradas com fitas pretas Le Grand Amour.",
    label: "Hastes",
    caption: "Rosas de haste longa, amarradas com as fitas pretas Le Grand Amour.",
    position: "50% 50%",
    orientation: "portrait",
  },
  // IMG_4183
  {
    src: `${BASE}/detalhe-assinatura.webp`,
    alt: "Uma rosa vermelha pousada sobre a assinatura Le Grand Amour gravada em relevo dourado.",
    label: "Assinatura",
    caption: "A assinatura Le Grand Amour, gravada em relevo.",
    position: "50% 60%",
    orientation: "portrait",
  },
  // IMG_4583, retouched version supplied by the client (1536px, 2026-10-26)
  {
    src: `${BASE}/detalhe-entrega.webp`,
    alt: "O momento da entrega: o buquê Le Grand Amour passando de uma mão para outra.",
    label: "Entrega",
    caption: "Apresentação e logística pensadas para que a chegada também faça parte do acontecimento.",
    position: "52% 50%",
    orientation: "landscape",
  },
];
