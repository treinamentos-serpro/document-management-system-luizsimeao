// Controller de documentos: trata entrada/saída HTTP e delega ao serviço.
// Responsabilidade única: adaptação entre HTTP e a camada de serviço.

const path = require('path');
const service = require('../services/documentService');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  const owner = req.body.owner;
  const document = service.registerUpload(req.file, owner);
  return res.status(201).json(document);
}

function list(req, res) {
  const documents = service.listDocuments();
  return res.json(documents);
}

function download(req, res) {
  const document = service.getDocumentById(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  const storageDir = path.resolve(__dirname, '../../storage');
  const filePath = path.resolve(document.storedPath);
  if (!filePath.startsWith(storageDir + path.sep)) {
    return res.status(400).json({ error: 'Caminho de arquivo inválido.' });
  }

  return res.download(filePath, document.originalName);
}

module.exports = { upload, list, download };
