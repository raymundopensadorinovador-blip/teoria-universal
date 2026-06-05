import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Teoria Universal",
    short_name: "Teoria Universal",
    description:
      "Reconstrua sua história, episódio por episódio, ligando a dor presente à própria linha da vida.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F6F1E8",
    theme_color: "#2A1D16",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}