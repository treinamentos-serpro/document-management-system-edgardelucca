function validateUpload({ file }) {
  if (file) {
    return;
  }

  const error = new Error('Arquivo obrigatório.');
  error.statusCode = 400;
  throw error;
}

module.exports = {
  validateUpload,
};