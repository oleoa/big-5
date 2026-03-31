"use client";

import { useState } from "react";
import type { DomainResult } from "@/lib/types";

interface FacetBreakdownProps {
  domain: DomainResult;
}

export default function FacetBreakdown({ domain }: FacetBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const descriptorBadge = (
    descriptor: string,
    color: string
  ) => {
    const bgOpacity = descriptor === "Alto" ? "20" : descriptor === "Baixo" ? "15" : "10";
    return (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{
          color: color,
          backgroundColor: `${color}${bgOpacity}`,
        }}
      >
        {descriptor}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-background transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: domain.color }}
          />
          <div className="text-left">
            <h3 className="font-semibold text-foreground">
              {domain.domainPt}
            </h3>
            <p className="text-sm text-foreground/50">
              {domain.percentile}% · {domain.score} pontos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {descriptorBadge(domain.descriptor, domain.color)}
          <svg
            className={`w-5 h-5 text-foreground/40 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-2 border-t border-border">
            {/* Domain description */}
            <p className="text-sm text-foreground/60 mb-5 leading-relaxed">
              {domain.description}
            </p>

            {/* Facets */}
            <div className="space-y-4">
              {domain.facets.map((facet) => (
                <div key={facet.facet}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-foreground/70">
                      {facet.facetPt}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/50">
                        {facet.percentile}%
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          color: domain.color,
                          backgroundColor: `${domain.color}15`,
                        }}
                      >
                        {facet.descriptor}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(2, facet.percentile)}%`,
                        backgroundColor: domain.color,
                        opacity: 0.75,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
