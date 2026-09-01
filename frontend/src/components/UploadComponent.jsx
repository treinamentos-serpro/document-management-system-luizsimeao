// Componente de upload de documentos.

import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setErro('Selecione um arquivo antes de enviar');
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const document = await uploadDocument(file, owner);
      setFile(null);
      setOwner('');
      event.target.reset();
      onUploaded(document);
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-slate-800">Enviar documento</h2>
      <div className="space-y-1">
        <label htmlFor="file" className="block text-sm font-medium text-slate-700">
          Arquivo
        </label>
        <input
          id="file"
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="owner" className="block text-sm font-medium text-slate-700">
          Dono (opcional)
        </label>
        <input
          id="owner"
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Identificador do usuário"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={enviando}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? 'Enviando...' : 'Enviar'}
      </button>
      {erro && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}
    </form>
  );
}
