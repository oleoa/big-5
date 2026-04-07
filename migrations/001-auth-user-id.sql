-- Migration: Add auth_user_id to mentoras for Neon Auth integration
ALTER TABLE mentoras ADD COLUMN auth_user_id TEXT UNIQUE;
CREATE INDEX idx_mentoras_auth_user_id ON mentoras (auth_user_id);
