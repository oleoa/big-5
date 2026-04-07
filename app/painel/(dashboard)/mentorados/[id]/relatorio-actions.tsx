'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, RefreshCw, Trash2 } from 'lucide-react';
import { apagarRespostaAction, reprocessarRespostaAction } from '@/app/painel/actions';

export function RelatorioActions({
  respostaId,
  status,
}: {
  respostaId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState('');

  async function handleReprocessar() {
    setLoading('reprocessar');
    const result = await reprocessarRespostaAction(respostaId);
    setLoading('');
    if (result.sucesso) {
      router.refresh();
    }
  }

  async function handleApagar() {
    if (!confirm('Tem a certeza que deseja apagar esta resposta? Esta ação não pode ser desfeita.')) return;
    setLoading('apagar');
    const result = await apagarRespostaAction(respostaId);
    if (result.sucesso) {
      router.push('/painel/mentorados');
    }
    setLoading('');
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === 'concluido' && (
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="size-4 mr-1" /> Imprimir / PDF
        </Button>
      )}
      {(status === 'erro' || status === 'pendente') && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReprocessar}
          disabled={loading === 'reprocessar'}
        >
          <RefreshCw className={`size-4 mr-1 ${loading === 'reprocessar' ? 'animate-spin' : ''}`} />
          Reprocessar
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={handleApagar}
        disabled={loading === 'apagar'}
      >
        <Trash2 className="size-4 mr-1" /> Apagar
      </Button>
    </div>
  );
}
