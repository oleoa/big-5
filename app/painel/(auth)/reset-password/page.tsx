'use client';

import { AuthView } from '@neondatabase/auth/react/ui';

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Nova senha</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha a sua nova senha
        </p>
      </div>
      <AuthView pathname="reset-password" />
    </div>
  );
}
