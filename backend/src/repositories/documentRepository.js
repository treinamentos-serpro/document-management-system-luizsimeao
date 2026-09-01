// Repositório de documentos: mantém os metadados em memória.
// Responsabilidade única: persistência e consulta de metadados.

const documents = [];

function save(metadata) {
  documents.push(metadata);
  return metadata;
}

function findAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((doc) => doc.id === id) || null;
}

module.exports = { save, findAll, findById };
