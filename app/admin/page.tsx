import Link from 'next/link';
import { listarMentoras } from '@/lib/db/admin';
import { toggleAtivoAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const mentoras = await listarMentoras();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mentoras</h1>
        <Link
          href="/admin/mentoras/nova"
          className="bg-accent text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-hover"
        >
          Nova mentora
        </Link>
      </div>

      {mentoras.length === 0 ? (
        <p className="text-muted">Nenhuma mentora registada.</p>
      ) : (
        <div className="bg-background rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-muted">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mentoras.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 text-foreground">{m.nome}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/${m.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {m.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted">{m.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.ativo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {m.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/mentoras/${m.id}`}
                      className="text-accent hover:underline"
                    >
                      Editar
                    </Link>
                    <form className="inline" action={toggleAtivoAction.bind(null, m.id, !m.ativo)}>
                      <button type="submit" className="text-muted hover:text-foreground cursor-pointer">
                        {m.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
