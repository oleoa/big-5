import { redirect } from 'next/navigation';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { PainelProvider } from '@/components/painel/PainelProvider';
import { PainelShell } from '@/components/painel/PainelShell';

export const dynamic = 'force-dynamic';

export default async function PainelDashboardLayout({ children }: { children: React.ReactNode }) {
  const mentora = await getAuthenticatedMentora();

  if (!mentora) {
    redirect('/painel/sign-in');
  }

  return (
    <PainelProvider mentora={mentora}>
      <PainelShell>{children}</PainelShell>
    </PainelProvider>
  );
}
