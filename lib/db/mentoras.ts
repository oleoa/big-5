import { pool } from "./client";
import { Mentora, PerguntaExtra } from "@/types/mentora";

function mapRow(row: Record<string, unknown>): Mentora {
  return {
    id: row.id as string,
    slug: row.slug as string,
    subdominio: row.subdominio as string | null,
    dominioCustom: row.dominio_custom as string | null,
    dominioDnsNome: row.dominio_dns_nome as string | null,
    dominioDnsValor: row.dominio_dns_valor as string | null,
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

export async function getMentoraBySlug(slug: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE slug = $1 AND ativo = TRUE LIMIT 1",
    [slug],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getMentoraBySubdominio(
  sub: string,
): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE subdominio = $1 AND ativo = TRUE LIMIT 1",
    [sub],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getMentoraByHost(host: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE dominio_custom = $1 AND ativo = TRUE LIMIT 1",
    [host],
  );
  console.log("ROWS", rows);
  return rows[0] ? mapRow(rows[0]) : null;
}
