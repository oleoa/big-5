export type DomainCode = "N" | "E" | "O" | "A" | "C";

export interface Item {
  id: number;
  text: string;
  textEn: string;
  domain: DomainCode;
  facet: string;
  reverse: boolean;
}

export interface FacetResult {
  facet: string;
  facetPt: string;
  score: number;
  percentile: number;
  descriptor: "Baixo" | "Médio" | "Alto";
}

export interface DomainResult {
  domain: DomainCode;
  domainPt: string;
  color: string;
  score: number;
  percentile: number;
  descriptor: "Baixo" | "Médio" | "Alto";
  description: string;
  facets: FacetResult[];
}

export interface TestResult {
  domains: DomainResult[];
  completedAt: string;
}

export type Answers = Record<number, number>;
