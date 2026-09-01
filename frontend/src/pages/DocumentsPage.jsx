// Página principal: reúne upload e listagem de documentos.

import { useCallback, useEffect, useState } from 'react';
import UploadComponent from '../components/UploadComponent';
import DocumentList from '../components/DocumentList';
import { listDocuments } from '../services/documentService';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [erro, setErro] = useState(null);

  const carregarDocumentos = useCallback(async () => {
    try {
      const dados = await listDocuments();
      setDocuments(dados);
      setErro(null);
    } catch (error) {
      setErro(error.message);
    }
  }, []);

  useEffect(() => {
    carregarDocumentos();
  }, [carregarDocumentos]);

  return (
    <section>
      <UploadComponent onUploaded={carregarDocumentos} />
      <h2>Documentos enviados</h2>
      {erro && <p role="alert">{erro}</p>}
      <DocumentList documents={documents} />
    </section>
  );
}
