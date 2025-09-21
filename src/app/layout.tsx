import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@styles/animations.css";
import Providers from '@components/Providers';
import PageEffects from '@components/PageEffects';
import Header from '@components/Header';
import HeaderSpacer from '@components/HeaderSpacer';
import Footer from '@components/Footer';
import BackToTop from "@components/BackToTop";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300","400","500","600","700","800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NeoShop — Futuristic E‑commerce",
    template: "%s — NeoShop",
  },
  description: "Clean, minimal, futuristic e-commerce powered by Next.js, NextAuth, TailwindCSS, and Redux.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "NeoShop — Futuristic E‑commerce",
    description: "Clean, minimal, futuristic e-commerce powered by Next.js, NextAuth, TailwindCSS, and Redux.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "NeoShop",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        <Providers>
          <PageEffects />
          <Header />
          <HeaderSpacer />
          <main className="min-h-[70vh]" data-anim>
            {children}
          </main>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
