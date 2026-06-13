import Link from 'next/link';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { contarRespostasPorMentora, contarRespostasEsteMes, getUltimaResposta } from '@/lib/db/respostas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CalendarDays, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PainelDashboardPage() {
  const mentora = (await getAuthenticatedMentora())!;

  const [total, esteMes, ultima] = await Promise.all([
    contarRespostasPorMentora(mentora.id),
    contarRespostasEsteMes(mentora.id),
    getUltimaResposta(mentora.id),
  ]);

  // O servidor roda em UTC — a saudação segue o fuso das mentoras.
  const hora = Number(
    new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    }).format(new Date()),
  );
  const saudacao = hora < 12 ? 'Bom dia' : hora < 19 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = mentora.nome.split(' ')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">
          {saudacao}, <span className="accent-italic">{primeiroNome}</span>
        </h1>
        <p className="text-muted-foreground">
          Veja quem respondeu e o que precisa da sua atenção.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mentorados no radar</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-4xl">{total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Responderam este mês</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-4xl">{esteMes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">A resposta mais recente</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ultima ? (
              <div>
                <div className="text-lg font-semibold">{ultima.nome}</div>
                <div className="font-mono text-xs tabular-nums text-muted-foreground">
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
        Ver todos os mentorados
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
