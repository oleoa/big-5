import Image from "next/image";
import Link from "next/link";
import DevRandomButton from "@/components/DevRandomButton";

const DOMAINS = [
  {
    code: "O",
    name: "Abertura à Experiência",
    description: "Curiosidade, criatividade e abertura a novas ideias",
    color: "#9B59B6",
  },
  {
    code: "C",
    name: "Conscienciosidade",
    description: "Organização, disciplina e orientação para objetivos",
    color: "#3498DB",
  },
  {
    code: "E",
    name: "Extroversão",
    description: "Sociabilidade, energia e expressividade",
    color: "#F39C12",
  },
  {
    code: "A",
    name: "Amabilidade",
    description: "Cooperação, empatia e confiança nos outros",
    color: "#2ECC71",
  },
  {
    code: "N",
    name: "Neuroticismo",
    description: "Sensibilidade emocional e reatividade ao stress",
    color: "#E74C3C",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center px-4 py-16 sm:py-24 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Image
            src="/logo.png"
            alt="Valquiria Abreu"
            width={180}
            height={180}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Descubra a Sua Personalidade
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 leading-relaxed">
            Um teste científico baseado no modelo{" "}
            <span className="font-semibold text-primary">Big Five</span>, o
            mais validado pela investigação em psicologia da personalidade.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-5xl mx-auto mb-12 w-full px-4">
          {DOMAINS.map((domain) => (
            <div
              key={domain.code}
              className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: domain.color }}
              />
              <div>
                <h3
                  className="font-semibold text-sm"
                  style={{ color: domain.color }}
                >
                  {domain.name}
                </h3>
                <p className="text-xs text-foreground/50 mt-0.5 leading-relaxed">
                  {domain.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/dados-pessoais"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-accent transition-colors shadow-lg shadow-primary/25"
          >
            Iniciar Teste
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <p className="text-sm text-foreground/40 mt-4">
            120 perguntas · ~15 minutos · Gratuito
          </p>
          <DevRandomButton />
        </div>
      </div>
    </main>
  );
}
