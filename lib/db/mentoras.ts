import { pool } from "./client";
import { Mentora, MentoraPublica, PerguntaExtra, DnsRegistro } from "@/types/mentora";

function mapRow(row: Record<string, unknown>): Mentora {
  return {
    id: row.id as string,
    authUserId: row.auth_user_id as string | null,
    slug: row.slug as string,
    dominioCustom: row.dominio_custom as string | null,
    dominioDnsRegistros: (row.dominio_dns_registros as DnsRegistro[]) ?? [],
    dominioVerificado: (row.dominio_verificado as boolean) ?? false,
    nome: row.nome as string,
    email: row.email as string,
    titulo: row.titulo as string,
    subtitulo: row.subtitulo as string,
    logoPrincipalUrl: row.logo_principal_url as string | null,
    logoSecundariaUrl: row.logo_secundaria_url as string | null,
    logoIconeUrl: row.logo_icone_url as string | null,
    corPrimaria: row.cor_primaria as string,
    corFundo: (row.cor_fundo as string) ?? "#ffffff",
    corTexto: (row.cor_texto as string) ?? "#111827",
    textoBotao: row.texto_botao as string,
    perguntasExtras: (row.perguntas_extras as PerguntaExtra[]) ?? [],
    opcoesResposta: row.opcoes_resposta as [
      string,
      string,
      string,
      string,
      string,
    ],
    tituloObrigado: row.titulo_obrigado as string,
    textoObrigado: row.texto_obrigado as string,
    openaiApiKey: row.openai_api_key as string | null,
    promptExtra: row.prompt_extra as string | null,
    ativo: row.ativo as boolean,
    criadoEm: row.criado_em as Date,
    atualizadoEm: row.atualizado_em as Date,
  };
}

export function sanitizeMentora(mentora: Mentora): MentoraPublica {
  const { openaiApiKey, promptExtra, authUserId, ...safe } = mentora;
  return safe;
}

export async function getMentoraBySlug(slug: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE slug = $1 AND ativo = TRUE LIMIT 1",
    [slug],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getSlugByHost(host: string): Promise<string | null> {
  const { rows } = await pool.query(
    "SELECT slug FROM mentoras WHERE dominio_custom = $1 AND ativo = TRUE LIMIT 1",
    [host],
  );
  return rows[0]?.slug ?? null;
}

export async function getMentoraByAuthUserId(authUserId: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE auth_user_id = $1 AND ativo = TRUE LIMIT 1",
    [authUserId],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}
