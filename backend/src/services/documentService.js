const crypto = require('node:crypto');
const documentRepository = require('../repositories/documentRepository');

function createDocumentFromUpload({ file, owner }) {
  if (!file) {
    const error = new Error('Arquivo obrigatório.');
    error.statusCode = 400;
    throw error;
  }

  const documentId = crypto.randomUUID();
  const document = {
    id: documentId,
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    owner: owner || 'anonymous',
    storagePath: file.path,
  };

  documentRepository.createDocument(document);
  return document;
}

function listDocuments() {
  return documentRepository.listDocuments().map((document) => ({
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
    mimeType: document.mimeType,
    storedName: document.storedName,
  }));
}

function getDocumentById(id) {
  return documentRepository.getDocumentById(id);
}

module.exports = {
  createDocumentFromUpload,
  listDocuments,
  getDocumentById,
};
