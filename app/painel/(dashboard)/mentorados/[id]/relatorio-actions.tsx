'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { apagarRespostaAction, reprocessarRespostaAction } from '@/app/painel/actions';

export function RelatorioActions({
  respostaId,
  status,
  nome,
}: {
  respostaId: string;
  status: string;
  nome: string;
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

  async function handleDownloadPDF() {
    setLoading('pdf');
    try {
      const response = await fetch(`/api/painel/mentorados/${respostaId}/pdf`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${nome}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    } finally {
      setLoading('');
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === 'concluido' && (
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={loading === 'pdf'}>
          {loading === 'pdf' ? (
            <Loader2 className="size-4 mr-1 animate-spin" />
          ) : (
            <Download className="size-4 mr-1" />
          )}
          {loading === 'pdf' ? 'A gerar...' : 'Baixar PDF'}
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
