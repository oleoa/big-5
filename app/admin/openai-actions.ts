'use server';

import { getMentoraById } from '@/lib/db/admin';
import {
  listarAssistentes,
  criarAssistente,
  atualizarAssistente,
  deletarAssistente,
  listarArquivosVectorStore,
  enviarArquivo,
  adicionarArquivoVectorStore,
  removerArquivoVectorStore,
  obterArquivo,
  deletarArquivo,
} from '@/lib/openai-assistants';
import type {
  Assistant,
  CreateAssistantPayload,
  UpdateAssistantPayload,
  OpenAIFile,
  VectorStoreFile,
} from '@/types/openai';

type Ok<T> = { sucesso: true; data: T };
type Err = { sucesso: false; erro: string };
type Result<T> = Ok<T> | Err;

async function obterChave(mentoraId: string): Promise<string> {
  const mentora = await getMentoraById(mentoraId);
  if (!mentora) throw new Error('Mentora não encontrada.');
  if (!mentora.openaiApiKey) throw new Error('Esta mentora não tem chave OpenAI configurada.');
  return mentora.openaiApiKey;
}

// ── Assistentes ───────────────────────────────────────────────

export async function listarAssistentesAction(mentoraId: string): Promise<Result<Assistant[]>> {
  try {
    const apiKey = await obterChave(mentoraId);
    const res = await listarAssistentes(apiKey, { limit: 100 });
    return { sucesso: true, data: res.data };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao listar assistentes.' };
  }
}

export async function criarAssistenteAction(
  mentoraId: string,
  payload: CreateAssistantPayload,
): Promise<Result<Assistant>> {
  try {
    const apiKey = await obterChave(mentoraId);
    const assistente = await criarAssistente(apiKey, payload);
    return { sucesso: true, data: assistente };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao criar assistente.' };
  }
}

export async function atualizarAssistenteAction(
  mentoraId: string,
  assistantId: string,
  payload: UpdateAssistantPayload,
): Promise<Result<Assistant>> {
  try {
    const apiKey = await obterChave(mentoraId);
    const assistente = await atualizarAssistente(apiKey, assistantId, payload);
    return { sucesso: true, data: assistente };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao atualizar assistente.' };
  }
}

export async function deletarAssistenteAction(
  mentoraId: string,
  assistantId: string,
): Promise<Result<null>> {
  try {
    const apiKey = await obterChave(mentoraId);
    await deletarAssistente(apiKey, assistantId);
    return { sucesso: true, data: null };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao eliminar assistente.' };
  }
}

// ── Ficheiros (Vector Store) ──────────────────────────────────

export interface ArquivoComNome extends VectorStoreFile {
  filename: string;
  bytes: number;
}

export async function listarArquivosAssistenteAction(
  mentoraId: string,
  vectorStoreIds: string[],
): Promise<Result<ArquivoComNome[]>> {
  try {
    const apiKey = await obterChave(mentoraId);
    const todos: ArquivoComNome[] = [];

    for (const vsId of vectorStoreIds) {
      const res = await listarArquivosVectorStore(apiKey, vsId);
      for (const vsFile of res.data) {
        try {
          const info = await obterArquivo(apiKey, vsFile.id);
          todos.push({ ...vsFile, filename: info.filename, bytes: info.bytes });
        } catch {
          todos.push({ ...vsFile, filename: vsFile.id, bytes: 0 });
        }
      }
    }

    return { sucesso: true, data: todos };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao listar ficheiros.' };
  }
}

export async function enviarArquivoAction(
  mentoraId: string,
  vectorStoreId: string,
  formData: FormData,
): Promise<Result<OpenAIFile>> {
  try {
    const apiKey = await obterChave(mentoraId);
    const file = formData.get('file') as File;
    if (!file || file.size === 0) throw new Error('Nenhum ficheiro selecionado.');

    const uploaded = await enviarArquivo(apiKey, file);
    await adicionarArquivoVectorStore(apiKey, vectorStoreId, uploaded.id);
    return { sucesso: true, data: uploaded };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao enviar ficheiro.' };
  }
}

export async function removerArquivoAction(
  mentoraId: string,
  vectorStoreId: string,
  fileId: string,
): Promise<Result<null>> {
  try {
    const apiKey = await obterChave(mentoraId);
    await removerArquivoVectorStore(apiKey, vectorStoreId, fileId);
    try { await deletarArquivo(apiKey, fileId); } catch { /* ficheiro pode já não existir */ }
    return { sucesso: true, data: null };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao remover ficheiro.' };
  }
}
