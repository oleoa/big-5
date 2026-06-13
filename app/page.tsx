import Image from "next/image";
import { Check } from "lucide-react";

const PASSOS = [
  {
    n: "1",
    title: "Sua cliente recebe o link",
    desc: "Você compartilha o link personalizado com seu logo e cores. A cliente preenche 120 perguntas em cerca de 15 minutos.",
  },
  {
    n: "2",
    title: "A IA analisa os resultados",
    desc: "O sistema processa automaticamente o perfil Big Five e gera um relatório interpretativo detalhado.",
  },
  {
    n: "3",
    title: "Você recebe a análise por email",
    desc: "Antes da sessão, já tem o perfil da cliente na caixa de entrada. Sem trabalho extra da sua parte.",
  },
];

const DOMINIOS = [
  {
    letter: "N",
    name: "Neuroticismo",
    soft: "bg-domain-n-soft",
    text: "text-domain-n-text",
    desc: "Tendência a vivenciar emoções negativas como ansiedade, irritabilidade e instabilidade emocional.",
  },
  {
    letter: "E",
    name: "Extroversão",
    soft: "bg-domain-e-soft",
    text: "text-domain-e-text",
    desc: "Orientação para o mundo exterior, sociabilidade, assertividade e energia nas interações sociais.",
  },
  {
    letter: "O",
    name: "Abertura",
    soft: "bg-domain-o-soft",
    text: "text-domain-o-text",
    desc: "Curiosidade intelectual, criatividade, apreciação pela arte e abertura a novas experiências.",
  },
  {
    letter: "A",
    name: "Amabilidade",
    soft: "bg-domain-a-soft",
    text: "text-domain-a-text",
    desc: "Tendência à cooperação, empatia, confiança e orientação para os outros.",
  },
  {
    letter: "C",
    name: "Conscienciosidade",
    soft: "bg-domain-c-soft",
    text: "text-domain-c-text",
    desc: "Organização, autodisciplina, orientação para objetivos e confiabilidade.",
  },
];

const INCLUIDO = [
  "Página personalizada com seu logo e cores",
  "Link próprio para compartilhar com as clientes",
  "120 perguntas validadas cientificamente (IPIP-NEO-120)",
  "Análise gerada por IA enviada para seu email",
  "Perfil completo dos 5 domínios e 30 facetas",
  "Página de obrigado personalizada",
  "Possibilidade de domínio próprio (ex: bigfive.seunome.com)",
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-accent-text">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 h-[76px] border-b border-border bg-accent-soft">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Image
            src="/strutura/banner.png"
            alt="Strutura"
            width={192}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <a
            href="#contato"
            className="hidden h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-accent-hover sm:inline-flex"
          >
            Quero meu formulário
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-background px-4 py-24 sm:py-32">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,154,45,0.06)_0%,transparent_55%)]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Image
            src="/strutura/mark.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto mb-8 opacity-90"
            priority
          />
          <h1 className="text-4xl leading-[1.08] tracking-[-1.5px] sm:text-5xl lg:text-[56px]">
            O formulário de personalidade que{" "}
            <span className="accent-italic">prepara suas clientes</span> antes
            de cada sessão
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">
            Cada cliente responde ao questionário Big Five antes da sessão.
            Você recebe a análise por email, já pronta. Chega preparada.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contato"
              className="inline-flex h-12 items-center rounded-lg bg-primary px-8 text-[15px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-accent-hover"
            >
              Quero meu formulário
            </a>
            <a
              href="#big-five"
              className="inline-flex h-12 items-center rounded-lg border border-border bg-card px-8 text-[15px] font-medium text-foreground transition-colors duration-150 hover:bg-muted"
            >
              Conhecer o Big Five
            </a>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-card px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center gap-5 text-center">
            <Pill>Como funciona</Pill>
            <h2 className="text-3xl sm:text-[40px] sm:leading-[1.15]">
              Três passos, nenhum trabalho extra
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {PASSOS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-border bg-card p-8 shadow-md transition-colors duration-300 hover:border-accent-border hover:bg-muted"
              >
                <span className="font-display text-4xl text-primary">
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que é o Big Five */}
      <section id="big-five" className="bg-muted px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center gap-5 text-center">
            <Pill>O modelo</Pill>
            <h2 className="text-3xl sm:text-[40px] sm:leading-[1.15]">
              O que é o modelo Big Five?
            </h2>
            <p className="max-w-3xl leading-relaxed text-body">
              O Big Five (OCEAN) é o modelo de personalidade mais validado
              cientificamente. Utilizado em pesquisa acadêmica e psicologia
              clínica em todo o mundo, mede cinco dimensões fundamentais da
              personalidade.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {DOMINIOS.map((d) => (
              <div
                key={d.letter}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-colors duration-300 hover:border-accent-border"
              >
                <div
                  className={`mx-auto flex size-14 items-center justify-center rounded-full ${d.soft}`}
                >
                  <span className={`font-display text-2xl ${d.text}`}>
                    {d.letter}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {d.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="bg-card px-4 py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 flex flex-col items-center gap-5 text-center">
            <Pill>O que você recebe</Pill>
            <h2 className="text-3xl sm:text-[40px] sm:leading-[1.15]">
              Tudo pronto para a sua{" "}
              <span className="accent-italic">próxima sessão</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
            {INCLUIDO.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <Check
                    className="size-3.5 text-accent-text"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="text-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contato */}
      <section id="contato" className="bg-card px-4 py-28">
        <div className="mx-auto max-w-3xl rounded-2xl border border-accent-border bg-accent-soft px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl">Pronta para começar?</h2>
          <p className="mx-auto mt-4 mb-10 max-w-xl text-lg leading-relaxed text-body">
            Me envie uma mensagem no WhatsApp e configuramos seu formulário
            personalizado em uma reunião de 30 minutos.
          </p>
          <a
            href="https://wa.me/351931135852?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20formul%C3%A1rio%20Big%20Five%20personalizado."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-lg bg-primary px-10 text-[15px] font-medium text-primary-foreground transition-colors duration-150 hover:bg-accent-hover"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent-soft px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <Image
            src="/strutura/banner.png"
            alt="Strutura"
            width={1584}
            height={396}
            className="h-auto w-full max-w-2xl"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <p className="text-[13px] text-body">
            &copy; 2026 Strutura AI · feita com cuidado
          </p>
        </div>
      </footer>
    </>
  );
}
