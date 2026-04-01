"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mentora } from "@/types/mentora";
import items from "@/data/ipip-neo-120-items.json";
import PhoneInput, { isValidPhone } from "@/components/mentora/PhoneInput";
import MentoraLayout from "./MentoraLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Fase = "dados" | "teste" | "enviando";

export default function TesteCliente({ mentora, basePath }: { mentora: Mentora; basePath: string }) {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>("dados");
  const [dados, setDados] = useState<Record<string, string>>({
    nome: "",
    email: "",
    celular: "",
  });
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [erro, setErro] = useState("");

  const iniciarTeste = useCallback(() => {
    if (!dados.nome.trim() || !dados.email.trim()) {
      setErro("Por favor, preencha o nome e o email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      setErro("Por favor, insira um email válido.");
      return;
    }
    if (!dados.celular || !isValidPhone(dados.celular)) {
      setErro("Por favor, insira um número de celular válido.");
      return;
    }
    for (const p of mentora.perguntasExtras) {
      if (p.obrigatorio && !dados[p.id]?.trim()) {
        setErro(`Por favor, preencha o campo "${p.label}".`);
        return;
      }
    }
    setErro("");
    setFase("teste");
  }, [dados, mentora.perguntasExtras]);

  const responder = useCallback(
    async (valor: number) => {
      const item = items[perguntaAtual];
      const novasRespostas = { ...respostas, [item.id]: valor };
      setRespostas(novasRespostas);

      if (perguntaAtual < items.length - 1) {
        setPerguntaAtual((p) => p + 1);
      } else {
        setFase("enviando");
        try {
          const res = await fetch("/api/submeter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: mentora.slug,
              cliente: dados,
              respostas: novasRespostas,
            }),
          });
          if (res.ok) {
            router.push(`${basePath}/obrigado`);
          } else {
            setErro("Ocorreu um erro ao enviar. Tente novamente.");
            setFase("teste");
          }
        } catch {
          setErro("Ocorreu um erro ao enviar. Tente novamente.");
          setFase("teste");
        }
      }
    },
    [perguntaAtual, respostas, mentora.slug, dados, router, basePath]
  );

  const anterior = useCallback(() => {
    if (perguntaAtual > 0) {
      setPerguntaAtual((p) => p - 1);
    }
  }, [perguntaAtual]);

  // --- Formulário de dados pessoais ---
  if (fase === "dados") {
    return (
      <MentoraLayout mentora={mentora}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-0">
            {mentora.logoSecundariaUrl && (
              <img
                src={mentora.logoSecundariaUrl}
                alt={mentora.nome}
                className="h-32 mx-auto mb-2 object-contain"
              />
            )}
            <CardTitle className="text-2xl font-semibold">
              Antes de começar
            </CardTitle>
            <CardDescription>
              Preencha seus dados para iniciar o teste.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {erro && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 text-destructive p-3 text-sm">
                {erro}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                type="text"
                value={dados.nome}
                onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
                className="h-11"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={dados.email}
                onChange={(e) => setDados(prev => ({ ...prev, email: e.target.value }))}
                className="h-11"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Celular *</Label>
              <PhoneInput
                value={dados.celular}
                onChange={(val) => setDados(prev => ({ ...prev, celular: val }))}
              />
            </div>

            {[...mentora.perguntasExtras].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)).map((pergunta) => (
              <div key={pergunta.id} className="space-y-2">
                <Label htmlFor={pergunta.id}>
                  {pergunta.label}{pergunta.obrigatorio ? " *" : ""}
                </Label>
                {pergunta.tipo === "textarea" ? (
                  <Textarea
                    id={pergunta.id}
                    value={dados[pergunta.id] ?? ""}
                    onChange={(e) => setDados(prev => ({ ...prev, [pergunta.id]: e.target.value }))}
                    placeholder={pergunta.placeholder || (pergunta.obrigatorio ? "" : "Opcional")}
                    required={pergunta.obrigatorio}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={pergunta.id}
                    type={pergunta.tipo}
                    value={dados[pergunta.id] ?? ""}
                    onChange={(e) => setDados(prev => ({ ...prev, [pergunta.id]: e.target.value }))}
                    className="h-11"
                    placeholder={pergunta.placeholder || (pergunta.obrigatorio ? "" : "Opcional")}
                    required={pergunta.obrigatorio}
                  />
                )}
              </div>
            ))}

            <Button
              onClick={iniciarTeste}
              className="w-full h-12 text-base mt-2"
            >
              Iniciar teste →
            </Button>
          </CardContent>
        </Card>
      </MentoraLayout>
    );
  }

  // --- Perguntas ---
  const item = items[perguntaAtual];
  const progresso = ((perguntaAtual + 1) / items.length) * 100;
  const respostaAtual = respostas[item.id];
  const enviando = fase === "enviando";

  return (
    <MentoraLayout mentora={mentora} variant="full" className="p-0">
      {/* Progress bar */}
      <div className="w-full bg-muted">
        <div
          className="h-2 rounded-r-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* Logo */}
          {mentora.logoSecundariaUrl && (
            <img
              src={mentora.logoSecundariaUrl}
              alt={mentora.nome}
              className="h-24 mx-auto mb-4 object-contain"
            />
          )}

          {/* Counter */}
          <p className="text-sm mb-4 text-center text-muted-foreground">
            Pergunta {perguntaAtual + 1} de {items.length} ({Math.round(progresso)}%)
          </p>

          <Card>
            <CardContent className="pt-6 pb-6">
              {/* Question */}
              <div key={item.id} className="animate-fade-in">
                <h2 className="text-xl font-medium text-center mb-8">
                  {item.text}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {mentora.opcoesResposta.map((label, i) => {
                    const valor = i + 1;
                    const selecionada = respostaAtual === valor;
                    return (
                      <Button
                        key={i}
                        onClick={() => responder(valor)}
                        disabled={enviando}
                        variant={selecionada ? "default" : "outline"}
                        className="w-full h-auto py-4 px-6 justify-start text-left font-medium"
                      >
                        {label}
                        {enviando && selecionada && (
                          <span className="ml-auto inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous button */}
          <div className="mt-6 text-center">
            <Button
              onClick={anterior}
              disabled={perguntaAtual === 0}
              variant="ghost"
              size="sm"
            >
              ← Anterior
            </Button>
          </div>

          {erro && (
            <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive p-3 text-sm text-center">
              {erro}
            </div>
          )}
        </div>
      </div>
    </MentoraLayout>
  );
}
