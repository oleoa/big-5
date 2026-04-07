'use client';

import { createContext, useContext } from 'react';
import type { Mentora } from '@/types/mentora';

const MentoraContext = createContext<Mentora | null>(null);

export function PainelProvider({
  mentora,
  children,
}: {
  mentora: Mentora;
  children: React.ReactNode;
}) {
  return (
    <MentoraContext.Provider value={mentora}>
      {children}
    </MentoraContext.Provider>
  );
}

export function useMentora(): Mentora {
  const mentora = useContext(MentoraContext);
  if (!mentora) throw new Error('useMentora must be used inside PainelProvider');
  return mentora;
}
