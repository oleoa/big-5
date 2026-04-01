'use client';

import { useState, useCallback } from 'react';
import { getMentoraAction } from '@/app/admin/actions';
import { MentorasTable } from './MentorasTable';
import { MentoraSheet } from './MentoraSheet';
import type { Mentora } from '@/types/mentora';

interface MentoraRow {
  id: string;
  slug: string;
  nome: string;
  email: string;
  ativo: boolean;
  dominio_custom: string | null;
  dominio_dns_registros: Array<{ type: string; name: string; value: string }>;
  dominio_verificado: boolean;
}

interface Props {
  mentoras: MentoraRow[];
}

export function MentorasPage({ mentoras }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create');
  const [selectedMentora, setSelectedMentora] = useState<Mentora | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEditar = useCallback(async (id: string) => {
    setLoading(true);
    setSheetMode('edit');
    setSheetOpen(true);
    const mentora = await getMentoraAction(id);
    setSelectedMentora(mentora);
    setLoading(false);
  }, []);

  const handleNova = useCallback(() => {
    setSheetMode('create');
    setSelectedMentora(null);
    setLoading(false);
    setSheetOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSheetOpen(false);
    setSelectedMentora(null);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) handleClose();
    else setSheetOpen(true);
  }, [handleClose]);

  const handleSaved = useCallback(async (id: string) => {
    const updated = await getMentoraAction(id);
    setSelectedMentora(updated);
  }, []);

  return (
    <>
      <MentorasTable
        mentoras={mentoras}
        onEditar={handleEditar}
        onNova={handleNova}
      />
      <MentoraSheet
        open={sheetOpen}
        onOpenChange={handleOpenChange}
        mode={sheetMode}
        mentora={selectedMentora}
        loading={loading}
        onSaved={handleSaved}
      />
    </>
  );
}
