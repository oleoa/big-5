import { Mentora } from '@/types/mentora';

export default function ObrigadoPage({ mentora }: { mentora: Mentora }) {
  const bgColor = mentora.corFundo || '#ffffff';
  const textColor = mentora.corTexto || '#111827';

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: mentora.corPrimaria + '15', color: mentora.corPrimaria }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-3">{mentora.tituloObrigado}</h1>
        <p style={{ opacity: 0.6 }}>{mentora.textoObrigado}</p>
      </div>
    </main>
  );
}
