'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { criarMentora, atualizarMentora, toggleAtivoMentora, getMentoraById, atualizarDnsConfig } from '@/lib/db/admin';
import { adicionarDominio, removerDominio, verificarDominio } from '@/lib/vercel-domains';
import { validarChaveOpenAI, notificarWebhookCriacao } from '@/lib/openai';
import type { DnsRegistro } from '@/types/mentora';

export type ActionResult = {
  sucesso: boolean;
  erro?: string;
};

// ── Auth actions (keep redirects) ──────────────────────────────

export async function loginAction(_prevState: { erro: string } | null, formData: FormData) {
  const senha = formData.get('senha') as string;
  if (senha !== process.env.ADMIN_PASSWORD) {
    return { erro: 'Senha incorreta' };
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

// ── Fetch single mentora (for Sheet) ───────────────────────────

export async function getMentoraAction(id: string): Promise<import('@/types/mentora').Mentora | null> {
  const mentora = await getMentoraById(id);
  if (!mentora) return null;
  // Mascarar a API key — enviar apenas os últimos 4 caracteres para o client
  if (mentora.openaiApiKey) {
    mentora.openaiApiKey = `sk-...${mentora.openaiApiKey.slice(-4)}`;
  }
  return mentora;
}

// ── CRUD actions (return ActionResult, no redirect) ────────────

export async function criarMentoraAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const dados = extrairDadosFormulario(formData);

    if (dados.openaiApiKey) {
      const chaveValida = await validarChaveOpenAI(dados.openaiApiKey);
      if (!chaveValida) return { sucesso: false, erro: 'Chave OpenAI inválida' };
    }

    if (dados.dominioCustom) {
      const resultado = await adicionarDominio(dados.dominioCustom);
      if (resultado.sucesso) {
        dados.dominioDnsRegistros = resultado.registros;
        dados.dominioVerificado = resultado.verificado;
      }
    }

    const row = await criarMentora(dados);

    if (dados.openaiApiKey) {
      await notificarWebhookCriacao(row.id);
    }

    revalidatePath('/admin');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao criar mentora' };
  }
}

export async function atualizarMentoraAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = formData.get('id') as string;
    if (!id) return { sucesso: false, erro: 'ID em falta' };

    const dados = extrairDadosFormulario(formData);

    const mentoraAtual = await getMentoraById(id);

    // Se o campo da chave veio vazio, manter a chave atual
    if (!dados.openaiApiKey && mentoraAtual?.openaiApiKey) {
      dados.openaiApiKey = mentoraAtual.openaiApiKey;
    }

    const dominioAntigo = mentoraAtual?.dominioCustom ?? null;
    const dominioNovo = dados.dominioCustom;
    const chaveMudou = dados.openaiApiKey && dados.openaiApiKey !== mentoraAtual?.openaiApiKey;

    if (chaveMudou) {
      const chaveValida = await validarChaveOpenAI(dados.openaiApiKey!);
      if (!chaveValida) return { sucesso: false, erro: 'Chave OpenAI inválida' };
    }

    dados.dominioDnsRegistros = [];
    dados.dominioVerificado = false;

    if (dominioAntigo !== dominioNovo) {
      if (dominioAntigo) {
        await removerDominio(dominioAntigo);
      }
      if (dominioNovo) {
        const resultado = await adicionarDominio(dominioNovo);
        if (resultado.sucesso) {
          dados.dominioDnsRegistros = resultado.registros;
          dados.dominioVerificado = resultado.verificado;
        }
      }
    } else if (dominioNovo && mentoraAtual) {
      dados.dominioDnsRegistros = mentoraAtual.dominioDnsRegistros;
      dados.dominioVerificado = mentoraAtual.dominioVerificado;
    }

    await atualizarMentora(id, dados);

    if (chaveMudou) {
      await notificarWebhookCriacao(id);
    }

    revalidatePath('/admin');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao atualizar mentora' };
  }
}

export async function verificarDominioAction(id: string): Promise<ActionResult> {
  try {
    const mentora = await getMentoraById(id);
    if (!mentora?.dominioCustom) return { sucesso: false, erro: 'Sem domínio custom' };

    const config = await verificarDominio(mentora.dominioCustom);
    await atualizarDnsConfig(id, {
      registros: config.registros,
      verificado: config.verificado,
    });

    revalidatePath('/admin');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao verificar domínio' };
  }
}

export async function toggleAtivoAction(id: string, ativo: boolean): Promise<ActionResult> {
  try {
    await toggleAtivoMentora(id, ativo);
    revalidatePath('/admin');
    return { sucesso: true };
  } catch (e) {
    return { sucesso: false, erro: e instanceof Error ? e.message : 'Erro ao alterar estado' };
  }
}

// ── Helper ─────────────────────────────────────────────────────

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
    dominioCustom: (formData.get('dominio_custom') as string) || null,
    dominioDnsRegistros: [] as DnsRegistro[],
    dominioVerificado: false,
    openaiApiKey: (formData.get('openai_api_key') as string) || null,
    promptExtra: (formData.get('prompt_extra') as string) || null,
    fotoCircular: formData.get('foto_circular') === 'true',
    ativo: formData.get('ativo') === 'true',
    authUserId: (formData.get('auth_user_id') as string) || null,
  };
}
