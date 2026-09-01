// Botão de download de um documento.

import { getDownloadUrl } from '../services/documentService';

export default function DownloadButton({ documentId, originalName }) {
  return (
    <a
      href={getDownloadUrl(documentId)}
      download={originalName}
      className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
    >
      Baixar
    </a>
  );
}
