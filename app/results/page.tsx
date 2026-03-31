"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { calculateResults } from "@/lib/scoring";
import { buildResultsHtml } from "@/lib/buildResultsHtml";
import type { Answers, PersonalInfo } from "@/lib/types";
import Loader from "@/components/Loader";

const STORAGE_KEY_ANSWERS = "big5-answers";
const STORAGE_KEY_INDEX = "big5-currentIndex";
const STORAGE_KEY_PERSONAL = "big5-personal";
const WEBHOOK_URL = "https://automations.strutura.ai/webhook/big-5";

export default function ThankYouPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
    if (!saved) {
      router.replace("/personalidade");
      return;
    }

    try {
      const answers: Answers = JSON.parse(saved);
      if (Object.keys(answers).length < 120) {
        router.replace("/personalidade");
        return;
      }

      // Read personal info
      const savedPersonal = localStorage.getItem(STORAGE_KEY_PERSONAL);
      const personalInfo: PersonalInfo | undefined = savedPersonal
        ? JSON.parse(savedPersonal)
        : undefined;

      // Calculate results and send via webhook
      const result = calculateResults(answers);
      const html = buildResultsHtml(result, personalInfo);

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          nome: personalInfo?.name ?? "",
          dadosPessoais: {
            idade: personalInfo?.age ?? "",
            email: personalInfo?.email ?? "",
            profissao: personalInfo?.profession ?? "",
            filhos: personalInfo?.children ?? "",
          },
          resultados: result.domains.map((d) => ({
            dominio: d.domainPt,
            codigo: d.domain,
            percentil: d.percentile,
            pontuacao: d.score,
            nivel: d.descriptor,
            facetas: d.facets.map((f) => ({
              nome: f.facetPt,
              percentil: f.percentile,
              pontuacao: f.score,
              nivel: f.descriptor,
            })),
          })),
          completadoEm: result.completedAt,
          html,
        }),
      }).catch(() => {
        // Silently ignore — the user sees the thank you page regardless
      });
    } catch {
      // If scoring fails, still show the thank you page
    }

    // Clear saved progress
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_INDEX);
    localStorage.removeItem(STORAGE_KEY_PERSONAL);
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl border border-border p-10 sm:p-14 shadow-md max-w-lg w-full text-center animate-fade-in">
        <Image
          src="/logo-horizontal.png"
          alt="Valquiria Abreu"
          width={180}
          height={45}
          className="mx-auto mb-10"
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Muito obrigada pelas suas respostas.
        </h1>

        <p className="text-lg text-foreground/60 mb-10">
          Em breve entrarei em contato.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-accent transition-colors shadow-md"
        >
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
