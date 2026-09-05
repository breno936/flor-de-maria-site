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
  | "delivery-moment";

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
    usedIn: ["Petal Reveal (preloader)", "Manifesto", "Ritual — seleção/preparação"],
    basePath: "/media/petal-macro",
  },
  "rose-lateral-light": {
    id: "rose-lateral-light",
    brief: "Rosas recebendo iluminação lateral, atmosfera editorial.",
    usedIn: ["Hero — plano de fundo", "Ritual — estrutura"],
    basePath: "/media/rose-lateral-light",
  },
  "hands-selecting": {
    id: "hands-selecting",
    brief: "Mãos selecionando e preparando rosas, uma a uma.",
    usedIn: ["O Amor Toma Forma — origem/gesto", "Ritual — seleção"],
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
    usedIn: ["Hero — plano intermediário", "Seção Patrícia Marchi"],
    basePath: "/media/patricia-film",
  },
  "ribbon-detail": {
    id: "ribbon-detail",
    brief: "Detalhe da fita vermelha e embalagem — acabamento, gesto, continuidade.",
    usedIn: ["Hero — primeiro plano", "The Red Thread", "Ritual — fita/cartão/embalagem", "Detalhes de produto"],
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
