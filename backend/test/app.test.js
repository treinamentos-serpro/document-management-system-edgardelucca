const { test } = require('node:test');
const assert = require('node:assert');
const { setTimeout: delay } = require('node:timers/promises');
const { once } = require('node:events');
const app = require('../src/app');

async function startServer() {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();

  return { server, port };
}

async function stopServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('deve fazer upload, listar e baixar um documento', async () => {
  const { server, port } = await startServer();

  try {
    const formData = new FormData();
    const file = new Blob(['conteudo do arquivo de teste'], { type: 'text/plain' });
    formData.append('file', file, 'arquivo-teste.txt');
    formData.append('owner', 'user-01');

    const uploadResponse = await fetch(`http://127.0.0.1:${port}/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(uploadResponse.status, 201, 'upload deve criar o documento');
    const uploadedDocument = await uploadResponse.json();
    assert.strictEqual(uploadedDocument.originalName, 'arquivo-teste.txt');
    assert.strictEqual(uploadedDocument.owner, 'user-01');
    assert.ok(uploadedDocument.id, 'o documento deve receber um id');

    const listResponse = await fetch(`http://127.0.0.1:${port}/documents`);
    assert.strictEqual(listResponse.status, 200, 'listagem deve retornar sucesso');
    const documents = await listResponse.json();
    assert.ok(Array.isArray(documents), 'a listagem deve ser uma lista');
    assert.ok(documents.some((document) => document.id === uploadedDocument.id), 'o documento enviado deve aparecer na listagem');

    const downloadResponse = await fetch(`http://127.0.0.1:${port}/documents/${uploadedDocument.id}/download`);
    assert.strictEqual(downloadResponse.status, 200, 'download deve retornar sucesso');
    const downloadContent = await downloadResponse.text();
    assert.strictEqual(downloadContent, 'conteudo do arquivo de teste');
  } finally {
    await delay(50);
    await stopServer(server);
  }
});
