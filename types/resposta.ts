import type { TestResult } from '@/lib/types';

export type RespostaStatus = 'pendente' | 'processando' | 'concluido' | 'erro';

export interface Resposta {
  id: string;
  mentoraId: string;
  nome: string;
  email: string;
  celular: string | null;
  scores: TestResult;
  camposExtras: Record<string, string>;
  respostasBrutas: Record<number, number> | null;
  relatorioHtml: string | null;
  analiseAi: string | null;
  status: RespostaStatus;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface RespostaResumo {
  id: string;
  nome: string;
  email: string;
  status: RespostaStatus;
  criadoEm: Date;
}
