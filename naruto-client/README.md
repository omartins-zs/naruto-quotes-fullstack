# ⚛️ Naruto Quotes Client

Front-end em React 19 + Vite 6 que consome a Naruto Quotes API.

Parte do monorepo **[naruto-quotes-fullstack](../README.md)**.

## Rodar

```bash
npm install
npm run dev
```

Aplicação em http://localhost:3000 (a API precisa estar de pé na 3333).

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o bundle em `dist/` |
| `npm run preview` | Serve o bundle gerado |
| `npm test` | Roda os testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes com relatório de cobertura |

## Testes

46 testes com Vitest, Testing Library e MSW. Threshold de 90% configurado em
`vite.config.js` — o build de teste falha se a cobertura cair.

## Como a API é chamada

O client sempre chama `/api`, nunca uma URL absoluta:

- **desenvolvimento** — o proxy do Vite redireciona `/api` para `API_PROXY_TARGET`
- **Docker** — o nginx redireciona `/api` para o container da API

Por isso o mesmo bundle roda em qualquer máquina, sem rebuild.

## Estrutura

```
src/
├── components/    # Button, Quotes, GlobalStyle
├── hooks/         # useQuote: busca, loading e erro
├── pages/app/     # App
├── services/      # quotesService e audioService
└── mocks/         # handlers do MSW
```

Documentação completa em [`../docs/`](../docs).
