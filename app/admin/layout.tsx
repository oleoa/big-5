import { logoutAction } from './actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-background border-b border-border px-6 py-3 flex justify-between items-center">
        <a href="/admin" className="font-semibold text-foreground">Strutura AI — Admin</a>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-muted hover:text-foreground cursor-pointer">
            Sair
          </button>
        </form>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
