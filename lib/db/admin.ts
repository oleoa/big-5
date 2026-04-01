import { pool } from './client';
import { Mentora, DnsRegistro } from '@/types/mentora';
import { verificarDominio } from '@/lib/vercel-domains';

export async function listarMentoras() {
  const { rows } = await pool.query(
    'SELECT id, slug, nome, email, ativo, criado_em, dominio_custom, dominio_dns_registros, dominio_verificado FROM mentoras ORDER BY criado_em DESC'
  );
  return rows;
}

export async function getMentoraById(id: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    'SELECT * FROM mentoras WHERE id = $1 LIMIT 1',
    [id]
  );
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    id: row.id,
    slug: row.slug,
    dominioCustom: row.dominio_custom,
    dominioDnsRegistros: row.dominio_dns_registros ?? [],
    dominioVerificado: row.dominio_verificado ?? false,
    nome: row.nome,
    email: row.email,
    logoPrincipalUrl: row.logo_principal_url,
    logoSecundariaUrl: row.logo_secundaria_url,
    logoIconeUrl: row.logo_icone_url,
    corPrimaria: row.cor_primaria,
    corFundo: row.cor_fundo,
    corTexto: row.cor_texto,
    titulo: row.titulo,
    subtitulo: row.subtitulo,
    textoBotao: row.texto_botao,
    perguntasExtras: row.perguntas_extras,
    opcoesResposta: row.opcoes_resposta,
    tituloObrigado: row.titulo_obrigado,
    textoObrigado: row.texto_obrigado,
    openaiApiKey: row.openai_api_key,
    promptExtra: row.prompt_extra,
    ativo: row.ativo,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

export async function criarMentora(dados: Partial<Mentora>) {
  const { rows } = await pool.query(
    `INSERT INTO mentoras (slug, nome, email, titulo, subtitulo, texto_botao,
      cor_primaria, cor_fundo, cor_texto,
      logo_principal_url, logo_secundaria_url, logo_icone_url,
      titulo_obrigado, texto_obrigado,
      opcoes_resposta, perguntas_extras,
      dominio_custom,
      openai_api_key, prompt_extra,
      dominio_dns_registros, dominio_verificado)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
     RETURNING *`,
    [
      dados.slug, dados.nome, dados.email,
      dados.titulo ?? 'Descubra a Sua Personalidade',
      dados.subtitulo ?? 'Um questionário científico de 120 perguntas baseado no modelo Big Five.',
      dados.textoBotao ?? 'Iniciar teste',
      dados.corPrimaria ?? '#6366f1',
      dados.corFundo ?? '#ffffff',
      dados.corTexto ?? '#111827',
      dados.logoPrincipalUrl ?? null,
      dados.logoSecundariaUrl ?? null,
      dados.logoIconeUrl ?? null,
      dados.tituloObrigado ?? 'Obrigado!',
      dados.textoObrigado ?? 'As suas respostas foram enviadas. Receberá a análise em breve.',
      JSON.stringify(dados.opcoesResposta ?? ['Discordo totalmente','Discordo','Neutro','Concordo','Concordo totalmente']),
      JSON.stringify(dados.perguntasExtras ?? []),
      dados.dominioCustom ?? null,
      dados.openaiApiKey ?? null,
      dados.promptExtra ?? null,
      JSON.stringify(dados.dominioDnsRegistros ?? []),
      dados.dominioVerificado ?? false,
    ]
  );
  return rows[0];
}

export async function atualizarMentora(id: string, dados: Partial<Mentora>) {
  const { rows } = await pool.query(
    `UPDATE mentoras SET
      slug = COALESCE($2, slug),
      nome = COALESCE($3, nome),
      email = COALESCE($4, email),
      titulo = COALESCE($5, titulo),
      subtitulo = COALESCE($6, subtitulo),
      texto_botao = COALESCE($7, texto_botao),
      cor_primaria = COALESCE($8, cor_primaria),
      cor_fundo = COALESCE($9, cor_fundo),
      cor_texto = COALESCE($10, cor_texto),
      logo_principal_url = $11,
      logo_secundaria_url = $12,
      logo_icone_url = $13,
      titulo_obrigado = COALESCE($14, titulo_obrigado),
      texto_obrigado = COALESCE($15, texto_obrigado),
      opcoes_resposta = COALESCE($16, opcoes_resposta),
      perguntas_extras = COALESCE($17, perguntas_extras),
      dominio_custom = $18,
      openai_api_key = $19,
      prompt_extra = $20,
      ativo = COALESCE($21, ativo),
      dominio_dns_registros = $22,
      dominio_verificado = $23,
      atualizado_em = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      id,
      dados.slug, dados.nome, dados.email,
      dados.titulo, dados.subtitulo, dados.textoBotao,
      dados.corPrimaria, dados.corFundo, dados.corTexto,
      dados.logoPrincipalUrl ?? null,
      dados.logoSecundariaUrl ?? null,
      dados.logoIconeUrl ?? null,
      dados.tituloObrigado, dados.textoObrigado,
      dados.opcoesResposta ? JSON.stringify(dados.opcoesResposta) : null,
      dados.perguntasExtras ? JSON.stringify(dados.perguntasExtras) : null,
      dados.dominioCustom ?? null,
      dados.openaiApiKey ?? null,
      dados.promptExtra ?? null,
      dados.ativo,
      JSON.stringify(dados.dominioDnsRegistros ?? []),
      dados.dominioVerificado ?? false,
    ]
  );
  return rows[0];
}

export async function atualizarDnsConfig(id: string, config: { registros: DnsRegistro[]; verificado: boolean }) {
  await pool.query(
    `UPDATE mentoras SET
      dominio_dns_registros = $2,
      dominio_verificado = $3,
      atualizado_em = NOW()
    WHERE id = $1`,
    [id, JSON.stringify(config.registros), config.verificado]
  );
}

export async function verificarTodosDominios() {
  const { rows } = await pool.query(
    'SELECT id, dominio_custom, dominio_dns_registros, dominio_verificado FROM mentoras WHERE dominio_custom IS NOT NULL'
  );

  await Promise.all(
    rows.map(async (row) => {
      try {
        const config = await verificarDominio(row.dominio_custom);
        const registosAtuais = row.dominio_dns_registros ?? [];
        const mudou = config.verificado !== row.dominio_verificado || registosAtuais.length === 0;
        if (mudou) {
          await atualizarDnsConfig(row.id, {
            registros: config.registros,
            verificado: config.verificado,
          });
        }
      } catch {
        // Silenciar erros individuais para não bloquear o carregamento da página
      }
    })
  );
}

export async function toggleAtivoMentora(id: string, ativo: boolean) {
  await pool.query('UPDATE mentoras SET ativo = $2, atualizado_em = NOW() WHERE id = $1', [id, ativo]);
}
