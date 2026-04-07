"use client";

import Link from "next/link";
import { AuthView } from "@neondatabase/auth/react/ui";

export default function PainelLoginPage() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Aceder ao Painel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inicie sessão para gerir os seus mentorados
        </p>
      </div>
      <AuthView pathname="sign-in" />
      <div className="text-center">
        <Link
          href="/painel/forgot-password"
          className="text-sm text-muted-foreground hover:underline"
        >
          Esqueceu a sua senha?
        </Link>
      </div>
    </div>
  );
}
