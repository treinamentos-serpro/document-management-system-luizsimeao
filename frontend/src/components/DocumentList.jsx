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
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tamanho</th>
          <th>Enviado em</th>
          <th>Dono</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            <td>{doc.originalName}</td>
            <td>{formatSize(doc.size)}</td>
            <td>{formatDate(doc.uploadedAt)}</td>
            <td>{doc.owner}</td>
            <td>
              <DownloadButton documentId={doc.id} originalName={doc.originalName} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
