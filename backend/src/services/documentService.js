// Serviço de documentos: concentra as regras de negócio.
// Responsabilidade única: orquestrar operações sobre documentos sem conhecer
// detalhes de HTTP ou de armazenamento físico.

const { randomUUID } = require('crypto');
const repository = require('../repositories/documentRepository');

function registerUpload(file, owner) {
  const metadata = {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    storedPath: file.path,
    owner: owner || 'anonymous',
    uploadedAt: new Date().toISOString(),
  };
  return repository.save(metadata);
}

function listDocuments() {
  return repository.findAll();
}

function getDocumentById(id) {
  return repository.findById(id);
}

module.exports = { registerUpload, listDocuments, getDocumentById };
