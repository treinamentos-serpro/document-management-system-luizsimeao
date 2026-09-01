// Lista os documentos enviados, com opção de download para cada um.

import DownloadButton from './DownloadButton';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('pt-BR');
}

export default function DocumentList({ documents }) {
  if (documents.length === 0) {
    return (
      <p className="rounded-md bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Nenhum documento enviado ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-4 font-medium">Nome</th>
            <th className="py-2 pr-4 font-medium">Tamanho</th>
            <th className="py-2 pr-4 font-medium">Enviado em</th>
            <th className="py-2 pr-4 font-medium">Dono</th>
            <th className="py-2 pr-4 font-medium">Ação</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-slate-100 last:border-0">
              <td className="py-2 pr-4">{doc.originalName}</td>
              <td className="py-2 pr-4">{formatSize(doc.size)}</td>
              <td className="py-2 pr-4">{formatDate(doc.uploadedAt)}</td>
              <td className="py-2 pr-4">{doc.owner}</td>
              <td className="py-2 pr-4">
                <DownloadButton documentId={doc.id} originalName={doc.originalName} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
