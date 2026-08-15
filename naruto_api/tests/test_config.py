"""Testes da leitura de configuracao por variaveis de ambiente."""

from __future__ import annotations

from pathlib import Path

import pytest

from narutoapi import create_app
from narutoapi.config import DEFAULT_QUOTES_FILE, Settings, env_flag, env_int


@pytest.mark.parametrize("valor", ["1", "true", "TRUE", "yes", "on"])
def test_env_flag_aceita_valores_verdadeiros(monkeypatch, valor):
    monkeypatch.setenv("API_DEBUG", valor)
    assert env_flag("API_DEBUG") is True


@pytest.mark.parametrize("valor", ["0", "false", "no", "off", "qualquer"])
def test_env_flag_trata_o_resto_como_falso(monkeypatch, valor):
    monkeypatch.setenv("API_DEBUG", valor)
    assert env_flag("API_DEBUG") is False


def test_env_flag_usa_default_quando_ausente(monkeypatch):
    monkeypatch.delenv("API_DEBUG", raising=False)
    assert env_flag("API_DEBUG", default=True) is True


def test_env_flag_usa_default_quando_vazia(monkeypatch):
    monkeypatch.setenv("API_DEBUG", "   ")
    assert env_flag("API_DEBUG", default=True) is True


def test_env_int_converte_valor(monkeypatch):
    monkeypatch.setenv("API_PORT", "8080")
    assert env_int("API_PORT", 3333) == 8080


def test_env_int_cai_no_default_quando_invalido(monkeypatch):
    monkeypatch.setenv("API_PORT", "porta")
    assert env_int("API_PORT", 3333) == 3333


def test_env_int_cai_no_default_quando_ausente(monkeypatch):
    monkeypatch.delenv("API_PORT", raising=False)
    assert env_int("API_PORT", 3333) == 3333


def test_settings_padrao():
    settings = Settings()

    assert settings.host == "0.0.0.0"
    assert settings.port == 3333
    assert settings.debug is False
    assert settings.quotes_file == DEFAULT_QUOTES_FILE
    assert settings.cors_origins == ("*",)


def test_settings_from_env_le_todas_as_variaveis(monkeypatch, tmp_path: Path):
    arquivo = tmp_path / "outro.csv"
    monkeypatch.setenv("API_HOST", "127.0.0.1")
    monkeypatch.setenv("API_PORT", "4000")
    monkeypatch.setenv("API_DEBUG", "true")
    monkeypatch.setenv("QUOTES_FILE", str(arquivo))
    monkeypatch.setenv("CORS_ORIGINS", "http://localhost:3000, http://localhost:8080")

    settings = Settings.from_env()

    assert settings.host == "127.0.0.1"
    assert settings.port == 4000
    assert settings.debug is True
    assert settings.quotes_file == arquivo
    assert settings.cors_origins == ("http://localhost:3000", "http://localhost:8080")


def test_settings_from_env_com_cors_vazio_volta_para_curinga(monkeypatch):
    monkeypatch.setenv("CORS_ORIGINS", " , ")
    assert Settings.from_env().cors_origins == ("*",)


def test_create_app_carrega_o_csv_real_quando_nada_e_injetado(monkeypatch):
    monkeypatch.delenv("QUOTES_FILE", raising=False)
    app = create_app()

    assert len(app.extensions["quotes"]) > 500
    assert app.config["SETTINGS"].quotes_file == DEFAULT_QUOTES_FILE


def test_cors_restrito_a_uma_origem(repository):
    app = create_app(
        settings=Settings(cors_origins=("http://localhost:8080",)),
        repository=repository,
    )
    response = app.test_client().get("/", headers={"Origin": "http://localhost:8080"})

    assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:8080"
