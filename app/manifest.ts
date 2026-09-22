import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lê Grand Amour — Alta Floricultura by Flor de Maria",
    short_name: "Lê Grand Amour",
    description: "Alta Floricultura. Amor em sua forma mais grandiosa.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
