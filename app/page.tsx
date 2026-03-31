export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            Strutura AI
          </span>
          <a
            href="#contacto"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-accent rounded-lg hover:bg-accent-hover transition-colors"
          >
            Quero o meu formulário
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-28 lg:py-36 px-4 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
            O formulário de personalidade que prepara as suas clientes antes de
            cada sessão
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
            Cada cliente responde ao questionário Big Five antes da sessão. Você
            recebe a análise por email, já pronta. Chega preparada.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contacto"
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-foreground bg-accent rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
            >
              Quero o meu formulário
            </a>
            <a
              href="#"
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-foreground border-2 border-foreground rounded-xl hover:bg-foreground/5 transition-colors"
            >
              Ver exemplo
            </a>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 sm:py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-14">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                n: "1",
                title: "A sua cliente recebe o link",
                desc: "Você partilha o link personalizado com a sua logótipo e cores. A cliente preenche 120 perguntas em cerca de 15 minutos.",
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
            ].map((step) => (
              <div
                key={step.n}
                className="bg-surface rounded-2xl p-8 border border-border"
              >
                <span className="text-4xl font-bold text-accent">
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que é o Big Five */}
      <section className="py-20 sm:py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            O que é o modelo Big Five?
          </h2>
          <p className="text-muted text-center max-w-3xl mx-auto mb-14 leading-relaxed">
            O Big Five (OCEAN) é o modelo de personalidade mais validado
            cientificamente. Utilizado em investigação académica e psicologia
            clínica em todo o mundo, mede cinco dimensões fundamentais da
            personalidade.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                letter: "N",
                name: "Neuroticismo",
                color: "#EF4444",
                desc: "Tendência para experienciar emoções negativas como ansiedade, irritabilidade e instabilidade emocional.",
              },
              {
                letter: "E",
                name: "Extroversão",
                color: "#F59E0B",
                desc: "Orientação para o mundo exterior, sociabilidade, assertividade e energia nas interações sociais.",
              },
              {
                letter: "O",
                name: "Abertura",
                color: "#8B5CF6",
                desc: "Curiosidade intelectual, criatividade, apreciação pela arte e abertura a novas experiências.",
              },
              {
                letter: "A",
                name: "Amabilidade",
                color: "#10B981",
                desc: "Tendência para a cooperação, empatia, confiança e orientação para os outros.",
              },
              {
                letter: "C",
                name: "Conscienciosidade",
                color: "#3B82F6",
                desc: "Organização, autodisciplina, orientação para objetivos e fiabilidade.",
              },
            ].map((d) => (
              <div
                key={d.letter}
                className="bg-card rounded-2xl p-6 border border-border text-center"
              >
                <span
                  className="text-5xl font-bold"
                  style={{ color: d.color }}
                >
                  {d.letter}
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">
                  {d.name}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="py-20 sm:py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-14">
            O que recebe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
            {[
              "Página personalizada com a sua logótipo e cores",
              "Link próprio para partilhar com as clientes",
              "120 perguntas validadas cientificamente (IPIP-NEO-120)",
              "Análise gerada por IA enviada para o seu email",
              "Perfil completo dos 5 domínios e 30 facetas",
              "Página de obrigado personalizada",
              "Possibilidade de domínio próprio (ex: bigfive.seunome.com)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-accent font-bold">
                  ✓
                </span>
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contacto */}
      <section id="contacto" className="py-20 sm:py-24 px-4 bg-cta-bg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cta-text mb-4">
            Pronta para começar?
          </h2>
          <p className="text-cta-muted text-lg leading-relaxed mb-10">
            Envie-me uma mensagem no WhatsApp e configuramos o seu formulário
            personalizado numa reunião de 30 minutos.
          </p>
          <a
            href="https://wa.me/351933144558?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20formul%C3%A1rio%20Big%20Five%20personalizado."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-4 text-lg font-semibold text-foreground bg-accent rounded-xl hover:bg-accent-hover transition-colors shadow-lg"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-footer-bg text-center">
        <p className="text-sm text-muted">&copy; 2025 Strutura AI</p>
      </footer>
    </>
  );
}
