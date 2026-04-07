import { getMentoraByHost } from '@/lib/db/mentoras';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ host: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host } = await params;
  const mentora = await getMentoraByHost(decodeURIComponent(host));

  if (!mentora) return {};

  const title = `${mentora.titulo} | ${mentora.nome}`;
  const description = mentora.subtitulo;
  const ogImage = mentora.logoPrincipalUrl || mentora.logoIconeUrl;

  return {
    title,
    description,
    icons: mentora.logoIconeUrl
      ? { icon: mentora.logoIconeUrl, apple: mentora.logoIconeUrl }
      : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, width: 500, height: 500, alt: mentora.nome }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default function DomainLayout({ children }: Props) {
  return children;
}
