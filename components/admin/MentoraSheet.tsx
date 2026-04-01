'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { criarMentoraAction, atualizarMentoraAction } from '@/app/admin/actions';
import type { ActionResult } from '@/app/admin/actions';
import type { Mentora } from '@/types/mentora';
import { TabIdentidade } from './tabs/TabIdentidade';
import { TabAparencia } from './tabs/TabAparencia';
import { TabConteudo } from './tabs/TabConteudo';
import { TabFormulario } from './tabs/TabFormulario';
import { TabIA } from './tabs/TabIA';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  mentora: Mentora | null;
  loading: boolean;
  onSaved?: (id: string) => void;
}

export function MentoraSheet({ open, onOpenChange, mode, mentora, loading, onSaved }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastHandledState = useRef<ActionResult | null>(null);

  const action = mode === 'create' ? criarMentoraAction : atualizarMentoraAction;
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);

  useEffect(() => {
    if (!state || state === lastHandledState.current) return;
    lastHandledState.current = state;
    if (state.sucesso) {
      toast.success(mode === 'create' ? 'Mentora criada' : 'Alterações salvas');
      if (mode === 'create') {
        onOpenChange(false);
      } else if (mentora?.id) {
        onSaved?.(mentora.id);
      }
    } else if (state.erro) {
      toast.error(state.erro);
    }
  }, [state, mode, onOpenChange, mentora?.id, onSaved]);

  const isReady = !loading && (mode === 'create' || mentora !== null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[50vw] w-full p-0 flex flex-col gap-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle>
            {mode === 'create' ? 'Nova mentora' : `Editar — ${mentora?.nome ?? ''}`}
          </SheetTitle>
          <SheetDescription>
            {mode === 'create'
              ? 'Preencha os dados para criar uma nova mentora.'
              : 'Edite os dados da mentora e salve as alterações.'}
          </SheetDescription>
        </SheetHeader>

        {!isReady ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form ref={formRef} action={formAction} className="flex-1 flex flex-col overflow-hidden">
            {mode === 'edit' && mentora && (
              <>
                <input type="hidden" name="id" value={mentora.id} />
                <input type="hidden" name="ativo" value={String(mentora.ativo)} />
              </>
            )}
            {mode === 'create' && (
              <input type="hidden" name="ativo" value="true" />
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="px-6 py-4">
                <Tabs defaultValue="identidade">
                  <TabsList className="w-full grid grid-cols-5 mb-4">
                    <TabsTrigger value="identidade">Identidade</TabsTrigger>
                    <TabsTrigger value="aparencia">Aparência</TabsTrigger>
                    <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                    <TabsTrigger value="formulario">Formulário</TabsTrigger>
                    <TabsTrigger value="ia">IA</TabsTrigger>
                  </TabsList>

                  <TabsContent value="identidade" keepMounted className="data-[state=inactive]:hidden">
                    <TabIdentidade mentora={mentora} />
                  </TabsContent>

                  <TabsContent value="aparencia" keepMounted className="data-[state=inactive]:hidden">
                    <TabAparencia mentora={mentora} />
                  </TabsContent>

                  <TabsContent value="conteudo" keepMounted className="data-[state=inactive]:hidden">
                    <TabConteudo mentora={mentora} />
                  </TabsContent>

                  <TabsContent value="formulario" keepMounted className="data-[state=inactive]:hidden">
                    <TabFormulario mentora={mentora} />
                  </TabsContent>

                  <TabsContent value="ia" keepMounted className="data-[state=inactive]:hidden">
                    <TabIA mentora={mentora} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row gap-2 sm:justify-start">
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin mr-2" />}
                {pending
                  ? 'Salvando...'
                  : mode === 'create'
                    ? 'Criar mentora'
                    : 'Salvar alterações'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
