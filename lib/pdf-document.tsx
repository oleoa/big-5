import React from "react";
import path from "path";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import type { TestResult, DomainResult, FacetResult } from "./types";
import { DOMAIN_TEXTS, FACET_TEXTS } from "./big-five-textos";

// ── Types ──

export interface PdfData {
  scores: TestResult;
  nome: string;
  email: string;
  celular: string | null;
  camposExtras: Record<string, string>;
  criadoEm: Date;
  mentora: {
    nome: string;
    logoPrincipalUrl: string | null;
    corPrimaria: string;
  };
  relatorioHtml: string | null;
  analiseAi: string | null;
}

// ── Font Registration ──

const fontsDir = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(fontsDir, "Inter-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "Inter-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(fontsDir, "Inter-Bold.ttf"), fontWeight: 700 },
  ],
});

// ── Styles ──

const colors = {
  bg: "#FAFAF9",
  white: "#FFFFFF",
  text: "#1C1917",
  textMuted: "#78716C",
  textLight: "#A8A29E",
  border: "#E7E5E4",
  barBg: "#F5F5F4",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.bg,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 45,
  },
  // ── Cover ──
  coverPage: {
    fontFamily: "Inter",
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.bg,
    paddingHorizontal: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  coverLogo: { width: 120, height: 120, marginBottom: 32 },
  coverTitle: { fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 6 },
  coverSubtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 40 },
  coverInfoBlock: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.border,
  },
  coverInfoRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  coverInfoLabel: { fontSize: 10, color: colors.textMuted, width: 120, flexShrink: 0 },
  coverInfoValue: { fontSize: 10, fontWeight: 600, flex: 1, textAlign: "right" },
  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 25,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerText: { fontSize: 8, color: colors.textLight },
  // ── Overview ──
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16 },
  sectionSubtitle: { fontSize: 11, color: colors.textMuted, marginBottom: 24 },
  overviewCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  overviewLabel: { width: 130, fontSize: 11, fontWeight: 600 },
  overviewBarContainer: { flex: 1, height: 18, backgroundColor: colors.barBg, borderRadius: 9 },
  overviewBarFill: { height: 18, borderRadius: 9 },
  overviewPercentile: { width: 44, fontSize: 11, fontWeight: 600, textAlign: "right" },
  overviewBadge: {
    width: 52,
    fontSize: 9,
    fontWeight: 600,
    textAlign: "center",
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  // ── Domain Detail ──
  domainCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  domainHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  domainColorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  domainName: { fontSize: 14, fontWeight: 700 },
  domainScore: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  domainBadge: {
    fontSize: 10,
    fontWeight: 600,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  domainBody: { padding: 16 },
  domainDescription: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.textMuted,
    marginBottom: 16,
  },
  // ── Facet ──
  facetRow: { marginBottom: 12 },
  facetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  facetName: { fontSize: 10, fontWeight: 600, color: colors.text },
  facetRight: { flexDirection: "row", alignItems: "center" },
  facetPercentile: { fontSize: 9, color: colors.textMuted, marginRight: 6 },
  facetBadge: { fontSize: 8, fontWeight: 600, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3 },
  facetBarContainer: { height: 8, backgroundColor: colors.barBg, borderRadius: 4, marginBottom: 4 },
  facetBarFill: { height: 8, borderRadius: 4 },
  facetText: { fontSize: 9, lineHeight: 1.5, color: colors.textLight },
  // ── AI Note ──
  // ── AI Analysis ──
  aiCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  aiParagraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.textMuted,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  aiTableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F5F5F4",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aiTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aiTableHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.text,
    padding: 8,
    flex: 1,
  },
  aiTableCell: {
    fontSize: 9,
    color: colors.textMuted,
    padding: 8,
    flex: 1,
    lineHeight: 1.4,
  },
});

// ── Helpers ──

function blendWithWhite(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const blend = (c: number) => Math.round(c * opacity + 255 * (1 - opacity));
  return `#${blend(r).toString(16).padStart(2, "0")}${blend(g).toString(16).padStart(2, "0")}${blend(b).toString(16).padStart(2, "0")}`;
}

function descriptorKey(descriptor: "Baixo" | "Médio" | "Alto"): "low" | "average" | "high" {
  if (descriptor === "Baixo") return "low";
  if (descriptor === "Alto") return "high";
  return "average";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ── Footer ──

function Footer({ generatedAt }: { generatedAt: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>Strutura AI — bigfive.strutura.ai</Text>
      <Text style={s.footerText}>{generatedAt}</Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

// ── Cover Page ──

function CoverPage({ data }: { data: PdfData }) {
  const hasLogo = !!data.mentora.logoPrincipalUrl;
  return (
    <Page size="A4" style={s.coverPage}>
      {hasLogo && (
        <Image src={data.mentora.logoPrincipalUrl!} style={s.coverLogo} />
      )}
      <Text style={s.coverTitle}>Relatório de Personalidade</Text>
      <Text style={[s.coverTitle, { fontSize: 20, fontWeight: 600, marginBottom: 4 }]}>
        Big Five
      </Text>
      <Text style={s.coverSubtitle}>IPIP-NEO-120</Text>

      <View style={s.coverInfoBlock}>
        <View style={s.coverInfoRow}>
          <Text style={s.coverInfoLabel}>Cliente</Text>
          <Text style={s.coverInfoValue}>{data.nome}</Text>
        </View>
        <View style={s.coverInfoRow}>
          <Text style={s.coverInfoLabel}>E-mail</Text>
          <Text style={s.coverInfoValue}>{data.email}</Text>
        </View>
        {data.celular && (
          <View style={s.coverInfoRow}>
            <Text style={s.coverInfoLabel}>Celular</Text>
            <Text style={s.coverInfoValue}>{data.celular}</Text>
          </View>
        )}
        <View style={s.coverInfoRow}>
          <Text style={s.coverInfoLabel}>Data do teste</Text>
          <Text style={s.coverInfoValue}>{formatDate(data.criadoEm)}</Text>
        </View>
        <View style={s.coverInfoRow}>
          <Text style={s.coverInfoLabel}>Mentora</Text>
          <Text style={s.coverInfoValue}>{data.mentora.nome}</Text>
        </View>
        {Object.entries(data.camposExtras).map(([campo, valor]) => {
          const isLong = campo.length > 25 || valor.length > 50;
          return isLong ? (
            <View key={campo} style={{ paddingVertical: 6 }}>
              <Text style={s.coverInfoLabel}>{campo}</Text>
              <Text style={[s.coverInfoValue, { textAlign: "left", marginTop: 4 }]}>{valor}</Text>
            </View>
          ) : (
            <View style={s.coverInfoRow} key={campo}>
              <Text style={s.coverInfoLabel}>{campo}</Text>
              <Text style={s.coverInfoValue}>{valor}</Text>
            </View>
          );
        })}
      </View>

      <Footer generatedAt={formatDate(new Date())} />
    </Page>
  );
}

// ── Overview Page ──

function OverviewBar({ domain }: { domain: DomainResult }) {
  const badgeBg = blendWithWhite(domain.color, 0.15);
  return (
    <View style={s.overviewRow}>
      <Text style={[s.overviewLabel, { color: domain.color }]}>{domain.domainPt}</Text>
      <View style={s.overviewBarContainer}>
        <View
          style={[
            s.overviewBarFill,
            { width: `${Math.max(2, domain.percentile)}%`, backgroundColor: domain.color },
          ]}
        />
      </View>
      <Text style={s.overviewPercentile}>{domain.percentile}%</Text>
      <View style={[s.overviewBadge, { backgroundColor: badgeBg }]}>
        <Text style={{ fontSize: 9, fontWeight: 600, color: domain.color }}>
          {domain.descriptor}
        </Text>
      </View>
    </View>
  );
}

function OverviewPage({ data }: { data: PdfData }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionTitle}>Visão Geral</Text>
      <Text style={s.sectionSubtitle}>
        Perfil de personalidade baseado no modelo Big Five (IPIP-NEO-120)
      </Text>
      <View style={s.overviewCard}>
        {data.scores.domains.map((d) => (
          <OverviewBar key={d.domain} domain={d} />
        ))}
      </View>
      <Footer generatedAt={formatDate(new Date())} />
    </Page>
  );
}

// ── Domain Detail Pages ──

function FacetRow({ facet, domainColor }: { facet: FacetResult; domainColor: string }) {
  const barColor = blendWithWhite(domainColor, 0.7);
  const badgeBg = blendWithWhite(domainColor, 0.12);
  const key = descriptorKey(facet.descriptor);
  const text = FACET_TEXTS[facet.facet]?.[key] ?? "";

  return (
    <View style={s.facetRow} wrap={false}>
      <View style={s.facetHeader}>
        <Text style={s.facetName}>{facet.facetPt}</Text>
        <View style={s.facetRight}>
          <Text style={s.facetPercentile}>{facet.percentile}%</Text>
          <View style={[s.facetBadge, { backgroundColor: badgeBg }]}>
            <Text style={{ fontSize: 8, fontWeight: 600, color: domainColor }}>
              {facet.descriptor}
            </Text>
          </View>
        </View>
      </View>
      <View style={s.facetBarContainer}>
        <View
          style={[
            s.facetBarFill,
            { width: `${Math.max(2, facet.percentile)}%`, backgroundColor: barColor },
          ]}
        />
      </View>
      {text && <Text style={s.facetText}>{text}</Text>}
    </View>
  );
}

function DomainDetailPage({ domain }: { domain: DomainResult }) {
  const key = descriptorKey(domain.descriptor);
  const longText =
    DOMAIN_TEXTS[domain.domain]?.[key] ?? domain.description;
  const badgeBg = blendWithWhite(domain.color, 0.15);

  return (
    <Page size="A4" style={s.page}>
      <View style={s.domainCard}>
        <View style={s.domainHeader}>
          <View style={s.domainHeaderLeft}>
            <View style={[s.domainColorDot, { backgroundColor: domain.color }]} />
            <View>
              <Text style={s.domainName}>{domain.domainPt}</Text>
              <Text style={s.domainScore}>
                {domain.percentile}% · {domain.score} pontos
              </Text>
            </View>
          </View>
          <View style={[s.domainBadge, { backgroundColor: badgeBg }]}>
            <Text style={{ fontSize: 10, fontWeight: 600, color: domain.color }}>
              {domain.descriptor}
            </Text>
          </View>
        </View>

        <View style={s.domainBody}>
          <Text style={s.domainDescription}>{longText}</Text>
          {domain.facets.map((f) => (
            <FacetRow key={f.facet} facet={f} domainColor={domain.color} />
          ))}
        </View>
      </View>

      <Footer generatedAt={formatDate(new Date())} />
    </Page>
  );
}

// ── HTML Parser for AI Analysis ──

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").trim();
}

interface ParsedTable {
  headers: string[];
  rows: string[][];
}

function parseHtmlTables(html: string): { tables: ParsedTable[]; paragraphs: string[] } {
  const tables: ParsedTable[] = [];
  const paragraphs: string[] = [];

  // Extract text outside tables as paragraphs
  const withoutTables = html.replace(/<table[\s\S]*?<\/table>/gi, "\n__TABLE__\n");
  let tableIndex = 0;

  // Extract tables
  const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) ?? [];
  for (const tableHtml of tableMatches) {
    const trMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    const headers: string[] = [];
    const rows: string[][] = [];

    for (let i = 0; i < trMatches.length; i++) {
      const thMatches = trMatches[i].match(/<th[\s\S]*?<\/th>/gi);
      const tdMatches = trMatches[i].match(/<td[\s\S]*?<\/td>/gi);

      if (thMatches && thMatches.length > 0) {
        for (const th of thMatches) headers.push(stripTags(th));
      } else if (tdMatches && tdMatches.length > 0) {
        // If first row and no headers found yet, treat as headers
        if (i === 0 && headers.length === 0) {
          for (const td of tdMatches) headers.push(stripTags(td));
        } else {
          rows.push(tdMatches.map((td) => stripTags(td)));
        }
      }
    }

    if (headers.length > 0 || rows.length > 0) {
      tables.push({ headers, rows });
    }
  }

  // Extract paragraphs from text outside tables
  const parts = withoutTables.split("__TABLE__");
  for (const part of parts) {
    // Split by common block elements
    const blocks = part.split(/<\/(?:p|div|h[1-6]|li|br\s*\/?)>/gi);
    for (const block of blocks) {
      const text = stripTags(block).trim();
      if (text) paragraphs.push(text);
    }
  }

  return { tables, paragraphs };
}

function AiTable({ table }: { table: ParsedTable }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {table.headers.length > 0 && (
        <View style={s.aiTableHeaderRow}>
          {table.headers.map((h, i) => (
            <Text key={i} style={s.aiTableHeaderCell}>{h}</Text>
          ))}
        </View>
      )}
      {table.rows.map((row, ri) => (
        <View key={ri} style={s.aiTableRow} wrap={false}>
          {row.map((cell, ci) => (
            <Text key={ci} style={s.aiTableCell}>{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

// ── AI Analysis Pages ──

function AiAnalysisPages({ html }: { html: string }) {
  const { tables, paragraphs } = parseHtmlTables(html);

  return (
    <Page size="A4" style={s.page} wrap>
      <Text style={s.sectionTitle}>Análise de IA</Text>

      <View style={s.aiCard}>
        {paragraphs.map((p, i) => (
          <Text key={`p-${i}`} style={s.aiParagraph}>{p}</Text>
        ))}
        <View style={{ padding: 16 }}>
          {tables.map((t, i) => (
            <AiTable key={`t-${i}`} table={t} />
          ))}
        </View>
      </View>

      <Footer generatedAt={formatDate(new Date())} />
    </Page>
  );
}

// ── Main Document ──

export function BigFiveReport({ data }: { data: PdfData }) {
  return (
    <Document
      title={`Relatório Big Five — ${data.nome}`}
      author="Strutura AI"
      subject="Relatório de Personalidade Big Five (IPIP-NEO-120)"
    >
      <CoverPage data={data} />
      <OverviewPage data={data} />
      {data.scores.domains.map((domain) => (
        <DomainDetailPage key={domain.domain} domain={domain} />
      ))}
      {data.analiseAi && <AiAnalysisPages html={data.analiseAi} />}
    </Document>
  );
}
