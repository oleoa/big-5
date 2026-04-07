import { NextRequest } from "next/server";
import { getAuthenticatedMentora } from "@/lib/auth/helpers";
import { getRespostaById } from "@/lib/db/respostas";
import { gerarPDF } from "@/lib/pdf";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const mentora = await getAuthenticatedMentora();
  if (!mentora) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const resposta = await getRespostaById(id, mentora.id);
  if (!resposta) {
    return Response.json(
      { error: "Resposta não encontrada" },
      { status: 404 }
    );
  }

  let scores = resposta.scores;
  // Handle double-encoded JSON (string inside JSONB)
  while (typeof scores === 'string') {
    try { scores = JSON.parse(scores); } catch { break; }
  }
  if (!scores?.domains?.length) {
    console.error('PDF: scores inválidos para resposta', id, JSON.stringify(scores).slice(0, 500));
    return Response.json(
      { error: "Dados do teste não disponíveis", debug: { type: typeof scores, keys: scores ? Object.keys(scores) : null } },
      { status: 400 }
    );
  }

  const pdfBuffer = await gerarPDF({
    scores,
    nome: resposta.nome,
    email: resposta.email,
    celular: resposta.celular,
    camposExtras: resposta.camposExtras,
    criadoEm: resposta.criadoEm,
    mentora: {
      nome: mentora.nome,
      logoPrincipalUrl: mentora.logoPrincipalUrl,
      corPrimaria: mentora.corPrimaria,
    },
    relatorioHtml: resposta.relatorioHtml,
    analiseAi: resposta.analiseAi,
  });

  const filename = `relatorio-${resposta.nome.replace(/[^a-zA-Z0-9\-_ ]/g, "")}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
