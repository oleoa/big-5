import { Mentora } from '@/types/mentora';

export default function TestePage({ mentora }: { mentora: Mentora }) {
  return (
    <main style={{ padding: '2rem' }}>
      <p>Teste — {mentora.nome}</p>
    </main>
  );
}
