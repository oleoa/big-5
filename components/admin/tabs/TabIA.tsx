'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ProvisionarRagButton } from '@/components/admin/ProvisionarRagButton';
import type { Mentora } from '@/types/mentora';

interface Props {
  mentora: Mentora | null;
}

const MODELOS = [
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini (rápido, barato)' },
  { value: 'gpt-4o', label: 'gpt-4o (mais rico)' },
  { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
  { value: 'gpt-4.1', label: 'gpt-4.1' },
];

export function TabIA({ mentora }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="openai_api_key">Chave OpenAI</Label>
        <Input
          id="openai_api_key"
          name="openai_api_key"
          type="password"
          defaultValue=""
          placeholder={mentora?.openaiApiKey ? `sk-...${mentora.openaiApiKey.slice(-4)}` : 'sk-...'}
        />
        <p className="text-xs text-muted-foreground">
          {mentora?.openaiApiKey
            ? 'Chave configurada. Deixe em branco para manter a atual, ou cole uma nova para substituir.'
            : 'A chave é usada para gerar a análise personalizada (a mentora paga o uso).'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="modelo_ia">Modelo</Label>
        <select
          id="modelo_ia"
          name="modelo_ia"
          defaultValue={mentora?.modeloIa ?? 'gpt-4o-mini'}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {MODELOS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Modelo usado na análise. A mentora paga o uso na chave dela.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt_extra">Prompt extra</Label>
        <Textarea
          id="prompt_extra"
          name="prompt_extra"
          rows={6}
          defaultValue={mentora?.promptExtra ?? ''}
          placeholder="Instruções adicionais para a IA ao gerar a análise..."
        />
      </div>

      <Separator />

      {mentora?.id && mentora?.openaiApiKey ? (
        <ProvisionarRagButton mentoraId={mentora.id} provisionado={!!mentora.vectorStoreId} />
      ) : (
        <p className="text-sm text-muted-foreground py-2">
          Salve a mentora com uma chave OpenAI para provisionar a base de conhecimento (RAG).
        </p>
      )}
    </div>
  );
}
