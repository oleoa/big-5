'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-background rounded-lg shadow-md p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-foreground text-center mb-6">
          Strutura AI — Admin
        </h1>
        <form action={formAction}>
          <label htmlFor="senha" className="block text-sm font-medium text-foreground mb-1">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          />
          {state?.erro && (
            <p className="text-red-600 text-sm mt-2">{state.erro}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full bg-accent text-foreground rounded-md py-2 text-sm font-medium hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
          >
            {pending ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
