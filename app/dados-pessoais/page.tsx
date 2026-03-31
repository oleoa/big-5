"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { PersonalInfo } from "@/lib/types";

const STORAGE_KEY_PERSONAL = "big5-personal";

export default function DadosPessoaisPage() {
  const router = useRouter();
  const [form, setForm] = useState<PersonalInfo>({
    name: "",
    age: "",
    email: "",
    profession: "",
    children: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY_PERSONAL, JSON.stringify(form));
    router.push("/personalidade");
  };

  const isValid =
    form.name.trim() &&
    form.age.trim() &&
    form.email.trim() &&
    form.profession.trim() &&
    form.children.trim();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="bg-surface rounded-2xl border border-border p-8 sm:p-12 shadow-md max-w-lg w-full animate-fade-in">
        <Image
          src="/logo-horizontal.png"
          alt="Valquiria Abreu"
          width={160}
          height={120}
          className="mx-auto mb-8 h-auto w-auto"
          loading="eager"
        />

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Antes de começar
        </h1>
        <p className="text-foreground/60 text-center mb-8">
          Preencha os seus dados para personalizar a experiência.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground/80 mb-1.5"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="O seu nome completo"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-foreground/80 mb-1.5"
            >
              Idade
            </label>
            <input
              id="age"
              name="age"
              type="number"
              required
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              placeholder="A sua idade"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground/80 mb-1.5"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="profession"
              className="block text-sm font-medium text-foreground/80 mb-1.5"
            >
              Profissão
            </label>
            <input
              id="profession"
              name="profession"
              type="text"
              required
              value={form.profession}
              onChange={handleChange}
              placeholder="A sua profissão"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="children"
              className="block text-sm font-medium text-foreground/80 mb-1.5"
            >
              Quantos filhos tem?
            </label>
            <input
              id="children"
              name="children"
              type="number"
              required
              min="0"
              max="20"
              value={form.children}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`
              w-full py-3.5 rounded-xl font-semibold text-white transition-colors shadow-md mt-2
              ${
                isValid
                  ? "bg-primary hover:bg-accent cursor-pointer"
                  : "bg-primary/40 cursor-not-allowed"
              }
            `}
          >
            Continuar para o Teste
          </button>
        </form>
      </div>
    </main>
  );
}
