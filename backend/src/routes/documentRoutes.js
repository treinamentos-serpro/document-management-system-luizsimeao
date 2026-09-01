// Rotas de documentos: definem os endpoints e delegam ao controller.

const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/documentController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../storage'),
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}-${safeName}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), controller.upload);
router.get('/documents', controller.list);
router.get('/documents/:id/download', controller.download);

module.exports = router;
