# Como Executar — Naruto Quotes

Escolha **um** guia conforme seu ambiente:

| Guia | Quando usar | Requisitos no PC |
| --- | --- | --- |
| **[COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md)** | Executar em qualquer máquina com containers | Docker Desktop |
| **[COMO_EXECUTAR_LOCAL.md](COMO_EXECUTAR_LOCAL.md)** | Desenvolver com Node e Python instalados | Node.js 18+, Python 3.9+ |
| [ACESSOS_TESTES.md](ACESSOS_TESTES.md) | URLs, endpoints e validação do ambiente | — |

---

## Início rápido

### Docker (recomendado)

```bash
docker compose up -d --build
```

Aplicação: http://localhost:8080
API: http://localhost:3333

### Local — sem Docker

API (terminal 1):

```bash
cd naruto_api
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements-dev.txt
python app.py
```

Client (terminal 2):

```bash
cd naruto-client
npm install
npm run dev
```

Aplicação: http://localhost:3000
API: http://localhost:3333

---

## Arquitetura

Microserviços: dois serviços independentes que sobem juntos pelo Docker Compose.

```
naruto-client (React 19 + Vite)  ──/api──►  naruto_api (Flask 3 + pandas)
     nginx :8080                                gunicorn :3333
```

O client **nunca** guarda a URL absoluta da API. Ele sempre chama `/api`, e quem
redireciona é o proxy do Vite (desenvolvimento) ou o nginx (Docker). Por isso o
mesmo bundle roda em qualquer máquina, sem rebuild.

---

## Este projeto não usa banco de dados

As 509 frases vêm do arquivo `naruto_api/finalQuotes.csv`, carregado em memória
quando a API sobe. Não existem migrations, seeders, login ou painel administrativo.

---

## URLs principais

| Área | Local | Docker |
| --- | --- | --- |
| Aplicação | http://localhost:3000 | http://localhost:8080 |
| Frase aleatória | http://localhost:3333/ | http://localhost:8080/api/ |
| Todas as frases | http://localhost:3333/quotes | http://localhost:8080/api/quotes |
| Healthcheck | http://localhost:3333/health | http://localhost:8080/api/health |

---

## Testes

```bash
cd naruto_api    && .venv/Scripts/python -m pytest      # 40 testes, 100% cobertura
cd naruto-client && npm run test:coverage               # 46 testes, 100% statements
cd e2e           && npx playwright test                 # 48 testes em 4 navegadores
```

Os testes E2E precisam da aplicação no ar (`docker compose up -d`).

---

## Outros documentos

- [ACESSOS_TESTES.md](ACESSOS_TESTES.md) — endpoints, validação do ambiente e dados de teste
- [COMO_EXECUTAR_LOCAL.md](COMO_EXECUTAR_LOCAL.md) — execução sem Docker
- [COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md) — execução com containers
