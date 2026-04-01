export async function validarChaveOpenAI(apiKey: string): Promise<boolean> {
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return res.ok;
}

export async function notificarWebhookCriacao(mentoraId: string): Promise<void> {
  await fetch('https://automations.strutura.ai/webhook/b5/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentoraId }),
  });
}
