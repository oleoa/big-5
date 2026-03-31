# CLAUDE.md — Big Five Estrutura AI (big5.estrutura.ai)

## Visão Geral

Plataforma multi-tenant de testes de personalidade Big Five (IPIP-NEO-120).
Cada mentora tem a sua própria página personalizada acessível de três formas diferentes.
**Não há autenticação de mentoras** — toda a gestão é feita directamente na base de dados pelo administrador.

---

## Stack

- **Framework**: Next.js 14+ com App Router
- **Linguagem**: TypeScript estrito
- **Styling**: Tailwind CSS
- **Base de dados**: PostgreSQL (Railway ou Neon) via `pg`
- **Automação / IA**: n8n self-hosted + OpenAI Assistants API
- **Hosting**: Vercel

---

## Três formas de aceder à página de uma mentora

| URL                                 | Como funciona                                                     |
| ----------------------------------- | ----------------------------------------------------------------- |
| `big5.estrutura.ai/valquiria-abreu` | Rota dinâmica `[slug]` — sempre disponível                        |
| `valquiria.big5.estrutura.ai`       | Wildcard DNS → middleware resolve pelo campo `subdominio`         |
| `bigfive.valquiriaabreu.com`        | CNAME da mentora → middleware resolve pelo campo `dominio_custom` |

O parâmetro de rota chama-se `slug` (não `slug`) para ficar mais legível no código.

---

## Schema da Base de Dados

```sql
CREATE TABLE mentoras (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT UNIQUE NOT NULL,
  subdominio          TEXT UNIQUE,
  dominio_custom      TEXT UNIQUE,
  nome                TEXT NOT NULL,
  email               TEXT NOT NULL,
  titulo              TEXT NOT NULL DEFAULT 'Descubra a Sua Personalidade',
  subtitulo           TEXT NOT NULL DEFAULT 'Um questionário científico de 120 perguntas baseado no modelo Big Five.',
  logo_principal_url  TEXT,
  logo_secundaria_url TEXT,
  logo_icone_url      TEXT,
  cor_primaria        TEXT NOT NULL DEFAULT '#6366f1',
  cor_fundo           TEXT NOT NULL DEFAULT '#ffffff',
  cor_texto           TEXT NOT NULL DEFAULT '#111827',
  texto_botao         TEXT NOT NULL DEFAULT 'Iniciar teste',
  opcoes_resposta     JSONB NOT NULL DEFAULT '["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]'::jsonb,
  titulo_obrigado     TEXT NOT NULL DEFAULT 'Obrigado!',
  texto_obrigado      TEXT NOT NULL DEFAULT 'As suas respostas foram enviadas. Receberá a análise em breve.',
  openai_api_key      TEXT,
  prompt_extra        TEXT,
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tipo TypeScript

```typescript
// types/mentora.ts
export interface Mentora {
  id: string;
  slug: string;
  subdominio: string | null;
  dominioCustom: string | null;
  nome: string;
  email: string;
  titulo: string;
  subtitulo: string;
  logoPrincipalUrl:  string | null;
  logoSecundariaUrl: string | null;
  logoIconeUrl:      string | null;
  corPrimaria:    string;
  corFundo:       string;
  corTexto:       string;
  textoBotao:     string;
  opcoesResposta: [string, string, string, string, string];
  tituloObrigado: string;
  textoObrigado:  string;
  openaiApiKey:   string | null;
  promptExtra:    string | null;
  ativo:          boolean;
  criadoEm:       Date;
  atualizadoEm:   Date;
}
```

### Regra de uso dos logos

| Campo              | Onde é usado                 |
| ------------------ | ---------------------------- |
| `logoPrincipalUrl` | Landing page e página obrigado |
| `logoSecundariaUrl`| Formulário e perguntas do teste |
| `logoIconeUrl`     | Reservado (uso futuro)       |

### Opções de resposta

`opcoesResposta` é um array JSONB de exactamente 5 strings. O índice + 1 corresponde ao valor enviado para o scoring (1–5). O scoring em si não muda — só os labels apresentados ao utilizador mudam.

---

## lib/db/mentoras.ts

```typescript
import { pool } from "./client";
import { Mentora } from "@/types/mentora";

function mapRow(row: Record<string, unknown>): Mentora {
  return {
    id: row.id as string,
    slug: row.slug as string,
    subdominio: row.subdominio as string | null,
    dominioCustom: row.dominio_custom as string | null,
    nome: row.nome as string,
    email: row.email as string,
    titulo: row.titulo as string,
    subtitulo: row.subtitulo as string,
    logoPrincipalUrl: row.logo_principal_url as string | null,
    logoSecundariaUrl: row.logo_secundaria_url as string | null,
    logoIconeUrl: row.logo_icone_url as string | null,
    corPrimaria: row.cor_primaria as string,
    corFundo: (row.cor_fundo as string) ?? '#ffffff',
    corTexto: (row.cor_texto as string) ?? '#111827',
    textoBotao: row.texto_botao as string,
    opcoesResposta: row.opcoes_resposta as [string, string, string, string, string],
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

## middleware.ts (raiz do projecto)

```typescript
import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = "big5.estrutura.ai";
const PLATFORM_HOSTS = new Set([ROOT_DOMAIN, "localhost:3000", "localhost"]);

export async function middleware(req: NextRequest) {
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
middleware.ts
app/
  [slug]/
    page.tsx              ← getMentoraBySlug(params.slug)
    questionario/
      page.tsx
    obrigado/
      page.tsx
  _subdomain/
    [sub]/
      page.tsx            ← getMentoraBySubdominio(params.sub)
      questionario/
        page.tsx
      obrigado/
        page.tsx
  _domain/
    [host]/
      page.tsx            ← getMentoraByHost(params.host)
      questionario/
        page.tsx
      obrigado/
        page.tsx
components/
  mentora/
    LandingPage.tsx       ← recebe mentora: Mentora como prop
    TesteCliente.tsx
    ObrigadoPage.tsx
    MentoraLoader.tsx
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

## Modelo de Dados do Teste (IPIP-NEO-120)

```typescript
interface Item {
  id: number;
  text: string; // português
  textEn: string;
  domain: "N" | "E" | "O" | "A" | "C";
  facet: string;
  reverse: boolean;
}
```

## Scoring (lib/scoring.ts)

1. Resposta raw: 1–5
2. Reverse: `score = 6 - rawValue`
3. Faceta: soma de 4 itens (range 4–20)
4. Domínio: soma de 6 facetas (range 24–120)
5. Percentil faceta: `((score - 4) / 16) * 100`
6. Percentil domínio: `((score - 24) / 96) * 100`
7. Nível: `< 35 → Baixo`, `35–65 → Médio`, `> 65 → Alto`

## Cores por Domínio

| Código | Domínio           | Cor       |
| ------ | ----------------- | --------- |
| N      | Neuroticismo      | `#EF4444` |
| E      | Extroversão       | `#F59E0B` |
| O      | Abertura          | `#8B5CF6` |
| A      | Amabilidade       | `#10B981` |
| C      | Conscienciosidade | `#3B82F6` |

## Payload para o n8n

```typescript
interface ResultadosPayload {
  mentora: {
    nome: string;
    email: string;
    openaiApiKey: string | null;
    promptExtra: string | null;
  };
  cliente: {
    nome: string;
    email: string;
    idade?: string;
    profissao?: string;
  };
  resultados: Array<{
    dominio: string;
    codigo: "N" | "E" | "O" | "A" | "C";
    percentil: number;
    pontuacao: number;
    nivel: "Baixo" | "Médio" | "Alto";
    facetas: Array<{
      nome: string;
      percentil: number;
      pontuacao: number;
      nivel: "Baixo" | "Médio" | "Alto";
    }>;
  }>;
}
```

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
- Server Components por defeito; Client Components apenas onde há interactividade (teste)
- `notFound()` para slugs inválidos ou mentoras inativas
- Sem autenticação — gestão feita directamente na BD
