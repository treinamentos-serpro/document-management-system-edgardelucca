const crypto = require('node:crypto');

function createDocumentMetadata({ file, owner }) {
  return {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    owner: owner || 'anonymous',
    storagePath: file.path,
  };
}

module.exports = {
  createDocumentMetadata,
};