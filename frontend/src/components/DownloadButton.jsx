import { getDocumentDownloadUrl } from '../services/documentApi';

export default function DownloadButton({ documentId, fileName }) {
  return (
    <a
      className="download-button"
      href={getDocumentDownloadUrl(documentId)}
      download={fileName}
    >
      Baixar
    </a>
  );
}