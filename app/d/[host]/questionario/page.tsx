import { getMentoraByHost } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import TestePage from '@/components/mentora/TestePage';

export default async function DomainTest({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const mentora = await getMentoraByHost(decodeURIComponent(host));
  if (!mentora) notFound();
  return <TestePage mentora={mentora} />;
}
