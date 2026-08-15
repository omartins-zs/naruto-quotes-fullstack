# 🐍 Naruto Quotes API

API em Flask que sorteia frases de personagens de Naruto a partir de um CSV
carregado em memória.

Parte do monorepo **[naruto-quotes-fullstack](../README.md)**.

## Rodar

```bash
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements-dev.txt
python app.py
```

API em http://localhost:3333

## Endpoints

| Método | Rota | Retorno |
| --- | --- | --- |
| `GET` | `/` | Uma frase aleatória |
| `GET` | `/quotes` | Todas as frases |
| `GET` | `/health` | Status e total de frases |

## Testes

```bash
.venv/Scripts/python -m pytest
```

40 testes, cobertura mínima de 90% exigida em `pytest.ini`.

## Configuração

Variáveis lidas do `.env` (veja `.env.example`):

| Variável | Padrão | Função |
| --- | --- | --- |
| `API_HOST` | `0.0.0.0` | Interface de escuta |
| `API_PORT` | `3333` | Porta |
| `API_DEBUG` | `false` | Modo debug |
| `CORS_ORIGINS` | `*` | Origens permitidas |
| `QUOTES_FILE` | `finalQuotes.csv` | Caminho do CSV |

## Estrutura

```
narutoapi/
├── __init__.py   # application factory
├── config.py     # configuração via env
├── quotes.py     # repositório das frases
└── routes.py     # blueprint das rotas
```

Documentação completa em [`../docs/`](../docs).
