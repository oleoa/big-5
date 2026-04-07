import { getMentoraBySlug } from '@/lib/db/mentoras';
import { getBasePath } from '@/lib/basePath';
import { notFound } from 'next/navigation';
import TesteCliente from '@/components/mentora/TesteCliente';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Teste({ params }: Props) {
  const { slug } = await params;
  const mentora = await getMentoraBySlug(slug);
  if (!mentora) notFound();
  const basePath = await getBasePath(slug);
  return <TesteCliente mentora={mentora} basePath={basePath} />;
}
