const { test, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

// Sobe o servidor em uma porta efêmera para os testes de integração via fetch.
let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(() => {
  server.close();
});

test('POST /upload envia um documento e retorna seus metadados', async () => {
  const form = new FormData();
  const conteudo = new Blob(['conteudo de teste'], { type: 'text/plain' });
  form.append('file', conteudo, 'arquivo-teste.txt');
  form.append('owner', 'usuario-teste');

  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: form,
  });

  assert.strictEqual(response.status, 201);
  const document = await response.json();

  assert.ok(document.id, 'deve retornar um id');
  assert.strictEqual(document.originalName, 'arquivo-teste.txt');
  assert.strictEqual(document.owner, 'usuario-teste');
  assert.ok(document.size > 0);
  assert.ok(document.uploadedAt);
  assert.strictEqual(document.storedName, undefined, 'não deve expor o nome interno do arquivo');
});

test('POST /upload sem arquivo retorna erro 400', async () => {
  const response = await fetch(`${baseUrl}/upload`, { method: 'POST' });
  assert.strictEqual(response.status, 400);
});

test('GET /documents lista os documentos enviados', async () => {
  const form = new FormData();
  form.append('file', new Blob(['abc']), 'lista.txt');
  await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });

  const response = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(response.status, 200);
  const documents = await response.json();

  assert.ok(Array.isArray(documents));
  assert.ok(documents.some((doc) => doc.originalName === 'lista.txt'));
});

test('GET /documents/:id/download baixa o conteúdo enviado', async () => {
  const form = new FormData();
  form.append('file', new Blob(['conteudo baixavel']), 'download.txt');
  const uploadResponse = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });
  const { id } = await uploadResponse.json();

  const response = await fetch(`${baseUrl}/documents/${id}/download`);
  assert.strictEqual(response.status, 200);
  const text = await response.text();
  assert.strictEqual(text, 'conteudo baixavel');
});

test('GET /documents/:id/download com id inexistente retorna 404', async () => {
  const response = await fetch(`${baseUrl}/documents/id-inexistente/download`);
  assert.strictEqual(response.status, 404);
});
