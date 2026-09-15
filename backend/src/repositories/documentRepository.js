const documents = [];

function createDocument(document) {
  documents.push(document);
  return document;
}

function listDocuments() {
  return [...documents];
}

function getDocumentById(id) {
  return documents.find((document) => document.id === id) || null;
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentById,
};
