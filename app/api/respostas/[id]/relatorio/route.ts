import { NextRequest, NextResponse } from 'next/server';
import { atualizarRelatorio } from '@/lib/db/respostas';
import type { RespostaStatus } from '@/types/resposta';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Validar token de callback
  const secret = req.headers.get('x-callback-secret');
  if (process.env.N8N_CALLBACK_SECRET && secret !== process.env.N8N_CALLBACK_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { relatorio_html, status } = body as {
    relatorio_html: string;
    status: RespostaStatus;
  };

  if (!relatorio_html || !status) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  await atualizarRelatorio(id, relatorio_html, status);

  return NextResponse.json({ ok: true });
}
