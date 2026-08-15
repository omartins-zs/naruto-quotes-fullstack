# 🔐 Acessos e Dados de Teste

## 1. Acesso ao Sistema

**Este projeto não possui autenticação.** Não há tela de login, cadastro de
usuários, perfis, permissões, banco de dados ou seeders — logo, não existem
credenciais de teste a documentar.

A aplicação é pública: abrir a URL já dá acesso total a todas as funcionalidades.

| Item | Situação |
| --- | --- |
| Login / senha | Não existe |
| Banco de dados | Não existe |
| Seeders | Não existem |
| Painel administrativo | Não existe |
| Origem dos dados | `naruto_api/finalQuotes.csv` (509 frases, lido em memória) |

---

## 2. URLs Principais

| Ambiente | Aplicação (Home) | API |
| --- | --- | --- |
| **Docker** | `http://localhost:8080` | `http://localhost:3333` |
| **Local** (`npm run dev` + `python app.py`) | `http://localhost:3000` | `http://localhost:3333` |

---

## 3. Endpoints da API

Todos são `GET` e públicos.

| Endpoint | Docker (via nginx) | Retorno |
| --- | --- | --- |
| Frase aleatória | `http://localhost:8080/api/` | `{"speaker": "...", "quote": "..."}` |
| Todas as frases | `http://localhost:8080/api/quotes` | `{"total": 509, "quotes": [...]}` |
| Healthcheck | `http://localhost:8080/api/health` | `{"status": "ok", "quotes": 509}` |
| Rota inexistente | `http://localhost:8080/api/qualquer` | `404` + `{"error": "not_found", ...}` |

Exemplo de resposta real da raiz:

```json
{
  "speaker": "Sasuke Uchiha",
  "quote": "My name is Sasuke Uchiha. I hate a lot of things, and I don't particularly like anything."
}
```

---

## 4. Validação do Acesso

Checklist executado neste ambiente:

| Verificação | Resultado esperado | Situação |
| --- | --- | --- |
| Containers `naruto_api` e `naruto_client` | Saudáveis / Rodando | ✅ `Up (healthy)` |
| Aplicação em `http://localhost:8080` | HTTP `200` | ✅ 200 |
| `GET /api/health` | `{"status":"ok","quotes":509}` | ✅ confirmado |
| `GET /api/` | JSON com `speaker` e `quote` | ✅ confirmado |
| `GET /api/rota-inexistente` | HTTP `404` em JSON | ✅ confirmado |
| 150 chamadas seguidas a `/api/` | Nenhum erro HTTP 500 | ✅ 0 erros, 129 frases distintas |
| Testes da API | 40 passando, cobertura ≥ 90% | ✅ 40 passando, 100% |
| Testes do client | 46 passando, cobertura ≥ 90% | ✅ 46 passando, 100% statements |
| Testes E2E | 48 passando em 4 navegadores | ✅ 48 passando |

Comandos usados na validação:

```bash
docker compose ps
curl http://localhost:8080/api/health
curl http://localhost:8080/api/
```

---

## 5. Dados de Teste Automatizado

Os testes não tocam o CSV real de produção — cada suíte usa sua própria massa.

### API (pytest)

Um CSV temporário com 3 frases é criado por fixture em `naruto_api/tests/conftest.py`:

| Personagem | Frase |
| --- | --- |
| Naruto Uzumaki | Eu nunca volto atras na minha palavra. |
| Itachi Uchiha | Aqueles que nao entendem o verdadeiro valor. |
| Kakashi Hatake | No mundo ninja, quem quebra as regras e lixo. |

O sorteio usa `random.Random(42)`, então os testes são determinísticos.

### Client (Vitest + MSW)

A API é interceptada por mock em `naruto-client/src/mocks/handlers.js`:

| Campo | Valor |
| --- | --- |
| `speaker` | Naruto Uzumaki |
| `quote` | Eu nunca volto atras na minha palavra, esse e o meu jeito ninja! |
| `/health` | `{"status": "ok", "quotes": 509}` |

### E2E (Playwright)

Roda contra a aplicação real, sem mocks — exceto nos cenários de resiliência, onde
`page.route` força HTTP 503 para validar o alerta de erro e a recuperação.

---

## 6. Recarregar os Dados

Não há banco para resetar. Para alterar as frases, edite o CSV e recrie a imagem:

```bash
docker compose up -d --build
```

O arquivo é `naruto_api/finalQuotes.csv`, no formato:

```csv
,0,1
0,Neji Hyuuga,"The difference between stupidity and genius, is that genius has its limits."
```

A primeira coluna é o índice original e é descartada na leitura; a linha de
cabeçalho `,0,1` também é ignorada.

---

## 📝 Observações

- Como não há autenticação nem dados sensíveis, não existe risco em expor estas URLs em ambiente local.
- `CORS_ORIGINS=*` está liberado por padrão para facilitar o desenvolvimento. Em um deploy público, restrinja para o domínio real.
- Os endpoints acima assumem as portas padrão. Se alterou `APP_PORT` ou `API_PORT` no `.env`, ajuste as URLs.
