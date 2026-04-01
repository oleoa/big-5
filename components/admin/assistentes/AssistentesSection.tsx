'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, RefreshCw, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listarAssistentesAction, deletarAssistenteAction } from '@/app/admin/openai-actions';
import type { Assistant } from '@/types/openai';
import { AssistenteCard } from './AssistenteCard';
import { AssistenteDetalhe } from './AssistenteDetalhe';
import { AssistenteForm } from './AssistenteForm';

interface Props {
  mentoraId: string;
}

export function AssistentesSection({ mentoraId }: Props) {
  const [assistentes, setAssistentes] = useState<Assistant[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<Assistant | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const res = await listarAssistentesAction(mentoraId);
    if (res.sucesso) {
      setAssistentes(res.data);
    } else {
      setErro(res.erro);
    }
    setCarregando(false);
  }, [mentoraId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function abrirCriar() {
    setEditando(null);
    setDialogAberto(true);
  }

  function abrirEditar(assistente: Assistant) {
    setEditando(assistente);
    setDialogAberto(true);
  }

  async function handleEliminar(assistente: Assistant) {
    const nome = assistente.name ?? assistente.id;
    if (!confirm(`Tem certeza que deseja eliminar o assistente "${nome}"? Esta acao e irreversivel.`)) return;

    const res = await deletarAssistenteAction(mentoraId, assistente.id);
    if (res.sucesso) {
      toast.success('Assistente eliminado.');
      if (selecionadoId === assistente.id) setSelecionadoId(null);
      await carregar();
    } else {
      toast.error(res.erro);
    }
  }

  const selecionado = assistentes.find((a) => a.id === selecionadoId) ?? null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Assistentes OpenAI</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon-sm" onClick={carregar} disabled={carregando}>
            <RefreshCw className={`size-3.5 ${carregando ? 'animate-spin' : ''}`} />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={abrirCriar}>
            <Plus className="size-3.5 mr-1" />
            Novo
          </Button>
        </div>
      </div>

      {carregando ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
          <Loader2 className="size-4 animate-spin" />
          A carregar assistentes...
        </div>
      ) : erro ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {erro}
          <Button type="button" variant="link" size="sm" className="ml-2" onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      ) : selecionado ? (
        <AssistenteDetalhe
          assistente={selecionado}
          mentoraId={mentoraId}
          onVoltar={() => setSelecionadoId(null)}
          onEditar={() => abrirEditar(selecionado)}
          onEliminar={() => handleEliminar(selecionado)}
        />
      ) : assistentes.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground">
          <Bot className="size-8 mx-auto mb-2 opacity-30" />
          <p>Nenhum assistente encontrado.</p>
          <p className="text-xs mt-1">Crie um novo assistente para comecar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {assistentes.map((a) => (
            <AssistenteCard
              key={a.id}
              assistente={a}
              selecionado={selecionadoId === a.id}
              onSelecionar={() => setSelecionadoId(a.id)}
              onEditar={() => abrirEditar(a)}
              onEliminar={() => handleEliminar(a)}
            />
          ))}
        </div>
      )}

      {dialogAberto && (
        <AssistenteForm
          key={editando?.id ?? 'novo'}
          aberto={dialogAberto}
          onFechar={() => setDialogAberto(false)}
          mentoraId={mentoraId}
          assistente={editando}
          onSucesso={carregar}
        />
      )}
    </div>
  );
}
