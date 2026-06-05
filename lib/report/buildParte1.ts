// ============================================================
// Parte 1 do relatório (dados/scores) + prompt para a IA
// ============================================================
// Migrado do nó "Mount Files" do workflow n8n FormWebhook.
// Agora tipado por Resposta + Mentora.
//
// Correções vs n8n:
//  - corPrimaria: o n8n lia mentora.corPrimaria de um row snake_case
//    (nunca presente) → caía sempre em #1A1410. Aqui usamos o campo
//    tipado mentora.corPrimaria corretamente.
//  - link "Ver Relatório Completo": configurável via APP_BASE_URL.
// ============================================================

import type { TestResult, DomainCode } from '@/lib/types';
import type { Mentora } from '@/types/mentora';
import type { Resposta } from '@/types/resposta';

const DESCRICOES: Record<DomainCode, string> = {
  O: 'Reflete a disposição para novas experiências, curiosidade intelectual, sensibilidade estética e imaginação.',
  C: 'Indica o grau de organização, persistência, controle e motivação no comportamento dirigido a objetivos.',
  E: 'Mede a quantidade e intensidade das interações interpessoais, nível de atividade, necessidade de estimulação e capacidade de alegria.',
  A: 'Reflete a qualidade da orientação interpessoal, desde a compaixão até o antagonismo nos pensamentos, sentimentos e ações.',
  N: 'Avalia a tendência a experimentar afetos negativos como medo, tristeza, vergonha, raiva, culpa e nojo.',
};

const CODIGOS_FACETAS: Record<DomainCode, string[]> = {
  O: ['O1', 'O2', 'O3', 'O4', 'O5', 'O6'],
  C: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
  E: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
  A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
  N: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'],
};

function getClassColor(nivel: string): string {
  const n = nivel.toLowerCase();
  if (n === 'alto' || n === 'alta') return '#166534';
  if (n === 'baixo' || n === 'baixa') return '#991B1B';
  return '#505050';
}

function getClassLabel(nivel: string): string {
  const n = nivel.toLowerCase();
  if (n === 'alto' || n === 'alta') return 'Alta';
  if (n === 'baixo' || n === 'baixa') return 'Baixa';
  return 'Média';
}

function getDataAtual(): string {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  const d = new Date();
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

function getBaseUrl(): string {
  return process.env.APP_BASE_URL || 'https://bigfive.strutura.ai';
}

interface CampoCustom {
  label: string;
  valor: string;
  prompt: string;
}

function getCamposCustom(resposta: Resposta, mentora: Mentora): CampoCustom[] {
  return mentora.perguntasExtras
    .filter((p) => resposta.camposExtras[p.label] !== undefined)
    .map((p) => ({
      label: p.label,
      valor: resposta.camposExtras[p.label],
      prompt: p.falaIa ?? '',
    }));
}

// ── HTML Parte 1 ─────────────────────────────────────────────

export function buildHtmlParte1(resposta: Resposta, mentora: Mentora): string {
  const scores = resposta.scores as TestResult;
  const resultados = scores.domains;
  const corPrimaria = mentora.corPrimaria || '#1A1410';
  const camposCustom = getCamposCustom(resposta, mentora);
  const celular = resposta.celular ?? '—';

  let html = `<div style="max-width:600px;margin:0 auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#282828;background:#FFFFFF;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:${corPrimaria};">
    <tr>
      <td style="padding:28px;text-align:center;">
        <div style="font-size:20px;font-weight:bold;color:#FFFFFF;">PERFIL BIG FIVE</div>
        <div style="font-size:14px;color:#FFFFFF;opacity:0.85;margin-top:4px;">${resposta.nome}</div>
        <div style="font-size:11px;color:#FFFFFF;opacity:0.6;margin-top:2px;">Gerado em ${getDataAtual()}</div>
        <div style="margin-top:16px;">
          <a href="${getBaseUrl()}/painel/mentorados/${resposta.id}" target="_blank" style="display:inline-block;padding:10px 24px;background:#FFFFFF;color:${corPrimaria};font-size:13px;font-weight:bold;text-decoration:none;border-radius:4px;">Ver Relatório Completo</a>
        </div>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:24px;">

        <div style="font-size:14px;font-weight:bold;color:#282014;">DADOS DO MENTORADO</div>
        <div style="width:120px;height:2px;background:${corPrimaria};margin:8px 0 16px 0;"></div>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td width="35%" style="padding:6px 0;font-weight:bold;font-size:12px;color:#787878;border-bottom:1px solid #ECECEC;">Nome</td>
            <td width="65%" style="padding:6px 0;font-size:12px;color:#282828;border-bottom:1px solid #ECECEC;">${resposta.nome}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:bold;font-size:12px;color:#787878;border-bottom:1px solid #ECECEC;">Email</td>
            <td style="padding:6px 0;font-size:12px;color:#282828;border-bottom:1px solid #ECECEC;">${resposta.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:bold;font-size:12px;color:#787878;border-bottom:1px solid #ECECEC;">Celular</td>
            <td style="padding:6px 0;font-size:12px;color:#282828;border-bottom:1px solid #ECECEC;">${celular}</td>
          </tr>`;

  for (const campo of camposCustom) {
    html += `
          <tr>
            <td style="padding:6px 0;font-weight:bold;font-size:12px;color:#787878;border-bottom:1px solid #ECECEC;">${campo.label}</td>
            <td style="padding:6px 0;font-size:12px;color:#282828;border-bottom:1px solid #ECECEC;">${campo.valor}</td>
          </tr>`;
  }

  html += `
        </table>

        <div style="height:24px;"></div>

        <div style="font-size:14px;font-weight:bold;color:#282014;">VISÃO GERAL</div>
        <div style="width:120px;height:2px;background:${corPrimaria};margin:8px 0 16px 0;"></div>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td width="50%" style="color:#787878;font-size:11px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #C8C8C8;">TRAÇO</td>
            <td width="25%" style="color:#787878;font-size:11px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #C8C8C8;">PONTUAÇÃO</td>
            <td width="25%" style="color:#787878;font-size:11px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #C8C8C8;">CLASSIFICAÇÃO</td>
          </tr>`;

  for (const d of resultados) {
    html += `
          <tr>
            <td style="padding:8px 0;font-weight:bold;">${d.domain} · ${d.domainPt}</td>
            <td style="padding:8px 0;">${d.score} / 120</td>
            <td style="padding:8px 0;color:${getClassColor(d.descriptor)};">${getClassLabel(d.descriptor)}</td>
          </tr>`;
  }

  html += `
        </table>`;

  for (const d of resultados) {
    const codigos = CODIGOS_FACETAS[d.domain] || [];

    html += `

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
          <tr>
            <td>
              <span style="font-weight:bold;font-size:13px;color:#282828;">${d.domain} · ${d.domainPt}</span>
              <span style="font-size:10px;color:${getClassColor(d.descriptor)};margin-left:8px;">${d.score}/120 — ${getClassLabel(d.descriptor)}</span>
            </td>
          </tr>
          <tr>
            <td style="font-style:italic;color:#646464;font-size:11px;padding-top:4px;">
              ${DESCRICOES[d.domain]}
            </td>
          </tr>
          <tr>
            <td style="padding-top:12px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td width="60%" style="color:#787878;font-size:11px;text-transform:uppercase;padding:6px 0;border-bottom:1px solid #DCDCDC;">FACETA</td>
                  <td width="20%" style="color:#787878;font-size:11px;text-transform:uppercase;padding:6px 0;border-bottom:1px solid #DCDCDC;">PONT.</td>
                  <td width="20%" style="color:#787878;font-size:11px;text-transform:uppercase;padding:6px 0;border-bottom:1px solid #DCDCDC;">CLASS.</td>
                </tr>`;

    for (let i = 0; i < d.facets.length; i++) {
      const f = d.facets[i];
      const codigo = codigos[i] || '';

      html += `
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#323232;">${codigo}: ${f.facetPt}</td>
                  <td style="padding:6px 0;font-size:12px;color:#323232;">${f.score}/20</td>
                  <td style="padding:6px 0;font-size:12px;color:${getClassColor(f.descriptor)};">${getClassLabel(f.descriptor)}</td>
                </tr>`;
    }

    html += `
              </table>
            </td>
          </tr>
        </table>`;
  }

  html += `

        <div style="margin-top:32px;color:#A0A0A0;font-size:10px;">
          Formação em Personalidade e Comportamento Humano · Big Five
        </div>

      </td>
    </tr>
  </table>

  <div style="height:40px;"></div>`;

  return html;
}

// ── User prompt para a IA ────────────────────────────────────

export function buildPromptIA(resposta: Resposta, mentora: Mentora): string {
  const scores = resposta.scores as TestResult;
  const resultados = scores.domains;
  const lines: string[] = [];

  lines.push('Gera a análise personalizada para o cliente abaixo.');
  lines.push('Responde APENAS com o HTML da análise (Parte 2). Sem a Parte 1, sem dados brutos.\n');

  lines.push('═══ DADOS DO CLIENTE ═══\n');
  lines.push(`Nome: ${resposta.nome}`);
  lines.push(`Email: ${resposta.email}`);
  lines.push(`Celular: ${resposta.celular ?? '—'}`);

  const camposCustom = getCamposCustom(resposta, mentora);
  if (camposCustom.length > 0) {
    lines.push('\n── Contexto adicional ──');
    for (const campo of camposCustom) {
      lines.push(`${campo.label}: ${campo.valor}${campo.prompt ? `\n${campo.prompt}` : ''}`);
    }
  }

  lines.push('\n\n═══ RESULTADOS DO IPIP-NEO-120 ═══\n');

  for (const d of resultados) {
    const cods = CODIGOS_FACETAS[d.domain] || [];
    lines.push(`▸ ${d.domainPt} (${d.domain}): ${d.score}/120 — percentil ${d.percentile}% — ${d.descriptor}`);

    for (let i = 0; i < d.facets.length; i++) {
      const f = d.facets[i];
      const cod = cods[i] || '';
      lines.push(`    ${cod}: ${f.facetPt}: ${f.score}/20 — percentil ${f.percentile}% — ${f.descriptor}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
