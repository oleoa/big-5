'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AssistentesSection } from '@/components/admin/assistentes/AssistentesSection';
import type { Mentora } from '@/types/mentora';

interface Props {
  mentora: Mentora | null;
}

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
            : 'A chave é usada para gerar a análise personalizada.'}
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
        <AssistentesSection mentoraId={mentora.id} />
      ) : (
        <p className="text-sm text-muted-foreground py-2">
          Salve a mentora com uma chave OpenAI para gerenciar assistentes.
        </p>
      )}
    </div>
  );
}
