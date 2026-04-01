import { getMentoraBySlug } from '@/lib/db/mentoras';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mentora = await getMentoraBySlug(slug);

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

export default function MentoraLayout({ children }: Props) {
  return children;
}
