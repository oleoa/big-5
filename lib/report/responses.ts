// ============================================================
// OpenAI Responses API — geração da análise (Parte 2)
// ============================================================
// Substitui o ciclo Assistants (threads/runs/polling) do n8n por
// UMA chamada síncrona ao endpoint /v1/responses.
//
// NOTA: NÃO enviar o header `OpenAI-Beta: assistants=v2` a /v1/responses.
// O RAG (file_search) é resolvido server-side pela própria API — não é
// preciso round-trip manual de tool results.
// ============================================================

interface ResponsesOutputContent {
  type: string;
  text?: string;
  refusal?: string;
}

interface ResponsesOutputItem {
  type: string;
  content?: ResponsesOutputContent[];
}

interface ResponsesApiResponse {
  status?: string;
  output?: ResponsesOutputItem[];
  incomplete_details?: { reason?: string } | null;
}

export interface AnaliseResult {
  text: string;
  status: string;
  refused: boolean;
}

function stripFences(text: string): string {
  return text
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export async function gerarAnaliseResponses(opts: {
  apiKey: string;
  model: string;
  instructions: string;
  input: string;
  vectorStoreId: string | null;
}): Promise<AnaliseResult> {
  const body: Record<string, unknown> = {
    model: opts.model,
    instructions: opts.instructions,
    input: opts.input,
  };

  if (opts.vectorStoreId) {
    body.tools = [
      { type: 'file_search', vector_store_ids: [opts.vectorStoreId] },
    ];
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err?.error?.message;
    if (res.status === 401) throw new Error('Chave OpenAI inválida ou expirada.');
    if (res.status === 429) throw new Error('Limite de requisições da OpenAI excedido. Tente novamente.');
    throw new Error(msg ?? `Erro da OpenAI (${res.status}).`);
  }

  const json = (await res.json()) as ResponsesApiResponse;

  let text = '';
  let refused = false;

  for (const item of json.output ?? []) {
    if (item.type !== 'message') continue; // ignora file_search_call, reasoning, etc.
    for (const part of item.content ?? []) {
      if (part.type === 'output_text') text += part.text ?? '';
      else if (part.type === 'refusal') refused = true;
    }
  }

  return {
    text: stripFences(text),
    status: json.status ?? 'unknown',
    refused,
  };
}
