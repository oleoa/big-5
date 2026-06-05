'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedMentora } from '@/lib/auth/helpers';
import { atualizarConfig, atualizarFormulario, atualizarConta } from '@/lib/db/admin';
import { apagarResposta, getRespostaById } from '@/lib/db/respostas';
import { gerarRelatorio } from '@/lib/report/gerarRelatorio';

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

    // Regenera o relatório de forma síncrona (ação manual → feedback real).
    await gerarRelatorio(resposta, mentora);

    revalidatePath(`/painel/mentorados/${respostaId}`);
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao reprocessar' };
  }
}
