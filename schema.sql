-- ============================================================
-- Big Five Estrutura AI — schema.sql
-- ============================================================

CREATE TABLE mentoras (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identidade e acesso
  slug                TEXT    UNIQUE NOT NULL,
  dominio_custom      TEXT    UNIQUE,
  dominio_dns_registros JSONB NOT NULL DEFAULT '[]'::jsonb,
  dominio_verificado  BOOLEAN NOT NULL DEFAULT FALSE,

  -- Informação da mentora
  nome                TEXT    NOT NULL,
  email               TEXT    NOT NULL,

  -- Logos
  logo_principal_url  TEXT,
  logo_secundaria_url TEXT,
  logo_icone_url      TEXT,

  -- Personalização visual
  cor_primaria        TEXT    NOT NULL DEFAULT '#6366f1',
  cor_fundo           TEXT    NOT NULL DEFAULT '#ffffff',
  cor_texto           TEXT    NOT NULL DEFAULT '#111827',

  -- Personalização da landing page
  titulo              TEXT    NOT NULL DEFAULT 'Descubra a Sua Personalidade',
  subtitulo           TEXT    NOT NULL DEFAULT 'Um questionário científico de 120 perguntas baseado no modelo Big Five.',
  texto_botao         TEXT    NOT NULL DEFAULT 'Iniciar teste',

  -- Foto circular na landing page
  foto_circular       BOOLEAN NOT NULL DEFAULT FALSE,

  -- Personalização do formulário
  opcoes_resposta     JSONB   NOT NULL DEFAULT '["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]'::jsonb,

  -- Personalização da página de obrigado
  titulo_obrigado     TEXT    NOT NULL DEFAULT 'Obrigado!',
  texto_obrigado      TEXT    NOT NULL DEFAULT 'As suas respostas foram enviadas. Receberá a análise em breve.',

  -- IA
  openai_api_key      TEXT,
  prompt_extra        TEXT,

  -- Controlo
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_mentoras_slug           ON mentoras (slug);
CREATE INDEX idx_mentoras_dominio_custom ON mentoras (dominio_custom);

-- Trigger para atualizado_em automático
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mentoras_atualizado_em
BEFORE UPDATE ON mentoras
FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- Seed de exemplo
-- INSERT INTO mentoras (slug, nome, email) VALUES ('walker-abreu', 'Walker & Abreu', 'contato@exemplo.com');