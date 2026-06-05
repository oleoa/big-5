'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { provisionarMentoraAction } from '@/app/admin/actions';

interface Props {
  mentoraId: string;
  provisionado: boolean;
}

export function ProvisionarRagButton({ mentoraId, provisionado }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleProvisionar() {
    setLoading(true);
    const res = await provisionarMentoraAction(mentoraId);
    setLoading(false);
    if (res.sucesso) {
      toast.success('Base de conhecimento (RAG) provisionada com sucesso.');
    } else {
      toast.error(res.erro ?? 'Erro ao provisionar RAG');
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <Database className="size-4 text-muted-foreground" />
        <span className={provisionado ? 'text-foreground' : 'text-muted-foreground'}>
          {provisionado ? 'RAG provisionado' : 'RAG não provisionado'}
        </span>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleProvisionar} disabled={loading}>
        {loading ? <Loader2 className="size-3.5 mr-1 animate-spin" /> : null}
        {provisionado ? 'Reprovisionar' : 'Provisionar RAG'}
      </Button>
    </div>
  );
}
