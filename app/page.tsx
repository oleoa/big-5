import Image from "next/image";
import Link from "next/link";
import DevRandomButton from "@/components/DevRandomButton";

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
          <DevRandomButton />
        </div>
      </div>
    </main>
  );
}
