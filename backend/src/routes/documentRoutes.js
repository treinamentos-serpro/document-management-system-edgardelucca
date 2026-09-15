const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const router = express.Router();
const storageDirectory = path.join(__dirname, '..', '..', 'storage');

fs.mkdirSync(storageDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, storageDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || 'document');
    const baseName = (file.originalname || 'document').replace(/\.[^/.]+$/, '') || 'document';
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
    callback(null, `${Date.now()}-${sanitizedName}${extension}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
