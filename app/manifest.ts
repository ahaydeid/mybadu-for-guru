import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyBadar - For Guru",
    short_name: "MyBadar Guru",
    description: "Aplikasi manajemen absensi guru",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/icons/192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
