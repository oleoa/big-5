'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useMentora } from '@/components/painel/PainelProvider';
import { atualizarContaAction } from '@/app/painel/actions';
import { toast } from 'sonner';

export default function ContaPage() {
  const mentora = useMentora();
  const [openaiKey, setOpenaiKey] = useState(mentora.openaiApiKey ?? '');
  const [promptExtra, setPromptExtra] = useState(mentora.promptExtra ?? '');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState('');

  async function handleGuardarOpenai() {
    setSaving('openai');
    const result = await atualizarContaAction({ openaiApiKey: openaiKey });
    setSaving('');
    if (result.sucesso) {
      toast.success('Chave OpenAI guardada');
    } else {
      toast.error(result.erro ?? 'Erro ao guardar');
    }
  }

  async function handleGuardarPrompt() {
    setSaving('prompt');
    const result = await atualizarContaAction({ promptExtra });
    setSaving('');
    if (result.sucesso) {
      toast.success('Prompt guardado');
    } else {
      toast.error(result.erro ?? 'Erro ao guardar');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conta</h1>
        <p className="text-muted-foreground">Configurações da sua conta e integração com IA.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chave API OpenAI</CardTitle>
          <CardDescription>
            Necessária para a geração de relatórios personalizados com IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                type={showKey ? 'text' : 'password'}
                value={openaiKey}
                onChange={e => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={handleGuardarOpenai} disabled={saving === 'openai'}>
            {saving === 'openai' ? 'A guardar...' : 'Guardar chave'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prompt extra</CardTitle>
          <CardDescription>
            Instruções adicionais para a IA na geração dos relatórios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              value={promptExtra}
              onChange={e => setPromptExtra(e.target.value)}
              placeholder="ex: Foque-se em aspectos de liderança e trabalho em equipa. Use linguagem acessível."
              rows={4}
            />
          </div>
          <Button onClick={handleGuardarPrompt} disabled={saving === 'prompt'}>
            {saving === 'prompt' ? 'A guardar...' : 'Guardar prompt'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
