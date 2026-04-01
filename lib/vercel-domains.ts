import type { DnsRegistro } from '@/types/mentora';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT = process.env.VERCEL_PROJECT_NAME!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || '';

function buildUrl(path: string): string {
  const base = `https://api.vercel.com${path}`;
  return VERCEL_TEAM_ID ? `${base}${path.includes('?') ? '&' : '?'}teamId=${VERCEL_TEAM_ID}` : base;
}

const headers = () => ({
  Authorization: `Bearer ${VERCEL_TOKEN}`,
  'Content-Type': 'application/json',
});

interface ResultadoDominio {
  sucesso: boolean;
  erro?: string;
  registros: DnsRegistro[];
  verificado: boolean;
}

interface ResultadoVerificacao {
  verificado: boolean;
  registros: DnsRegistro[];
}

// ── Adicionar domínio ao projeto Vercel ──────────────────────────

export async function adicionarDominio(domain: string): Promise<ResultadoDominio> {
  try {
    const res = await fetch(
      buildUrl(`/v10/projects/${VERCEL_PROJECT}/domains`),
      {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ name: domain }),
      }
    );

    if (!res.ok && res.status !== 409) {
      const body = await res.json().catch(() => ({}));
      return { sucesso: false, erro: body.error?.message ?? `Vercel API ${res.status}`, registros: [], verificado: false };
    }

    // Extrair TXT de verificação da resposta do POST (ou do estado actual se 409)
    let verificationRecords: DnsRegistro[] = [];
    let verified = false;

    if (res.ok) {
      const addBody = await res.json();
      verified = addBody.verified === true;
      if (Array.isArray(addBody.verification)) {
        verificationRecords = addBody.verification
          .filter((v: { type: string }) => v.type === 'TXT')
          .map((v: { domain: string; value: string }) => ({
            type: 'TXT' as const,
            name: v.domain,
            value: v.value,
          }));
      }
    }

    // Buscar config DNS recomendada + estado actual
    const config = await obterConfigDns(domain);

    // Combinar registos: DNS pointing (CNAME/A) + TXT verificação
    const registros: DnsRegistro[] = [
      ...config.registros.filter(r => r.type !== 'TXT'),
      ...(verificationRecords.length > 0 ? verificationRecords : config.registros.filter(r => r.type === 'TXT')),
    ];

    return {
      sucesso: true,
      registros,
      verificado: verified || config.verificado,
    };
  } catch (err) {
    return { sucesso: false, erro: (err as Error).message, registros: [], verificado: false };
  }
}

// ── Remover domínio do projeto Vercel ────────────────────────────

export async function removerDominio(domain: string): Promise<{ sucesso: boolean; erro?: string }> {
  try {
    const res = await fetch(
      buildUrl(`/v9/projects/${VERCEL_PROJECT}/domains/${domain}`),
      { method: 'DELETE', headers: headers() }
    );

    if (!res.ok && res.status !== 404) {
      const body = await res.json().catch(() => ({}));
      return { sucesso: false, erro: body.error?.message ?? `Vercel API ${res.status}` };
    }

    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: (err as Error).message };
  }
}

// ── Verificar domínio (POST verify + refrescar config) ──────────

export async function verificarDominio(domain: string): Promise<ResultadoVerificacao> {
  // Chamar POST verify para pedir à Vercel que verifique
  await fetch(
    buildUrl(`/v9/projects/${VERCEL_PROJECT}/domains/${domain}/verify`),
    { method: 'POST', headers: headers() }
  );

  // Refrescar estado completo
  return obterConfigDns(domain);
}

// ── Obter configuração DNS completa ─────────────────────────────

async function obterConfigDns(domain: string): Promise<ResultadoVerificacao> {
  // 1. Estado do domínio no projeto (verified + verification[])
  const [domainRes, configRes] = await Promise.all([
    fetch(
      buildUrl(`/v9/projects/${VERCEL_PROJECT}/domains/${domain}`),
      { method: 'GET', headers: headers() }
    ),
    fetch(
      buildUrl(`/v6/domains/${domain}/config`),
      { method: 'GET', headers: headers() }
    ),
  ]);

  const domainBody = await domainRes.json().catch(() => ({}));
  const configBody = await configRes.json().catch(() => ({}));

  const verificado = domainBody.verified === true;
  const registros: DnsRegistro[] = [];

  // 2. Registo de apontamento (CNAME ou A) a partir da config
  if (Array.isArray(configBody.cns) && configBody.cns.length > 0) {
    // A API retorna cns para CNAME targets
    registros.push({
      type: 'CNAME',
      name: domain,
      value: configBody.cns[0],
    });
  } else if (configBody.misconfigured !== undefined) {
    // Usar recommendedCNAME ou recommendedIPv4
    if (Array.isArray(configBody.recommendedCNAME) && configBody.recommendedCNAME.length > 0) {
      registros.push({
        type: 'CNAME',
        name: domain,
        value: configBody.recommendedCNAME[0].value ?? configBody.recommendedCNAME[0],
      });
    } else if (Array.isArray(configBody.recommendedIPv4) && configBody.recommendedIPv4.length > 0) {
      const ip = configBody.recommendedIPv4[0].value ?? configBody.recommendedIPv4[0];
      registros.push({
        type: 'A',
        name: domain,
        value: Array.isArray(ip) ? ip[0] : ip,
      });
    } else {
      // Fallback: CNAME padrão da Vercel
      registros.push({
        type: 'CNAME',
        name: domain,
        value: 'cname.vercel-dns.com',
      });
    }
  } else {
    // Fallback se config não retornou nada útil
    registros.push({
      type: 'CNAME',
      name: domain,
      value: 'cname.vercel-dns.com',
    });
  }

  // 3. Registos TXT de verificação
  if (Array.isArray(domainBody.verification)) {
    for (const entry of domainBody.verification) {
      if (entry.type === 'TXT') {
        registros.push({
          type: 'TXT',
          name: entry.domain,
          value: entry.value,
        });
      }
    }
  }

  return { verificado, registros };
}
