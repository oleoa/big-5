'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import { authClient } from '@/lib/auth/client';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { PainelSidebar } from './PainelSidebar';
import { useMentora } from './PainelProvider';

export function PainelShell({ children }: { children: React.ReactNode }) {
  const mentora = useMentora();

  return (
    <NeonAuthUIProvider authClient={authClient as any}>
      <SidebarProvider>
        <PainelSidebar mentoraNome={mentora.nome} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </NeonAuthUIProvider>
  );
}
