---
description: Melhora o visual do frontend do DMS aplicando Tailwind CSS 3.
name: melhorar-visual-tailwind
agent: tailwind-ui
---

# Melhorar visual com Tailwind CSS 3

Melhore o visual do frontend do Document Management System aplicando Tailwind CSS 3,
sem alterar a lógica de negócio dos componentes.

## Contexto

- Frontend em `frontend/` (React + Vite), sem Tailwind instalado ainda.
- Componentes principais: `App.jsx`, `pages/DocumentsPage.jsx`,
  `components/UploadComponent.jsx`, `components/DocumentList.jsx`,
  `components/DownloadButton.jsx`.
- Estilos atuais são inline ou inexistentes; a tela não tem identidade visual.

## Tarefas

1. Instale e configure o Tailwind CSS 3 no `frontend` (dependências, `tailwind.config.js`,
   `postcss.config.js` e diretivas `@tailwind` no CSS de entrada importado em `main.jsx`).
2. Aplique um layout limpo e consistente em `App.jsx` (cabeçalho, container central,
   espaçamento).
3. Estilize o formulário de upload (`UploadComponent.jsx`): campos, botão de envio
   com estado de carregamento e mensagem de erro destacada.
4. Estilize a listagem de documentos (`DocumentList.jsx`): tabela responsiva, estado
   vazio ("Nenhum documento enviado ainda.") com destaque visual adequado.
5. Estilize o botão de download (`DownloadButton.jsx`) de forma consistente com o
   restante da interface.

## Restrições

- Não altere chamadas a `services/documentService.js` nem a lógica de estado dos
  componentes.
- Não use bibliotecas de componentes de terceiros, apenas classes utilitárias do
  Tailwind.
- Não quebre os testes existentes do backend.
- Ao final, valide rodando o frontend (`npm run dev` em `frontend/`) e reporte
  como conferir visualmente o resultado.
