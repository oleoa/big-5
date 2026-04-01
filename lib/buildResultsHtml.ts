import type { TestResult, DomainResult, PersonalInfo } from "./types";

/**
 * Blends a hex color with white at the given opacity,
 * producing a solid 6-digit hex (email-safe, no 8-digit hex).
 */
function blendWithWhite(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const blend = (c: number) => Math.round(c * opacity + 255 * (1 - opacity));
  return `#${blend(r).toString(16).padStart(2, "0")}${blend(g).toString(16).padStart(2, "0")}${blend(b).toString(16).padStart(2, "0")}`;
}

function buildOverviewTable(domains: DomainResult[]): string {
  const rows = domains
    .map(
      (d) => `
      <tr>
        <td width="160" valign="middle" style="padding:8px 12px 8px 0;font-size:14px;font-weight:600;color:${d.color};">
          ${d.domainPt}
        </td>
        <td valign="middle" style="padding:8px 0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td width="${Math.max(2, d.percentile)}%" height="16" style="background-color:${d.color};font-size:1px;line-height:1px;">&nbsp;</td>
              <td width="${100 - Math.max(2, d.percentile)}%" height="16" style="background-color:#f2eeeb;font-size:1px;line-height:1px;">&nbsp;</td>
            </tr>
          </table>
        </td>
        <td width="50" valign="middle" align="right" style="padding:8px 0 8px 12px;font-size:14px;font-weight:600;color:#2d2d2d;">
          ${d.percentile}%
        </td>
      </tr>`
    )
    .join("\n");

  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
    ${rows}
  </table>`;
}

function buildFacetRow(facet: { facetPt: string; percentile: number; descriptor: string }, domainColor: string): string {
  const badgeBg = blendWithWhite(domainColor, 0.1);
  const barColor = blendWithWhite(domainColor, 0.75);

  return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-bottom:12px;">
      <tr>
        <td valign="middle" style="font-size:14px;font-weight:500;color:#7a7a7a;padding-bottom:6px;">
          ${facet.facetPt}
        </td>
        <td align="right" valign="middle" style="padding-bottom:6px;white-space:nowrap;">
          <span style="font-size:12px;color:#9a9a9a;">${facet.percentile}%</span>
          &nbsp;
          <span style="font-size:12px;font-weight:500;padding:2px 8px;color:${domainColor};background-color:${badgeBg};">${facet.descriptor}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td width="${Math.max(2, facet.percentile)}%" height="10" style="background-color:${barColor};font-size:1px;line-height:1px;">&nbsp;</td>
              <td width="${100 - Math.max(2, facet.percentile)}%" height="10" style="background-color:#f2eeeb;font-size:1px;line-height:1px;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function buildDomainSection(domain: DomainResult): string {
  const badgeBg = blendWithWhite(domain.color, 0.15);
  const facetRows = domain.facets.map((f) => buildFacetRow(f, domain.color)).join("\n");

  return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#ffffff;border:1px solid #d8cfc9;margin-bottom:16px;">
      <!-- Domain header -->
      <tr>
        <td style="padding:16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td width="16" valign="middle">
                <div style="width:12px;height:12px;background-color:${domain.color};"></div>
              </td>
              <td valign="middle" style="padding-left:12px;">
                <span style="font-size:16px;font-weight:600;color:#2d2d2d;">${domain.domainPt}</span><br/>
                <span style="font-size:14px;color:#9a9a9a;">${domain.percentile}% &middot; ${domain.score} pontos</span>
              </td>
              <td align="right" valign="middle" style="font-size:12px;font-weight:600;padding:4px 10px;color:${domain.color};background-color:${badgeBg};">
                ${domain.descriptor}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Description + facets -->
      <tr>
        <td style="padding:8px 20px 20px;border-top:1px solid #d8cfc9;">
          <p style="font-size:14px;color:#7a7a7a;line-height:1.6;margin:0 0 16px;">${domain.description}</p>
          ${facetRows}
        </td>
      </tr>
    </table>`;
}

function buildPersonalInfoSection(info: PersonalInfo): string {
  const fields = [
    { label: "Nome", value: info.name },
    { label: "Idade", value: info.age },
    { label: "E-mail", value: info.email },
    { label: "Profissão", value: info.profession },
    { label: "Filhos", value: info.children },
  ];

  const rows = fields
    .map(
      (f) => `
      <tr>
        <td style="padding:6px 12px 6px 0;font-size:14px;font-weight:600;color:#355e81;white-space:nowrap;">${f.label}</td>
        <td style="padding:6px 0;font-size:14px;color:#2d2d2d;">${f.value}</td>
      </tr>`
    )
    .join("\n");

  return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#ffffff;border:1px solid #d8cfc9;margin-bottom:32px;">
      <tr>
        <td style="padding:24px;">
          <h2 style="font-size:18px;font-weight:600;color:#2d2d2d;margin:0 0 16px;text-align:center;">Dados Pessoais</h2>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            ${rows}
          </table>
        </td>
      </tr>
    </table>`;
}

export function buildResultsHtml(result: TestResult, personalInfo?: PersonalInfo): string {
  const personalSection = personalInfo ? buildPersonalInfoSection(personalInfo) : "";
  const overviewTable = buildOverviewTable(result.domains);
  const domainSections = result.domains.map(buildDomainSection).join("\n");
  const formattedDate = new Date(result.completedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resultados — Big Five</title>
</head>
<body style="margin:0;padding:0;background-color:#f2eeeb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2d2d2d;">
  <!-- Outer centering table -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:#f2eeeb;">
    <tr>
      <td align="center">

        <!-- Header -->
        <table cellpadding="0" cellspacing="0" border="0" width="640" style="border-collapse:collapse;background:#ffffff;border-bottom:1px solid #d8cfc9;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <h1 style="font-size:28px;font-weight:700;color:#2d2d2d;margin:0 0 8px;">Seus Resultados</h1>
              <p style="font-size:14px;color:#9a9a9a;margin:0;">Perfil de personalidade baseado no modelo Big Five (IPIP-NEO-120)</p>
              <p style="font-size:12px;color:#b0b0b0;margin:8px 0 0;">Concluído em ${formattedDate}</p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table cellpadding="0" cellspacing="0" border="0" width="640" style="border-collapse:collapse;">
          <tr>
            <td style="padding:32px 16px;">

              ${personalSection}

              <!-- Overview -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#ffffff;border:1px solid #d8cfc9;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <h2 style="font-size:18px;font-weight:600;color:#2d2d2d;margin:0 0 16px;text-align:center;">Vis&atilde;o Geral</h2>
                    ${overviewTable}
                  </td>
                </tr>
              </table>

              <!-- Domain Breakdowns -->
              <h2 style="font-size:18px;font-weight:600;color:#2d2d2d;margin:0 0 16px;">Detalhes por Dom&iacute;nio</h2>
              ${domainSections}

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
