import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMentoraById } from '@/lib/db/admin';
import { atualizarMentoraAction, verificarDominioAction } from '../../actions';
import EditorPerguntasExtras from '@/components/admin/EditorPerguntasExtras';
import EditorOpcoesResposta from '@/components/admin/EditorOpcoesResposta';
import InputLogo from '@/components/admin/InputLogo';
import BotaoSubmeter from '@/components/admin/BotaoSubmeter';

export const dynamic = 'force-dynamic';

export default async function EditarMentoraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mentora = await getMentoraById(id);
  if (!mentora) notFound();

  const atualizarComId = atualizarMentoraAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Editar mentora — {mentora.nome}</h1>
      <form key={id} action={atualizarComId} className="space-y-8">
        <input type="hidden" name="ativo" value={String(mentora.ativo)} />

        {/* Identidade */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Identidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">Slug *</label>
              <input id="slug" name="slug" type="text" required defaultValue={mentora.slug} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
              <p className="text-xs text-muted mt-1">Ex: valquiria-abreu → será a URL /valquiria-abreu</p>
            </div>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-1">Nome *</label>
              <input id="nome" name="nome" type="text" required defaultValue={mentora.nome} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email *</label>
              <input id="email" name="email" type="email" required defaultValue={mentora.email} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="subdominio" className="block text-sm font-medium text-foreground mb-1">Subdomínio</label>
              <input id="subdominio" name="subdominio" type="text" defaultValue={mentora.subdominio ?? ''} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
              <p className="text-xs text-muted mt-1">Ex: valquiria → valquiria.bigfive.strutura.ai</p>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="dominio_custom" className="block text-sm font-medium text-foreground mb-1">Domínio custom</label>
              <input id="dominio_custom" name="dominio_custom" type="text" defaultValue={mentora.dominioCustom ?? ''} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
              <p className="text-xs text-muted mt-1">Ex: bigfive.valquiriaabreu.com</p>
            </div>
            {mentora.dominioCustom && (
              <div className="md:col-span-2 p-4 bg-surface rounded-lg border border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">Configuração DNS</h3>
                {mentora.dominioDnsNome ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-muted">Nome:</span>{' '}
                        <code className="bg-background px-1 py-0.5 rounded text-xs">{mentora.dominioDnsNome}</code>
                      </div>
                      <div>
                        <span className="text-muted">Valor:</span>{' '}
                        <code className="bg-background px-1 py-0.5 rounded text-xs">{mentora.dominioDnsValor}</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        mentora.dominioVerificado
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {mentora.dominioVerificado ? 'Verificado' : 'Aguardando configuração'}
                      </span>
                      <form action={verificarDominioAction.bind(null, mentora.id)}>
                        <button type="submit" className="text-sm text-accent hover:underline cursor-pointer">
                          Verificar DNS
                        </button>
                      </form>
                    </div>
                    <p className="text-xs text-muted mt-2">A mentora deve adicionar um registo CNAME no provedor do domínio.</p>
                  </>
                ) : (
                  <p className="text-sm text-amber-600">
                    Erro ao registar domínio na Vercel. Tente guardar novamente ou altere o domínio.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Personalização visual */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Personalização visual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="cor_primaria" className="block text-sm font-medium text-foreground mb-1">Cor primária</label>
              <input id="cor_primaria" name="cor_primaria" type="color" defaultValue={mentora.corPrimaria} className="h-10 w-full rounded border border-border cursor-pointer" />
            </div>
            <div>
              <label htmlFor="cor_fundo" className="block text-sm font-medium text-foreground mb-1">Cor de fundo</label>
              <input id="cor_fundo" name="cor_fundo" type="color" defaultValue={mentora.corFundo} className="h-10 w-full rounded border border-border cursor-pointer" />
            </div>
            <div>
              <label htmlFor="cor_texto" className="block text-sm font-medium text-foreground mb-1">Cor de texto</label>
              <input id="cor_texto" name="cor_texto" type="color" defaultValue={mentora.corTexto} className="h-10 w-full rounded border border-border cursor-pointer" />
            </div>
          </div>
        </section>

        {/* Logos */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Logos</h2>
          <div className="grid grid-cols-1 gap-4">
            <InputLogo id="logo_principal_url" name="logo_principal_url" label="Logo principal (URL)" inicial={mentora.logoPrincipalUrl ?? ''} />
            <InputLogo id="logo_secundaria_url" name="logo_secundaria_url" label="Logo secundária (URL)" inicial={mentora.logoSecundariaUrl ?? ''} />
            <InputLogo id="logo_icone_url" name="logo_icone_url" label="Ícone (URL)" inicial={mentora.logoIconeUrl ?? ''} />
          </div>
        </section>

        {/* Textos da landing page */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Textos da landing page</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-foreground mb-1">Título</label>
              <input id="titulo" name="titulo" type="text" defaultValue={mentora.titulo} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="subtitulo" className="block text-sm font-medium text-foreground mb-1">Subtítulo</label>
              <input id="subtitulo" name="subtitulo" type="text" defaultValue={mentora.subtitulo} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="texto_botao" className="block text-sm font-medium text-foreground mb-1">Texto do botão</label>
              <input id="texto_botao" name="texto_botao" type="text" defaultValue={mentora.textoBotao} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        {/* Textos da página de obrigado */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Textos da página de obrigado</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="titulo_obrigado" className="block text-sm font-medium text-foreground mb-1">Título de obrigado</label>
              <input id="titulo_obrigado" name="titulo_obrigado" type="text" defaultValue={mentora.tituloObrigado} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="texto_obrigado" className="block text-sm font-medium text-foreground mb-1">Texto de obrigado</label>
              <textarea id="texto_obrigado" name="texto_obrigado" rows={3} defaultValue={mentora.textoObrigado} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        {/* Formulário do teste */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Formulário do teste</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Opções de resposta</label>
              <EditorOpcoesResposta inicial={mentora.opcoesResposta} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Perguntas extras</label>
              <EditorPerguntasExtras inicial={mentora.perguntasExtras} />
            </div>
          </div>
        </section>

        {/* IA */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">IA</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="openai_api_key" className="block text-sm font-medium text-foreground mb-1">Chave OpenAI</label>
              <input id="openai_api_key" name="openai_api_key" type="text" defaultValue={mentora.openaiApiKey ?? ''} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="prompt_extra" className="block text-sm font-medium text-foreground mb-1">Prompt extra</label>
              <textarea id="prompt_extra" name="prompt_extra" rows={4} defaultValue={mentora.promptExtra ?? ''} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <BotaoSubmeter />
          <Link href="/admin" className="px-6 py-2 rounded-md text-sm font-medium text-muted hover:text-foreground border border-border">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
