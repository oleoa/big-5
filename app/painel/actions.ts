'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { atualizarConfig, atualizarFormulario, atualizarConta } from '@/lib/db/admin';
import { apagarResposta, getRespostaById } from '@/lib/db/respostas';
import type { TestResult } from '@/lib/types';

export type PainelActionResult = {
  sucesso: boolean;
  erro?: string;
};

async function requireMentora() {
  const mentora = await getAuthenticatedMentora();
  if (!mentora) throw new Error('Não autenticado');
  return mentora;
}

// ── Formulário (perguntas extras) ─────────────────────────────

export async function atualizarFormularioAction(
  perguntasExtrasJson: string,
): Promise<PainelActionResult> {
  try {
    const mentora = await requireMentora();
    const perguntasExtras = JSON.parse(perguntasExtrasJson);

    if (!Array.isArray(perguntasExtras) || perguntasExtras.length > 5) {
      return { sucesso: false, erro: 'Máximo de 5 perguntas extras' };
    }

    await atualizarFormulario(mentora.id, perguntasExtras);

    revalidatePath('/painel/formulario');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao guardar formulário' };
  }
}

// ── Configurações (cores, textos, opções) ─────────────────────

export async function atualizarConfigAction(dados: {
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  fotoCircular: boolean;
  tituloObrigado: string;
  textoObrigado: string;
  opcoesResposta: [string, string, string, string, string];
}): Promise<PainelActionResult> {
  try {
    const mentora = await requireMentora();

    await atualizarConfig(mentora.id, dados);

    revalidatePath('/painel/config');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao guardar configurações' };
  }
}

// ── Conta (OpenAI key, prompt) ────────────────────────────────

export async function atualizarContaAction(dados: {
  openaiApiKey?: string;
  promptExtra?: string;
}): Promise<PainelActionResult> {
  try {
    const mentora = await requireMentora();

    await atualizarConta(mentora.id, {
      openaiApiKey: dados.openaiApiKey !== undefined ? (dados.openaiApiKey || null) : undefined,
      promptExtra: dados.promptExtra !== undefined ? (dados.promptExtra || null) : undefined,
    });

    revalidatePath('/painel/conta');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao guardar conta' };
  }
}

// ── Respostas (apagar, reprocessar) ───────────────────────────

export async function apagarRespostaAction(
  respostaId: string,
): Promise<PainelActionResult> {
  try {
    const mentora = await requireMentora();
    const deleted = await apagarResposta(respostaId, mentora.id);

    if (!deleted) {
      return { sucesso: false, erro: 'Resposta não encontrada' };
    }

    revalidatePath('/painel/mentorados');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao apagar resposta' };
  }
}

export async function reprocessarRespostaAction(
  respostaId: string,
): Promise<PainelActionResult> {
  try {
    const mentora = await requireMentora();
    const resposta = await getRespostaById(respostaId, mentora.id);

    if (!resposta) {
      return { sucesso: false, erro: 'Resposta não encontrada' };
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return { sucesso: false, erro: 'Webhook não configurado' };
    }

    const n8nPayload = {
      resposta_id: resposta.id,
      callback_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/respostas/${resposta.id}/relatorio`,
      mentora: {
        nome: mentora.nome,
        email: mentora.email,
        id: mentora.id,
        promptExtra: mentora.promptExtra,
      },
      cliente: {
        nome: resposta.nome,
        email: resposta.email,
        celular: resposta.celular,
      },
      resultados: ((typeof resposta.scores === 'string' ? JSON.parse(resposta.scores) : resposta.scores) as TestResult).domains.map((d) => ({
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

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload),
    });

    revalidatePath(`/painel/mentorados/${respostaId}`);
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao reprocessar' };
  }
}
