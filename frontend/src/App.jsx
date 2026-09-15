import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments, uploadDocument } from './services/documentApi';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadDocuments() {
    setIsLoading(true);

    try {
      const documentsFromApi = await listDocuments();
      setDocuments(documentsFromApi);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(uploadData) {
    setIsUploading(true);
    setMessage('');

    try {
      await uploadDocument(uploadData);
      setMessage('Documento enviado com sucesso.');
      await loadDocuments();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <main className="app-shell">
      <section className="app-panel">
        <header className="page-header">
          <h1>Document Management System</h1>
          <p>Envie, consulte e baixe documentos armazenados localmente.</p>
        </header>

        <UploadComponent onUpload={handleUpload} isUploading={isUploading} />

        {message && <p className="status-message">{message}</p>}

        <DocumentList documents={documents} isLoading={isLoading} />
      </section>
    </main>
  );
}
