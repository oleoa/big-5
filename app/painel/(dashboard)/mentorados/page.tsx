import Link from 'next/link';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { getRespostasByMentora } from '@/lib/db/respostas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  processando: 'bg-blue-100 text-blue-800',
  concluido: 'bg-green-100 text-green-800',
  erro: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  processando: 'A processar',
  concluido: 'Concluído',
  erro: 'Erro',
};

export default async function MentoradosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const mentora = (await getAuthenticatedMentora())!;
  const { page: pageStr, q } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const pageSize = 20;

  const { data: respostas, total } = await getRespostasByMentora(mentora.id, {
    page,
    pageSize,
    search: q,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mentorados</h1>
        <span className="text-sm text-muted-foreground">{total} resultado{total !== 1 ? 's' : ''}</span>
      </div>

      <form className="max-w-sm">
        <Input
          name="q"
          placeholder="Pesquisar por nome ou email..."
          defaultValue={q ?? ''}
          className="h-10"
        />
      </form>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="sr-only">Lista de mentorados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {respostas.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {q ? 'Nenhum resultado encontrado.' : 'Nenhum mentorado ainda.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Nome</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {respostas.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/painel/mentorados/${r.id}`} className="font-medium hover:underline">
                          {r.nome}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={STATUS_STYLES[r.status]}>
                          {STATUS_LABELS[r.status] ?? r.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.criadoEm.toLocaleDateString('pt-PT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 ? (
            <Button variant="outline" size="sm" render={<Link href={`/painel/mentorados?page=${page - 1}${q ? `&q=${q}` : ''}`} />}>
              <ChevronLeft className="size-4" /> Anterior
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="size-4" /> Anterior
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          {page < totalPages ? (
            <Button variant="outline" size="sm" render={<Link href={`/painel/mentorados?page=${page + 1}${q ? `&q=${q}` : ''}`} />}>
              Seguinte <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Seguinte <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
