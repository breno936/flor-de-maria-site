import type { MediaClipId } from "./media-manifest";

/**
 * Provisional editorial media — licensed stock photography, color-graded into a
 * single coherent noir/wine campaign, standing in for the real Patrícia Marchi
 * studio shoot until it exists. See MEDIA-MANIFEST.md for sourcing/licensing
 * notes and the exact official file each entry will be replaced by.
 *
 * Every entry here is honestly disclosed to assistive tech and to the DOM
 * (`data-temporary-media="true"`) — none of it is presented as the final
 * product or as a photograph of Patrícia Marchi herself.
 */

export type TemporaryMedia = {
  clipId: MediaClipId;
  temporaryVideo?: { mp4: string; webm?: string; poster: string };
  temporaryImage: string;
  mobileImage?: string;
  objectPosition?: string;
  alt: string;
  isTemporary: true;
};

const BASE = "/media/temporary";

export const temporaryMedia: Partial<Record<MediaClipId, TemporaryMedia>> = {
  "rose-lateral-light": {
    clipId: "rose-lateral-light",
    temporaryVideo: {
      mp4: `${BASE}/hero-editorial-loop.mp4`,
      webm: `${BASE}/hero-editorial-loop.webm`,
      poster: `${BASE}/hero-editorial-loop-poster.jpg`,
    },
    temporaryImage: `${BASE}/hero-editorial-desktop.webp`,
    mobileImage: `${BASE}/hero-editorial-mobile.webp`,
    alt: "Imagem conceitual provisória: mão erguendo uma única rosa vermelha contra fundo escuro. Direção de atmosfera para o filme oficial do hero — não é o vídeo final da campanha.",
    isTemporary: true,
  },
  "petal-macro": {
    clipId: "petal-macro",
    temporaryVideo: {
      mp4: `${BASE}/petal-macro-loop.mp4`,
      webm: `${BASE}/petal-macro-loop.webm`,
      poster: `${BASE}/petal-macro-loop-poster.jpg`,
    },
    temporaryImage: `${BASE}/petal-macro.webp`,
    alt: "Imagem conceitual provisória: macro de rosa vermelha em fundo escuro, referência de luz e textura.",
    isTemporary: true,
  },
  "hands-selecting": {
    clipId: "hands-selecting",
    temporaryVideo: {
      mp4: `${BASE}/hands-selecting-loop.mp4`,
      webm: `${BASE}/hands-selecting-loop.webm`,
      poster: `${BASE}/hands-selecting-loop-poster.jpg`,
    },
    temporaryImage: `${BASE}/hands-selecting.webp`,
    alt: "Imagem conceitual provisória: mão segurando uma rosa vermelha — referência de gesto, não a filmagem oficial do ritual de seleção.",
    isTemporary: true,
  },
  "bouquet-assembly": {
    clipId: "bouquet-assembly",
    temporaryImage: `${BASE}/bouquet-concept.webp`,
    alt: "Imagem conceitual provisória: composição densa de rosas vermelhas, referência de escala e volume para Le Bouquet — não é fotografia do produto final.",
    isTemporary: true,
  },
  "coeur-assembly": {
    clipId: "coeur-assembly",
    temporaryImage: `${BASE}/coeur-concept.webp`,
    objectPosition: "object-center",
    alt: "Imagem conceitual provisória: rosas vermelhas em composição densa, referência de atmosfera para Le Cœur Royale — não é fotografia do produto final.",
    isTemporary: true,
  },
  "patricia-film": {
    clipId: "patricia-film",
    temporaryImage: `${BASE}/woman-editorial.webp`,
    alt: "Imagem conceitual e não identificável, em tratamento gráfico duotone — não representa Patrícia Marchi. Será substituída pelo ensaio oficial autorizado.",
    isTemporary: true,
  },
  "ribbon-detail": {
    clipId: "ribbon-detail",
    temporaryImage: `${BASE}/ribbon-detail.webp`,
    alt: "Imagem conceitual provisória: laço de cetim vermelho sobre fundo escuro.",
    isTemporary: true,
  },
  "delivery-moment": {
    clipId: "delivery-moment",
    temporaryImage: `${BASE}/delivery-concept.webp`,
    alt: "Imagem conceitual provisória: rosas vermelhas sobre veículo em noite de chuva, referência de entrega — não é fotografia da entrega real.",
    isTemporary: true,
  },
};
