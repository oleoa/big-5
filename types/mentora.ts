export interface Mentora {
  id: string;
  slug: string;
  subdominio: string | null;
  dominioCustom: string | null;
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
  opcoesResposta: [string, string, string, string, string];
  tituloObrigado: string;
  textoObrigado: string;
  openaiApiKey: string | null;
  promptExtra: string | null;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}
