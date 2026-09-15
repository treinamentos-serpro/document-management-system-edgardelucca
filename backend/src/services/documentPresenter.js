function toDocumentSummary(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
    mimeType: document.mimeType,
    storedName: document.storedName,
  };
}

module.exports = {
  toDocumentSummary,
};