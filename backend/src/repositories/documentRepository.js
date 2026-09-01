// Repositório de documentos.
//
// Mantém os metadados em memória (array) e delega a leitura/escrita dos
// arquivos ao filesystem local (pasta backend/storage), conforme a restrição
// de armazenamento do projeto.

const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

// Metadados dos documentos enviados. Reiniciados a cada restart do servidor.
const documents = [];

function create(metadata) {
  documents.push(metadata);
  return metadata;
}

function findAll() {
  return documents;
}

function findById(id) {
  return documents.find((doc) => doc.id === id);
}

function getFilePath(storedName) {
  return path.join(STORAGE_DIR, storedName);
}

function readFile(storedName) {
  return fs.createReadStream(getFilePath(storedName));
}

module.exports = {
  STORAGE_DIR,
  create,
  findAll,
  findById,
  getFilePath,
  readFile,
};
