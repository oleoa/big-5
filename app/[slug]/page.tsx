import { getMentoraBySlug } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/mentora/LandingPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MentoraPage({ params }: Props) {
  const { slug } = await params;
  const mentora = await getMentoraBySlug(slug);
  if (!mentora) notFound();
  return <LandingPage mentora={mentora} />;
}
