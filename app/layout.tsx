import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teste de Personalidade Big Five",
  description:
    "Descubra seu perfil de personalidade com o teste científico IPIP-NEO-120, baseado no modelo dos Cinco Grandes Fatores (Big Five).",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Teste de Personalidade Big Five",
    description:
      "Descubra seu perfil de personalidade com o teste científico IPIP-NEO-120, baseado no modelo dos Cinco Grandes Fatores (Big Five).",
    type: "website",
    images: [{ url: "/icon.png", width: 500, height: 500, alt: "Big Five" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teste de Personalidade Big Five",
    description:
      "Descubra seu perfil de personalidade com o teste científico IPIP-NEO-120, baseado no modelo dos Cinco Grandes Fatores (Big Five).",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
