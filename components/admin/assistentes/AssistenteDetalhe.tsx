'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil, Trash2, Code, FileSearch, Thermometer, ArrowLeft } from 'lucide-react';
import { ArquivosSection } from './ArquivosSection';
import type { Assistant } from '@/types/openai';

interface Props {
  assistente: Assistant;
  mentoraId: string;
  onVoltar: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}

export function AssistenteDetalhe({ assistente, mentoraId, onVoltar, onEditar, onEliminar }: Props) {
  const tools = assistente.tools.map((t) => t.type);
  const vectorStoreIds = assistente.tool_resources?.file_search?.vector_store_ids ?? [];
  const data = new Date(assistente.created_at * 1000).toLocaleDateString('pt-BR');

  return (
    <div className="space-y-4 overflow-hidden">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon-sm" onClick={onVoltar}>
          <ArrowLeft className="size-4" />
        </Button>
        <h4 className="font-medium flex-1 truncate">{assistente.name ?? 'Sem nome'}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onEditar}>
          <Pencil className="size-3 mr-1" />
          Editar
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onEliminar} className="text-destructive hover:text-destructive">
          <Trash2 className="size-3 mr-1" />
          Eliminar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="secondary">{assistente.model}</Badge>
        {tools.includes('code_interpreter') && (
          <Badge variant="outline" className="gap-1">
            <Code className="size-3" />
            Code Interpreter
          </Badge>
        )}
        {tools.includes('file_search') && (
          <Badge variant="outline" className="gap-1">
            <FileSearch className="size-3" />
            File Search
          </Badge>
        )}
        {assistente.temperature != null && (
          <Badge variant="outline" className="gap-1">
            <Thermometer className="size-3" />
            Temp: {assistente.temperature}
          </Badge>
        )}
        <span className="text-muted-foreground self-center">Criado em {data}</span>
      </div>

      {assistente.description && (
        <p className="text-sm text-muted-foreground">{assistente.description}</p>
      )}

      <div className="space-y-1 min-w-0 w-full">
        <span className="text-xs font-medium text-muted-foreground">System Prompt (Instructions)</span>
        <div className="rounded-md border bg-muted/30 p-3 max-h-64 overflow-auto w-full">
          <div className="text-xs font-mono whitespace-pre-wrap break-all w-full">
            {assistente.instructions || '(vazio)'}
          </div>
        </div>
      </div>

      <Separator />

      <ArquivosSection mentoraId={mentoraId} vectorStoreIds={vectorStoreIds} />
    </div>
  );
}
