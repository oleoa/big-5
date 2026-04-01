'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { Mentora } from '@/types/mentora';

interface Props {
  mentora: Mentora | null;
}

export function TabConteudo({ mentora }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Landing page</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" name="titulo" defaultValue={mentora?.titulo ?? 'Descubra sua Personalidade'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitulo">Subtítulo</Label>
            <Input id="subtitulo" name="subtitulo" defaultValue={mentora?.subtitulo ?? 'Um questionário científico de 120 perguntas baseado no modelo Big Five.'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="texto_botao">Texto do botão</Label>
            <Input id="texto_botao" name="texto_botao" defaultValue={mentora?.textoBotao ?? 'Iniciar teste'} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Página de obrigado</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo_obrigado">Título</Label>
            <Input id="titulo_obrigado" name="titulo_obrigado" defaultValue={mentora?.tituloObrigado ?? 'Obrigado!'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="texto_obrigado">Texto</Label>
            <Textarea
              id="texto_obrigado"
              name="texto_obrigado"
              rows={3}
              defaultValue={mentora?.textoObrigado ?? 'Suas respostas foram enviadas. Você receberá a análise em breve.'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
