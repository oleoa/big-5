import { getMentoraBySubdominio } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/mentora/LandingPage';

export default async function SubdomainPage({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = await params;
  const mentora = await getMentoraBySubdominio(sub);
  if (!mentora) notFound();
  return <LandingPage mentora={mentora} />;
}
