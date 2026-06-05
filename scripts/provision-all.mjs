// ============================================================
// Aprovisiona o RAG (vector store) de todas as mentoras com chave OpenAI.
// Replica lib/report/provisioning.ts para uso fora do app (one-off / manutenção).
//
//   node --env-file=.env scripts/provision-all.mjs
//
// Idempotente: remove recursos antigos antes de recriar.
// Nunca imprime as chaves.
// ============================================================

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

const BASE = 'https://api.openai.com/v1';

async function openai(apiKey, method, p, body) {
  const headers = { Authorization: `Bearer ${apiKey}`, 'OpenAI-Beta': 'assistants=v2' };
  let fetchBody;
  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${p}`, { method, headers, body: fetchBody });
  if (!res.ok) {
    const e = await res.json().catch(() => null);
    if (res.status === 401) throw new Error('chave OpenAI inválida ou expirada');
    throw new Error(e?.error?.message || `OpenAI ${res.status}`);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

async function provision(mentora, md) {
  const apiKey = mentora.openai_api_key;

  // idempotência
  if (mentora.vector_store_id) {
    try { await openai(apiKey, 'DELETE', `/vector_stores/${mentora.vector_store_id}`); } catch {}
  }
  if (mentora.knowledge_file_id) {
    try { await openai(apiKey, 'DELETE', `/files/${mentora.knowledge_file_id}`); } catch {}
  }

  const form = new FormData();
  form.append('file', new File([md], 'knowledge-base-big-five.md', { type: 'text/markdown' }));
  form.append('purpose', 'assistants');
  const uploaded = await openai(apiKey, 'POST', '/files', form);

  const vs = await openai(apiKey, 'POST', '/vector_stores', { name: `B5 — ${mentora.slug}` });
  await openai(apiKey, 'POST', `/vector_stores/${vs.id}/files`, { file_id: uploaded.id });

  // espera de indexação (~1.5s × 20)
  let ok = false;
  for (let i = 0; i < 20; i++) {
    const r = await openai(apiKey, 'GET', `/vector_stores/${vs.id}/files`);
    const f = r.data?.[0];
    if (f?.status === 'completed') { ok = true; break; }
    if (f?.status === 'failed' || f?.status === 'cancelled') throw new Error('indexação falhou');
    await new Promise((res) => setTimeout(res, 1500));
  }
  if (!ok) throw new Error('timeout de indexação');

  await pool.query(
    'UPDATE mentoras SET vector_store_id=$2, knowledge_file_id=$3, atualizado_em=NOW() WHERE id=$1',
    [mentora.id, vs.id, uploaded.id],
  );
  return vs.id;
}

const md = await readFile(path.join(process.cwd(), 'data', 'knowledge-base-big-five.md'), 'utf8');
const { rows } = await pool.query(
  `SELECT id, slug, nome, openai_api_key, vector_store_id, knowledge_file_id
   FROM mentoras WHERE openai_api_key IS NOT NULL AND ativo = TRUE ORDER BY criado_em`,
);

console.log(`Mentoras com chave OpenAI: ${rows.length}\n`);
for (const m of rows) {
  process.stdout.write(`→ ${m.slug.padEnd(28)} `);
  try {
    const vsId = await provision(m, md);
    console.log(`OK  ${vsId}`);
  } catch (e) {
    console.log(`ERRO: ${e.message}`);
  }
}
await pool.end();
console.log('\nConcluído.');
