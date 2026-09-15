const documentRepository = require('../repositories/documentRepository');
const { createDocumentMetadata } = require('./documentFactory');
const { toDocumentSummary } = require('./documentPresenter');
const { validateUpload } = require('./documentValidator');

function createDocumentFromUpload({ file, owner }) {
  validateUpload({ file });

  const document = createDocumentMetadata({ file, owner });

  documentRepository.createDocument(document);
  return document;
}

function listDocuments() {
  return documentRepository.listDocuments().map(toDocumentSummary);
}

function getDocumentById(id) {
  return documentRepository.getDocumentById(id);
}

module.exports = {
  createDocumentFromUpload,
  listDocuments,
  getDocumentById,
};
