'use client';

import { MoreHorizontal, Pencil, Trash2, Code, FileSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Assistant } from '@/types/openai';

interface Props {
  assistente: Assistant;
  selecionado: boolean;
  onSelecionar: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}

export function AssistenteCard({ assistente, selecionado, onSelecionar, onEditar, onEliminar }: Props) {
  const tools = assistente.tools.map((t) => t.type);

  return (
    <div
      onClick={onSelecionar}
      className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
        selecionado ? 'border-primary bg-muted/30' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium truncate">{assistente.name ?? 'Sem nome'}</span>
            <Badge variant="secondary" className="text-[10px]">{assistente.model}</Badge>
            {tools.includes('code_interpreter') && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <Code className="size-3" />
                Code
              </Badge>
            )}
            {tools.includes('file_search') && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <FileSearch className="size-3" />
                Ficheiros
              </Badge>
            )}
          </div>
          {assistente.instructions && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {assistente.instructions}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditar(); }}>
              <Pencil className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); onEliminar(); }}>
              <Trash2 className="size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
