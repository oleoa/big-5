"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mentora } from "@/types/mentora";
import items from "@/data/ipip-neo-120-items.json";

type Fase = "dados" | "teste" | "enviando";

interface DadosCliente {
  nome: string;
  email: string;
  idade: string;
  profissao: string;
}

export default function TesteCliente({ mentora }: { mentora: Mentora }) {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>("dados");
  const [dados, setDados] = useState<DadosCliente>({
    nome: "",
    email: "",
    idade: "",
    profissao: "",
  });
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [erro, setErro] = useState("");

  const cor = mentora.corPrimaria;

  const iniciarTeste = useCallback(() => {
    if (!dados.nome.trim() || !dados.email.trim()) {
      setErro("Por favor, preencha o nome e o email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      setErro("Por favor, insira um email válido.");
      return;
    }
    setErro("");
    setFase("teste");
  }, [dados]);

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
              cliente: {
                nome: dados.nome,
                email: dados.email,
                ...(dados.idade && { idade: dados.idade }),
                ...(dados.profissao && { profissao: dados.profissao }),
              },
              respostas: novasRespostas,
            }),
          });
          if (res.ok) {
            router.push(`/${mentora.slug}/obrigado`);
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
    [perguntaAtual, respostas, mentora.slug, dados, router]
  );

  const anterior = useCallback(() => {
    if (perguntaAtual > 0) {
      setPerguntaAtual((p) => p - 1);
    }
  }, [perguntaAtual]);

  // --- Formulário de dados pessoais ---
  if (fase === "dados") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: mentora.corFundo, color: mentora.corTexto }}>
        <div className="w-full max-w-md">
          {mentora.logoSecundariaUrl && (
            <img
              src={mentora.logoSecundariaUrl}
              alt={mentora.nome}
              className="h-32 mx-auto mb-6 object-contain"
            />
          )}

          <h1 className="text-2xl font-semibold mb-2 text-center">
            Antes de começar
          </h1>
          <p className="text-center mb-8" style={{ opacity: 0.6 }}>
            Preencha os seus dados para iniciar o teste.
          </p>

          {erro && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome completo *
              </label>
              <input
                type="text"
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ focusRingColor: cor } as React.CSSProperties}
                placeholder="O seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                placeholder="o-seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Idade
              </label>
              <input
                type="text"
                value={dados.idade}
                onChange={(e) => setDados({ ...dados, idade: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Profissão
              </label>
              <input
                type="text"
                value={dados.profissao}
                onChange={(e) =>
                  setDados({ ...dados, profissao: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                placeholder="Opcional"
              />
            </div>
          </div>

          <button
            onClick={iniciarTeste}
            className="mt-8 px-8 py-4 text-white font-medium rounded-lg transition-opacity hover:opacity-90 mx-auto block"
            style={{ backgroundColor: cor }}
          >
            Iniciar teste →
          </button>
        </div>
      </main>
    );
  }

  // --- Perguntas ---
  const item = items[perguntaAtual];
  const progresso = ((perguntaAtual + 1) / items.length) * 100;
  const respostaAtual = respostas[item.id];

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: mentora.corFundo, color: mentora.corTexto }}>
      {/* Barra de progresso */}
      <div className="w-full" style={{ backgroundColor: mentora.corFundo }}>
        <div
          className="h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${progresso}%`, backgroundColor: cor }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* Logo */}
          {mentora.logoSecundariaUrl && (
            <img
              src={mentora.logoSecundariaUrl}
              alt={mentora.nome}
              className="h-32 mx-auto mb-4 object-contain"
            />
          )}

          {/* Contador */}
          <p className="text-sm mb-2 text-center" style={{ opacity: 0.5 }}>
            Pergunta {perguntaAtual + 1} de {items.length}
          </p>

          {/* Pergunta */}
          <div
            key={item.id}
            className="animate-fade-in"
          >
            <h2 className="text-xl font-medium text-center mb-10">
              {item.text}
            </h2>

            {/* Opções */}
            <div className="space-y-3">
              {mentora.opcoesResposta.map((label, i) => {
                const valor = i + 1;
                const selecionada = respostaAtual === valor;
                const enviando = fase === "enviando";
                return (
                  <button
                    key={i}
                    onClick={() => responder(valor)}
                    disabled={enviando}
                    className="w-full py-4 px-6 rounded-lg border-2 text-left font-medium transition-all duration-150 flex items-center justify-between disabled:opacity-60 disabled:cursor-not-allowed"
                    style={
                      selecionada
                        ? {
                            backgroundColor: cor,
                            borderColor: cor,
                            color: "white",
                          }
                        : {
                            borderColor: "#e5e7eb",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!selecionada && !enviando) {
                        e.currentTarget.style.backgroundColor = cor + "15";
                        e.currentTarget.style.borderColor = cor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selecionada && !enviando) {
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}
                  >
                    {label}
                    {enviando && selecionada && (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão anterior */}
          <div className="mt-8 text-center">
            <button
              onClick={anterior}
              disabled={perguntaAtual === 0}
              className="text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ opacity: 0.5 }}
            >
              ← Anterior
            </button>
          </div>

          {erro && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {erro}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
