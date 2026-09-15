import DownloadButton from './DownloadButton';

function formatFileSize(sizeInBytes) {
  if (!sizeInBytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(
    Math.floor(Math.log(sizeInBytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = sizeInBytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateValue));
}

export default function DocumentList({ documents, isLoading }) {
  if (isLoading) {
    return <p className="empty-state">Carregando documentos...</p>;
  }

  if (documents.length === 0) {
    return <p className="empty-state">Nenhum documento enviado ainda.</p>;
  }

  return (
    <div className="document-list" aria-live="polite">
      {documents.map((document) => (
        <article className="document-card" key={document.id}>
          <div>
            <h2>{document.originalName}</h2>
            <p>
              {document.owner} - {formatFileSize(document.size)} -{' '}
              {formatDate(document.uploadedAt)}
            </p>
          </div>
          <DownloadButton
            documentId={document.id}
            fileName={document.originalName}
          />
        </article>
      ))}
    </div>
  );
}