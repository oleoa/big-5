'use client';

import { ExternalLink, MoreHorizontal, Pencil, Power, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toggleAtivoAction, verificarDominioAction } from '@/app/admin/actions';
import { toast } from 'sonner';

interface MentoraRow {
  id: string;
  slug: string;
  nome: string;
  email: string;
  ativo: boolean;
  dominio_custom: string | null;
  dominio_dns_registros: Array<{ type: string; name: string; value: string }>;
  dominio_verificado: boolean;
}

interface Props {
  mentoras: MentoraRow[];
  onEditar: (id: string) => void;
  onNova: () => void;
}

export function MentorasTable({ mentoras: mentorasRaw, onEditar, onNova }: Props) {
  const mentoras = [...mentorasRaw].sort((a, b) => {
    if (a.ativo === b.ativo) return 0;
    return a.ativo ? -1 : 1;
  });
  async function handleToggle(id: string, ativo: boolean) {
    const resultado = await toggleAtivoAction(id, ativo);
    if (resultado.sucesso) {
      toast.success(ativo ? 'Mentora ativada' : 'Mentora desativada');
    } else {
      toast.error(resultado.erro);
    }
  }

  async function handleVerificar(id: string) {
    const resultado = await verificarDominioAction(id);
    if (resultado.sucesso) {
      toast.success('DNS verificado');
    } else {
      toast.error(resultado.erro);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Mentoras</h1>
        <Button onClick={onNova}>Nova mentora</Button>
      </div>

      {mentoras.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Nenhuma mentora registrada.</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dominio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentoras.map((m) => (
                <TableRow key={m.id} className={`cursor-pointer ${!m.ativo ? 'opacity-50' : ''}`} onClick={() => onEditar(m.id)}>
                  <TableCell className="font-medium">{m.nome}</TableCell>
                  <TableCell>
                    <a
                      href={m.dominio_custom && m.dominio_verificado ? `https://${m.dominio_custom}` : `/${m.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {m.dominio_custom && m.dominio_verificado ? m.dominio_custom : m.slug}
                      <ExternalLink className="size-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.email}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {m.dominio_custom ? (
                      <div className="space-y-1">
                        <span className="text-sm flex items-center gap-1">
                          <Globe className="size-3 text-muted-foreground" />
                          {m.dominio_custom}
                        </span>
                        {m.dominio_dns_registros?.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <Badge variant={m.dominio_verificado ? 'default' : 'secondary'} className="text-[10px]">
                              {m.dominio_verificado ? 'Verificado' : 'Aguardando DNS'}
                            </Badge>
                            {!m.dominio_verificado && (
                              <button
                                type="button"
                                onClick={() => handleVerificar(m.id)}
                                className="text-[10px] text-muted-foreground hover:text-foreground underline"
                              >
                                Verificar
                              </button>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">DNS pendente</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.ativo ? 'default' : 'secondary'}>
                      {m.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditar(m.id)}>
                          <Pencil className="size-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<a href={m.dominio_custom && m.dominio_verificado ? `https://${m.dominio_custom}` : `/${m.slug}`} target="_blank" rel="noopener noreferrer" />}>
                          <ExternalLink className="size-4 mr-2" />
                          Ver site
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggle(m.id, !m.ativo)}>
                          <Power className="size-4 mr-2" />
                          {m.ativo ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
