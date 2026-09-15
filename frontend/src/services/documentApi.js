const API_PREFIX = '/api';

async function parseResponse(response) {
  if (response.ok) {
    return response.json();
  }

  let errorMessage = 'Erro ao comunicar com o servidor.';

  try {
    const errorBody = await response.json();
    errorMessage = errorBody.message || errorMessage;
  } catch {
    // Mantém a mensagem padrão quando a resposta não contém JSON válido.
  }

  throw new Error(errorMessage);
}

export async function uploadDocument({ file, owner }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner || 'anonymous');

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  return parseResponse(response);
}

export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);
  return parseResponse(response);
}

export function getDocumentDownloadUrl(documentId) {
  return `${API_PREFIX}/documents/${documentId}/download`;
}