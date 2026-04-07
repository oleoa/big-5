import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { getRespostaById } from '@/lib/db/respostas';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RelatorioActions } from './relatorio-actions';

export const dynamic = 'force-dynamic';

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
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/painel/mentorados" />}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
        <RelatorioActions respostaId={resposta.id} status={resposta.status} nome={resposta.nome} />
      </div>

      {resposta.status === 'concluido' && resposta.relatorioHtml && (
        <Card>
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
