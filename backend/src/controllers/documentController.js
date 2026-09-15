const documentService = require('../services/documentService');

function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo obrigatório.' });
    }

    const owner = req.body.owner || 'anonymous';
    const document = documentService.createDocumentFromUpload({
      file: req.file,
      owner,
    });

    return res.status(201).json(document);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Erro ao processar o upload.',
    });
  }
}

function listDocuments(req, res) {
  try {
    const documents = documentService.listDocuments();
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar documentos.' });
  }
}

function downloadDocument(req, res) {
  try {
    const document = documentService.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    return res.download(document.storagePath, document.originalName);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao baixar documento.' });
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
