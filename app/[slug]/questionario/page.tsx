import { getMentoraBySlug } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import TesteCliente from '@/components/mentora/TesteCliente';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Teste({ params }: Props) {
  const { slug } = await params;
  const mentora = await getMentoraBySlug(slug);
  if (!mentora) notFound();
  return <TesteCliente mentora={mentora} />;
}
