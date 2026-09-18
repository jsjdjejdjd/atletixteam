import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://atletix.app"),
  title: "ATLETIX · Donde los fuertes se crean",
  description:
    "Plataforma de entrenamiento y asesoramiento de calistenia. Programas, rutinas, seguimiento del progreso y comunicación directa con tu entrenador.",
  applicationName: "ATLETIX",
  authors: [{ name: "Gonzalo Casalis" }],
  keywords: [
    "calistenia",
    "street workout",
    "planche",
    "front lever",
    "entrenamiento online",
    "asesoramiento de calistenia",
  ],
  openGraph: {
    title: "ATLETIX · Donde los fuertes se crean",
    description:
      "Entrená con un plan profesional, registrá tu desempeño y evolucioná con la guía de tu entrenador.",
    url: "https://atletix.app/",
    siteName: "ATLETIX",
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ATLETIX",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="atletix-build" content="ea248c0" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}