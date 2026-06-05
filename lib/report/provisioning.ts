// ============================================================
// Provisionamento de RAG por mentora (substitui CreateAssistant.json)
// ============================================================
// Cria, na conta OpenAI da mentora (a chave dela → ela paga):
//   1. upload do knowledge-base-big-five.md (POST /files)
//   2. vector store + associação do ficheiro
//   3. espera de indexação
// e grava vector_store_id + knowledge_file_id na mentora.
//
// NÃO cria Assistant (Assistants API descontinuada — desliga 2026-08-26).
// O RAG é consumido diretamente pela Responses API via file_search.
//
// Idempotente: se já houver recursos, são removidos e recriados.
// ============================================================

import { getMentoraById, atualizarRagMentora } from '@/lib/db/admin';
import {
  enviarArquivo,
  criarVectorStore,
  adicionarArquivoVectorStore,
  listarArquivosVectorStore,
  deletarVectorStore,
  deletarArquivo,
} from '@/lib/openai-assistants';
import { loadKnowledgeFile } from './knowledgeBase';

async function aguardarIndexacao(apiKey: string, vsId: string): Promise<void> {
  for (let i = 0; i < 20; i++) {
    const res = await listarArquivosVectorStore(apiKey, vsId);
    const file = res.data[0];
    if (file) {
      if (file.status === 'completed') return;
      if (file.status === 'failed' || file.status === 'cancelled') {
        throw new Error('Falha ao indexar a base de conhecimento na OpenAI.');
      }
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('Tempo esgotado a indexar a base de conhecimento na OpenAI.');
}

export async function provisionarMentora(
  mentoraId: string,
): Promise<{ vectorStoreId: string; knowledgeFileId: string }> {
  const mentora = await getMentoraById(mentoraId);
  if (!mentora) throw new Error('Mentora não encontrada.');
  if (!mentora.openaiApiKey) {
    throw new Error('Esta mentora não tem chave OpenAI configurada.');
  }
  const apiKey = mentora.openaiApiKey;

  // Idempotência: remover recursos antigos antes de recriar.
  if (mentora.vectorStoreId) {
    await deletarVectorStore(apiKey, mentora.vectorStoreId).catch(() => {});
  }
  if (mentora.knowledgeFileId) {
    await deletarArquivo(apiKey, mentora.knowledgeFileId).catch(() => {});
  }

  const file = await loadKnowledgeFile();
  const uploaded = await enviarArquivo(apiKey, file);
  const vs = await criarVectorStore(apiKey, { name: `B5 — ${mentora.slug}` });
  await adicionarArquivoVectorStore(apiKey, vs.id, uploaded.id);
  await aguardarIndexacao(apiKey, vs.id);

  await atualizarRagMentora(mentoraId, {
    vectorStoreId: vs.id,
    knowledgeFileId: uploaded.id,
  });

  return { vectorStoreId: vs.id, knowledgeFileId: uploaded.id };
}
