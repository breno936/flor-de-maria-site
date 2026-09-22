import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HashScrollFix from "@/components/layout/HashScrollFix";
import MobileStickyCta from "@/components/layout/MobileStickyCta";
import NarrativeIndicator from "@/components/layout/NarrativeIndicator";
import LogoIntro from "@/components/intro/LogoIntro";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://www.legrandamour.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lê Grand Amour — Alta Floricultura by Flor de Maria",
    template: "%s — Lê Grand Amour",
  },
  description:
    "Alta Floricultura. Amor em sua forma mais grandiosa. Uma coleção autoral da Lê Grand Amour by Flor de Maria, em parceria com Patrícia Marchi.",
  keywords: [
    "Lê Grand Amour",
    "Flor de Maria",
    "alta floricultura",
    "Patrícia Marchi",
    "buquê de rosas de luxo",
    "presente de luxo Campinas",
    "Lê Bouquet",
    "Lê Cœur Royale",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Lê Grand Amour",
    title: "Lê Grand Amour — Amor em sua forma mais grandiosa.",
    description:
      "Alta Floricultura by Flor de Maria, em parceria com Patrícia Marchi.",
    images: [{ url: "/media/og/le-grand-amour-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lê Grand Amour",
    description: "Alta Floricultura. Amor em sua forma mais grandiosa.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${bodoniModa.variable} ${manrope.variable}`}
    >
      <body>
        <LogoIntro />
        <HashScrollFix />
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="conteudo-principal">{children}</main>
        <Footer />
        <MobileStickyCta />
        <NarrativeIndicator />
      </body>
    </html>
  );
}
