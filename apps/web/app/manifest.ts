import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ATLETIX · Entrenamiento y Calistenia",
    short_name: "ATLETIX",
    description:
      "Donde los fuertes se crean. Programas, seguimiento del progreso y chat con tu entrenador.",
    // Abrir directo en la app (no en la landing): si el sistema mata la PWA en
    // segundo plano, al tocar el ícono el atleta vuelve a su espacio y no a la
    // página de marketing.
    start_url: "/alumno",
    id: "/",
    scope: "/",
    // Si la app ya está abierta en segundo plano, enfocarla en vez de abrir una
    // ventana nueva en start_url. Así no se pierde la sesión de entrenamiento.
    launch_handler: { client_mode: "focus-existing" },
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090b",
    theme_color: "#09090b",
    lang: "es",
    categories: ["fitness", "health", "sports"],
    shortcuts: [
      { name: "Entrenar", short_name: "Entrenar", url: "/alumno" },
      { name: "Mi programa", short_name: "Programa", url: "/alumno/programa" },
    ],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}