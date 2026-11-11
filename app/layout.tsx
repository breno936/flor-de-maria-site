import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HashScrollFix from "@/components/layout/HashScrollFix";
import MobileStickyCta from "@/components/layout/MobileStickyCta";
import NarrativeIndicator from "@/components/layout/NarrativeIndicator";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

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
    default: "Le Grand Amour — Alta Floricultura by Flor de Maria",
    template: "%s — Le Grand Amour",
  },
  description:
    "Alta Floricultura. Amor em sua forma mais grandiosa. Uma coleção autoral da Le Grand Amour by Flor de Maria, em parceria com Patrícia Marchi.",
  keywords: [
    "Le Grand Amour",
    "Flor de Maria",
    "alta floricultura",
    "Patrícia Marchi",
    "buquê de rosas de luxo",
    "presente de luxo Campinas",
    "Le Bouquet",
    "Le Coeur Royale",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Le Grand Amour",
    title: "Le Grand Amour — Amor em sua forma mais grandiosa.",
    description:
      "Alta Floricultura by Flor de Maria, em parceria com Patrícia Marchi.",
    images: [{ url: "/media/og/le-grand-amour-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Grand Amour",
    description: "Alta Floricultura. Amor em sua forma mais grandiosa.",
  },
  // Icons come from the files themselves: app/favicon.ico and app/apple-icon.png.
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
        <HashScrollFix />
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="conteudo-principal">{children}</main>
        <Footer />
        <MobileStickyCta />
        <NarrativeIndicator />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
