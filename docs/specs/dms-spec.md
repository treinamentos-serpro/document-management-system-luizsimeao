# Especificação - Document Management System

> Especificação do Document Management System (DMS) para orientar o
> desenvolvimento guiado por especificação. Este documento descreve o produto,
> os contratos esperados e o plano de execução futuro, sem executar ou alterar
> arquivos de backend ou frontend nesta etapa.

## 1. Objetivo

Entregar um sistema web simples para envio, listagem e download de documentos,
mantendo os arquivos no filesystem local da aplicação e os metadados em memória
nesta fase inicial.

## 2. Escopo

### Dentro do escopo

- Upload de documentos por usuário.
- Listagem dos documentos cadastrados.
- Download de documento pelo identificador.
- Gestão simples por usuário, baseada em um identificador textual de dono.
- Armazenamento local dos arquivos em `backend/storage`.
- Registro de metadados em memória durante o ciclo de vida do processo Node.js.
- Backend em Node.js com Express, organizado em Clean Architecture simples.
- Frontend em React com Vite, consumindo a API por `fetch` via prefixo `/api`.

### Fora do escopo

- Armazenamento externo, em nuvem ou em serviços de terceiros.
- Versionamento de documentos.
- Banco de dados persistente.
- Autenticação, autorização avançada ou gestão completa de usuários.
- Compartilhamento de documentos entre usuários.
- Edição, pré-visualização, OCR, assinatura digital ou classificação automática.
- Criptografia específica por documento.
- Execução ou implementação imediata dos arquivos de backend e frontend nesta
  etapa de especificação.

## 3. Requisitos funcionais

| ID    | Requisito |
| ----- | --------- |
| RF-01 | O usuário pode enviar um documento por uma requisição `multipart/form-data`. |
| RF-02 | O upload deve receber o arquivo no campo `file`. |
| RF-03 | O upload deve aceitar um identificador simples de usuário dono (`owner`) quando informado. |
| RF-04 | Quando `owner` não for informado, o backend deve aplicar um dono padrão para manter o fluxo simples nesta fase. |
| RF-05 | Ao receber um arquivo válido, o sistema deve gravar o conteúdo no filesystem local da aplicação. |
| RF-06 | Ao concluir o upload, o sistema deve registrar os metadados do documento em memória. |
| RF-07 | Ao concluir o upload, a API deve retornar os metadados do documento criado. |
| RF-08 | O usuário pode listar os documentos registrados em memória. |
| RF-09 | A listagem pode ser filtrada por `owner` quando esse parâmetro for informado. |
| RF-10 | A resposta da listagem deve conter apenas metadados, sem o conteúdo binário dos arquivos. |
| RF-11 | O usuário pode baixar um documento informando o identificador do documento na rota de download. |
| RF-12 | O download deve retornar o conteúdo binário do arquivo armazenado localmente. |
| RF-13 | Quando o documento solicitado não existir, a API deve retornar erro `404`. |
| RF-14 | Quando o upload não receber arquivo, a API deve retornar erro `400`. |
| RF-15 | Quando ocorrer erro inesperado de leitura, escrita ou processamento, a API deve retornar erro `500` com mensagem genérica. |
| RF-16 | O endpoint de saúde `/health` pode permanecer disponível para verificação básica da aplicação. |

## 4. Requisitos não funcionais

| ID     | Requisito |
| ------ | --------- |
| RNF-01 | Os arquivos enviados devem ser gravados no filesystem local da aplicação. |
| RNF-02 | O diretório padrão de armazenamento deve ser `backend/storage`. |
| RNF-03 | O upload deve utilizar `multer` com `diskStorage`. |
| RNF-04 | Os metadados dos documentos devem permanecer em memória nesta fase inicial. |
| RNF-05 | A configuração deve seguir 12-Factor App, usando variáveis de ambiente quando houver valores configuráveis. |
| RNF-06 | O backend deve seguir Clean Architecture simples com camadas `routes`, `controllers`, `services` e `repositories`. |
| RNF-07 | O fluxo de dependência deve ser `routes -> controllers -> services -> repositories`. |
| RNF-08 | Camadas internas não devem depender de camadas externas. |
| RNF-09 | Controllers devem tratar entrada HTTP, validação básica e saída HTTP. |
| RNF-10 | Services devem concentrar regras de negócio e orquestração dos casos de uso. |
| RNF-11 | Repositories devem cuidar da persistência local e do armazenamento de metadados. |
| RNF-12 | O código deve priorizar legibilidade, simplicidade e baixo acoplamento. |
| RNF-13 | O sistema deve evitar dependências novas sem necessidade clara. |
| RNF-14 | Erros devem ser tratados nos limites do sistema, especialmente nas entradas HTTP e operações de arquivo. |
| RNF-15 | Os testes de backend devem usar o runner nativo do Node.js (`node:test`). |
| RNF-16 | O frontend deve usar componentes funcionais com React Hooks. |
| RNF-17 | A comunicação do frontend com o backend deve usar `fetch` através do prefixo `/api`. |

## 5. Modelo de dados (metadados do documento)

Os metadados representam o estado mínimo necessário para listar e localizar os
arquivos armazenados localmente. Nesta fase, eles ficam em memória e são
perdidos quando o processo do backend é reiniciado.

| Campo        | Tipo   | Obrigatório | Exposto na API | Descrição |
| ------------ | ------ | ----------- | -------------- | --------- |
| id           | string | Sim | Sim | Identificador único do documento. |
| originalName | string | Sim | Sim | Nome original do arquivo enviado pelo usuário. |
| storedName   | string | Sim | Sim | Nome físico usado para gravar o arquivo no filesystem local. |
| mimeType     | string | Sim | Sim | Tipo MIME recebido no upload. |
| size         | number | Sim | Sim | Tamanho do arquivo em bytes. |
| uploadedAt   | string | Sim | Sim | Data e hora do upload em formato ISO 8601. |
| owner        | string | Sim | Sim | Identificador textual do usuário dono do documento. |
| path         | string | Sim | Não | Caminho interno do arquivo no servidor. Deve ser usado apenas pelo backend. |

### Exemplo conceitual

```json
{
  "id": "doc_1737560000000_ab12cd",
  "originalName": "contrato.pdf",
  "storedName": "doc_1737560000000_ab12cd.pdf",
  "mimeType": "application/pdf",
  "size": 245760,
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "user-123"
}
```

## 6. Contratos de API

Todos os endpoints do DMS devem ser expostos pelo backend Express. No frontend,
as chamadas devem usar o prefixo `/api`, conforme proxy do Vite.

### POST /upload

Cria um documento a partir de um arquivo enviado pelo usuário.

- Método: `POST`
- Caminho: `/upload`
- Content-Type da requisição: `multipart/form-data`
- Campo de arquivo: `file`
- Campos adicionais:
  - `owner` (string, opcional): identificador simples do dono do documento.

#### Resposta de sucesso

- Status: `201 Created`
- Content-Type: `application/json`
- Corpo: metadados do documento criado, sem o campo interno `path`.

```json
{
  "id": "doc_1737560000000_ab12cd",
  "originalName": "contrato.pdf",
  "storedName": "doc_1737560000000_ab12cd.pdf",
  "mimeType": "application/pdf",
  "size": 245760,
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "user-123"
}
```

#### Erros previstos

| Status | Quando ocorre | Corpo esperado |
| ------ | ------------- | -------------- |
| 400 | Nenhum arquivo foi enviado no campo `file`. | `{ "error": "Arquivo e obrigatorio." }` |
| 500 | Falha inesperada no upload, gravação ou registro de metadados. | `{ "error": "Erro interno ao enviar documento." }` |

### GET /documents

Lista os documentos registrados em memória.

- Método: `GET`
- Caminho: `/documents`
- Query parameters:
  - `owner` (string, opcional): filtra documentos pelo dono informado.

#### Resposta de sucesso

- Status: `200 OK`
- Content-Type: `application/json`
- Corpo: lista de metadados, sem o campo interno `path`.

```json
[
  {
    "id": "doc_1737560000000_ab12cd",
    "originalName": "contrato.pdf",
    "storedName": "doc_1737560000000_ab12cd.pdf",
    "mimeType": "application/pdf",
    "size": 245760,
    "uploadedAt": "2026-09-01T12:00:00.000Z",
    "owner": "user-123"
  }
]
```

#### Erros previstos

| Status | Quando ocorre | Corpo esperado |
| ------ | ------------- | -------------- |
| 500 | Falha inesperada ao consultar os metadados. | `{ "error": "Erro interno ao listar documentos." }` |

### GET /documents/:id/download

Baixa o conteúdo binário de um documento pelo identificador.

- Método: `GET`
- Caminho: `/documents/:id/download`
- Path parameters:
  - `id` (string, obrigatório): identificador único do documento.

#### Resposta de sucesso

- Status: `200 OK`
- Content-Type: deve refletir o `mimeType` registrado quando possível.
- Headers recomendados:
  - `Content-Disposition: attachment; filename="<originalName>"`
- Corpo: conteúdo binário do arquivo.

#### Erros previstos

| Status | Quando ocorre | Corpo esperado |
| ------ | ------------- | -------------- |
| 404 | Não existe documento com o `id` informado ou o arquivo físico não foi encontrado. | `{ "error": "Documento nao encontrado." }` |
| 500 | Falha inesperada ao preparar ou enviar o arquivo. | `{ "error": "Erro interno ao baixar documento." }` |

## 7. Decisões arquiteturais

- O backend deve ser organizado em Clean Architecture simples dentro de
  `backend/src`.
- `routes/` define os endpoints e aplica middlewares HTTP, incluindo o middleware
  de upload com `multer`.
- `controllers/` recebe `req` e `res`, valida entradas básicas, chama services e
  monta respostas HTTP.
- `services/` concentra regras de negócio, como registrar upload, listar
  documentos e localizar documento para download.
- `repositories/` mantém os metadados em memória e encapsula detalhes de acesso
  ao filesystem local.
- O fluxo de dependência deve permanecer `routes -> controllers -> services ->
  repositories`.
- O armazenamento físico deve usar apenas o filesystem local em
  `backend/storage`.
- O upload deve usar `multer` com `diskStorage`, evitando armazenamento em
  memória para o conteúdo binário do arquivo.
- Os metadados em memória são uma decisão explícita desta fase e não devem ser
  substituídos por banco de dados sem mudança de escopo.
- O campo interno `path` deve ser tratado como detalhe do backend e não precisa
  ser exposto nas respostas públicas da API.
- O frontend deve permanecer componentizado, com serviços em `frontend/src/services`
  encapsulando chamadas `fetch`.
- A interface deve consumir o backend pelo prefixo `/api`, aproveitando a
  configuração de proxy do Vite.

## 8. Plano de execução

Este plano descreve a ordem recomendada para implementação futura. Nesta etapa,
somente este documento de especificação deve ser criado.

1. Preparar configuração de armazenamento local.
   - Confirmar o diretório `backend/storage` como destino dos uploads.
   - Definir variável de ambiente opcional para caminho de storage se necessário.
   - Garantir que o diretório exista antes de gravar arquivos.

2. Implementar o repository de documentos.
   - Manter coleção em memória para os metadados.
   - Criar operação para salvar metadados.
   - Criar operação para listar todos os documentos.
   - Criar operação para listar por `owner`.
   - Criar operação para buscar documento por `id`.

3. Implementar configuração de upload com `multer`.
   - Usar `diskStorage`.
   - Gerar nome físico único para cada arquivo.
   - Preservar informações necessárias para montar os metadados.
   - Restringir o armazenamento ao filesystem local.

4. Implementar service de documentos.
   - Registrar upload recebido do controller.
   - Normalizar `owner` quando ausente.
   - Remover detalhes internos da resposta pública quando necessário.
   - Validar existência do documento antes do download.
   - Centralizar mensagens de erro de negócio.

5. Implementar controller de documentos.
   - Validar ausência de arquivo no upload.
   - Retornar `201` no upload bem-sucedido.
   - Retornar `200` na listagem.
   - Retornar download binário com headers adequados.
   - Converter erros conhecidos para status HTTP previsíveis.

6. Implementar routes.
   - Registrar `POST /upload` com middleware de upload.
   - Registrar `GET /documents`.
   - Registrar `GET /documents/:id/download`.
   - Conectar as rotas ao `app.js` sem remover `/health`.

7. Adicionar testes de backend.
   - Testar exportação do app existente.
   - Testar upload bem-sucedido.
   - Testar upload sem arquivo.
   - Testar listagem vazia e listagem com documento.
   - Testar download bem-sucedido.
   - Testar download de documento inexistente.

8. Implementar serviço de API no frontend.
   - Criar funções para upload, listagem e montagem de URL de download.
   - Usar `fetch` com prefixo `/api`.
   - Tratar erros de API com mensagens em português.

9. Implementar componentes de frontend.
   - Criar componente de upload.
   - Criar componente de listagem.
   - Criar botão ou ação de download.
   - Atualizar estado da lista após upload bem-sucedido.

10. Validar fluxo completo.
    - Executar testes do backend.
    - Executar build do frontend.
    - Validar manualmente upload, listagem e download em ambiente local.
    - Limpar arquivos temporários gerados por testes quando aplicável.

11. Atualizar documentação operacional se necessário.
    - Registrar variáveis de ambiente relevantes.
    - Registrar comandos de desenvolvimento e teste.
    - Documentar limitações conhecidas da fase inicial.