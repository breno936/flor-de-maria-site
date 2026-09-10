/**
 * Central registry of every film clip the experience needs.
 * Per brief: 5–8 short clips, reused across sections, never all playing at once.
 *
 * None of these files exist yet (the official studio shoot with Patrícia Marchi
 * had not been scheduled as of the partnership deck — see "Próximos passos").
 * Drop the real exports into /public/media/<id>/ using these exact filenames
 * and every section below picks them up automatically — no component code
 * needs to change.
 *
 * Expected filenames inside /public/media/<id>/:
 *   desktop.mp4   (H.264, ~1920×1080 or clip-native, <8s loop unless noted)
 *   desktop.webm  (VP9, optional but preferred)
 *   mobile.mp4    (H.264, ~1080×1350 or 9:16, compressed for saveData)
 *   poster.jpg    (first-frame still, AVIF/WebP variants optional)
 */

export type MediaClipId =
  | "petal-macro"
  | "rose-lateral-light"
  | "hands-selecting"
  | "bouquet-assembly"
  | "coeur-assembly"
  | "patricia-film"
  | "ribbon-detail"
  | "delivery-moment"
  | "hero-bouquet";

export type MediaClip = {
  id: MediaClipId;
  brief: string;
  usedIn: string[];
  basePath: string;
};

export const mediaClips: Record<MediaClipId, MediaClip> = {
  "petal-macro": {
    id: "petal-macro",
    brief: "Macro de pétalas — textura, veios, luz percorrendo lentamente.",
    usedIn: ["Hero — abertura (matéria)", "Manifesto", "Reserva — detalhe", "Ritual — seleção/preparação"],
    basePath: "/media/petal-macro",
  },
  "rose-lateral-light": {
    id: "rose-lateral-light",
    brief: "Mão erguendo uma rosa vermelha contra fundo escuro, iluminação lateral, atmosfera editorial — filme principal do hero (camada de presença, cortina central) e do quadro dominante de \"O último cuidado\".",
    usedIn: ["Hero — abertura (presença) e estado final", "O último cuidado — quadro 2 (dominante)", "Ritual — estrutura"],
    basePath: "/media/rose-lateral-light",
  },
  "hero-bouquet": {
    id: "hero-bouquet",
    brief: "Buquê de três rosas vermelhas com caules expostos — substituído como mídia principal do hero por não comunicar buquê monumental/alta floricultura. Sem uso atual; mantido no inventário até reavaliação ou remoção.",
    usedIn: [],
    basePath: "/media/hero-bouquet",
  },
  "hands-selecting": {
    id: "hands-selecting",
    brief: "Mãos selecionando e preparando rosas, uma a uma.",
    usedIn: ["O último cuidado — quadro 1 (seleção)", "Ritual — seleção", "Escala e Detalhes"],
    basePath: "/media/hands-selecting",
  },
  "bouquet-assembly": {
    id: "bouquet-assembly",
    brief: "Montagem de Le Bouquet — volume crescendo, rosas preenchendo a cena.",
    usedIn: ["O Amor Toma Forma — composição", "Le Bouquet — mídia principal"],
    basePath: "/media/bouquet-assembly",
  },
  "coeur-assembly": {
    id: "coeur-assembly",
    brief: "Montagem/abertura de Le Cœur Royale — tampa se abrindo, rosas em coração.",
    usedIn: ["O Amor Toma Forma — revelação (alt)", "Le Cœur Royale — mídia principal"],
    basePath: "/media/coeur-assembly",
  },
  "patricia-film": {
    id: "patricia-film",
    brief: "Patrícia Marchi caminhando, observando a criação, tocando as rosas, olhando para fora de câmera.",
    usedIn: ["Seção Patrícia Marchi"],
    basePath: "/media/patricia-film",
  },
  "ribbon-detail": {
    id: "ribbon-detail",
    brief: "Detalhe da fita vermelha e embalagem — acabamento, gesto, continuidade.",
    usedIn: ["Hero — abertura (acabamento)", "O último cuidado — quadro 3 (acabamento)", "Ritual — fita/cartão/embalagem", "Le Bouquet — detalhe"],
    basePath: "/media/ribbon-detail",
  },
  "delivery-moment": {
    id: "delivery-moment",
    brief: "Entrega ou reação autorizada — produto atravessando um ambiente, momento de entrega.",
    usedIn: ["Escala e Detalhes", "Ritual — entrega", "Encerramento"],
    basePath: "/media/delivery-moment",
  },
};

export const mediaClipList = Object.values(mediaClips);
