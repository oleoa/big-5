import Link from 'next/link';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { contarRespostasPorMentora, contarRespostasEsteMes, getUltimaResposta } from '@/lib/db/respostas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CalendarDays, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PainelDashboardPage() {
  const mentora = (await getAuthenticatedMentora())!;

  const [total, esteMes, ultima] = await Promise.all([
    contarRespostasPorMentora(mentora.id),
    contarRespostasEsteMes(mentora.id),
    getUltimaResposta(mentora.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {mentora.nome}</h1>
        <p className="text-muted-foreground">Bem-vinda ao seu painel de gestão.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de mentorados</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Respostas este mês</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{esteMes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Última resposta</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ultima ? (
              <div>
                <div className="text-lg font-semibold">{ultima.nome}</div>
                <div className="text-sm text-muted-foreground">
                  {ultima.criadoEm.toLocaleDateString('pt-PT')}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Nenhuma resposta ainda</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button nativeButton={false} render={<Link href="/painel/mentorados" />}>
        Ver todos os mentorados →
      </Button>
    </div>
  );
}
