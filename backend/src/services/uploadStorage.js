// Configuração do multer com armazenamento local (diskStorage), conforme a
// restrição de armazenamento do projeto: nada de provedores externos.

const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const documentRepository = require('../repositories/documentRepository');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentRepository.STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

module.exports = multer({ storage });
