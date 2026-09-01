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
    <section className="space-y-8">
      <UploadComponent onUploaded={carregarDocumentos} />
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Documentos enviados</h2>
        {erro && (
          <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            {erro}
          </p>
        )}
        <DocumentList documents={documents} />
      </div>
    </section>
  );
}
