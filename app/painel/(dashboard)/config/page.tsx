'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMentora } from '@/components/painel/PainelProvider';
import { atualizarConfigAction } from '@/app/painel/actions';
import { toast } from 'sonner';

export default function ConfigPage() {
  const mentora = useMentora();
  const [saving, setSaving] = useState(false);

  const [corPrimaria, setCorPrimaria] = useState(mentora.corPrimaria);
  const [corFundo, setCorFundo] = useState(mentora.corFundo);
  const [corTexto, setCorTexto] = useState(mentora.corTexto);
  const [titulo, setTitulo] = useState(mentora.titulo);
  const [subtitulo, setSubtitulo] = useState(mentora.subtitulo);
  const [textoBotao, setTextoBotao] = useState(mentora.textoBotao);
  const [fotoCircular, setFotoCircular] = useState(mentora.fotoCircular);
  const [tituloObrigado, setTituloObrigado] = useState(mentora.tituloObrigado);
  const [textoObrigado, setTextoObrigado] = useState(mentora.textoObrigado);
  const [opcoes, setOpcoes] = useState(mentora.opcoesResposta);

  function atualizarOpcao(index: number, valor: string) {
    setOpcoes(prev => {
      const next = [...prev] as [string, string, string, string, string];
      next[index] = valor;
      return next;
    });
  }

  async function handleGuardar() {
    setSaving(true);
    const result = await atualizarConfigAction({
      corPrimaria,
      corFundo,
      corTexto,
      titulo,
      subtitulo,
      textoBotao,
      fotoCircular,
      tituloObrigado,
      textoObrigado,
      opcoesResposta: opcoes,
    });
    setSaving(false);
    if (result.sucesso) {
      toast.success('Configurações guardadas');
    } else {
      toast.error(result.erro ?? 'Erro ao guardar');
    }
  }

  const OPCAO_LABELS = [
    'Opção 1 (discordância máxima)',
    'Opção 2',
    'Opção 3 (neutro)',
    'Opção 4',
    'Opção 5 (concordância máxima)',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize a aparência e textos da sua página.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Página</CardTitle>
          <CardDescription>
            URL: bigfive.strutura.ai/{mentora.slug}
            {mentora.dominioCustom && ` | ${mentora.dominioCustom}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={mentora.slug} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">O slug não pode ser alterado aqui. Contacte o administrador.</p>
          </div>

          {mentora.dominioCustom && (
            <div className="space-y-2">
              <Label>Domínio personalizado</Label>
              <Input value={mentora.dominioCustom} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                {mentora.dominioVerificado ? '✓ DNS verificado' : '⏳ Aguardando verificação DNS'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cor primária</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={corPrimaria}
                  onChange={e => setCorPrimaria(e.target.value)}
                  className="size-10 rounded border cursor-pointer"
                />
                <Input value={corPrimaria} onChange={e => setCorPrimaria(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor de fundo</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={corFundo}
                  onChange={e => setCorFundo(e.target.value)}
                  className="size-10 rounded border cursor-pointer"
                />
                <Input value={corFundo} onChange={e => setCorFundo(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor do texto</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={corTexto}
                  onChange={e => setCorTexto(e.target.value)}
                  className="size-10 rounded border cursor-pointer"
                />
                <Input value={corTexto} onChange={e => setCorTexto(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Textos da landing page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={titulo} onChange={e => setTitulo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Textarea value={subtitulo} onChange={e => setSubtitulo(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Texto do botão</Label>
            <Input value={textoBotao} onChange={e => setTextoBotao(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Foto circular</Label>
              <p className="text-xs text-muted-foreground">Aplica formato redondo à foto principal na landing page.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={fotoCircular}
              onClick={() => setFotoCircular(!fotoCircular)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${fotoCircular ? 'bg-primary' : 'bg-input'}`}
            >
              <span className={`pointer-events-none inline-block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform ${fotoCircular ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Página de obrigado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={tituloObrigado} onChange={e => setTituloObrigado(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Texto</Label>
            <Textarea value={textoObrigado} onChange={e => setTextoObrigado(e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opções de resposta</CardTitle>
          <CardDescription>Personalize os textos da escala de 1 a 5.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {opcoes.map((opcao, i) => (
              <div key={i} className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground w-48 shrink-0">{OPCAO_LABELS[i]}</Label>
                <Input value={opcao} onChange={e => atualizarOpcao(i, e.target.value)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleGuardar} disabled={saving} size="lg">
          {saving ? 'A guardar...' : 'Guardar configurações'}
        </Button>
      </div>
    </div>
  );
}
