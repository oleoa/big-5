import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { getMentoraBySlug } from '@/lib/db/mentoras';
import { criarResposta } from '@/lib/db/respostas';
import { calculateResults } from '@/lib/scoring';
import type { Answers } from '@/lib/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, cliente, respostas } = body as {
    slug: string;
    cliente: Record<string, string>;
    respostas: Answers;
  };

  if (!slug || !cliente || !respostas) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  const mentora = await getMentoraBySlug(slug);
  if (!mentora) {
    return NextResponse.json({ error: 'Mentora não encontrada' }, { status: 404 });
  }

  const result = calculateResults(respostas);

  // Remapear chaves do cliente usando o campo payload da pergunta extra
  const clientePayload: Record<string, string> = {
    nome: cliente.nome,
    email: cliente.email,
    celular: cliente.celular,
  };
  const camposExtras: Record<string, string> = {};
  for (const p of mentora.perguntasExtras) {
    if (cliente[p.id] !== undefined) {
      const key = p.label;
      clientePayload[key] = cliente[p.id];
      camposExtras[p.label] = cliente[p.id];
    }
  }

  // Gravar na tabela respostas
  const resposta = await criarResposta({
    mentoraId: mentora.id,
    nome: cliente.nome,
    email: cliente.email,
    celular: cliente.celular || null,
    scores: result,
    camposExtras,
    respostasBrutas: respostas,
  });

  // Construir payload para n8n
  const callbackUrl = `${req.nextUrl.origin}/api/respostas/${resposta.id}/relatorio`;
  const n8nPayload = {
    resposta_id: resposta.id,
    callback_url: callbackUrl,
    mentora: {
      nome: mentora.nome,
      email: mentora.email,
      id: mentora.id,
      promptExtra: mentora.promptExtra,
    },
    cliente: {
      ...clientePayload,
      extras: mentora.perguntasExtras
        .filter((p) => cliente[p.id] !== undefined)
        .map((p) => ({
          campo: p.label,
          valor: cliente[p.id],
          fala_ia: p.falaIa,
        })),
    },
    resultados: result.domains.map((d) => ({
      dominio: d.domainPt,
      codigo: d.domain,
      percentil: d.percentile,
      pontuacao: d.score,
      nivel: d.descriptor,
      facetas: d.facets.map((f) => ({
        nome: f.facetPt,
        percentil: f.percentile,
        pontuacao: f.score,
        nivel: f.descriptor,
      })),
    })),
  };

  // Disparar webhook n8n em background (fire-and-forget)
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    after(async () => {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n8nPayload),
        });
      } catch {
        // Silenciar erro do webhook — resposta já foi gravada na DB
      }
    });
  }

  return NextResponse.json({ ok: true, id: resposta.id });
}
