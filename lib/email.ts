// ============================================================
// Strutura Email Gateway — cliente HTTP
// ============================================================
// Envia email transacional via o gateway central (Resend por trás).
// Ver email-gateway.md. Server-to-server apenas — NUNCA no browser.
// ============================================================

const GATEWAY_URL = 'https://email.strutura.ai/send';

export interface SendEmailInput {
  to: string;
  fromName: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[]; // content em base64
}

export async function sendEmail(input: SendEmailInput): Promise<{ id: string }> {
  const apiKey = process.env.EMAIL_GATEWAY_KEY;
  if (!apiKey) throw new Error('EMAIL_GATEWAY_KEY não configurada');

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(`Email gateway falhou (${res.status}): ${JSON.stringify(json)}`);
  }

  return { id: (json as { id: string }).id };
}

/**
 * Retry com backoff exponencial em 5xx/429. Sem retry em 4xx (erro de payload/auth).
 */
export async function sendEmailWithRetry(
  input: SendEmailInput,
  maxAttempts = 4,
): Promise<{ id: string }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await sendEmail(input);
    } catch (err) {
      const isLast = attempt === maxAttempts;
      const msg = String(err);
      const retryable = msg.includes('(5') || msg.includes('(429');

      if (!retryable || isLast) throw err;

      const delayMs = 500 * 2 ** (attempt - 1); // 500, 1000, 2000, 4000
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('unreachable');
}
