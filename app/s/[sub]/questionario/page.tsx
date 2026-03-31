import { getMentoraBySubdominio } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import TestePage from '@/components/mentora/TestePage';

export default async function SubdomainTest({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = await params;
  const mentora = await getMentoraBySubdominio(sub);
  if (!mentora) notFound();
  return <TestePage mentora={mentora} />;
}
