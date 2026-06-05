# Strutura Email Gateway — Guia de Integração

Este documento é **autocontido**: pode ser copiado para o repo de qualquer projeto que precise enviar email via o gateway centralizado da Strutura. Serve tanto para desenvolvedores quanto para IAs (Claude, Cursor, Copilot) entenderem como integrar sem precisar olhar o repo do gateway.

> **Para IAs:** quando o usuário pedir para "enviar email", "mandar email transacional", "notificar por email" em um projeto Strutura, **use este gateway HTTP**. Não tente integrar SMTP, AWS SES, SendGrid, ou Resend diretamente — o gateway já existe e centraliza tudo.

---

## O que é

Um proxy HTTP autenticado por Bearer token que envia emails transacionais via Resend, hospedado em Cloudflare Workers. Você (consumidor) só precisa de:

1. Uma **URL base**: `https://email.strutura.ai`
2. Uma **API key** (entregue pelo mantenedor do gateway)
3. Fazer um `POST /send` com JSON

---

## Como obter uma API key

**Peça ao mantenedor do `email-gateway` (Leonardo).** Ele vai:

1. Gerar uma key aleatória de 64 chars hex (`openssl rand -hex 32`)
2. Registrar como secret `KEY_<SEU_PROJETO>` no Cloudflare Workers
3. Te entregar a key por canal seguro

Guarde a key como **secret** no seu projeto (nunca em código versionado):

| Plataforma         | Onde guardar                                                    |
| ------------------ | --------------------------------------------------------------- |
| Vercel             | Environment Variables → `EMAIL_GATEWAY_KEY`                     |
| Cloudflare Workers | `wrangler secret put EMAIL_GATEWAY_KEY`                         |
| .NET / appsettings | User Secrets ou Azure Key Vault, ler como `EmailGateway:ApiKey` |
| Node/Next local    | `.env.local` (gitignored) → `EMAIL_GATEWAY_KEY=...`             |
| Python             | variável de ambiente `EMAIL_GATEWAY_KEY`                        |

A key identifica seu projeto nos logs (formato `[<NOME_DO_PROJETO>] sent: ...`). Se vazar, peça rotação.

---

## URL base

| Ambiente                              | URL                         |
| ------------------------------------- | --------------------------- |
| Produção                              | `https://email.strutura.ai` |
| Dev local (Worker rodando localmente) | `http://localhost:8787`     |

Não há ambiente de staging separado — produção é o único endpoint público.

---

## Autenticação

Todo request a `/send` precisa do header:

```
Authorization: Bearer <SUA_API_KEY>
```

Sem esse header (ou com key inválida) → `401 Unauthorized`.

---

## Endpoint: `POST /send`

### Request

**URL:** `https://email.strutura.ai/send`
**Método:** `POST`
**Headers:**

- `Authorization: Bearer <SUA_API_KEY>` (obrigatório)
- `Content-Type: application/json` (obrigatório)

**Body (JSON):**

| Campo         | Tipo                         | Obrigatório | Descrição                                                                                                                                                                                        |
| ------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `to`          | `string`                     | ✅          | Email do destinatário. Apenas **um** destinatário por chamada — sem `cc`/`bcc`/array.                                                                                                            |
| `fromName`    | `string`                     | ✅          | Display name do remetente (ex: `"Greece Aviation"`). O domínio do From é **sempre** `noreply@strutura.ai` — você não controla. O cabeçalho final fica `"Greece Aviation <noreply@strutura.ai>"`. |
| `subject`     | `string`                     | ✅          | Assunto do email.                                                                                                                                                                                |
| `html`        | `string`                     | ✅          | HTML completo do corpo. **Não há template engine** — você renderiza antes de mandar.                                                                                                             |
| `replyTo`     | `string`                     | ❌          | Email pra responder (ex: o email do visitante que preencheu um form). Se ausente, replies vão pra `noreply@strutura.ai` (caixa não monitorada).                                                  |
| `attachments` | `Array<{filename, content}>` | ❌          | Anexos. `content` é **base64** (sem prefix `data:...;base64,`), `filename` é o nome do arquivo final (com extensão).                                                                             |

**Exemplo de body:**

```json
{
  "to": "destinatario@example.com",
  "fromName": "Greece Aviation",
  "subject": "Contact Form Submission",
  "html": "<html><body><h1>Olá</h1><p>Obrigado pelo contato.</p></body></html>",
  "replyTo": "visitante@example.com",
  "attachments": [
    { "filename": "comprovante.pdf", "content": "JVBERi0xLjQK..." }
  ]
}
```

### Respostas

| Status | Body                                                                       | Quando ocorre                                                                  |
| ------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `200`  | `{ "ok": true, "id": "<resend-id>" }`                                      | Email aceito pelo Resend. Guarde o `id` se precisar consultar status depois.   |
| `400`  | `{ "error": "Invalid JSON" }`                                              | Body não é JSON válido.                                                        |
| `400`  | `{ "error": "Missing required fields (to, fromName, subject, html)" }`     | Faltou algum dos quatro campos obrigatórios.                                   |
| `401`  | `{ "error": "Unauthorized" }`                                              | Header `Authorization` ausente, mal-formado, ou key não cadastrada.            |
| `404`  | `{ "error": "Not found" }`                                                 | Path ou método errado (só `POST /send` e `GET /healthz` existem).              |
| `502`  | `{ "error": "Upstream error", "status": <int>, "body": "<resend-error>" }` | Resend rejeitou. O campo `body` é o erro original do Resend — útil para debug. |

---

## Endpoint: `GET /healthz`

Para monitoramento/uptime checks. **Sem autenticação.**

```
GET https://email.strutura.ai/healthz
→ 200 { "ok": true }
```

---

## Exemplos

### TypeScript / fetch

```ts
type SendEmailInput = {
  to: string;
  fromName: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
};

export async function sendEmail(
  input: SendEmailInput,
): Promise<{ id: string }> {
  const apiKey = process.env.EMAIL_GATEWAY_KEY;
  if (!apiKey) throw new Error("EMAIL_GATEWAY_KEY não configurada");

  const res = await fetch("https://email.strutura.ai/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      `Email gateway falhou (${res.status}): ${JSON.stringify(json)}`,
    );
  }

  return { id: (json as { id: string }).id };
}

// Uso:
await sendEmail({
  to: "user@example.com",
  fromName: "Minha App",
  subject: "Bem-vindo",
  html: "<p>Olá!</p>",
});
```

### cURL (smoke test)

```bash
curl -X POST https://email.strutura.ai/send \
  -H "Authorization: Bearer $EMAIL_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "voce@example.com",
    "fromName": "Teste Gateway",
    "subject": "Teste",
    "html": "<p>Funciona.</p>"
  }'
```

Health check (sem auth):

```bash
curl https://email.strutura.ai/healthz
# {"ok":true}
```

### Python / requests

```python
import os
import requests

API_KEY = os.environ["EMAIL_GATEWAY_KEY"]
GATEWAY_URL = "https://email.strutura.ai/send"


def send_email(
    *,
    to: str,
    from_name: str,
    subject: str,
    html: str,
    reply_to: str | None = None,
    attachments: list[dict] | None = None,
) -> str:
    """Envia email via Strutura Email Gateway. Retorna o ID do Resend."""
    payload = {
        "to": to,
        "fromName": from_name,
        "subject": subject,
        "html": html,
    }
    if reply_to:
        payload["replyTo"] = reply_to
    if attachments:
        payload["attachments"] = attachments  # [{filename, content (base64)}]

    res = requests.post(
        GATEWAY_URL,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=15,
    )

    body = res.json()
    if not res.ok:
        raise RuntimeError(f"Email gateway falhou ({res.status_code}): {body}")

    return body["id"]


# Uso:
send_email(
    to="user@example.com",
    from_name="Minha App",
    subject="Bem-vindo",
    html="<p>Olá!</p>",
)
```

---

## Comportamento e limites

- **Sem retry automático.** Se você receber `502` ou erro de rede, é responsabilidade do consumidor fazer retry. Veja "Retry recomendado" abaixo.
- **Sem webhooks de status.** O gateway retorna o `id` do Resend mas não notifica delivered/bounced/opened. Se você precisa desses eventos, guarde o `id` e consulte direto a API do Resend (requer acordo separado com o mantenedor pra acesso à conta).
- **Sem rate limit explícito** no gateway. Rate limit efetivo vem do Resend (consulte limites do plano atual com o mantenedor) e do Cloudflare. Se você prevê rajadas grandes, sinaliza antes.
- **Sem validação de email no gateway.** Strings inválidas em `to`/`replyTo` chegam ao Resend, que pode aceitar ou rejeitar (`502` no seu lado).
- **Sem CORS.** É **server-to-server**. Não chame do browser — sua key vazaria. Sempre por trás de um endpoint do seu backend.
- **Tamanho do payload.** Não há limite documentado no gateway, mas Cloudflare Workers tem limite de 100 MB por request e Resend limita anexos a ~40 MB no total. Para anexos grandes, prefira link para storage (R2/S3) no HTML.
- **`From` é fixo no domínio `strutura.ai`.** Você customiza só o display name (`fromName`). Se precisar enviar de outro domínio, fala com o mantenedor.

---

## Retry recomendado no consumidor

```ts
async function sendEmailWithRetry(input: SendEmailInput, maxAttempts = 4) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await sendEmail(input);
    } catch (err) {
      const isLast = attempt === maxAttempts;
      const msg = String(err);
      const retryable = msg.includes("(5") || msg.includes("(429"); // 5xx ou 429

      if (!retryable || isLast) throw err;

      const delayMs = 500 * 2 ** (attempt - 1); // 500, 1000, 2000, 4000
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("unreachable");
}
```

**Não faça retry em `400` ou `401`** — são erros do payload/auth, retry não resolve.

---

## Troubleshooting

| Sintoma                                                | Causa provável                                               | O que fazer                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `401 Unauthorized`                                     | Header errado, ou key não cadastrada, ou key foi rotacionada | Confirmar que está mandando `Authorization: Bearer <key>` exato. Pedir nova key ao mantenedor.                    |
| `400 Missing required fields`                          | Faltou um de `to`, `fromName`, `subject`, `html`             | Conferir o payload — todos os 4 são obrigatórios mesmo se vazios não são aceitos.                                 |
| `400 Invalid JSON`                                     | Body não é JSON válido                                       | Confirmar `Content-Type: application/json` e que o body é JSON serializado.                                       |
| `502 Upstream error` com `body` mencionando domínio    | Domínio do From não verificado no Resend                     | Avisar mantenedor — geralmente bug de config no gateway.                                                          |
| `502 Upstream error` com `body` mencionando rate limit | Limite do plano Resend atingido                              | Aplicar backoff. Se persistir, avisar mantenedor pra upgrade de plano.                                            |
| `404 Not found`                                        | Path/método errado                                           | Só `POST /send` e `GET /healthz` existem. Confirmar que está em `POST` e em `/send` (não `/api/send` ou similar). |
| Timeout / sem resposta                                 | Worker lento ou Resend lento                                 | Timeout de 15–30s no consumidor + retry com backoff.                                                              |

---

## Resumo para IAs

Quando integrar este gateway, **siga este checklist**:

1. ✅ Ler a key de `process.env.EMAIL_GATEWAY_KEY` (ou equivalente no stack do projeto). **Nunca hardcode.**
2. ✅ `POST https://email.strutura.ai/send` com header `Authorization: Bearer <key>` e body JSON.
3. ✅ Body precisa ter exatamente esses 4 campos obrigatórios: `to`, `fromName`, `subject`, `html`. Opcionais: `replyTo`, `attachments`.
4. ✅ Tratar `200` como sucesso (guardar `id` se precisar). `4xx` é erro do payload (não retry). `5xx` faz retry com backoff exponencial.
5. ❌ **Não** integrar SMTP, SES, SendGrid, Mailgun, ou Resend direto — use só este gateway.
6. ❌ **Não** chamar do browser — é server-to-server.
7. ❌ **Não** tentar setar o domínio do `From` — só o `fromName` é configurável.
