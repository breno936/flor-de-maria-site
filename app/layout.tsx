import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Parisienne, Courier_Prime } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HashScrollFix from "@/components/layout/HashScrollFix";
import MobileStickyCta from "@/components/layout/MobileStickyCta";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl = "https://www.legrandamour.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Le Grand Amour — Flor de Maria Ateliê × Patrícia Marchi",
    template: "%s — Le Grand Amour",
  },
  description:
    "Uma coleção autoral de alta floricultura criada para transformar sentimentos em grandes declarações. Flor de Maria Ateliê em parceria com Patrícia Marchi.",
  keywords: [
    "Le Grand Amour",
    "Flor de Maria Ateliê",
    "Patrícia Marchi",
    "buquê de rosas de luxo",
    "presente de luxo Campinas",
    "Le Bouquet",
    "Le Cœur Royale",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Le Grand Amour",
    title: "Le Grand Amour — Amor que se vê. Presença que fica.",
    description:
      "Uma coleção autoral de alta floricultura da Flor de Maria Ateliê, em parceria com Patrícia Marchi.",
    images: [{ url: "/media/og/le-grand-amour-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Grand Amour",
    description: "Há amores que não foram feitos para ser discretos.",
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
      className={`${cormorant.variable} ${manrope.variable} ${parisienne.variable} ${courierPrime.variable}`}
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
      </body>
    </html>
  );
}
