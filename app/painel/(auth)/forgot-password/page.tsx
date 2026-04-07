'use client';

import { AuthView } from '@neondatabase/auth/react/ui';

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Insira o seu email para receber um link de recuperação
        </p>
      </div>
      <AuthView pathname="forgot-password" />
    </div>
  );
}
