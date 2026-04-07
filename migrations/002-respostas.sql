-- Migration: Create respostas table for storing test submissions
CREATE TABLE respostas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentora_id      UUID NOT NULL REFERENCES mentoras(id) ON DELETE CASCADE,
  nome            TEXT NOT NULL,
  email           TEXT NOT NULL,
  celular         TEXT,
  scores          JSONB NOT NULL,
  campos_extras   JSONB NOT NULL DEFAULT '{}'::jsonb,
  respostas_brutas JSONB,
  relatorio_html  TEXT,
  status          TEXT NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente', 'processando', 'concluido', 'erro')),
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_respostas_mentora_id ON respostas (mentora_id);
CREATE INDEX idx_respostas_email      ON respostas (email);
CREATE INDEX idx_respostas_status     ON respostas (status);
CREATE INDEX idx_respostas_criado_em  ON respostas (criado_em DESC);

CREATE TRIGGER trg_respostas_atualizado_em
BEFORE UPDATE ON respostas
FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
