import { useState } from 'react';

export default function UploadComponent({ onUpload, isUploading }) {
  const [owner, setOwner] = useState('');
  const [file, setFile] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      return;
    }

    await onUpload({ file, owner });
    event.target.reset();
    setFile(null);
    setOwner('');
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label>
        Responsável
        <input
          type="text"
          name="owner"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Nome do usuário"
        />
      </label>

      <label>
        Documento
        <input
          type="file"
          name="file"
          onChange={(event) => setFile(event.target.files[0] || null)}
          required
        />
      </label>

      <button type="submit" disabled={!file || isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}