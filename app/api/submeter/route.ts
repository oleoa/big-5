import { NextRequest, NextResponse } from "next/server";
import { getMentoraBySlug } from "@/lib/db/mentoras";
import { calculateResults } from "@/lib/scoring";
import type { Answers } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, cliente, respostas } = body as {
    slug: string;
    cliente: { nome: string; email: string; idade?: string; profissao?: string };
    respostas: Answers;
  };

  if (!slug || !cliente || !respostas) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const mentora = await getMentoraBySlug(slug);
  if (!mentora) {
    return NextResponse.json({ error: "Mentora não encontrada" }, { status: 404 });
  }

  const result = calculateResults(respostas);

  const payload = {
    mentora: {
      nome: mentora.nome,
      email: mentora.email,
      openaiApiKey: mentora.openaiApiKey,
      promptExtra: mentora.promptExtra,
    },
    cliente,
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

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 });
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({ ok: true });
}
