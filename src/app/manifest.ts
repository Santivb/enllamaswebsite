import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "En Llamas 87",
    short_name: "En Llamas 87",
    description: "Amantes de la Parrilla — modern Latin American grill in Franklin Square, NY.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0605",
    theme_color: "#0a0605",
    icons: [
      { src: "/assets/logo/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/logo/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
