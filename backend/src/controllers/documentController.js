// Controller de documentos: trata entrada/saída HTTP e validação básica.

const documentService = require('../services/documentService');
const documentRepository = require('../repositories/documentRepository');

function upload(req, res) {
  try {
    const owner = req.body && req.body.owner;
    const { storedName, ...document } = documentService.registerUpload(req.file, owner);
    return res.status(201).json(document);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}

function list(req, res) {
  const documents = documentService.listDocuments();
  return res.json(documents);
}

function download(req, res) {
  const { id } = req.params;
  const document = documentService.getDocumentForDownload(id);

  if (!document) {
    return res.status(404).json({ erro: 'Documento não encontrado' });
  }

  res.download(documentRepository.getFilePath(document.storedName), document.originalName, (error) => {
    if (error && !res.headersSent) {
      res.status(500).json({ erro: 'Falha ao baixar o documento' });
    }
  });
}

module.exports = {
  upload,
  list,
  download,
};
