'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LABELS = [
  'Opção 1 (discordância máxima)',
  'Opção 2',
  'Opção 3 (neutro)',
  'Opção 4',
  'Opção 5 (concordância máxima)',
];

const DEFAULTS: [string, string, string, string, string] = [
  'Discordo totalmente',
  'Discordo',
  'Neutro',
  'Concordo',
  'Concordo totalmente',
];

interface Props {
  inicial?: [string, string, string, string, string];
}

export default function EditorOpcoesResposta({ inicial = DEFAULTS }: Props) {
  const [opcoes, setOpcoes] = useState<[string, string, string, string, string]>(inicial);

  function atualizar(index: number, valor: string) {
    setOpcoes(prev => {
      const next = [...prev] as [string, string, string, string, string];
      next[index] = valor;
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name="opcoes_resposta" value={JSON.stringify(opcoes)} />
      <div className="space-y-2">
        {opcoes.map((opcao, i) => (
          <div key={i} className="flex items-center gap-3">
            <Label className="text-xs text-muted-foreground w-48 shrink-0">{LABELS[i]}</Label>
            <Input
              value={opcao}
              onChange={e => atualizar(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
