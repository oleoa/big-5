"use client";

import type { DomainResult } from "@/lib/types";

interface RadarChartProps {
  domains: DomainResult[];
}

const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 140;
const LEVELS = [0.25, 0.5, 0.75, 1];

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  index: number,
  total: number
): { x: number; y: number } {
  const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  count: number
): string {
  return Array.from({ length: count }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, radius, i, count);
    return `${x},${y}`;
  }).join(" ");
}

export default function RadarChart({ domains }: RadarChartProps) {
  const count = domains.length;

  // Data polygon points
  const dataPoints = domains.map((d, i) => {
    const dataRadius = (d.percentile / 100) * R;
    return polarToCartesian(CX, CY, dataRadius, i, count);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions (slightly outside the chart)
  const labelOffset = R + 35;

  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
        {/* Grid levels */}
        {LEVELS.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(CX, CY, R * level, count)}
            fill="none"
            stroke="#d8cfc9"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {domains.map((_, i) => {
          const { x, y } = polarToCartesian(CX, CY, R, i, count);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="#d8cfc9"
              strokeWidth={1}
            />
          );
        })}

        {/* Percentage labels on axes */}
        {LEVELS.map((level) => {
          const { x, y } = polarToCartesian(CX, CY, R * level, 0, count);
          return (
            <text
              key={level}
              x={x + 4}
              y={y - 4}
              fontSize={10}
              fill="#a8b9c8"
              textAnchor="start"
            >
              {Math.round(level * 100)}%
            </text>
          );
        })}

        {/* Data polygon fill */}
        <polygon
          points={dataPolygon}
          fill="#355e81"
          fillOpacity={0.15}
          stroke="#355e81"
          strokeWidth={2}
          strokeOpacity={0.6}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={5}
            fill={domains[i].color}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Domain labels */}
        {domains.map((domain, i) => {
          const { x, y } = polarToCartesian(CX, CY, labelOffset, i, count);
          const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
          const isTop = angle < -Math.PI / 4 && angle > (-3 * Math.PI) / 4;
          const isBottom = angle > Math.PI / 4 && angle < (3 * Math.PI) / 4;

          return (
            <g key={domain.domain}>
              <text
                x={x}
                y={isTop ? y - 4 : isBottom ? y + 4 : y}
                textAnchor="middle"
                dominantBaseline={
                  isTop ? "auto" : isBottom ? "hanging" : "central"
                }
                fontSize={13}
                fontWeight={600}
                fill={domain.color}
              >
                {domain.domainPt}
              </text>
              <text
                x={x}
                y={isTop ? y + 10 : isBottom ? y + 18 : y + 14}
                textAnchor="middle"
                dominantBaseline="auto"
                fontSize={11}
                fill="#6b7280"
              >
                {domain.percentile}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
