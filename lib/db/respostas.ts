import { pool } from './client';
import type { Resposta, RespostaResumo, RespostaStatus } from '@/types/resposta';
import type { TestResult } from '@/lib/types';

function mapRow(row: Record<string, unknown>): Resposta {
  return {
    id: row.id as string,
    mentoraId: row.mentora_id as string,
    nome: row.nome as string,
    email: row.email as string,
    celular: row.celular as string | null,
    scores: row.scores as TestResult,
    camposExtras: (row.campos_extras as Record<string, string>) ?? {},
    respostasBrutas: row.respostas_brutas as Record<number, number> | null,
    relatorioHtml: row.relatorio_html as string | null,
    analiseAi: row.analise_ai as string | null,
    status: row.status as RespostaStatus,
    criadoEm: new Date(row.criado_em as string),
    atualizadoEm: new Date(row.atualizado_em as string),
  };
}

function mapResumoRow(row: Record<string, unknown>): RespostaResumo {
  return {
    id: row.id as string,
    nome: row.nome as string,
    email: row.email as string,
    status: row.status as RespostaStatus,
    criadoEm: new Date(row.criado_em as string),
  };
}

export async function criarResposta(data: {
  mentoraId: string;
  nome: string;
  email: string;
  celular?: string | null;
  scores: TestResult;
  camposExtras?: Record<string, string>;
  respostasBrutas?: Record<number, number> | null;
}): Promise<Resposta> {
  const { rows } = await pool.query(
    `INSERT INTO respostas (mentora_id, nome, email, celular, scores, campos_extras, respostas_brutas)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.mentoraId,
      data.nome,
      data.email,
      data.celular ?? null,
      JSON.stringify(data.scores),
      JSON.stringify(data.camposExtras ?? {}),
      data.respostasBrutas ? JSON.stringify(data.respostasBrutas) : null,
    ],
  );
  return mapRow(rows[0]);
}

export async function getRespostaById(id: string, mentoraId: string): Promise<Resposta | null> {
  const { rows } = await pool.query(
    'SELECT * FROM respostas WHERE id = $1 AND mentora_id = $2 LIMIT 1',
    [id, mentoraId],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getRespostasByMentora(
  mentoraId: string,
  opts: { page?: number; pageSize?: number; search?: string } = {},
): Promise<{ data: RespostaResumo[]; total: number }> {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let whereClause = 'WHERE mentora_id = $1';
  const params: unknown[] = [mentoraId];

  if (opts.search?.trim()) {
    whereClause += ' AND (nome ILIKE $2 OR email ILIKE $2)';
    params.push(`%${opts.search.trim()}%`);
  }

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM respostas ${whereClause}`,
    params,
  );
  const total = parseInt(countResult.rows[0].count as string, 10);

  const dataParams = [...params, pageSize, offset];
  const dataResult = await pool.query(
    `SELECT id, nome, email, status, criado_em
     FROM respostas ${whereClause}
     ORDER BY criado_em DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams,
  );

  return {
    data: dataResult.rows.map(mapResumoRow),
    total,
  };
}

export async function atualizarRelatorio(
  id: string,
  relatorioHtml: string,
  status: RespostaStatus,
): Promise<void> {
  await pool.query(
    'UPDATE respostas SET relatorio_html = $2, status = $3 WHERE id = $1',
    [id, relatorioHtml, status],
  );
}

export async function apagarResposta(id: string, mentoraId: string): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM respostas WHERE id = $1 AND mentora_id = $2',
    [id, mentoraId],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function contarRespostasPorMentora(mentoraId: string): Promise<number> {
  const { rows } = await pool.query(
    'SELECT COUNT(*) FROM respostas WHERE mentora_id = $1',
    [mentoraId],
  );
  return parseInt(rows[0].count as string, 10);
}

export async function contarRespostasEsteMes(mentoraId: string): Promise<number> {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM respostas
     WHERE mentora_id = $1 AND criado_em >= date_trunc('month', CURRENT_DATE)`,
    [mentoraId],
  );
  return parseInt(rows[0].count as string, 10);
}

export async function getUltimaResposta(mentoraId: string): Promise<RespostaResumo | null> {
  const { rows } = await pool.query(
    `SELECT id, nome, email, status, criado_em
     FROM respostas WHERE mentora_id = $1
     ORDER BY criado_em DESC LIMIT 1`,
    [mentoraId],
  );
  return rows[0] ? mapResumoRow(rows[0]) : null;
}
