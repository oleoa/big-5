'use client';

import { Separator } from '@/components/ui/separator';
import EditorOpcoesResposta from '@/components/admin/EditorOpcoesResposta';
import EditorPerguntasExtras from '@/components/admin/EditorPerguntasExtras';
import type { Mentora } from '@/types/mentora';

interface Props {
  mentora: Mentora | null;
}

export function TabFormulario({ mentora }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Opções de resposta</h4>
        <EditorOpcoesResposta inicial={mentora?.opcoesResposta} />
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Perguntas extras</h4>
        <EditorPerguntasExtras inicial={mentora?.perguntasExtras} />
      </div>
    </div>
  );
}
