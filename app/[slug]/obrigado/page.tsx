import { getMentoraBySlug, sanitizeMentora } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import ObrigadoPage from '@/components/mentora/ObrigadoPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Obrigado({ params }: Props) {
  const { slug } = await params;
  const mentora = await getMentoraBySlug(slug);
  if (!mentora) notFound();
  return <ObrigadoPage mentora={sanitizeMentora(mentora)} />;
}
