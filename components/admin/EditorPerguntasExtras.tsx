'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PerguntaExtra } from '@/types/mentora';

interface Props {
  inicial?: PerguntaExtra[];
}

export default function EditorPerguntasExtras({ inicial = [] }: Props) {
  const [perguntas, setPerguntas] = useState<PerguntaExtra[]>(
    () => inicial
      .map((p, i) => ({ ...p, ordem: p.ordem ?? i }))
      .sort((a, b) => a.ordem - b.ordem)
  );

  function adicionar() {
    setPerguntas(prev => [
      ...prev,
      { id: '', label: '', tipo: 'text', placeholder: '', obrigatorio: false, ordem: prev.length }
    ]);
  }

  function atualizar(index: number, campo: keyof PerguntaExtra, valor: string | boolean | number) {
    setPerguntas(prev => prev.map((p, i) => i === index ? { ...p, [campo]: valor } : p));
  }

  function remover(index: number) {
    setPerguntas(prev =>
      prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, ordem: i }))
    );
  }

  function moverCima(index: number) {
    if (index === 0) return;
    setPerguntas(prev => {
      const next = [...prev];
      const tempOrdem = next[index].ordem;
      next[index] = { ...next[index], ordem: next[index - 1].ordem };
      next[index - 1] = { ...next[index - 1], ordem: tempOrdem };
      return next.sort((a, b) => a.ordem - b.ordem);
    });
  }

  function moverBaixo(index: number) {
    if (index === perguntas.length - 1) return;
    setPerguntas(prev => {
      const next = [...prev];
      const tempOrdem = next[index].ordem;
      next[index] = { ...next[index], ordem: next[index + 1].ordem };
      next[index + 1] = { ...next[index + 1], ordem: tempOrdem };
      return next.sort((a, b) => a.ordem - b.ordem);
    });
  }

  return (
    <div>
      <input type="hidden" name="perguntas_extras" value={JSON.stringify(perguntas)} />

      <div className="space-y-3">
        {perguntas.map((pergunta, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">ID</Label>
                <Input
                  value={pergunta.id}
                  onChange={e => atualizar(i, 'id', e.target.value)}
                  placeholder="ex: idade"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input
                  value={pergunta.label}
                  onChange={e => atualizar(i, 'label', e.target.value)}
                  placeholder="ex: Qual sua idade?"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={pergunta.placeholder ?? ''}
                  onChange={e => atualizar(i, 'placeholder', e.target.value)}
                  placeholder="ex: Digite sua idade"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Select value={pergunta.tipo} onValueChange={v => { if (v) atualizar(i, 'tipo', v); }}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="textarea">Texto longo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 mt-5">
                <Switch
                  checked={pergunta.obrigatorio}
                  onCheckedChange={checked => atualizar(i, 'obrigatorio', checked)}
                />
                <Label className="text-xs">Obrigatório</Label>
              </div>

              <div className="ml-auto mt-5 flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => moverCima(i)} disabled={i === 0}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => moverBaixo(i)} disabled={i === perguntas.length - 1}>
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" onClick={() => remover(i)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {perguntas.length === 0 && (
        <p className="text-sm text-muted-foreground mb-3">
          Sem perguntas extras. Nome e email são sempre solicitados.
        </p>
      )}
      <Button type="button" variant="outline" className="mt-3 w-full border-dashed" onClick={adicionar}>
        <Plus className="size-4 mr-2" />
        Adicionar pergunta
      </Button>
    </div>
  );
}
