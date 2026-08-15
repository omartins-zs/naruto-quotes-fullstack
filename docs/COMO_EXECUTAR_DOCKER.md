# Como Executar com Docker — Naruto Quotes

Guia para executar o sistema utilizando Docker Desktop. É o caminho recomendado:
não exige Node nem Python instalados na máquina.

---

## Stack e containers

| Container | Função | Porta |
| --- | --- | --- |
| `naruto_client` | React 19 buildado, servido pelo nginx | 8080 |
| `naruto_api` | API Flask 3 rodando em gunicorn | 3333 |

O projeto **não usa banco de dados**, então não há containers de MySQL, Redis ou
phpMyAdmin. As 509 frases vêm de `naruto_api/finalQuotes.csv`, carregado em memória.

---

## 1) Preparar ambiente

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

O `.env` da raiz controla apenas as portas publicadas na sua máquina:

```env
APP_PORT=8080
API_PORT=3333
VITE_API_URL=/api
CORS_ORIGINS=*
```

> Os `.env` de `naruto_api/` e `naruto-client/` valem para execução **local**. No
> Docker, o Compose injeta as variáveis diretamente nos containers, então não é
> preciso alternar nada para subir com containers.

---

## 2) Subir containers

```bash
docker compose up -d --build
docker compose ps
```

Saída esperada:

```
SERVICE   STATUS
api       Up (healthy)
client    Up (healthy)
```

O client só sobe depois que a API passa no healthcheck (`depends_on: service_healthy`).

---

## 3) Acessar

| Recurso | URL |
| --- | --- |
| Aplicação | http://localhost:8080 |
| Frase aleatória (via nginx) | http://localhost:8080/api/ |
| Healthcheck (via nginx) | http://localhost:8080/api/health |
| API direta | http://localhost:3333 |

---

## 4) Rodar os testes E2E contra os containers

```bash
cd e2e
npm install
npx playwright install
npx playwright test
```

São 12 cenários em 4 navegadores (Chromium, Firefox, WebKit e Mobile Chrome) = 48 testes.
O `baseURL` padrão já é `http://localhost:8080`.

Relatório:

```bash
npx playwright show-report
```

---

## 5) Logs e diagnóstico

```bash
docker compose logs -f
docker compose logs -f api
docker compose logs -f client
```

Verificar a saúde da API por dentro do container:

```bash
docker compose exec api python -c "import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:3333/health').read())"
```

---

## 6) Ajustar capacidade da API

O gunicorn é configurável por variáveis de ambiente, com estes padrões:

| Variável | Padrão | Função |
| --- | --- | --- |
| `GUNICORN_WORKERS` | 4 | processos |
| `GUNICORN_THREADS` | 8 | threads por processo |
| `GUNICORN_TIMEOUT` | 60 | timeout em segundos |

Para alterar, adicione ao `.env` da raiz e suba de novo:

```env
GUNICORN_WORKERS=8
GUNICORN_THREADS=16
```

---

## 7) Parar ou reconstruir

```bash
docker compose down            # para os containers
docker compose up -d --build   # reconstrói e sobe
docker compose restart api     # reinicia só a API
```

Como não há volumes de dados, `docker compose down` não apaga nada relevante — as
frases moram no CSV versionado no repositório.

---

## 8) Problemas comuns

### Porta 8080 ocupada

Altere `APP_PORT` no `.env` da raiz e rode `docker compose up -d` de novo.

### O client mostra o alerta de erro

Confira se a API está saudável:

```bash
docker compose ps
curl http://localhost:8080/api/health
```

### Mudança no código não apareceu

As imagens são buildadas, não montadas por volume. Reconstrua:

```bash
docker compose up -d --build
```

---

## Próximo passo

Para desenvolver com hot reload, consulte [COMO_EXECUTAR_LOCAL.md](COMO_EXECUTAR_LOCAL.md).
