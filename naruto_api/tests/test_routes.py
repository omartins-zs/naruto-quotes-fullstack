"""Testes das rotas HTTP da API."""

from __future__ import annotations


def test_raiz_retorna_uma_frase(client):
    response = client.get("/")

    assert response.status_code == 200
    assert set(response.get_json()) == {"speaker", "quote"}


def test_raiz_retorna_json(client):
    assert client.get("/").content_type.startswith("application/json")


def test_raiz_envia_header_de_cors(client):
    """Com origins curinga o Flask-Cors reflete a origem da requisicao."""
    origem = "http://localhost:3000"
    response = client.get("/", headers={"Origin": origem})

    assert response.headers["Access-Control-Allow-Origin"] in {"*", origem}


def test_preflight_permite_o_client(client):
    response = client.options(
        "/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code in {200, 204}
    assert "Access-Control-Allow-Origin" in response.headers


def test_health_reporta_status_e_total(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok", "quotes": 3}


def test_lista_todas_as_frases(client):
    response = client.get("/quotes")
    payload = response.get_json()

    assert response.status_code == 200
    assert payload["total"] == 3
    assert len(payload["quotes"]) == 3
    assert set(payload["quotes"][0]) == {"speaker", "quote"}


def test_rota_inexistente_retorna_404_em_json(client):
    response = client.get("/naruto-nao-existe")
    payload = response.get_json()

    assert response.status_code == 404
    assert payload["error"] == "not_found"


def test_metodo_nao_permitido(client):
    assert client.post("/").status_code == 405


def test_erro_interno_retorna_json(app):
    @app.get("/boom")
    def boom():
        raise RuntimeError("falha proposital")

    app.config["PROPAGATE_EXCEPTIONS"] = False
    response = app.test_client().get("/boom")

    assert response.status_code == 500
    assert response.get_json()["error"] == "internal_error"
