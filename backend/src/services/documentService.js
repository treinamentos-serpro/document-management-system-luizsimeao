// Regras de negócio de documentos.

const crypto = require('crypto');
const fs = require('fs');
const documentRepository = require('../repositories/documentRepository');

const DEFAULT_OWNER = 'anonimo';

function registerUpload(file, owner) {
  if (!file) {
    throw new Error('Nenhum arquivo foi enviado');
  }

  const metadata = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: owner || DEFAULT_OWNER,
  };

  return documentRepository.create(metadata);
}

function listDocuments() {
  return documentRepository.findAll().map(({ storedName, ...publicFields }) => publicFields);
}

function getDocumentForDownload(id) {
  const document = documentRepository.findById(id);
  if (!document) {
    return null;
  }

  const filePath = documentRepository.getFilePath(document.storedName);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return document;
}

module.exports = {
  registerUpload,
  listDocuments,
  getDocumentForDownload,
};
