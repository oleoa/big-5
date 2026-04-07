import { getMentoraByHost } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import ObrigadoPage from '@/components/mentora/ObrigadoPage';

export default async function DomainObrigado({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const mentora = await getMentoraByHost(decodeURIComponent(host));
  if (!mentora) notFound();
  return <ObrigadoPage mentora={mentora} />;
}
