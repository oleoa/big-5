# CLAUDE.md — Big Five Strutura AI (bigfive.strutura.ai)

## Visão Geral

Plataforma multi-tenant de testes de personalidade Big Five (IPIP-NEO-120).
Cada mentora tem a sua própria página personalizada acessível de três formas diferentes.
**Não há autenticação de mentoras** — toda a gestão é feita directamente na base de dados pelo administrador.

---

## Stack

- **Framework**: Next.js 16+ com App Router
- **Linguagem**: TypeScript estrito
- **Styling**: Tailwind CSS
- **Base de dados**: PostgreSQL (Railway ou Neon) via `pg`
- **Proxy**: `proxy.ts` na raiz (Next.js 16 — substituiu `middleware.ts`)
- **Automação / IA**: n8n self-hosted + OpenAI Assistants API
- **Hosting**: Vercel

---

## Três formas de aceder à página de uma mentora

| URL                                   | Como funciona                                                |
| ------------------------------------- | ------------------------------------------------------------ |
| `bigfive.strutura.ai/valquiria-abreu` | Rota dinâmica `[slug]` — sempre disponível                   |
| `valquiria.bigfive.strutura.ai`       | Wildcard DNS → proxy resolve pelo campo `subdominio`         |
| `bigfive.valquiriaabreu.com`          | CNAME da mentora → proxy resolve pelo campo `dominio_custom` |

O `proxy.ts` intercepta o `Host` header e faz rewrite interno para a rota correcta. O utilizador nunca vê o URL mudar.

---

## Schema da Base de Dados

```sql
CREATE TABLE mentoras (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identidade e acesso
  slug                TEXT    UNIQUE NOT NULL,
  subdominio          TEXT    UNIQUE,
  dominio_custom      TEXT    UNIQUE,

  -- Informação da mentora
  nome                TEXT    NOT NULL,
  email               TEXT    NOT NULL,

  -- Logos
  logo_principal_url  TEXT,                        -- landing page e obrigado
  logo_secundaria_url TEXT,                        -- formulário do teste
  logo_icone_url      TEXT,                        -- reservado

  -- Personalização visual
  cor_primaria        TEXT    NOT NULL DEFAULT '#6366f1',
  cor_fundo           TEXT    NOT NULL DEFAULT '#ffffff',
  cor_texto           TEXT    NOT NULL DEFAULT '#111827',

  -- Personalização da landing page
  titulo              TEXT    NOT NULL DEFAULT 'Descubra a Sua Personalidade',
  subtitulo           TEXT    NOT NULL DEFAULT 'Um questionário científico de 120 perguntas baseado no modelo Big Five.',
  texto_botao         TEXT    NOT NULL DEFAULT 'Iniciar teste',

  -- Perguntas pessoais do formulário
  -- Nome e email são sempre obrigatórios e não estão aqui.
  -- Este campo define perguntas extra opcionais ou obrigatórias por mentora.
  perguntas_extras    JSONB   NOT NULL DEFAULT '[]'::jsonb,

  -- Personalização do formulário (opções de resposta do teste)
  opcoes_resposta     JSONB   NOT NULL DEFAULT '["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]'::jsonb,

  -- Personalização da página de obrigado
  titulo_obrigado     TEXT    NOT NULL DEFAULT 'Obrigado!',
  texto_obrigado      TEXT    NOT NULL DEFAULT 'As suas respostas foram enviadas. Receberá a análise em breve.',

  -- IA
  openai_api_key      TEXT,
  prompt_extra        TEXT,

  -- Controlo
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Tipo TypeScript

```typescript
// types/mentora.ts

export interface PerguntaExtra {
  id: string; // identificador interno (chave no state do formulário)
  label: string; // texto exibido no formulário (ex: "Qual a sua idade?")
  tipo: "text" | "number" | "textarea";
  placeholder?: string; // placeholder do campo
  obrigatorio: boolean;
  ordem: number; // ordem de exibição no formulário (0-based)
  payload?: string; // chave enviada ao webhook/IA; se vazio, usa o id
}

export interface Mentora {
  id: string;
  slug: string;
  subdominio: string | null;
  dominioCustom: string | null;
  nome: string;
  email: string;
  logoPrincipalUrl: string | null;
  logoSecundariaUrl: string | null;
  logoIconeUrl: string | null;
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  perguntasExtras: PerguntaExtra[];
  opcoesResposta: [string, string, string, string, string];
  tituloObrigado: string;
  textoObrigado: string;
  openaiApiKey: string | null;
  promptExtra: string | null;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}
```

---

## lib/db/mentoras.ts

```typescript
import { pool } from "./client";
import { Mentora, PerguntaExtra } from "@/types/mentora";

function mapRow(row: Record<string, unknown>): Mentora {
  return {
    id: row.id as string,
    slug: row.slug as string,
    subdominio: row.subdominio as string | null,
    dominioCustom: row.dominio_custom as string | null,
    nome: row.nome as string,
    email: row.email as string,
    logoPrincipalUrl: row.logo_principal_url as string | null,
    logoSecundariaUrl: row.logo_secundaria_url as string | null,
    logoIconeUrl: row.logo_icone_url as string | null,
    corPrimaria: row.cor_primaria as string,
    corFundo: row.cor_fundo as string,
    corTexto: row.cor_texto as string,
    titulo: row.titulo as string,
    subtitulo: row.subtitulo as string,
    textoBotao: row.texto_botao as string,
    perguntasExtras: row.perguntas_extras as PerguntaExtra[],
    opcoesResposta: row.opcoes_resposta as [
      string,
      string,
      string,
      string,
      string,
    ],
    tituloObrigado: row.titulo_obrigado as string,
    textoObrigado: row.texto_obrigado as string,
    openaiApiKey: row.openai_api_key as string | null,
    promptExtra: row.prompt_extra as string | null,
    ativo: row.ativo as boolean,
    criadoEm: row.criado_em as Date,
    atualizadoEm: row.atualizado_em as Date,
  };
}

export async function getMentoraBySlug(slug: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE slug = $1 AND ativo = TRUE LIMIT 1",
    [slug],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getMentoraBySubdominio(
  sub: string,
): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE subdominio = $1 AND ativo = TRUE LIMIT 1",
    [sub],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getMentoraByHost(host: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    "SELECT * FROM mentoras WHERE dominio_custom = $1 AND ativo = TRUE LIMIT 1",
    [host],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}
```

---

## proxy.ts (raiz do projecto)

```typescript
import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = "bigfive.strutura.ai";
const PLATFORM_HOSTS = new Set([ROOT_DOMAIN, "localhost:3000", "localhost"]);

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Subdomínio da plataforma → /_subdomain/[sub]/...
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "");
    const url = req.nextUrl.clone();
    url.pathname = `/_subdomain/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Domínio raiz → rotas normais [slug]
  if (PLATFORM_HOSTS.has(hostname)) {
    return NextResponse.next();
  }

  // Domínio custom da mentora → /_domain/[host]/...
  const url = req.nextUrl.clone();
  url.pathname = `/_domain/${hostname}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

## Estrutura de Ficheiros

```
proxy.ts
app/
  page.tsx                          ← landing page de marketing
  [slug]/
    page.tsx                        ← getMentoraBySlug
    questionario/page.tsx
    obrigado/page.tsx
  _subdomain/
    [sub]/
      page.tsx                      ← getMentoraBySubdominio
      questionario/page.tsx
      obrigado/page.tsx
  _domain/
    [host]/
      page.tsx                      ← getMentoraByHost
      questionario/page.tsx
      obrigado/page.tsx
  api/
    submeter/
      route.ts                      ← recebe respostas, calcula score, envia para n8n
components/
  mentora/
    LandingPage.tsx                 ← logoPrincipalUrl, corFundo, corTexto, textoBotao
    QuestionarioCliente.tsx         ← Client Component — formulário de dados + 120 perguntas
    ObrigadoPage.tsx                ← logoPrincipalUrl, tituloObrigado, textoObrigado
lib/
  db/
    client.ts
    mentoras.ts
  scoring.ts
types/
  mentora.ts
data/
  ipip-neo-120-items.json
db/
  schema.sql
```

---

## Formulário de dados pessoais

Campos fixos (sempre presentes, sempre obrigatórios):

- Nome completo
- Email
- Celular (com selector de país e formatação automática; guardado em formato E.164, ex: `+5511987654321`)

Campos dinâmicos (vêm de `mentora.perguntasExtras`):

```json
[
  { "id": "idade", "label": "Idade", "tipo": "number", "obrigatorio": false, "ordem": 0, "payload": "client_age" },
  {
    "id": "profissao",
    "label": "Profissão",
    "tipo": "text",
    "obrigatorio": false,
    "ordem": 1
  },
  {
    "id": "objetivo",
    "label": "Qual o seu objectivo",
    "tipo": "textarea",
    "obrigatorio": true,
    "ordem": 2,
    "payload": "client_goal"
  }
]
```

Se `perguntasExtras` for `[]`, o formulário mostra apenas nome e email.

---

## Payload enviado ao n8n (POST)

```typescript
{
  mentora: {
    nome:          string;
    email:         string;
    openaiApiKey:  string | null;
    promptExtra:   string | null;
  };
  cliente: {
    nome:    string;
    email:   string;
    celular: string;          // formato E.164 (ex: "+5511987654321")
    [id: string]: string;     // respostas às perguntas_extras, chave = PerguntaExtra.payload (ou .id se payload vazio)
  };
  resultados: Array<{
    dominio:    string;
    codigo:     'N' | 'E' | 'O' | 'A' | 'C';
    percentil:  number;
    pontuacao:  number;
    nivel:      'Baixo' | 'Médio' | 'Alto';
    facetas: Array<{
      nome:      string;
      percentil: number;
      pontuacao: number;
      nivel:     'Baixo' | 'Médio' | 'Alto';
    }>;
  }>;
}
```

---

## Scoring (lib/scoring.ts)

1. Resposta raw: 1–5
2. Reverse: `score = 6 - rawValue`
3. Faceta: soma de 4 itens (range 4–20)
4. Domínio: soma de 6 facetas (range 24–120)
5. Percentil faceta: `((score - 4) / 16) * 100`
6. Percentil domínio: `((score - 24) / 96) * 100`
7. Nível: `< 35 → Baixo`, `35–65 → Médio`, `> 65 → Alto`

---

## Cores por Domínio

| Código | Domínio           | Cor       |
| ------ | ----------------- | --------- |
| N      | Neuroticismo      | `#EF4444` |
| E      | Extroversão       | `#F59E0B` |
| O      | Abertura          | `#8B5CF6` |
| A      | Amabilidade       | `#10B981` |
| C      | Conscienciosidade | `#3B82F6` |

---

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://...
N8N_WEBHOOK_URL=https://...
OPENAI_API_KEY=sk-...
```

## Convenções

- UI totalmente em português
- snake_case na BD, camelCase no TypeScript
- Sem CSS modules — só Tailwind
- Server Components por defeito; Client Components apenas onde há interactividade
- `notFound()` para slugs inválidos ou mentoras inativas
- Sem autenticação — gestão feita directamente na BD
- Next.js 16: usar `proxy.ts` com `export function proxy()`, não `middleware.ts`

---

## Dashboard de Administração (/admin)

Área exclusiva do administrador (Leonardo) para gerir mentoras.
**Sem Clerk** — autenticação por senha simples guardada no `.env`.

### Autenticação

Senha guardada em `.env`:

```env
ADMIN_PASSWORD=...
```

Fluxo:

- `/admin` → redireciona para `/admin/login` se não autenticado
- Login valida contra `ADMIN_PASSWORD` e guarda cookie de sessão `admin_session`
- Cookie é um valor fixo também definido no `.env` (`ADMIN_SESSION_SECRET`)
- O `proxy.ts` protege todas as rotas `/admin/*` verificando o cookie

### Rotas do dashboard

| Rota                   | O que faz                          |
| ---------------------- | ---------------------------------- |
| `/admin/login`         | Página de login com campo de senha |
| `/admin`               | Lista de todas as mentoras         |
| `/admin/mentoras/nova` | Formulário para criar mentora      |
| `/admin/mentoras/[id]` | Formulário para editar mentora     |

### Variáveis de ambiente adicionais

```env
ADMIN_PASSWORD=escolhe-uma-senha-forte
ADMIN_SESSION_SECRET=string-aleatoria-longa
```
