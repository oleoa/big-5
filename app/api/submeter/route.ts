/**
 * @deprecated Use POST /api/respostas instead.
 * Mantido para compatibilidade com sistemas externos. Agora gera o relatório
 * nativamente (sem n8n), tal como /api/respostas.
 */
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { getMentoraBySlug } from "@/lib/db/mentoras";
import { criarResposta } from "@/lib/db/respostas";
import { calculateResults } from "@/lib/scoring";
import { gerarRelatorio } from "@/lib/report/gerarRelatorio";
import type { Answers } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, cliente, respostas } = body as {
    slug: string;
    cliente: Record<string, string>;
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

  const camposExtras: Record<string, string> = {};
  for (const p of mentora.perguntasExtras) {
    if (cliente[p.id] !== undefined) {
      camposExtras[p.label] = cliente[p.id];
    }
  }

  const resposta = await criarResposta({
    mentoraId: mentora.id,
    nome: cliente.nome,
    email: cliente.email,
    celular: cliente.celular || null,
    scores: result,
    camposExtras,
    respostasBrutas: respostas,
  });

  after(() => gerarRelatorio(resposta, mentora));

  return NextResponse.json({ ok: true, id: resposta.id });
}
