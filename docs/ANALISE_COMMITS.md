# 📋 Análise de Commits — Naruto Quotes

Análise **profunda** (Análise 2), por envolver refatoração grande, upgrade de stack
e mudança de arquitetura. Os commits foram agrupados por responsabilidade, não por arquivo.

Padrão seguido: [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits),
sempre com **1 emoji no formato `:nome:`**.

---

## 🐍 API — `naruto_api/`

### Arquivo
`naruto_api/requirements.txt`, `naruto_api/requirements-dev.txt`

**Análise:**
Stack elevada de Flask 1.1.2 / pandas 1.2.3 / Python 3.8 para Flask 3.1 / pandas 2.2 /
Python 3.12. Removidas as dependências transitivas fixadas à mão (`click`, `itsdangerous`,
`Jinja2`, `MarkupSafe`, `six`, `pytz`, `python-dateutil`, `Werkzeug`), que só existiam para
contornar incompatibilidades das versões antigas. Adicionados `gunicorn` (servidor WSGI de
produção) e `python-dotenv` (leitura do `.env`). Criado um `requirements-dev.txt` separado
com `pytest` e `pytest-cov`, para não levar ferramenta de teste à imagem de produção.

**Classificação:** Complexa

**Commit sugerido:**
`:package: build: atualizando API para Flask 3 e pandas 2`

---

### Arquivo
`naruto_api/narutoapi/quotes.py`

**Análise:**
Coração da correção. O código original tinha dois defeitos reais:

1. `random.randint(0, len(df))` — `randint` tem limite superior **inclusivo**, mas os
   índices válidos vão até `len(df) - 1`. Sempre que o sorteio caía no último valor, a
   API estourava `IndexError` e devolvia HTTP 500. Trocado por `random.choice`, que não
   tem como sair do intervalo.
2. `pd.read_csv(..., names=['Speakers','Quotes'])` sem tratar o cabeçalho — a linha `,0,1`
   do CSV era lida como dado, criando uma "frase" falsa em que o personagem era `0` e a
   frase era `1`. Corrigido com `header=0` e `usecols` explícito.

Também extraído para um `QuoteRepository` com carga única em memória, validação de arquivo
ausente/vazio (`QuoteSourceError`), descarte de linhas incompletas e cópia defensiva no
`all()`. O gerador aleatório é injetável, o que torna o sorteio determinístico nos testes.

**Impacto no sistema:** elimina os HTTP 500 esporádicos e a frase inválida. O total de
frases servidas passou de 510 (com a linha-lixo) para **509 reais**.

**Classificação:** Complexa

**Commit sugerido:**
`:bug: fix: corrigindo sorteio que estourava o indice`

---

### Arquivo
`naruto_api/narutoapi/__init__.py`, `config.py`, `routes.py`, `app.py`, `wsgi.py`

**Análise:**
O `app.py` original concentrava configuração, carga de dados, regra de negócio e rota em
25 linhas, com estado global de módulo — impossível de testar isoladamente. Reorganizado em
Application Factory (`create_app`) com injeção do repositório, `Settings` lido de variáveis
de ambiente, blueprint dedicado às rotas e handlers de erro que devolvem JSON em vez de HTML.
Adicionadas as rotas `/health` (usada pelo healthcheck do Docker) e `/quotes`. Criado o
`wsgi.py` como entrypoint do gunicorn, mantendo o `app.py` para desenvolvimento.

**Impacto no sistema:** a API deixa de depender de estado global, passa a ser configurável
sem alterar código e se torna testável.

**Classificação:** Complexa

**Commit sugerido:**
`:recycle: refactor: extraindo a API para o pacote narutoapi`

---

### Arquivo
`naruto_api/tests/`, `naruto_api/pytest.ini`

**Análise:**
Suíte criada do zero — o projeto não tinha nenhum teste de back-end. 40 testes cobrindo
rotas, healthcheck, CORS, preflight, 404/405/500, leitura do CSV, descarte do cabeçalho,
linhas incompletas, arquivo ausente e leitura de configuração. Inclui teste de regressão
que faz 2000 sorteios seguidos para provar que o `IndexError` não volta. Threshold de 90%
configurado no `pytest.ini`, com falha automática se a cobertura cair.

**Classificação:** Complexa

**Commit sugerido:**
`:test_tube: test: criando suite de testes da API`

---

### Arquivo
`naruto_api/.env.example`

**Análise:**
Arquivo novo, com blocos `LOCAL` e `DOCKER` — apenas um ativo por vez. Expõe `API_HOST`,
`API_PORT`, `API_DEBUG` e `CORS_ORIGINS`, que antes estavam fixos no código.

**Classificação:** Simples

**Commit sugerido:**
`:wrench: chore: configurando a API por variaveis de ambiente`

---

### Arquivo
`naruto_api/Dockerfile`, `naruto_api/.dockerignore`

**Análise:**
O Dockerfile antigo usava `python:3.8-slim-buster` (Debian 10, fora de suporte) e rodava
`flask run`, o servidor de **desenvolvimento**, na porta padrão 5000 — que não era a 3000
esperada pelo client. Reescrito para `python:3.12-slim` com gunicorn, porta 3333, usuário
não-root, healthcheck nativo e workers configuráveis por env. O `.dockerignore` tinha uma
única linha (`naruto`) e agora exclui `.git`, `.venv`, caches, testes e o `.env`.

**Impacto no sistema:** a imagem deixa de rodar servidor de desenvolvimento em produção e
passa a subir na porta que o client realmente chama.

**Classificação:** Complexa

**Commit sugerido:**
`:bricks: ci: dockerizando a API com gunicorn`

---

## ⚛️ Client — `naruto-client/`

### Arquivo
`package.json`, `vite.config.js`, `index.html`, `src/main.jsx` (removidos: `src/index.js`, `public/index.html`, `public/manifest.json`, `yarn.lock`, testes do CRA)

**Análise:**
Motivo principal do upgrade: `react-scripts@4.0.3` **não roda em Node 18+** por causa do
OpenSSL 3 (`error:0308010C:digital envelope routines::unsupported`) — ou seja, o projeto não
subia mais em máquina atual. Migrado para Vite 6 + React 19 + styled-components 6, com
`createRoot` no lugar do `ReactDOM.render` (removido no React 18+). Configurados proxy de
`/api` no dev server e Vitest com threshold de cobertura. `prop-types` removido porque o
React 19 não valida mais propTypes em runtime.

**Impacto no sistema:** o front volta a rodar em máquina moderna, e o build cai de dezenas
de segundos para ~1,3s.

**Classificação:** Complexa

**Commit sugerido:**
`:package: build: migrando o client para Vite 6 e React 19`

---

### Arquivo
`src/services/quotesService/quotesService.js`, `src/services/audioService.js`, `src/services/index.js`

**Análise:**
O serviço original era uma linha: `fetch(process.env.REACT_APP_API)`, com a URL absoluta
`http://localhost:3000/` fixada no `.env` **em tempo de build** — o bundle só funcionava na
máquina onde foi compilado. Reescrito para usar sempre o caminho relativo `/api`, resolvido
por proxy (Vite em desenvolvimento, nginx em Docker). Adicionados tratamento de respostas
não-ok, o endpoint de health e resolução de URL absoluta a partir da origem atual. O áudio
foi extraído para `audioService`, com `try/catch` — antes, o bloqueio de autoplay do
navegador podia derrubar a atualização da frase.

**Impacto no sistema:** o mesmo bundle passa a rodar em qualquer máquina, sem rebuild.

**Classificação:** Complexa

**Commit sugerido:**
`:recycle: refactor: resolvendo a URL da API por proxy`

---

### Arquivo
`src/hooks/useQuote.js`, `src/pages/app/App.jsx` (removido `App.js`)

**Análise:**
O `App` original acumulava estado, efeito, chamada de API e reprodução de áudio. A lógica foi
extraída para o hook `useQuote`, que expõe `status`, `error` e `refresh`, e mantém a última
frase válida quando uma atualização falha. A guarda de `isMounted` foi preservada e corrigida
para o StrictMode do React 19, que monta e desmonta os efeitos duas vezes em desenvolvimento.

**Classificação:** Complexa

**Commit sugerido:**
`:recycle: refactor: criando o hook useQuote para a busca`

---

### Arquivo
`src/components/quotes/Quotes.jsx`, `src/components/button/Button.js` (removido `Quotes.js`)

**Análise:**
Funcionalidade nova: o componente passa a refletir carregamento (botão desabilitado, com
texto próprio) e erro (alerta com `role="alert"`, lido por leitores de tela). Antes, uma falha
da API deixava a tela travada em "Loading Quote" sem nenhum aviso. Adicionados `data-testid`
para ancorar os testes e ajustes de acessibilidade no botão (`:focus-visible` no lugar de
`outline: none`, que removia o indicador de foco do teclado).

**Classificação:** Complexa

**Commit sugerido:**
`:sparkles: feat: adicionando estados de carregamento e erro`

---

### Arquivo
`src/setupTests.js`, `src/mocks/`, todos os `*.test.jsx` e `*.test.js`

**Análise:**
O projeto tinha 5 testes em Jest/CRA com msw 0.35. Reescritos para Vitest + msw 2 (a API da
lib mudou de `rest` para `http`), somando 46 testes: hook, componentes, serviços, cenários de
erro, recuperação após falha e desmontagem durante requisição pendente. Handlers do MSW
centralizados em `src/mocks/`.

**Classificação:** Complexa

**Commit sugerido:**
`:test_tube: test: criando suite de testes do client`

---

### Arquivo
`naruto-client/.env.example`

**Análise:**
Blocos `LOCAL` e `DOCKER` com `CLIENT_PORT`, `VITE_API_URL` e `API_PROXY_TARGET`.

**Classificação:** Simples

**Commit sugerido:**
`:wrench: chore: configurando o client por variaveis de ambiente`

---

### Arquivo
`naruto-client/Dockerfile`, `naruto-client/nginx.conf`, `naruto-client/.dockerignore`

**Análise:**
O client não tinha Docker — só a API era containerizada, o que impedia subir o sistema
completo em outra máquina. Criado build multi-stage (Node 22 compila, nginx 1.27 Alpine serve),
com `nginx.conf` fazendo proxy de `/api` para o container da API, fallback de SPA, gzip e cache
de assets com hash.

**Impacto no sistema:** é o que permite `docker compose up` subir a aplicação inteira.

**Classificação:** Complexa

**Commit sugerido:**
`:bricks: ci: dockerizando o client com nginx`

---

## 🐳 Raiz do monorepo

### Arquivo
`docker-compose.yml`, `.env.example`, `.gitignore`

**Análise:**
Orquestração criada do zero. Dois serviços em rede própria, com healthcheck em ambos e
`depends_on: service_healthy` — o client só sobe depois que a API responde. Portas,
origens de CORS e capacidade do gunicorn parametrizadas pelo `.env` da raiz.

**Ponto crítico resolvido:** no projeto original a API subia em `127.0.0.1:3000` e o dev
server do React também usava a 3000. Os dois brigavam pela mesma porta, e era essa colisão
que fazia o sistema parecer "fora do ar". Agora a API usa 3333 e a aplicação, 8080.

**Classificação:** Complexa

**Commit sugerido:**
`:bricks: ci: orquestrando os servicos com docker compose`

---

### Arquivo
`e2e/`

**Análise:**
Camada de teste inexistente no projeto. 12 cenários rodando em Chromium, Firefox, WebKit e
Mobile Chrome (48 execuções): fluxo principal, troca de frase, estado de carregamento,
resiliência a falha da API com recuperação, integração pelo proxy do nginx e dois testes de
regressão dos bugs corrigidos (índice estourado e cabeçalho do CSV virando frase).

**Classificação:** Complexa

**Commit sugerido:**
`:test_tube: test: adicionando testes E2E com Playwright`

---

### Arquivo
`docs/`

**Análise:**
Documentação criada do zero: guia principal, execução local, execução com Docker e acessos
de teste. Os guias registram a alternância entre os blocos `LOCAL` e `DOCKER` e o ambiente de
referência real da máquina de desenvolvimento.

**Classificação:** Simples

**Commit sugerido:**
`:books: docs: documentando execucao local e com Docker`

---

### Arquivo
`README.md`, `naruto-client/README.md`, `naruto_api/README.md`

**Análise:**
O README do client era boilerplate do Create React App; o da API listava comandos de
`tensorflow-gpu` sem relação com o projeto. Substituídos por um README principal de portfólio
(header com devicons, badges, arquitetura, comparativo antes/depois, documentação da API) e
dois READMEs curtos nas subpastas apontando para `docs/`.

**Classificação:** Simples

**Commit sugerido:**
`:books: docs: reescrevendo os README do projeto`

---

## ✅ Consolidação Final

### Lista final de commits

```text
1.  :tada: init: criando monorepo do Naruto Quotes
2.  :package: build: atualizando API para Flask 3 e pandas 2
3.  :bug: fix: corrigindo sorteio que estourava o indice
4.  :recycle: refactor: extraindo a API para o pacote narutoapi
5.  :test_tube: test: criando suite de testes da API
6.  :wrench: chore: configurando a API por variaveis de ambiente
7.  :bricks: ci: dockerizando a API com gunicorn
8.  :package: build: migrando o client para Vite 6 e React 19
9.  :recycle: refactor: resolvendo a URL da API por proxy
10. :recycle: refactor: criando o hook useQuote para a busca
11. :sparkles: feat: adicionando estados de carregamento e erro
12. :test_tube: test: criando suite de testes do client
13. :wrench: chore: configurando o client por variaveis de ambiente
14. :bricks: ci: dockerizando o client com nginx
15. :bricks: ci: orquestrando os servicos com docker compose
16. :test_tube: test: adicionando testes E2E com Playwright
17. :books: docs: documentando execucao local e com Docker
18. :books: docs: reescrevendo os README do projeto
19. :books: docs: registrando a analise de commits
```

### Quantidade total de commits

```text
Total de commits: 19
```

### Distribuição por tipo

| Tipo | Emoji | Quantidade |
| --- | --- | --- |
| Documentação | `:books:` | 3 |
| Testes | `:test_tube:` | 3 |
| Infraestrutura / CI | `:bricks:` | 4 |
| Refatoração | `:recycle:` | 3 |
| Dependências | `:package:` | 2 |
| Configuração | `:wrench:` | 2 |
| Bugfix | `:bug:` | 1 |
| Novo recurso | `:sparkles:` | 1 |
| Commit inicial | `:tada:` | 1 |
