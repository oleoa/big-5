import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["@react-pdf/renderer"],
  // Garante que a base de conhecimento Big Five vai no bundle serverless
  // (lida em runtime por lib/report/knowledgeBase.ts para provisionar o RAG).
  outputFileTracingIncludes: {
    "/**": ["./data/knowledge-base-big-five.md"],
  },
};

export default nextConfig;
