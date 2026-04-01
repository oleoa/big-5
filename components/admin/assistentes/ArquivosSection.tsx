'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  listarArquivosAssistenteAction,
  enviarArquivoAction,
  removerArquivoAction,
} from '@/app/admin/openai-actions';
import type { ArquivoComNome } from '@/app/admin/openai-actions';

interface Props {
  mentoraId: string;
  vectorStoreIds: string[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ArquivosSection({ mentoraId, vectorStoreIds }: Props) {
  const [arquivos, setArquivos] = useState<ArquivoComNome[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [removendo, setRemovendo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregar = useCallback(async () => {
    if (vectorStoreIds.length === 0) {
      setArquivos([]);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    const res = await listarArquivosAssistenteAction(mentoraId, vectorStoreIds);
    if (res.sucesso) {
      setArquivos(res.data);
    } else {
      toast.error(res.erro);
    }
    setCarregando(false);
  }, [mentoraId, vectorStoreIds]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || vectorStoreIds.length === 0) return;

    setEnviando(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await enviarArquivoAction(mentoraId, vectorStoreIds[0], formData);
    if (res.sucesso) {
      toast.success(`Ficheiro "${res.data.filename}" enviado.`);
      await carregar();
    } else {
      toast.error(res.erro);
    }
    setEnviando(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleRemover(fileId: string) {
    if (!confirm('Tem certeza que deseja remover este ficheiro?')) return;
    setRemovendo(fileId);
    const res = await removerArquivoAction(mentoraId, vectorStoreIds[0], fileId);
    if (res.sucesso) {
      toast.success('Ficheiro removido.');
      await carregar();
    } else {
      toast.error(res.erro);
    }
    setRemovendo(null);
  }

  if (vectorStoreIds.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Este assistente não tem vector stores associados. Ative a ferramenta &quot;File Search&quot; para gerir ficheiros.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Ficheiros ({carregando ? '...' : arquivos.length})
        </span>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={enviando}
            onClick={() => fileInputRef.current?.click()}
          >
            {enviando ? <Loader2 className="size-3 animate-spin mr-1" /> : <Upload className="size-3 mr-1" />}
            Enviar
          </Button>
        </div>
      </div>

      {carregando ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Loader2 className="size-3 animate-spin" />
          A carregar ficheiros...
        </div>
      ) : arquivos.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">Nenhum ficheiro associado.</p>
      ) : (
        <div className="space-y-1">
          {arquivos.map((arq) => (
            <div key={arq.id} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{arq.filename}</span>
                {arq.bytes > 0 && (
                  <span className="text-muted-foreground shrink-0">{formatBytes(arq.bytes)}</span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={removendo === arq.id}
                onClick={() => handleRemover(arq.id)}
              >
                {removendo === arq.id ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Trash2 className="size-3 text-destructive" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
