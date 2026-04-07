import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { getRespostaById } from '@/lib/db/respostas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RelatorioActions } from './relatorio-actions';

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

export default async function RelatorioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const mentora = (await getAuthenticatedMentora())!;
  const { id } = await params;
  const resposta = await getRespostaById(id, mentora.id);

  if (!resposta) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" render={<Link href="/painel/mentorados" />}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{resposta.nome}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                <p>{resposta.email}</p>
                {resposta.celular && <p>{resposta.celular}</p>}
                <p>Respondido em {resposta.criadoEm.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <Badge variant="secondary" className={STATUS_STYLES[resposta.status]}>
              {STATUS_LABELS[resposta.status] ?? resposta.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(resposta.camposExtras).length > 0 && (
            <div className="mb-6 rounded-lg border p-4 space-y-2">
              <h3 className="text-sm font-medium">Dados adicionais</h3>
              {Object.entries(resposta.camposExtras).map(([campo, valor]) => (
                <div key={campo} className="text-sm">
                  <span className="font-medium">{campo}:</span>{' '}
                  <span className="text-muted-foreground">{valor}</span>
                </div>
              ))}
            </div>
          )}

          <RelatorioActions respostaId={resposta.id} status={resposta.status} />
        </CardContent>
      </Card>

      {resposta.status === 'concluido' && resposta.relatorioHtml && (
        <Card id="relatorio-print">
          <CardContent className="p-6 lg:p-8">
            <div dangerouslySetInnerHTML={{ __html: resposta.relatorioHtml }} />
          </CardContent>
        </Card>
      )}

      {resposta.status === 'pendente' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin-logo inline-block size-8 border-4 border-primary border-r-transparent rounded-full mb-4" />
            <p className="text-muted-foreground">Relatório em processamento...</p>
            <p className="text-sm text-muted-foreground mt-1">Isto pode demorar alguns minutos.</p>
          </CardContent>
        </Card>
      )}

      {resposta.status === 'processando' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin-logo inline-block size-8 border-4 border-blue-500 border-r-transparent rounded-full mb-4" />
            <p className="text-muted-foreground">A gerar relatório com IA...</p>
            <p className="text-sm text-muted-foreground mt-1">Aguarde enquanto o relatório é gerado.</p>
          </CardContent>
        </Card>
      )}

      {resposta.status === 'erro' && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-medium">Ocorreu um erro ao gerar o relatório.</p>
            <p className="text-sm text-muted-foreground mt-1">Tente reprocessar ou contacte o suporte.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
