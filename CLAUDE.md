# CLAUDE.md — Big Five Strutura AI (bigfive.strutura.ai)

## Visão Geral

Plataforma multi-tenant de testes de personalidade Big Five (IPIP-NEO-120).
Cada mentora tem a sua própria página personalizada acessível de duas formas diferentes.
Cada mentora tem o seu próprio painel autenticado para gerir mentorados, relatórios, formulários e configurações.

---

## Stack

- **Framework**: Next.js 16+ com App Router
- **Linguagem**: TypeScript estrito
- **Styling**: Tailwind CSS v4 + shadcn/ui (@base-ui/react)
- **Design system**: Strutura Warm Minimal — light-only (sem dark mode), tokens em `app/globals.css`; Fraunces 500 (display, utilities `font-display`/`accent-italic`) + Inter (UI) + JetBrains Mono (dados técnicos) via next/font
- **Base de dados**: PostgreSQL (Neon) via `pg`
- **Autenticação**: Neon Auth (baseado em Better Auth) — `@neondatabase/auth`
- **Proxy**: `proxy.ts` na raiz (Next.js 16 — substituiu `middleware.ts`)
- **Automação / IA**: n8n self-hosted + OpenAI Assistants API
- **Hosting**: Vercel

---

## Design System (Strutura Warm Minimal)

O farol de design de todos os produtos Strutura, aplicado a todas as superfícies Strutura deste projeto (marketing `/`, painel, admin, auth). As páginas públicas das mentoras (`[slug]`, questionário, obrigado) herdam tipografia e forma, mas as **cores personalizadas da mentora mandam** (injetadas via `mentoraThemeStyle()` em `lib/mentora-theme.ts`).

### Paleta (tokens em `app/globals.css`)

| Papel | Token | Valor |
| --- | --- | --- |
| Fundo de página | `--background` | `#FAF7F2` (off-white quente, NUNCA branco puro) |
| Superfície (cards, inputs) | `--card` / `--surface` | `#FFFEFB` |
| Muted (sidebar, hovers) | `--muted` / `--secondary` | `#F5F1E8` |
| Subtle (hover de sidebar) | `--subtle` | `#F0EBDF` |
| Ink | `--foreground` | `#2C2820` (nunca preto absoluto) |
| Corpo / faint | `--body` / `--faint` | `#5C5448` / `#A89A7E` |
| Acento mostarda | `--primary` / `--ring` | `#C99A2D` (hover `--accent-hover` `#B58825`) |
| Mostarda em texto pequeno | `--accent-text` | `#8B6F2C` — **obrigatório para texto pequeno (WCAG AA)**, utility `text-accent-text` |
| Mostarda soft | `--accent-soft` / `--accent-border` | `#F5EFE0` / `#E8DDB8` |
| Bordas | `--border` / `--input` (strong) | `#E8E0D0` / `#D8CDB5` |

Tríades semânticas (`soft`/`text`/`border` cada): `success` `#5C7A3A`, `danger` `#B5462E` (= `--destructive`), `info` `#4A6B8B`, `warning` = mostarda. Utilities: `bg-success-soft text-success-text border-success-border`, etc. — é o padrão para badges de status.

### Forma, sombra e movimento

- Raios: `rounded-lg` = 10px (botões/inputs), `rounded-xl` = 16px (cards), `rounded-2xl` = 20px (modais), `rounded-4xl` = pill. Nunca cantos retos.
- Sombras warm RGB 44/40/32 a 4–8% (`shadow-sm/md/lg` já mapeadas) — nunca dramáticas, nunca cinza-frio.
- Motion: 150ms controles, 300ms hover de cards, ease padrão, sem bounce.
- Hover de card: `hover:border-accent-border hover:bg-muted`.

### Tipografia e voz

- `h1`/`h2` recebem Fraunces 500 automaticamente via base layer — **não usar `font-bold` em headings** (Fraunces nunca é bold; `font-bold` em utility vence o base layer e gera faux-bold).
- Utility `font-display` para números importantes/títulos fora de h1/h2; `accent-italic` para o acento itálico mostarda — **no máximo um por headline**.
- JetBrains Mono (`font-mono`) só em IDs, telefones, datas, dados técnicos.
- Voz pt-BR conversacional: "Boa tarde, *Nome*", "Mentorados no radar" (não "Total de mentorados"). Sem dashboard-speak, sem jargão corporativo.

### Regras invioláveis

- **Sem dark mode** (o bloco `.dark` foi removido; `sonner.tsx` fixa `theme="light"`). Sem branco puro em fundos, sem cinza neutro, sem emoji, sem unicode como ícone (usar Lucide, stroke 1.75), sem gradientes — exceto o glow radial mostarda a ~6% no hero do marketing.
- O slot `--accent` do shadcn é ground de hover de menus (`#F5EFE0` com tinta ink) — NÃO pôr mostarda saturada nele.
- `@theme inline` não emite vars em runtime: em CSS/JS manuscrito usar apenas vars de `:root` (`var(--primary)`), nunca `var(--color-*)`/`var(--shadow-*)`.
- Logos oficiais em `public/strutura/` (`banner.png`, `mark.png`, `mark-mustard.png`, `logo-square.png`). Não existem variantes dark — light-only.

### Defaults de novas mentoras

`#C99A2D` / `#FAF7F2` / `#2C2820` (TabAparencia, `lib/db/admin.ts`, `db/schema.sql`). **SQL pendente na base de dados** (afeta só inserts raw; o app sempre passa valores):

```sql
ALTER TABLE mentoras ALTER COLUMN cor_primaria SET DEFAULT '#C99A2D';
ALTER TABLE mentoras ALTER COLUMN cor_fundo SET DEFAULT '#FAF7F2';
ALTER TABLE mentoras ALTER COLUMN cor_texto SET DEFAULT '#2C2820';
```

---

## Autenticação — Neon Auth

A autenticação das mentoras usa **Neon Auth**, o serviço de autenticação nativo do Neon que guarda users, sessions e configuração OAuth directamente no schema `neon_auth` da mesma base de dados PostgreSQL.

### Como funciona

- Neon Auth cria e mantém automaticamente as tabelas `neon_auth.user`, `neon_auth.session`, `neon_auth.account`, etc.
- As mentoras fazem login com **email + senha** (método `signIn.email` / `signUp.email`)
- Sessões são geridas automaticamente via cookies httpOnly (`__Secure-neonauth.session_token`)
- O SDK providencia `auth.getSession()` para server components e `authClient.useSession()` para client components

### Setup

**Pacote:**

```bash
npm install @neondatabase/auth@latest
```

**Variáveis de ambiente:**

```env
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=string-de-pelo-menos-32-caracteres
```

Gerar cookie secret: `openssl rand -base64 32`

**Auth server instance — `lib/auth/server.ts`:**

```typescript
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

**Auth client — `lib/auth/client.ts`:**

```typescript
"use client";

import { createAuthClient } from "@neondatabase/auth/next";

export const authClient = createAuthClient();
```

**API route handler — `app/api/auth/[...path]/route.ts`:**

```typescript
import { auth } from "@/lib/auth/server";

export const { GET, POST } = auth.handler();
```

### Protecção de rotas no proxy.ts

O Neon Auth fornece `auth.middleware()` para proteger rotas. No nosso caso, o `proxy.ts` já faz routing de domínios custom, por isso a protecção das rotas `/painel/*` é feita dentro do proxy:

```typescript
import { auth } from "@/lib/auth/server";

// Dentro do proxy(), para rotas /painel/*:
// Usar auth.getSession() ou auth.middleware() para validar
// Redirecionar para /painel/login se não autenticado
```

### UI de Auth

Neon Auth fornece componentes React pré-construídos:

```typescript
import {
  NeonAuthUIProvider,
  UserButton,
  AuthView,
  AccountView,
} from "@neondatabase/auth/react";
```

**Importante:** Adicionar os estilos no `globals.css`:

```css
@import "tailwindcss";
@import "@neondatabase/auth/ui/tailwind";
```

### Aceder a sessão

**Server Components / Server Actions:**

```typescript
import { auth } from "@/lib/auth/server";

// DEVE ser renderizado dinamicamente
export const dynamic = "force-dynamic";

const { data: session } = await auth.getSession();
// session.user.id → UUID do user no neon_auth.user
// session.user.email → email do user
```

**Client Components:**

```typescript
"use client";
import { authClient } from "@/lib/auth/client";

const { data } = authClient.useSession();
// data?.user?.id, data?.user?.email, etc.
```

**API Routes:**

```typescript
import { auth } from "@/lib/auth/server";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }
  // ...
}
```

### Schema neon_auth (gerido automaticamente pelo Neon)

O Neon Auth cria e mantém estas tabelas no schema `neon_auth`:

```sql
-- Tabelas principais (NÃO CRIAR MANUALMENTE — o Neon gere estas)
-- neon_auth.user      → id (UUID), name, email, emailVerified, image, role, createdAt, updatedAt
-- neon_auth.session   → id, userId, token, expiresAt, ...
-- neon_auth.account   → id, userId, providerId, accountId, ...
```

### Ligação mentora ↔ neon_auth.user

A tabela `mentoras` referencia o user do Neon Auth via `auth_user_id`:

```sql
ALTER TABLE mentoras ADD COLUMN auth_user_id TEXT UNIQUE;
-- Valor = neon_auth.user.id (UUID como text)
```

Quando uma mentora faz login, o backend resolve:

```sql
SELECT * FROM mentoras WHERE auth_user_id = $1 AND ativo = true
-- $1 = session.user.id do Neon Auth
```

---

## Duas formas de aceder à página de uma mentora

| URL                                   | Como funciona                                                |
| ------------------------------------- | ------------------------------------------------------------ |
| `bigfive.strutura.ai/valquiria-abreu` | Rota dinâmica `[slug]` — sempre disponível                   |
| `bigfive.valquiriaabreu.com`          | CNAME da mentora → proxy resolve pelo campo `dominio_custom` |

O `proxy.ts` intercepta o `Host` header e faz rewrite interno para a rota correcta. O utilizador nunca vê o URL mudar.

---

## Schema da Base de Dados

### Tabela `mentoras`

```sql
CREATE TABLE mentoras (
  id                    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ligação ao Neon Auth
  auth_user_id          TEXT    UNIQUE,          -- neon_auth.user.id

  -- Identidade e acesso
  slug                  TEXT    UNIQUE NOT NULL,
  dominio_custom        TEXT    UNIQUE,
  dominio_dns_registros JSONB   NOT NULL DEFAULT '[]'::jsonb,
  dominio_verificado    BOOLEAN NOT NULL DEFAULT FALSE,

  -- Informação da mentora
  nome                  TEXT    NOT NULL,
  email                 TEXT    NOT NULL,

  -- Logos
  logo_principal_url    TEXT,
  logo_secundaria_url   TEXT,
  logo_icone_url        TEXT,

  -- Personalização visual
  cor_primaria          TEXT    NOT NULL DEFAULT '#6366f1',
  cor_fundo             TEXT    NOT NULL DEFAULT '#ffffff',
  cor_texto             TEXT    NOT NULL DEFAULT '#111827',

  -- Personalização da landing page
  titulo                TEXT    NOT NULL DEFAULT 'Descubra a Sua Personalidade',
  subtitulo             TEXT    NOT NULL DEFAULT 'Um questionário científico de 120 perguntas baseado no modelo Big Five.',
  texto_botao           TEXT    NOT NULL DEFAULT 'Iniciar teste',

  -- Perguntas pessoais do formulário
  perguntas_extras      JSONB   NOT NULL DEFAULT '[]'::jsonb,

  -- Personalização do formulário (opções de resposta do teste)
  opcoes_resposta       JSONB   NOT NULL DEFAULT '["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]'::jsonb,

  -- Personalização da página de obrigado
  titulo_obrigado       TEXT    NOT NULL DEFAULT 'Obrigado!',
  texto_obrigado        TEXT    NOT NULL DEFAULT 'As suas respostas foram enviadas. Receberá a análise em breve.',

  -- IA
  openai_api_key        TEXT,
  prompt_extra          TEXT,

  -- Controlo
  ativo                 BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mentoras_slug            ON mentoras (slug);
CREATE INDEX idx_mentoras_dominio_custom  ON mentoras (dominio_custom);
CREATE INDEX idx_mentoras_auth_user_id    ON mentoras (auth_user_id);
```

### Tabela `respostas`

```sql
CREATE TABLE respostas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentora_id        UUID NOT NULL REFERENCES mentoras(id) ON DELETE CASCADE,

  -- Dados do mentorado
  nome              TEXT NOT NULL,
  email             TEXT NOT NULL,
  celular           TEXT,

  -- Scores (JSONB)
  -- { dominios: { N: { score, percentil, nivel }, ... },
  --   facetas:  { N1: { score, percentil, nivel }, ... } }
  scores            JSONB NOT NULL,

  -- Respostas aos campos extras da mentora (JSONB)
  -- { "profissao": "Engenheiro", "maior_desafio": "Gestão de tempo" }
  campos_extras     JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Respostas brutas ao questionário (120 itens)
  -- { "1": 4, "2": 2, "3": 5, ... }
  respostas_brutas  JSONB,

  -- Relatório HTML gerado pela IA
  relatorio_html    TEXT,

  -- Status do relatório
  status            TEXT NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente', 'processando', 'concluido', 'erro')),

  -- Controlo
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_respostas_mentora_id ON respostas (mentora_id);
CREATE INDEX idx_respostas_email      ON respostas (email);
CREATE INDEX idx_respostas_status     ON respostas (status);
CREATE INDEX idx_respostas_criado_em  ON respostas (criado_em DESC);
```

### Triggers

```sql
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mentoras_atualizado_em
BEFORE UPDATE ON mentoras
FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trg_respostas_atualizado_em
BEFORE UPDATE ON respostas
FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
```

---

## Tipos TypeScript

```typescript
// types/mentora.ts

export interface PerguntaExtra {
  id: string;
  label: string;
  tipo: "text" | "number" | "textarea";
  placeholder?: string;
  obrigatorio: boolean;
  ordem: number;
  payload?: string;
  fala_ia?: string; // instrução para a IA sobre como usar este dado na análise
}

export interface DnsRegistro {
  type: "CNAME" | "A" | "TXT";
  name: string;
  value: string;
}

export interface Mentora {
  id: string;
  authUserId: string | null;
  slug: string;
  dominioCustom: string | null;
  dominioDnsRegistros: DnsRegistro[];
  dominioVerificado: boolean;
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

// types/resposta.ts

export interface ScoreDominio {
  score: number;
  percentil: number;
  nivel: "Baixo" | "Médio" | "Alto";
}

export interface ScoreFaceta {
  score: number;
  percentil: number;
  nivel: "Baixo" | "Médio" | "Alto";
}

export interface Scores {
  dominios: Record<"N" | "E" | "O" | "A" | "C", ScoreDominio>;
  facetas: Record<string, ScoreFaceta>; // "N1", "N2", ..., "C6"
}

export interface Resposta {
  id: string;
  mentoraId: string;
  nome: string;
  email: string;
  celular: string | null;
  scores: Scores;
  camposExtras: Record<string, string>;
  respostasBrutas: Record<string, number> | null;
  relatorioHtml: string | null;
  status: "pendente" | "processando" | "concluido" | "erro";
  criadoEm: Date;
  atualizadoEm: Date;
}
```

---

## Painel da Mentora (/painel)

Área autenticada para cada mentora gerir os seus mentorados, relatórios, formulários e configurações. Usa Neon Auth para autenticação.

### Fluxo de autenticação

1. Mentora acede `/painel/login` → componente `AuthView` do Neon Auth (sign-in com email + senha)
2. Neon Auth valida e cria sessão automaticamente
3. `proxy.ts` protege rotas `/painel/*` — redireciona para `/painel/login` se não autenticado
4. Backend resolve `mentora` via `auth_user_id = session.user.id`

### Rotas do painel

| Rota                      | O que faz                                        |
| ------------------------- | ------------------------------------------------ |
| `/painel/login`           | Login/registo — AuthView do Neon Auth            |
| `/painel`                 | Dashboard — total mentorados, respostas recentes |
| `/painel/mentorados`      | Lista de respostas (nome, email, data, status)   |
| `/painel/mentorados/[id]` | Relatório individual + botão baixar PDF          |
| `/painel/formulario`      | Gerir campos extras (CRUD, drag reorder, max 5)  |
| `/painel/config`          | Slug, domínio, cores, logos, textos              |
| `/painel/conta`           | API key OpenAI, prompt extra, settings de conta  |

### Layout do painel — `app/painel/layout.tsx`

```typescript
import { auth } from '@/lib/auth/server';
import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect('/painel/login');
  }

  // Resolver mentora a partir do auth_user_id
  const mentora = await getMentoraByAuthUserId(session.user.id);
  if (!mentora) {
    redirect('/painel/login');
  }

  return (
    <NeonAuthUIProvider authClient={authClient} emailOTP>
      <div className="flex min-h-screen">
        {/* Sidebar com navegação */}
        <aside className="w-64 border-r p-4">
          <nav>
            {/* Links: Dashboard, Mentorados, Formulário, Config, Conta */}
          </nav>
          <UserButton size="icon" />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </NeonAuthUIProvider>
  );
}
```

---

## API Endpoints

### Públicos (submissão do teste)

```
POST   /api/respostas                    → grava resposta + dispara webhook n8n
```

### Callback do n8n

```
PUT    /api/respostas/[id]/relatorio     → atualiza relatorio_html + status
```

### Autenticados (painel da mentora — todas requerem sessão Neon Auth)

```
GET    /api/painel/mentorados            → lista paginada de respostas
GET    /api/painel/mentorados/[id]       → detalhe com relatório
GET    /api/painel/mentorados/[id]/pdf   → gera e retorna PDF
POST   /api/painel/mentorados/[id]/reprocessar → re-dispara webhook n8n
DELETE /api/painel/mentorados/[id]       → apaga resposta

GET    /api/painel/formulario            → campos extras atuais
PUT    /api/painel/formulario            → atualiza campos extras

GET    /api/painel/config                → dados de config da mentora
PUT    /api/painel/config                → atualiza configs
POST   /api/painel/config/logo           → upload de logo

PUT    /api/painel/conta/openai          → atualiza API key OpenAI
PUT    /api/painel/conta/prompt          → atualiza prompt extra
```

### Padrão de autenticação nas API routes

```typescript
// Exemplo: app/api/painel/mentorados/route.ts
import { auth } from "@/lib/auth/server";
import { getMentoraByAuthUserId } from "@/lib/db/mentoras";
import { getRespostasByMentora } from "@/lib/db/respostas";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const mentora = await getMentoraByAuthUserId(session.user.id);
  if (!mentora) {
    return Response.json({ error: "Mentora não encontrada" }, { status: 404 });
  }

  const respostas = await getRespostasByMentora(mentora.id);
  return Response.json(respostas);
}
```

---

## Fluxo de submissão do teste (atualizado)

```
Mentorado preenche teste no frontend
  → Frontend calcula scores (client-side)
  → POST /api/respostas { mentora_id, nome, email, celular, scores, campos_extras, respostas_brutas }
  → Backend grava na tabela `respostas` com status='pendente'
  → Backend dispara webhook n8n (async) com resposta_id + scores + campos_extras + fala_ia
  → Retorna página de obrigado ao mentorado

n8n recebe webhook
  → Gera relatório HTML (Code Node 1 + OpenAI + Code Node 2)
  → PUT /api/respostas/{id}/relatorio { relatorio_html, status: 'concluido' }
  → Backend atualiza resposta na DB
  → n8n envia email para a mentora com o relatório
```

---

## Payload enviado ao n8n (POST)

```typescript
{
  resposta_id: string; // UUID da resposta na DB
  callback_url: string; // URL para PUT do relatório
  mentora: {
    nome: string;
    email: string;
    id: string;
    promptExtra: string | null;
  }
  cliente: {
    nome: string;
    email: string;
    celular: string;
    // respostas aos campos extras, com fala_ia incluída
    extras: Array<{
      campo: string; // label do campo
      valor: string; // resposta do mentorado
      fala_ia?: string; // instrução para a IA
    }>;
  }
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

---

## Geração de PDF

O relatório já existe como HTML com inline styles. Para gerar PDF:

**Abordagem:** Puppeteer server-side (ou `@sparticuz/chromium` para Vercel serverless)

```typescript
// lib/pdf.ts
import puppeteer from "puppeteer";

export async function gerarPDF(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
  });
  await browser.close();
  return Buffer.from(pdf);
}
```

**Alternativa para Vercel:** Usar `@sparticuz/chromium` ou gerar no Railway (onde o n8n já roda).

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

  // Proteger rotas /painel (excepto login e auth)
  if (pathname.startsWith("/painel") && pathname !== "/painel/login") {
    // A validação real é feita no layout.tsx do painel via auth.getSession()
    // O proxy apenas deixa passar; o redirect acontece no server component
  }

  // Proteger rotas /admin
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = req.cookies.get("admin_session");
    if (session?.value !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Domínio raiz ou subdomínios da plataforma → rotas normais [slug]
  if (PLATFORM_HOSTS.has(hostname) || hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  // Domínio custom da mentora → /d/[host]/...
  const url = req.nextUrl.clone();
  url.pathname = `/d/${hostname}${pathname}`;
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
  page.tsx                              ← landing page de marketing
  globals.css                           ← inclui @import "@neondatabase/auth/ui/tailwind"
  [slug]/
    page.tsx                            ← getMentoraBySlug
    questionario/page.tsx
    obrigado/page.tsx
  d/
    [host]/
      page.tsx                          ← getMentoraByHost
      questionario/page.tsx
      obrigado/page.tsx
  painel/
    login/page.tsx                      ← AuthView do Neon Auth (sign-in)
    layout.tsx                          ← auth guard + sidebar + NeonAuthUIProvider
    page.tsx                            ← dashboard
    mentorados/
      page.tsx                          ← lista de respostas
      [id]/page.tsx                     ← relatório individual + download PDF
    formulario/page.tsx                 ← gerir campos extras
    config/page.tsx                     ← slug, domínio, cores, logos, textos
    conta/page.tsx                      ← API key OpenAI, prompt extra
  admin/
    login/page.tsx
    page.tsx                            ← lista de mentoras (admin)
    mentoras/nova/page.tsx
    mentoras/[id]/page.tsx
  api/
    auth/
      [...path]/route.ts               ← handler do Neon Auth
    respostas/
      route.ts                          ← POST público (submissão do teste)
      [id]/
        relatorio/route.ts             ← PUT callback do n8n
    painel/
      mentorados/route.ts              ← GET lista (autenticado)
      mentorados/[id]/route.ts         ← GET detalhe, DELETE (autenticado)
      mentorados/[id]/pdf/route.ts     ← GET PDF (autenticado)
      mentorados/[id]/reprocessar/route.ts ← POST (autenticado)
      formulario/route.ts              ← GET, PUT (autenticado)
      config/route.ts                  ← GET, PUT (autenticado)
      config/logo/route.ts             ← POST upload (autenticado)
      conta/openai/route.ts            ← PUT (autenticado)
      conta/prompt/route.ts            ← PUT (autenticado)
    submeter/
      route.ts                          ← (legado) recebe respostas, calcula score, envia para n8n
components/
  mentora/
    LandingPage.tsx
    QuestionarioCliente.tsx
    ObrigadoPage.tsx
  painel/
    Sidebar.tsx
    MentoradosList.tsx
    RelatorioViewer.tsx
    CamposExtrasEditor.tsx
    ConfigForm.tsx
lib/
  auth/
    server.ts                           ← createNeonAuth
    client.ts                           ← createAuthClient
  db/
    client.ts
    mentoras.ts
    respostas.ts
  scoring.ts
  pdf.ts                                ← geração de PDF com Puppeteer
types/
  mentora.ts
  resposta.ts
data/
  ipip-neo-120-items.json
db/
  schema.sql
```

---

## lib/db/mentoras.ts

```typescript
import { pool } from "./client";
import { Mentora, PerguntaExtra, DnsRegistro } from "@/types/mentora";

function mapRow(row: Record<string, unknown>): Mentora {
  return {
    id: row.id as string,
    authUserId: row.auth_user_id as string | null,
    slug: row.slug as string,
    dominioCustom: row.dominio_custom as string | null,
    dominioDnsRegistros: (row.dominio_dns_registros as DnsRegistro[]) ?? [],
    dominioVerificado: (row.dominio_verificado as boolean) ?? false,
    nome: row.nome as string,
    email: row.email as string,
    // ... restantes campos
  };
}

export async function getMentoraBySlug(slug: string): Promise<Mentora | null> { ... }
export async function getMentoraByHost(host: string): Promise<Mentora | null> { ... }
export async function getMentoraByAuthUserId(authUserId: string): Promise<Mentora | null> {
  const { rows } = await pool.query(
    'SELECT * FROM mentoras WHERE auth_user_id = $1 AND ativo = true',
    [authUserId]
  );
  return rows[0] ? mapRow(rows[0]) : null;
}
```

---

## lib/db/respostas.ts

```typescript
import { pool } from "./client";
import { Resposta } from "@/types/resposta";

function mapRow(row: Record<string, unknown>): Resposta {
  return {
    id: row.id as string,
    mentoraId: row.mentora_id as string,
    nome: row.nome as string,
    email: row.email as string,
    celular: row.celular as string | null,
    scores: row.scores as Resposta['scores'],
    camposExtras: row.campos_extras as Record<string, string>,
    respostasBrutas: row.respostas_brutas as Record<string, number> | null,
    relatorioHtml: row.relatorio_html as string | null,
    status: row.status as Resposta['status'],
    criadoEm: new Date(row.criado_em as string),
    atualizadoEm: new Date(row.atualizado_em as string),
  };
}

export async function getRespostasByMentora(mentoraId: string): Promise<Resposta[]> { ... }
export async function getRespostaById(id: string, mentoraId: string): Promise<Resposta | null> { ... }
export async function criarResposta(data: Omit<Resposta, 'id' | 'criadoEm' | 'atualizadoEm' | 'relatorioHtml' | 'status'>): Promise<Resposta> { ... }
export async function atualizarRelatorio(id: string, relatorioHtml: string, status: string): Promise<void> { ... }
export async function apagarResposta(id: string, mentoraId: string): Promise<void> { ... }
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

Duas paletas distintas, por decisão explícita (jun/2026):

**Relatórios / pipeline IA** (`lib/descriptions.ts` → emails/PDF entregues às mentoradas — fora do escopo do design system Strutura, ficam como estão):

| Código | Domínio           | Cor       |
| ------ | ----------------- | --------- |
| N      | Neuroticismo      | `#E74C3C` |
| E      | Extroversão       | `#F39C12` |
| O      | Abertura          | `#9B59B6` |
| A      | Amabilidade       | `#2ECC71` |
| C      | Conscienciosidade | `#3498DB` |

**Marketing landing** (`app/page.tsx` — superfície Strutura, segue a regra da tríade warm-shifted do design system; tokens `--domain-{n,e,o,a,c}-soft/text` em `globals.css`):

| Código | Domínio           | Texto     | Soft      |
| ------ | ----------------- | --------- | --------- |
| N      | Neuroticismo      | `#A03E2A` | `#F5E0DC` |
| E      | Extroversão       | `#A0712A` | `#F5EBDA` |
| O      | Abertura          | `#5C3D7E` | `#EDE5F2` |
| A      | Amabilidade       | `#4A6B2C` | `#E8F0E0` |
| C      | Conscienciosidade | `#3A5570` | `#E0E8F0` |

---

## Variáveis de Ambiente

```env
# Base de dados
DATABASE_URL=postgresql://...

# Neon Auth
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=string-de-pelo-menos-32-caracteres

# n8n
N8N_WEBHOOK_URL=https://...

# OpenAI (fallback — normalmente cada mentora usa a sua key)
OPENAI_API_KEY=sk-...

# Vercel API (para domínios custom)
VERCEL_TOKEN=...
VERCEL_PROJECT_NAME=...
VERCEL_TEAM_ID=...

# Admin (dashboard administrativo do Leonardo)
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

---

## Onboarding de uma nova mentora

1. Admin cria mentora no `/admin/mentoras/nova` (slug, nome, email, configs)
2. Admin regista a mentora no Neon Auth (sign-up via UI ou API)
3. Admin associa o `auth_user_id` na tabela `mentoras`
4. Mentora acede `/painel/login` → faz sign-in com email + senha
5. Mentora configura campos extras, cores, logos no painel

**Alternativa futura:** self-service sign-up onde a mentora se regista e cria o seu próprio perfil.

---

## Convenções

- UI totalmente em português
- snake_case na BD, camelCase no TypeScript
- Sem CSS modules — só Tailwind
- Server Components por defeito; Client Components apenas onde há interactividade
- `notFound()` para slugs inválidos ou mentoras inativas
- Next.js 16: usar `proxy.ts` com `export function proxy()`, não `middleware.ts`
- Neon Auth: usar `@neondatabase/auth` (não `better-auth` directamente)
- Sessões validadas via `auth.getSession()` em server components e API routes
- Todas as rotas `/api/painel/*` verificam sessão + resolvem mentora antes de operar

---

## Dashboard de Administração (/admin)

Área exclusiva do administrador (Leonardo) para gerir mentoras.
**Autenticação separada** — senha simples no `.env` (não usa Neon Auth).

### Autenticação

```env
ADMIN_PASSWORD=escolhe-uma-senha-forte
ADMIN_SESSION_SECRET=string-aleatoria-longa
```

Fluxo:

- `/admin` → redireciona para `/admin/login` se não autenticado
- Login valida contra `ADMIN_PASSWORD` e guarda cookie `admin_session`
- O `proxy.ts` protege todas as rotas `/admin/*` verificando o cookie

### Rotas

| Rota                   | O que faz                           |
| ---------------------- | ----------------------------------- |
| `/admin/login`         | Login com senha                     |
| `/admin`               | Lista de todas as mentoras          |
| `/admin/mentoras/nova` | Criar mentora (inclui auth_user_id) |
| `/admin/mentoras/[id]` | Editar mentora                      |
