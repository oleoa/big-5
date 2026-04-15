export interface PerguntaExtra {
  id: string;
  label: string;
  tipo: 'text' | 'number' | 'textarea';
  placeholder?: string;
  obrigatorio: boolean;
  ordem: number;
  falaIa?: string;
}

export interface DnsRegistro {
  type: 'CNAME' | 'A' | 'TXT';
  name: string;
  value: string;
}

export interface Mentora {
  id: string;
  authUserId: string | null;
  slug: string;
  dominioCustom: string | null;
  dominioDnsRegistros: DnsRegistro[];
  dominioVerificado: boolean;
  nome: string;
  email: string;
  titulo: string;
  subtitulo: string;
  logoPrincipalUrl: string | null;
  logoSecundariaUrl: string | null;
  logoIconeUrl: string | null;
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
  textoBotao: string;
  fotoCircular: boolean;
  opcoesResposta: [string, string, string, string, string];
  tituloObrigado: string;
  textoObrigado: string;
  perguntasExtras: PerguntaExtra[];
  openaiApiKey: string | null;
  promptExtra: string | null;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export type MentoraPublica = Omit<Mentora, 'openaiApiKey' | 'promptExtra' | 'authUserId'>;
