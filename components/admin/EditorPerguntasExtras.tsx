'use client';

import { useState } from 'react';
import type { PerguntaExtra } from '@/types/mentora';

interface Props {
  inicial?: PerguntaExtra[];
}

export default function EditorPerguntasExtras({ inicial = [] }: Props) {
  const [perguntas, setPerguntas] = useState<PerguntaExtra[]>(
    () => inicial
      .map((p, i) => ({ ...p, ordem: p.ordem ?? i, payload: p.payload ?? '' }))
      .sort((a, b) => a.ordem - b.ordem)
  );

  function adicionar() {
    setPerguntas(prev => [
      ...prev,
      { id: '', label: '', tipo: 'text', placeholder: '', obrigatorio: false, ordem: prev.length, payload: '' }
    ]);
  }

  function atualizar(index: number, campo: keyof PerguntaExtra, valor: string | boolean) {
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
      <input
        type="hidden"
        name="perguntas_extras"
        value={JSON.stringify(perguntas)}
      />

      <div className="space-y-3">
        {perguntas.map((pergunta, i) => (
          <div key={i} className="border border-border rounded-lg p-4 bg-card space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">
                  ID <span className="text-muted">(identificador interno)</span>
                </label>
                <input
                  type="text"
                  value={pergunta.id}
                  onChange={e => atualizar(i, 'id', e.target.value)}
                  placeholder="ex: idade"
                  className="w-full border border-border rounded px-3 py-1.5 text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Label</label>
                <input
                  type="text"
                  value={pergunta.label}
                  onChange={e => atualizar(i, 'label', e.target.value)}
                  placeholder="ex: Qual a sua idade?"
                  className="w-full border border-border rounded px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Payload <span className="text-muted">(chave no webhook — vazio usa o ID)</span>
                </label>
                <input
                  type="text"
                  value={pergunta.payload ?? ''}
                  onChange={e => atualizar(i, 'payload', e.target.value)}
                  placeholder="ex: client_age"
                  className="w-full border border-border rounded px-3 py-1.5 text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Placeholder</label>
                <input
                  type="text"
                  value={pergunta.placeholder ?? ''}
                  onChange={e => atualizar(i, 'placeholder', e.target.value)}
                  placeholder="ex: Digite a sua idade"
                  className="w-full border border-border rounded px-3 py-1.5 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Tipo</label>
                <select
                  value={pergunta.tipo}
                  onChange={e => atualizar(i, 'tipo', e.target.value)}
                  className="border border-border rounded px-3 py-1.5 text-sm"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="textarea">Texto longo</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={pergunta.obrigatorio}
                  onChange={e => atualizar(i, 'obrigatorio', e.target.checked)}
                  className="w-4 h-4"
                />
                Obrigatório
              </label>

              <div className="ml-auto mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moverCima(i)}
                  disabled={i === 0}
                  className="text-sm text-muted hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed px-1"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moverBaixo(i)}
                  disabled={i === perguntas.length - 1}
                  className="text-sm text-muted hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed px-1"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remover(i)}
                  className="text-sm text-red-500 hover:text-red-700 cursor-pointer ml-2"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {perguntas.length === 0 && (
        <p className="text-sm text-muted mb-3">
          Sem perguntas extras. Nome e email são sempre pedidos.
        </p>
      )}
      <button
        type="button"
        onClick={adicionar}
        className="mt-3 text-sm border border-dashed border-border rounded-lg px-4 py-2 text-muted hover:border-accent hover:text-accent w-full cursor-pointer"
      >
        + Adicionar pergunta
      </button>
    </div>
  );
}
