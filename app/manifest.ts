import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Le Grand Amour — Flor de Maria Ateliê × Patrícia Marchi",
    short_name: "Le Grand Amour",
    description: "Uma coleção autoral de alta floricultura criada para transformar sentimentos em grandes declarações.",
    start_url: "/",
    display: "standalone",
    background_color: "#070504",
    theme_color: "#070504",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
