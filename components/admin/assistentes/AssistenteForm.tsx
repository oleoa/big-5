'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { criarAssistenteAction, atualizarAssistenteAction } from '@/app/admin/openai-actions';
import type { Assistant, CreateAssistantPayload } from '@/types/openai';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  mentoraId: string;
  assistente: Assistant | null; // null = criar
  onSucesso: () => void;
}

const MODELOS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
];

export function AssistenteForm({ aberto, onFechar, mentoraId, assistente, onSucesso }: Props) {
  const editando = assistente !== null;

  const [nome, setNome] = useState(assistente?.name ?? '');
  const [modelo, setModelo] = useState(assistente?.model ?? 'gpt-4o');
  const [instructions, setInstructions] = useState(assistente?.instructions ?? '');
  const [descricao, setDescricao] = useState(assistente?.description ?? '');
  const [temperatura, setTemperatura] = useState(String(assistente?.temperature ?? 1));
  const [topP, setTopP] = useState(String(assistente?.top_p ?? 1));
  const [codeInterpreter, setCodeInterpreter] = useState(
    assistente?.tools.some((t) => t.type === 'code_interpreter') ?? false,
  );
  const [fileSearch, setFileSearch] = useState(
    assistente?.tools.some((t) => t.type === 'file_search') ?? false,
  );
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('O nome é obrigatório.');
      return;
    }

    setSalvando(true);

    const tools: { type: string }[] = [];
    if (codeInterpreter) tools.push({ type: 'code_interpreter' });
    if (fileSearch) tools.push({ type: 'file_search' });

    const payload: CreateAssistantPayload = {
      name: nome.trim(),
      model: modelo,
      instructions: instructions || undefined,
      description: descricao || undefined,
      tools,
      temperature: parseFloat(temperatura) || undefined,
      top_p: parseFloat(topP) || undefined,
    };

    const res = editando
      ? await atualizarAssistenteAction(mentoraId, assistente.id, payload)
      : await criarAssistenteAction(mentoraId, payload);

    if (res.sucesso) {
      toast.success(editando ? 'Assistente atualizado.' : 'Assistente criado.');
      onSucesso();
      onFechar();
    } else {
      toast.error(res.erro);
    }

    setSalvando(false);
  }

  return (
    <Sheet open={aberto} onOpenChange={(open) => { if (!open) onFechar(); }}>
      <SheetContent side="right" className="sm:max-w-2xl! z-60 overflow-y-auto [&+[data-slot=sheet-close]]:z-60">
        <form onSubmit={handleSubmit} className="min-w-0 px-6 py-6">
          <SheetHeader className="px-0">
            <SheetTitle>{editando ? 'Editar assistente' : 'Novo assistente'}</SheetTitle>
            <SheetDescription>
              {editando ? 'Altere os dados do assistente.' : 'Preencha os dados para criar um novo assistente OpenAI.'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="asst-nome">Nome *</Label>
              <Input id="asst-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do assistente" required />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select value={modelo} onValueChange={(v) => { if (v) setModelo(v); }}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELOS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asst-instructions">System Prompt (Instructions)</Label>
              <Textarea
                id="asst-instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={10}
                placeholder="Instruções do assistente..."
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asst-descricao">Descricao</Label>
              <Input id="asst-descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Breve descricao (opcional)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asst-temp">Temperatura (0-2)</Label>
                <Input id="asst-temp" type="number" step="0.1" min="0" max="2" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asst-top-p">Top P (0-1)</Label>
                <Input id="asst-top-p" type="number" step="0.1" min="0" max="1" value={topP} onChange={(e) => setTopP(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Ferramentas</Label>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-sm">Code Interpreter</span>
                <Switch checked={codeInterpreter} onCheckedChange={setCodeInterpreter} />
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-sm">File Search</span>
                <Switch checked={fileSearch} onCheckedChange={setFileSearch} />
              </div>
            </div>
          </div>

          <SheetFooter className="px-0 pt-6">
            <Button type="submit" disabled={salvando}>
              {salvando && <Loader2 className="size-4 animate-spin mr-2" />}
              {salvando ? 'Salvando...' : editando ? 'Salvar alteracoes' : 'Criar assistente'}
            </Button>
            <Button type="button" variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
