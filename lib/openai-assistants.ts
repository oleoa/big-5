import type {
  Assistant,
  CreateAssistantPayload,
  UpdateAssistantPayload,
  VectorStore,
  VectorStoreFile,
  OpenAIFile,
} from '@/types/openai';

const BASE_URL = 'https://api.openai.com/v1';

async function openaiRequest<T>(
  apiKey: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'OpenAI-Beta': 'assistants=v2',
  };

  let fetchBody: BodyInit | undefined;

  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: fetchBody,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const msg = errorBody?.error?.message;

    if (res.status === 401) throw new Error('Chave OpenAI inválida ou expirada.');
    if (res.status === 404) throw new Error(msg ?? 'Recurso não encontrado na OpenAI.');
    if (res.status === 429) throw new Error('Limite de requisições excedido. Tente novamente em alguns segundos.');
    throw new Error(msg ?? `Erro da OpenAI (${res.status}).`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ── Assistentes ───────────────────────────────────────────────

export async function listarAssistentes(
  apiKey: string,
  params?: { limit?: number; after?: string },
): Promise<{ data: Assistant[]; has_more: boolean }> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.after) query.set('after', params.after);
  const qs = query.toString();
  return openaiRequest(apiKey, 'GET', `/assistants${qs ? `?${qs}` : ''}`);
}

export async function obterAssistente(apiKey: string, id: string): Promise<Assistant> {
  return openaiRequest(apiKey, 'GET', `/assistants/${id}`);
}

export async function criarAssistente(apiKey: string, payload: CreateAssistantPayload): Promise<Assistant> {
  return openaiRequest(apiKey, 'POST', '/assistants', payload);
}

export async function atualizarAssistente(
  apiKey: string,
  id: string,
  payload: UpdateAssistantPayload,
): Promise<Assistant> {
  return openaiRequest(apiKey, 'POST', `/assistants/${id}`, payload);
}

export async function deletarAssistente(apiKey: string, id: string): Promise<void> {
  await openaiRequest(apiKey, 'DELETE', `/assistants/${id}`);
}

// ── Vector Stores ─────────────────────────────────────────────

export async function listarVectorStores(
  apiKey: string,
): Promise<{ data: VectorStore[]; has_more: boolean }> {
  return openaiRequest(apiKey, 'GET', '/vector_stores');
}

export async function criarVectorStore(
  apiKey: string,
  payload: { name: string; file_ids?: string[] },
): Promise<VectorStore> {
  return openaiRequest(apiKey, 'POST', '/vector_stores', payload);
}

export async function deletarVectorStore(apiKey: string, id: string): Promise<void> {
  await openaiRequest(apiKey, 'DELETE', `/vector_stores/${id}`);
}

// ── Ficheiros em Vector Stores ────────────────────────────────

export async function listarArquivosVectorStore(
  apiKey: string,
  vsId: string,
): Promise<{ data: VectorStoreFile[]; has_more: boolean }> {
  return openaiRequest(apiKey, 'GET', `/vector_stores/${vsId}/files`);
}

export async function adicionarArquivoVectorStore(
  apiKey: string,
  vsId: string,
  fileId: string,
): Promise<VectorStoreFile> {
  return openaiRequest(apiKey, 'POST', `/vector_stores/${vsId}/files`, { file_id: fileId });
}

export async function removerArquivoVectorStore(
  apiKey: string,
  vsId: string,
  fileId: string,
): Promise<void> {
  await openaiRequest(apiKey, 'DELETE', `/vector_stores/${vsId}/files/${fileId}`);
}

// ── Upload de ficheiros ───────────────────────────────────────

export async function enviarArquivo(apiKey: string, file: File): Promise<OpenAIFile> {
  const form = new FormData();
  form.append('file', file);
  form.append('purpose', 'assistants');
  return openaiRequest(apiKey, 'POST', '/files', form);
}

export async function obterArquivo(apiKey: string, fileId: string): Promise<OpenAIFile> {
  return openaiRequest(apiKey, 'GET', `/files/${fileId}`);
}

export async function deletarArquivo(apiKey: string, fileId: string): Promise<void> {
  await openaiRequest(apiKey, 'DELETE', `/files/${fileId}`);
}
