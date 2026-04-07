import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
