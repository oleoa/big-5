import { getMentoraByHost } from '@/lib/db/mentoras';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/mentora/LandingPage';

export default async function DomainPage({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const mentora = await getMentoraByHost(decodeURIComponent(host));
  if (!mentora) notFound();
  return <LandingPage mentora={mentora} />;
}
