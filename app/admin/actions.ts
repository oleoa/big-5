'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { criarMentora, atualizarMentora, toggleAtivoMentora, getMentoraById, atualizarDnsConfig } from '@/lib/db/admin';
import { adicionarDominio, removerDominio, verificarDominio } from '@/lib/vercel-domains';

export async function loginAction(_prevState: { erro: string } | null, formData: FormData) {
  const senha = formData.get('senha') as string;
  if (senha !== process.env.ADMIN_PASSWORD) {
    return { erro: 'Senha incorrecta' };
  }
  const cookieStore = await cookies();
  cookieStore.set('admin_session', process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

export async function criarMentoraAction(formData: FormData) {
  const dados = extrairDadosFormulario(formData);

  if (dados.dominioCustom) {
    const resultado = await adicionarDominio(dados.dominioCustom);
    if (resultado.sucesso) {
      dados.dominioDnsNome = resultado.dnsNome ?? null;
      dados.dominioDnsValor = resultado.dnsValor ?? null;
      dados.dominioVerificado = false;
    }
  }

  await criarMentora(dados);
  revalidatePath('/admin');
  redirect('/admin');
}

export async function atualizarMentoraAction(id: string, formData: FormData) {
  const dados = extrairDadosFormulario(formData);

  const mentoraAtual = await getMentoraById(id);
  const dominioAntigo = mentoraAtual?.dominioCustom ?? null;
  const dominioNovo = dados.dominioCustom;

  // Inicializar campos DNS
  dados.dominioDnsNome = null;
  dados.dominioDnsValor = null;
  dados.dominioVerificado = false;

  if (dominioAntigo !== dominioNovo) {
    // Remover domínio antigo da Vercel
    if (dominioAntigo) {
      await removerDominio(dominioAntigo);
    }
    // Adicionar novo domínio
    if (dominioNovo) {
      const resultado = await adicionarDominio(dominioNovo);
      if (resultado.sucesso) {
        dados.dominioDnsNome = resultado.dnsNome ?? null;
        dados.dominioDnsValor = resultado.dnsValor ?? null;
      }
    }
  } else if (dominioNovo && mentoraAtual) {
    // Domínio não mudou — preservar DNS existente
    dados.dominioDnsNome = mentoraAtual.dominioDnsNome;
    dados.dominioDnsValor = mentoraAtual.dominioDnsValor;
    dados.dominioVerificado = mentoraAtual.dominioVerificado;
  }

  await atualizarMentora(id, dados);
  revalidatePath('/admin');
  revalidatePath(`/admin/mentoras/${id}`);
  redirect('/admin');
}

export async function verificarDominioAction(id: string) {
  const mentora = await getMentoraById(id);
  if (!mentora?.dominioCustom) return;

  const config = await verificarDominio(mentora.dominioCustom);
  await atualizarDnsConfig(id, {
    dnsNome: config.dnsNome,
    dnsValor: config.dnsValor,
    verificado: config.verificado,
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/mentoras/${id}`);
}

export async function toggleAtivoAction(id: string, ativo: boolean) {
  await toggleAtivoMentora(id, ativo);
  revalidatePath('/admin');
}

function extrairDadosFormulario(formData: FormData) {
  let perguntasExtras = [];
  let opcoesResposta: [string, string, string, string, string] = ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'];
  try { perguntasExtras = JSON.parse(formData.get('perguntas_extras') as string || '[]'); } catch {}
  try { opcoesResposta = JSON.parse(formData.get('opcoes_resposta') as string || '[]'); } catch {}

  return {
    slug: formData.get('slug') as string,
    nome: formData.get('nome') as string,
    email: formData.get('email') as string,
    titulo: formData.get('titulo') as string,
    subtitulo: formData.get('subtitulo') as string,
    textoBotao: formData.get('texto_botao') as string,
    corPrimaria: formData.get('cor_primaria') as string,
    corFundo: formData.get('cor_fundo') as string,
    corTexto: formData.get('cor_texto') as string,
    logoPrincipalUrl: (formData.get('logo_principal_url') as string) || null,
    logoSecundariaUrl: (formData.get('logo_secundaria_url') as string) || null,
    logoIconeUrl: (formData.get('logo_icone_url') as string) || null,
    tituloObrigado: formData.get('titulo_obrigado') as string,
    textoObrigado: formData.get('texto_obrigado') as string,
    opcoesResposta,
    perguntasExtras,
    subdominio: (formData.get('subdominio') as string) || null,
    dominioCustom: (formData.get('dominio_custom') as string) || null,
    dominioDnsNome: null as string | null,
    dominioDnsValor: null as string | null,
    dominioVerificado: false,
    openaiApiKey: (formData.get('openai_api_key') as string) || null,
    promptExtra: (formData.get('prompt_extra') as string) || null,
    ativo: formData.get('ativo') === 'true',
  };
}
