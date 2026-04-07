'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { verificarDominioAction } from '@/app/admin/actions';
import { toast } from 'sonner';
import type { Mentora } from '@/types/mentora';

interface Props {
  mentora: Mentora | null;
}

export function TabIdentidade({ mentora }: Props) {
  async function handleVerificar() {
    if (!mentora) return;
    const resultado = await verificarDominioAction(mentora.id);
    if (resultado.sucesso) toast.success('DNS verificado');
    else toast.error(resultado.erro);
  }

  function copiar(texto: string) {
    navigator.clipboard.writeText(texto);
    toast.success('Copiado!');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={mentora?.slug ?? ''} placeholder="nome-da-mentora" />
          <p className="text-xs text-muted-foreground">URL: /nome-da-mentora</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" name="nome" required defaultValue={mentora?.nome ?? ''} placeholder="Nome da Mentora" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required defaultValue={mentora?.email ?? ''} placeholder="email@exemplo.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="auth_user_id">Auth User ID (Neon Auth)</Label>
        <Input id="auth_user_id" name="auth_user_id" defaultValue={mentora?.authUserId ?? ''} placeholder="UUID do user no Neon Auth" />
        <p className="text-xs text-muted-foreground">Vincule a conta Neon Auth da mentora para acesso ao painel.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dominio_custom">Dominio personalizado</Label>
        <Input id="dominio_custom" name="dominio_custom" defaultValue={mentora?.dominioCustom ?? ''} placeholder="bigfive.meudominio.com" />
        <p className="text-xs text-muted-foreground">Dominio proprio da mentora (ex: bigfive.meudominio.com)</p>
      </div>

      {mentora?.dominioCustom && (
        <div className="rounded-lg border p-4 space-y-3">
          <h4 className="text-sm font-medium">Configuracao DNS</h4>
          {mentora.dominioDnsRegistros.length > 0 ? (
            <>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium">Tipo</th>
                      <th className="px-3 py-2 text-left font-medium">Nome</th>
                      <th className="px-3 py-2 text-left font-medium">Valor</th>
                      <th className="px-3 py-2 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {mentora.dominioDnsRegistros.map((reg, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="text-[10px] font-mono">{reg.type}</Badge>
                        </td>
                        <td className="px-3 py-2">
                          <code className="bg-muted px-1.5 py-0.5 rounded text-xs break-all">{reg.name}</code>
                        </td>
                        <td className="px-3 py-2">
                          <code className="bg-muted px-1.5 py-0.5 rounded text-xs break-all">{reg.value}</code>
                        </td>
                        <td className="px-3 py-2">
                          <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => copiar(reg.value)}>
                            <Copy className="size-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={mentora.dominioVerificado ? 'default' : 'secondary'}>
                  {mentora.dominioVerificado ? 'Verificado' : 'Aguardando configuracao'}
                </Badge>
                {!mentora.dominioVerificado && (
                  <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={handleVerificar}>
                    Verificar DNS
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Configure estes registos no painel DNS do seu provedor (Cloudflare, GoDaddy, etc.) e clique em Verificar.
              </p>
            </>
          ) : (
            <p className="text-sm text-destructive">
              Erro ao registrar dominio na Vercel. Tente salvar novamente ou altere o dominio.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
