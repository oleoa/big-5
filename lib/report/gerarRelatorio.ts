// ============================================================
// Orquestrador da geração do relatório (substitui FormWebhook.json)
// ============================================================
// Fluxo: status=processando → Parte 1 (código) → análise IA (Responses)
//        → concat → persistência (relatorio_html + analise_ai) → email à mentora.
//
// Corre em background (after()) na submissão e em await no reprocessar.
// ============================================================

import type { Resposta } from '@/types/resposta';
import type { Mentora } from '@/types/mentora';
import type { TestResult } from '@/lib/types';
import {
  getRespostaById,
  atualizarStatusResposta,
  salvarRelatorio,
} from '@/lib/db/respostas';
import { getMentoraById } from '@/lib/db/admin';
import { buildHtmlParte1, buildPromptIA } from './buildParte1';
import { buildInstructions } from './systemPrompt';
import { gerarAnaliseResponses } from './responses';
import { sendEmailWithRetry } from '@/lib/email';

async function enviarEmailMentora(
  mentora: Mentora,
  resposta: Resposta,
  html: string,
): Promise<void> {
  try {
    await sendEmailWithRetry({
      to: mentora.email,
      fromName: mentora.nome,
      subject: `Análise de Personalidade BIG 5 de ${resposta.nome}`,
      html,
      replyTo: resposta.email,
    });
  } catch (e) {
    // Email é best-effort — o relatório já está guardado e visível no painel.
    console.error('Erro ao enviar email do relatório:', e);
  }
}

export async function gerarRelatorio(resposta: Resposta, mentora: Mentora): Promise<void> {
  // Normaliza scores (defensivo: JSONB devolve objeto, mas garante).
  const scores = (
    typeof resposta.scores === 'string' ? JSON.parse(resposta.scores) : resposta.scores
  ) as TestResult;
  const resp: Resposta = { ...resposta, scores };

  await atualizarStatusResposta(resp.id, 'processando');

  const htmlParte1 = buildHtmlParte1(resp, mentora);
  const semIa = htmlParte1 + '\n</div>';

  // Sem chave OpenAI → relatório só com scores (porta "Send a message without AI").
  if (!mentora.openaiApiKey) {
    await salvarRelatorio(resp.id, { relatorioHtml: semIa, analiseAi: null, status: 'concluido' });
    await enviarEmailMentora(mentora, resp, semIa);
    return;
  }

  try {
    const promptIA = buildPromptIA(resp, mentora);
    const { text, status, refused } = await gerarAnaliseResponses({
      apiKey: mentora.openaiApiKey,
      model: mentora.modeloIa || 'gpt-4o-mini',
      instructions: buildInstructions(mentora.promptExtra),
      input: promptIA,
      vectorStoreId: mentora.vectorStoreId,
    });

    // Recusa / vazio / incompleto → guarda scores e marca erro (oferece reprocessar).
    if (refused || !text || status !== 'completed') {
      await salvarRelatorio(resp.id, { relatorioHtml: semIa, analiseAi: null, status: 'erro' });
      await enviarEmailMentora(mentora, resp, semIa);
      return;
    }

    const relatorioHtml = htmlParte1 + '\n' + text + '\n</div>';
    await salvarRelatorio(resp.id, { relatorioHtml, analiseAi: text, status: 'concluido' });
    await enviarEmailMentora(mentora, resp, relatorioHtml);
  } catch (e) {
    console.error('Erro ao gerar relatório:', e);
    await salvarRelatorio(resp.id, { relatorioHtml: semIa, analiseAi: null, status: 'erro' });
    await enviarEmailMentora(mentora, resp, semIa);
    // Não relança — corre em after().
  }
}

export async function gerarRelatorioById(respostaId: string, mentoraId: string): Promise<void> {
  const resposta = await getRespostaById(respostaId, mentoraId);
  if (!resposta) throw new Error('Resposta não encontrada.');
  const mentora = await getMentoraById(mentoraId);
  if (!mentora) throw new Error('Mentora não encontrada.');
  await gerarRelatorio(resposta, mentora);
}
