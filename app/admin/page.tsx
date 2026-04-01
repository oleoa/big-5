import { listarMentoras, verificarTodosDominios } from '@/lib/db/admin';
import { MentorasPage } from '@/components/admin/MentorasPage';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await verificarTodosDominios();
  const mentoras = await listarMentoras();

  return <MentorasPage mentoras={mentoras} />;
}
