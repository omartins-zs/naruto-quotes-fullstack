<h1 align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="45" height="45" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="45" height="45" alt="Vite" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" width="45" height="45" alt="Python" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg" width="45" height="45" alt="Flask" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" width="45" height="45" alt="Docker" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg" width="45" height="45" alt="Nginx" />
  <br />
  🍥 Naruto Quotes
</h1>

<div align="center">

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

[![Testes](https://img.shields.io/badge/testes-134%20passando-success?style=flat-square)](#-testes)
[![Cobertura API](https://img.shields.io/badge/cobertura%20API-100%25-success?style=flat-square)](#-testes)
[![Cobertura Client](https://img.shields.io/badge/cobertura%20client-100%25-success?style=flat-square)](#-testes)

</div>

---

## 📝 Descrição

Aplicação fullstack que sorteia frases marcantes dos personagens de **Naruto**.
O front-end em React consome uma API em Flask que mantém 509 frases em memória,
e todo o ambiente sobe com **um único comando** graças ao Docker Compose.

<cite>Gerador de frases aleatórias de Naruto, construído como projeto multi stack para praticar integração entre front-end, API e containers.</cite>

> 🎓 Projeto desenvolvido durante o **Workshop Multi Stack da [TreinaWeb](https://www.treinaweb.com.br/)**,
> e posteriormente modernizado com Docker, testes automatizados e testes end-to-end.

---

## 🚦 Status do Projeto

<h4 align="center">
  ✅ Naruto Quotes 🚀 Concluído e funcional ⚙️
</h4>

---

## 🏗️ Arquitetura do Projeto

**Tipo: 🧩 Microserviços** — dois serviços independentes, orquestrados pelo Docker Compose.

```
┌─────────────────────────┐         ┌─────────────────────────┐
│      naruto-client      │         │       naruto_api        │
│                         │  /api   │                         │
│  React 19 + Vite 6      ├────────►│  Flask 3 + pandas 2     │
│  servido pelo nginx     │  proxy  │  rodando em gunicorn    │
│                         │         │                         │
│       porta 8080        │         │       porta 3333        │
└─────────────────────────┘         └───────────┬─────────────┘
                                                │
                                                ▼
                                      finalQuotes.csv
                                        509 frases
```

O client **nunca** guarda a URL absoluta da API: ele sempre chama `/api`, e quem
redireciona é o proxy do Vite (desenvolvimento) ou o nginx (Docker). Por isso o
mesmo bundle roda em qualquer máquina, sem precisar rebuildar.

---

## 🔥 Pré-requisitos

### Para rodar com Docker (recomendado)

- **Docker Desktop** 20.10+
- **Docker Compose** v2+

Nada mais. Não é preciso ter Node nem Python instalados.

### Para rodar localmente

- **Node.js** 18+ (recomendado 22+)
- **NPM** 9+
- **Python** 3.9+ (recomendado 3.12)
- **pip** 21+

---

## 🚀 Tecnologias Utilizadas

### Front-end

- **React 19** — biblioteca de interface
- **Vite 6** — build tool e dev server
- **styled-components 6** — CSS-in-JS
- **Vitest 2** + **Testing Library** — testes unitários e de componentes
- **MSW 2** — mock de API nos testes

### Back-end

- **Python 3.12**
- **Flask 3.1** — framework web
- **Flask-Cors 5** — controle de CORS
- **pandas 2.2** — leitura e tratamento do CSV
- **gunicorn 23** — servidor WSGI de produção
- **pytest 8** + **pytest-cov** — testes e cobertura

### Infraestrutura

- **Docker** + **Docker Compose** — containerização
- **nginx 1.27 Alpine** — servidor estático e proxy reverso
- **Playwright 1.49** — testes end-to-end

### Padrões aplicados

- Application Factory (Flask)
- Repository Pattern (acesso às frases)
- Injeção de dependência para testabilidade
- Configuração por variáveis de ambiente
- Custom Hooks (React)
- Multi-stage build (Docker)

---

## 🔨 Funcionalidades

- 🎲 **Sorteio de frases** — 509 frases reais de personagens de Naruto
- 🔊 **Efeito sonoro** — som de jutsu ao carregar cada frase
- 🔄 **Botão "Quote No Jutsu"** — busca uma nova frase sem recarregar a página
- ⏳ **Estado de carregamento** — botão desabilitado e com texto próprio durante a requisição
- ⚠️ **Tratamento de erro** — alerta acessível quando a API falha, mantendo a última frase válida em tela
- ♻️ **Recuperação automática** — ao clicar novamente, o alerta some assim que a API responde
- 🩺 **Healthcheck** — endpoint `/health` usado pelo Docker e pelos testes
- 📋 **Listagem completa** — endpoint `/quotes` devolve todas as frases carregadas

---

## 🎯 Sobre o Projeto

Sistema desenvolvido demonstrando boas práticas de desenvolvimento, arquitetura
limpa e organização de código, com foco em escalabilidade e manutenção.

A versão original foi feita durante um workshop e rodava apenas na máquina de
desenvolvimento. Esta versão foi modernizada para rodar em **qualquer máquina**:

| Antes | Agora |
| --- | --- |
| React 17 + Create React App (quebrava no Node 22) | React 19 + Vite 6 |
| Flask 1.1 + pandas 1.2 + Python 3.8 | Flask 3.1 + pandas 2.2 + Python 3.12 |
| Servidor de desenvolvimento do Flask | gunicorn com workers configuráveis |
| API e client disputando a porta 3000 | API na 3333, client na 8080 |
| URL da API fixa no `.env` do build | Caminho relativo `/api` resolvido por proxy |
| Sem containers para o front | Docker Compose sobe tudo com um comando |
| 5 testes | 134 testes automatizados |

---

## 📸 Preview do Projeto

<div align="center">
  <img src="./naruto-client/src/images/2NP90DSQce.gif" width="700" alt="Preview do Naruto Quotes" />
</div>

---

## 📊 Documentação da API

Base local: `http://localhost:3333` · Via nginx no Docker: `http://localhost:8080/api`

### `GET /`

Retorna uma frase aleatória.

```json
{
  "speaker": "Sasuke Uchiha",
  "quote": "My name is Sasuke Uchiha. I hate a lot of things, and I don't particularly like anything."
}
```

### `GET /quotes`

Retorna todas as frases carregadas.

```json
{
  "total": 509,
  "quotes": [{ "speaker": "Neji Hyuuga", "quote": "The difference between stupidity and genius..." }]
}
```

### `GET /health`

Healthcheck usado pelo Docker e pelos testes E2E.

```json
{ "status": "ok", "quotes": 509 }
```

### Erros

Rotas inexistentes devolvem JSON, nunca HTML:

```json
{ "error": "not_found", "message": "Rota inexistente." }
```

### 📁 Documentação complementar

A pasta [`docs/`](./docs) contém:

- **[COMO_EXECUTAR.md](./docs/COMO_EXECUTAR.md)** — guia principal e início rápido
- **[COMO_EXECUTAR_LOCAL.md](./docs/COMO_EXECUTAR_LOCAL.md)** — execução sem Docker
- **[COMO_EXECUTAR_DOCKER.md](./docs/COMO_EXECUTAR_DOCKER.md)** — execução com containers
- **[ACESSOS_TESTES.md](./docs/ACESSOS_TESTES.md)** — endpoints, validação e massa de teste

---

## 💻 Comandos

### 🐳 Docker (recomendado)

```bash
cp .env.example .env
docker compose up -d --build
```

Aplicação: **http://localhost:8080**

```bash
docker compose ps         # status dos containers
docker compose logs -f    # acompanhar logs
docker compose down       # parar tudo
```

### 💻 Local — API

```bash
cd naruto_api
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements-dev.txt
python app.py
```

### 💻 Local — Client

```bash
cd naruto-client
npm install
npm run dev
```

> ⚠️ Estes são comandos básicos. Verifique no projeto arquivos como
> README.md, docs/COMO_EXECUTAR.md ou docs/ para instruções completas.

---

## 🧪 Testes

São **134 testes automatizados** cobrindo as três camadas.

| Suíte | Ferramenta | Testes | Cobertura |
| --- | --- | --- | --- |
| API | pytest + pytest-cov | 40 | **100%** |
| Client | Vitest + Testing Library + MSW | 46 | **100%** statements / 97% branches |
| End-to-end | Playwright | 48 (12 × 4 navegadores) | — |

Ambas as suítes unitárias têm **threshold de 90% configurado** e falham se a cobertura cair.

```bash
# API
cd naruto_api && .venv/Scripts/python -m pytest

# Client
cd naruto-client && npm run test:coverage

# End-to-end (precisa da aplicação no ar)
cd e2e && npm install && npx playwright install && npx playwright test
```

Os testes E2E rodam em **Chromium, Firefox, WebKit e Mobile Chrome**, validando o
fluxo real, a resiliência a falhas da API e a integração pelo proxy do nginx.

---

## 🧱 Estrutura do Projeto

```
naruto-quotes-fullstack/
├── docker-compose.yml          # orquestra client + api
├── .env.example                # portas publicadas na máquina
│
├── naruto_api/                 # 🐍 API Flask
│   ├── narutoapi/
│   │   ├── __init__.py         # application factory
│   │   ├── config.py           # configuração via env
│   │   ├── quotes.py           # repositório das frases
│   │   └── routes.py           # blueprint das rotas
│   ├── tests/                  # 40 testes
│   ├── finalQuotes.csv         # 509 frases
│   ├── wsgi.py                 # entrypoint do gunicorn
│   ├── app.py                  # entrypoint de desenvolvimento
│   └── Dockerfile
│
├── naruto-client/              # ⚛️ Front-end React
│   ├── src/
│   │   ├── components/         # Button, Quotes, GlobalStyle
│   │   ├── hooks/useQuote.js   # busca, loading e erro
│   │   ├── pages/app/          # App
│   │   ├── services/           # quotesService e audioService
│   │   └── mocks/              # handlers MSW
│   ├── nginx.conf              # proxy /api + fallback SPA
│   ├── vite.config.js
│   └── Dockerfile              # multi-stage: build + nginx
│
├── e2e/                        # 🎭 Playwright
│   ├── tests/quotes.spec.js    # 12 cenários
│   └── playwright.config.js
│
└── docs/                       # 📚 documentação
```

---

## 📝 Melhorias Futuras

- [ ] Adicionar CI no GitHub Actions rodando as três suítes
- [ ] Publicar as imagens no Docker Hub ou GitHub Container Registry
- [ ] Endpoint de busca por personagem (`/quotes?speaker=naruto`)
- [ ] Cache HTTP nas respostas da API
- [ ] Compartilhamento da frase em redes sociais
- [ ] Modo escuro
- [ ] Traduzir as frases para português

---

## 🖋️ Dicas

- Use `docker compose logs -f api` para acompanhar as requisições em tempo real.
- Precisa de mais capacidade? Ajuste `GUNICORN_WORKERS` e `GUNICORN_THREADS` no `.env`.
- `npx playwright test --ui` abre o modo interativo, ótimo para depurar E2E.
- `npm run test:watch` no client roda os testes a cada alteração de arquivo.
- Os relatórios de cobertura ficam em `naruto_api/coverage_html/` e `naruto-client/coverage/`.

---

<div align="center">

Feito com ❤️ por Gabriel Martins 🚀

</div>
