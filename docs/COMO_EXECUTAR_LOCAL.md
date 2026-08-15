# Como Executar Localmente — Naruto Quotes

Guia para rodar **sem Docker**, com Node.js e Python instalados na máquina.

> **Não quer instalar Node e Python?** Use [COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md) — basta Docker Desktop, em qualquer Windows, Mac ou Linux.

---

## Requisitos

| Ferramenta | Obrigatório? | Versão mínima |
| --- | --- | --- |
| **Node.js** | Sim (client) | 18+ |
| **NPM** | Sim (client) | 9+ |
| **Python** | Sim (API) | 3.9+ |
| **pip** | Sim (API) | 21+ |

O projeto **não usa banco de dados**. As frases vêm de um CSV lido em memória.

### Ambiente de referência (máquina de desenvolvimento)

Stack usada na elaboração deste projeto — **não é requisito fixo**, só referência do que já foi testado:

| Ferramenta | Versão |
| --- | --- |
| **Node.js** | **22.14.0** |
| **NPM** | **11.4.2** |
| **Python** | **3.10.6** |
| Docker | 29.6.1 |
| Docker Compose | v5.2.0 |

Para conferir no seu computador:

```bash
node -v
npm -v
python --version
```

---

## 1) Preparar ambiente

### 1.1 Acessar o projeto

```bash
cd naruto-quotes-fullstack
```

### 1.2 Copiar variáveis de ambiente

```bash
cp naruto_api/.env.example naruto_api/.env
cp naruto-client/.env.example naruto-client/.env
```

No PowerShell:

```powershell
Copy-Item naruto_api/.env.example naruto_api/.env
Copy-Item naruto-client/.env.example naruto-client/.env
```

### 1.3 Ativar o ambiente local

Os dois `.env` já vêm com o bloco `LOCAL` ativo e o bloco `DOCKER` comentado.

`naruto_api/.env`:

```env
# LOCAL
API_HOST=127.0.0.1
API_PORT=3333
API_DEBUG=true
CORS_ORIGINS=http://localhost:3000

# DOCKER
# API_HOST=0.0.0.0
# API_PORT=3333
# API_DEBUG=false
# CORS_ORIGINS=http://localhost:8080
```

`naruto-client/.env`:

```env
# LOCAL
CLIENT_PORT=3000
VITE_API_URL=/api
API_PROXY_TARGET=http://localhost:3333

# DOCKER
# CLIENT_PORT=3000
# VITE_API_URL=/api
# API_PROXY_TARGET=http://api:3333
```

> `VITE_API_URL` é relativo nos dois modos. Só muda **para onde** o `/api` aponta:
> no modo local quem redireciona é o proxy do Vite; no Docker, o nginx.

---

## 2) Subir a API (terminal 1)

```bash
cd naruto_api
python -m venv .venv
```

Ativar o ambiente virtual — Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Linux, Mac ou Git Bash:

```bash
source .venv/bin/activate
```

Instalar e rodar:

```bash
pip install -r requirements-dev.txt
python app.py
```

API disponível em http://localhost:3333

---

## 3) Subir o client (terminal 2)

```bash
cd naruto-client
npm install
npm run dev
```

Aplicação disponível em http://localhost:3000

---

## 4) Rodar os testes

### API

```bash
cd naruto_api
.venv/Scripts/python -m pytest
```

Cobertura mínima exigida: **90%** (configurada em `pytest.ini`). O relatório HTML sai em `naruto_api/coverage_html/index.html`.

### Client

```bash
cd naruto-client
npm run test:coverage
```

Cobertura mínima exigida: **90%** em statements, branches, functions e lines (configurada em `vite.config.js`). O relatório HTML sai em `naruto-client/coverage/index.html`.

### End-to-end

Os testes E2E precisam da aplicação no ar. Com a API e o client rodando localmente:

```bash
cd e2e
npm install
npx playwright install
E2E_BASE_URL=http://localhost:3000 npx playwright test
```

No PowerShell:

```powershell
cd e2e
npm install
npx playwright install
$env:E2E_BASE_URL="http://localhost:3000"; npx playwright test
```

---

## 5) Comandos úteis

```bash
npm run build            # gera o bundle de produção do client
npm run preview          # serve o bundle gerado
npm run test:watch       # testes do client em modo watch
python -m pytest -k nome # roda um teste específico da API
```

---

## 6) Problemas comuns

### A porta 3000 já está em uso

O client usa 3000 e a API usa 3333 — portas diferentes de propósito. Se algo já
ocupa a 3000, altere `CLIENT_PORT` em `naruto-client/.env`.

> Na versão antiga do projeto a API também subia na 3000, brigando com o dev server
> do React. Era essa colisão que derrubava a aplicação.

### O client não encontra a API

Verifique se a API está de pé:

```bash
curl http://localhost:3333/health
```

Resposta esperada: `{"quotes":509,"status":"ok"}`

Depois confirme que `API_PROXY_TARGET` em `naruto-client/.env` aponta para `http://localhost:3333`.

### Alterações no .env não foram aplicadas

O Vite lê o `.env` só na subida. Pare o servidor (`Ctrl+C`) e rode `npm run dev` de novo.

### Erro ao ativar o venv no PowerShell

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## Próximo passo

Para ambiente containerizado, consulte [COMO_EXECUTAR_DOCKER.md](COMO_EXECUTAR_DOCKER.md).
