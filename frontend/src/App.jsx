// Componente raiz do Document Management System.

import DocumentsPage from './pages/DocumentsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Document Management System
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <DocumentsPage />
      </main>
    </div>
  );
}
