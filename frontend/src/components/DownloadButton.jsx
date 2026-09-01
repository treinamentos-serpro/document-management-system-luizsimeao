// Botão de download de um documento.

import { getDownloadUrl } from '../services/documentService';

export default function DownloadButton({ documentId, originalName }) {
  return (
    <a href={getDownloadUrl(documentId)} download={originalName}>
      Baixar
    </a>
  );
}
