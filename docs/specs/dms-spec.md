# Especificação do Document Management System (DMS)

## 1. Objetivo

O sistema deve permitir que usuários registrem, consultem e baixem documentos de forma simples e segura, mantendo o armazenamento local da aplicação e os metadados em memória durante esta fase inicial.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos enviados
- Download de documentos por identificador
- Associação de cada documento a um proprietário ou usuário dono
- Persistência local dos arquivos no filesystem da aplicação
- Validação básica de entrada e erros de operação

### Fora do escopo

- Armazenamento em nuvem ou em serviços externos
- Versionamento de documentos
- Compartilhamento público ou links temporários
- Busca textual por conteúdo dos arquivos
- Autenticação e autorização complexa de usuários
- Controle de permissões por papel ou grupo
- Backup centralizado ou replicação de arquivos

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o envio de um documento por um usuário. |
| RF-02 | O sistema deve validar que foi enviado um arquivo válido no request multipart/form-data. |
| RF-03 | O sistema deve gerar um identificador único para cada documento enviado. |
| RF-04 | O sistema deve registrar os metadados do documento, incluindo nome original, tamanho, data e dono. |
| RF-05 | O sistema deve permitir a listagem de todos os documentos registrados. |
| RF-06 | O sistema deve permitir a listagem de documentos filtrados por proprietário, quando informado. |
| RF-07 | O sistema deve permitir o download de um documento a partir do seu identificador. |
| RF-08 | O sistema deve retornar erro quando o documento solicitado não existir. |
| RF-09 | O sistema deve manter o nome original do arquivo para apresentação ao usuário. |
| RF-10 | O sistema deve garantir que o arquivo enviado seja gravado em local seguro e acessível apenas pela aplicação. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos devem ser gravados no filesystem local da aplicação, na pasta backend/storage, utilizando multer com diskStorage. |
| RNF-02 | Os metadados dos documentos devem ser mantidos em memória nesta fase inicial. |
| RNF-03 | A aplicação deve permitir configuração via variáveis de ambiente, seguindo princípios de 12-Factor App. |
| RNF-04 | A API deve responder em JSON para operações de metadados e em stream binário para download de arquivos. |
| RNF-05 | O backend deve seguir a estrutura de Clean Architecture simples: routes, controllers, services e repositories. |
| RNF-06 | O frontend deve seguir arquitetura baseada em componentes e utilizar fetch com prefixo /api. |
| RNF-07 | A solução deve ser simples, legível e fácil de evoluir sem aumento de complexidade desnecessária. |

## 5. Modelo de dados

O sistema trabalha com metadados do documento para permitir controle de cadastro, consulta e download. A persistência do arquivo é local no filesystem; os metadados são mantidos em memória.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | Identificador único do documento, gerado pela aplicação. |
| originalName | string | Nome original do arquivo enviado pelo usuário. |
| storedName | string | Nome do arquivo salvo no armazenamento local da aplicação. |
| size | number | Tamanho do arquivo em bytes. |
| mimeType | string | Tipo de conteúdo do arquivo, quando disponível. |
| uploadedAt | string | Data e hora do upload no formato ISO 8601. |
| owner | string | Identificador do usuário ou dono do documento. |
| storagePath | string | Caminho local do arquivo salvo em backend/storage. |

### Regras do modelo

- O campo `id` deve ser único para cada documento registrado.
- O campo `owner` representa a referência simples do usuário responsável pelo documento.
- `originalName` deve ser mantido para exibição em telas e relatórios.
- `storedName` deve ser usado para identificar o arquivo físico salvo localmente.
- `storagePath` deve refletir a localização física do arquivo no sistema de arquivos da aplicação.
- `uploadedAt` deve seguir padrão ISO 8601, por exemplo: `2026-09-15T14:30:00.000Z`.

## 6. Contratos de API

### 6.1. POST /upload

#### Objetivo

Enviar um documento para o sistema e criar seus metadados.

#### Requisição

- Método: `POST`
- Content-Type: `multipart/form-data`
- Campos esperados:
  - `file`: arquivo enviado
  - `owner`: identificador do usuário dono do documento (quando houver associação explícita no fluxo)

#### Resposta esperada (201 Created)

```json
{
  "id": "1700000000000-abc123",
  "originalName": "arquivo-teste.txt",
  "storedName": "1700000000000-arquivo-teste.txt",
  "size": 1542,
  "mimeType": "text/plain",
  "uploadedAt": "2026-09-15T14:30:00.000Z",
  "owner": "usuario-01",
  "storagePath": "/app/backend/storage/1700000000000-arquivo-teste.txt"
}
```

#### Possíveis erros

- `400 Bad Request`: nenhum arquivo enviado ou payload inválido.
- `500 Internal Server Error`: falha durante gravação do arquivo ou registro do metadado.

### 6.2. GET /documents

#### Objetivo

Listar todos os documentos cadastrados.

#### Requisição

- Método: `GET`
- Query params opcionais:
  - `owner`: filtrar por identificador do proprietário

#### Resposta esperada (200 OK)

```json
[
  {
    "id": "1700000000000-abc123",
    "originalName": "arquivo-teste.txt",
    "storedName": "1700000000000-arquivo-teste.txt",
    "size": 1542,
    "mimeType": "text/plain",
    "uploadedAt": "2026-09-15T14:30:00.000Z",
    "owner": "usuario-01",
    "storagePath": "/app/backend/storage/1700000000000-arquivo-teste.txt"
  }
]
```

#### Possíveis erros

- `500 Internal Server Error`: falha na leitura dos metadados ou do armazenamento local.

### 6.3. GET /documents/:id/download

#### Objetivo

Recuperar o conteúdo binário de um documento específico.

#### Requisição

- Método: `GET`
- Parâmetro de rota:
  - `id`: identificador do documento

#### Resposta esperada (200 OK)

- Content-Type: tipo do arquivo
- Content-Disposition: `attachment; filename="nome-original.extensao"`
- Corpo: stream binário do arquivo salvo localmente

#### Possíveis erros

- `404 Not Found`: documento inexistente.
- `500 Internal Server Error`: erro ao ler o arquivo do filesystem local.

## 7. Decisões arquiteturais

- O backend deve seguir a arquitetura em camadas simples:
  - `routes`: definição de endpoints e delegação para controllers
  - `controllers`: entrada e saída HTTP, validação básica
  - `services`: regras de negócio e coordenação
  - `repositories`: acesso aos metadados e ao armazenamento local
- O armazenamento de arquivos deve ser local e exclusivo da aplicação, sem uso de provedores externos.
- O frontend deve seguir padrão baseado em componentes com React e hooks.
- A comunicação com o backend deve ocorrer via `fetch`, com prefixo `/api` e proxy configurado no Vite.
- Os metadados devem ser mantidos em memória nesta fase, como estrutura de dados simples, sem banco de dados.
- A solução deve evitar overengineering e abstrações que não sejam necessárias ao escopo inicial.

## 8. Plano de execução em etapas

O plano abaixo descreve a sequência de trabalho em nível de especificação e validação, sem detalhar a execução de arquivos concretos do backend e do frontend.

1. Levantamento e alinhamento do objetivo do sistema, escopo e critérios de aceite.
2. Definição dos requisitos funcionais e não funcionais, incluindo regras de negócio do upload, listagem e download.
3. Formalização do modelo de dados e dos metadados essenciais do documento.
4. Definição dos contratos de API para upload, listagem e download, incluindo payloads e respostas esperadas.
5. Validação da arquitetura esperada, garantindo aderência ao padrão Clean Architecture simples e ao armazenamento local com multer.
6. Definição do fluxo operacional para arquivos e metadados, com atenção ao tratamento de erros e aos cenários de documento inexistente.
7. Verificação do comportamento esperado do sistema nos casos de sucesso e falha, antes da implementação técnica.
8. Preparação para a fase de codificação, com foco em manter a entrega simples, testável e evolutiva.

## 9. Critérios de aceite

- O usuário consegue enviar um documento e receber confirmação de sucesso com seus metadados.
- O sistema lista os documentos enviados, preservando nome original, dono e timestamp de upload.
- O usuário consegue baixar o arquivo salvo através do identificador do documento.
- O arquivo físico é gravado no filesystem local da aplicação e não em armazenamento externo.
- O comportamento em cenários de erro é previsível e informativo.
- A arquitetura permanece aderente ao padrão de Clean Architecture simples definido para o projeto.
