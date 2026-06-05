export async function validarChaveOpenAI(apiKey: string): Promise<boolean> {
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  return res.ok;
}
