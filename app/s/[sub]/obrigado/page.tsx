import { getMentoraBySubdominio } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import ObrigadoPage from '@/components/mentora/ObrigadoPage';

export default async function SubdomainObrigado({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = await params;
  const mentora = await getMentoraBySubdominio(sub);
  if (!mentora) notFound();
  return <ObrigadoPage mentora={mentora} />;
}
