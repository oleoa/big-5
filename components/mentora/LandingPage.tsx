'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mentora } from '@/types/mentora';

export default function LandingPage({ mentora }: { mentora: Mentora }) {
  const cor = mentora.corPrimaria;
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: mentora.corFundo, color: mentora.corTexto }}>
      <div className="w-full max-w-md text-center">
        {mentora.logoPrincipalUrl && (
          <img
            src={mentora.logoPrincipalUrl}
            alt={mentora.nome}
            className="h-44 mx-auto mb-8 object-contain"
          />
        )}

        <h1 className="text-3xl font-bold mb-4">
          {mentora.titulo}
        </h1>

        <p className="mb-10 leading-relaxed" style={{ opacity: 0.6 }}>
          {mentora.subtitulo}
        </p>

        <Link
          href={`/${mentora.slug}/questionario`}
          onClick={() => setLoading(true)}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-medium rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: cor }}
        >
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
          )}
          {mentora.textoBotao} →
        </Link>
      </div>
    </main>
  );
}
