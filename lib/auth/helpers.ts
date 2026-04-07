import { auth } from './server';
import { getMentoraByAuthUserId } from '@/lib/db/mentoras';
import type { Mentora } from '@/types/mentora';

export async function getAuthenticatedMentora(): Promise<Mentora | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) return null;
  return getMentoraByAuthUserId(session.user.id);
}
