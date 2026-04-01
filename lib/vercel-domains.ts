const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_NAME = process.env.VERCEL_PROJECT_NAME!;

function buildUrl(path: string): string {
  return `https://api.vercel.com${path}`;
}

const headers = () => ({
  Authorization: `Bearer ${VERCEL_TOKEN}`,
  'Content-Type': 'application/json',
});

interface ResultadoDominio {
  sucesso: boolean;
  erro?: string;
  dnsNome?: string;
  dnsValor?: string;
}

interface ResultadoVerificacao {
  verificado: boolean;
  dnsNome: string;
  dnsValor: string;
}

export async function adicionarDominio(domain: string): Promise<ResultadoDominio> {
  try {
    const res = await fetch(
      buildUrl(`/v10/projects/${VERCEL_PROJECT_NAME}/domains`),
      {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ name: domain }),
      }
    );

    if (!res.ok && res.status !== 409) {
      const body = await res.json().catch(() => ({}));
      return { sucesso: false, erro: body.error?.message ?? `Vercel API ${res.status}` };
    }

    // Buscar config DNS após adicionar (ou se já existia — 409)
    const config = await obterConfigDns(domain);
    return {
      sucesso: true,
      dnsNome: config.dnsNome,
      dnsValor: config.dnsValor,
    };
  } catch (err) {
    return { sucesso: false, erro: (err as Error).message };
  }
}

export async function removerDominio(domain: string): Promise<{ sucesso: boolean; erro?: string }> {
  try {
    const res = await fetch(
      buildUrl(`/v10/projects/${VERCEL_PROJECT_NAME}/domains/${domain}`),
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

export async function verificarDominio(domain: string): Promise<ResultadoVerificacao> {
  return obterConfigDns(domain);
}

async function obterConfigDns(domain: string): Promise<ResultadoVerificacao> {
  const res = await fetch(
    buildUrl(`/v9/projects/${VERCEL_PROJECT_NAME}/domains/${domain}`),
    { method: 'GET', headers: headers() }
  );

  const body = await res.json();

  const verificado = body.verified === true;
  const dnsNome = domain;

  // Extrair o valor CNAME real da resposta da API (ex: d020eeed7af0a250.vercel-dns-017.com)
  let dnsValor = 'cname.vercel-dns.com';
  if (Array.isArray(body.verification)) {
    for (const entry of body.verification) {
      if (entry.type === 'CNAME' && entry.value) {
        dnsValor = entry.value;
        break;
      }
    }
  }

  return { verificado, dnsNome, dnsValor };
}
