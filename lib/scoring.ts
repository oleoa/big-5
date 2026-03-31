import itemsJson from "@/data/ipip-neo-120-items.json";
import { DOMAIN_INFO, DOMAIN_ORDER, FACET_TRANSLATIONS } from "./descriptions";
import type { Answers, DomainCode, DomainResult, FacetResult, Item, TestResult } from "./types";

const items = itemsJson as Item[];

function getDescriptor(percentile: number): "Baixo" | "Médio" | "Alto" {
  if (percentile < 30) return "Baixo";
  if (percentile > 70) return "Alto";
  return "Médio";
}

export function calculateResults(answers: Answers): TestResult {
  const answeredCount = Object.keys(answers).length;
  if (answeredCount < 120) {
    throw new Error(`Esperadas 120 respostas, recebidas ${answeredCount}`);
  }

  // Group items by domain then facet
  const domainFacetMap = new Map<DomainCode, Map<string, Item[]>>();

  for (const item of items) {
    if (!domainFacetMap.has(item.domain)) {
      domainFacetMap.set(item.domain, new Map());
    }
    const facetMap = domainFacetMap.get(item.domain)!;
    if (!facetMap.has(item.facet)) {
      facetMap.set(item.facet, []);
    }
    facetMap.get(item.facet)!.push(item);
  }

  const domains: DomainResult[] = DOMAIN_ORDER.map((domainCode) => {
    const info = DOMAIN_INFO[domainCode];
    const facetMap = domainFacetMap.get(domainCode)!;
    let domainScore = 0;

    const facets: FacetResult[] = Array.from(facetMap.entries()).map(
      ([facetName, facetItems]) => {
        let facetScore = 0;
        for (const item of facetItems) {
          const raw = answers[item.id];
          facetScore += item.reverse ? 6 - raw : raw;
        }
        domainScore += facetScore;

        const percentile = Math.round(((facetScore - 4) / 16) * 100);
        return {
          facet: facetName,
          facetPt: FACET_TRANSLATIONS[facetName] ?? facetName,
          score: facetScore,
          percentile: Math.max(0, Math.min(100, percentile)),
          descriptor: getDescriptor(percentile),
        };
      }
    );

    const domainPercentile = Math.round(((domainScore - 24) / 96) * 100);
    const descriptor = getDescriptor(domainPercentile);

    return {
      domain: domainCode,
      domainPt: info.namePt,
      color: info.color,
      score: domainScore,
      percentile: Math.max(0, Math.min(100, domainPercentile)),
      descriptor,
      description: info.descriptions[descriptor === "Baixo" ? "low" : descriptor === "Alto" ? "high" : "average"],
      facets,
    };
  });

  return {
    domains,
    completedAt: new Date().toISOString(),
  };
}
