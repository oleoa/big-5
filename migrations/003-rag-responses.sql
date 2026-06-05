-- ============================================================
-- 003 — RAG (vector store) + Responses API migration
-- ============================================================
-- Substitui os workflows n8n (FormWebhook + CreateAssistant) por
-- geração nativa no Next.js usando a OpenAI Responses API.
--
-- mentoras:
--   vector_store_id   → ID do vector store da OpenAI (RAG, file_search)
--   knowledge_file_id → ID do ficheiro de conhecimento carregado na OpenAI
--   modelo_ia         → modelo usado na análise (default gpt-4o-mini)
-- respostas:
--   analise_ai        → texto bruto da análise (Parte 2) devolvido pela IA
-- ============================================================

ALTER TABLE respostas ADD COLUMN IF NOT EXISTS analise_ai TEXT;

ALTER TABLE mentoras  ADD COLUMN IF NOT EXISTS vector_store_id   TEXT;
ALTER TABLE mentoras  ADD COLUMN IF NOT EXISTS knowledge_file_id TEXT;
ALTER TABLE mentoras  ADD COLUMN IF NOT EXISTS modelo_ia TEXT NOT NULL DEFAULT 'gpt-4o-mini';
