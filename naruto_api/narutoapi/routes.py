"""Rotas HTTP da Naruto Quotes API."""

from __future__ import annotations

from flask import Blueprint, current_app, jsonify

from .quotes import QuoteRepository

api = Blueprint("api", __name__)


def get_repository() -> QuoteRepository:
    return current_app.extensions["quotes"]


@api.get("/")
def random_quote():
    """Retorna uma frase aleatoria no formato {speaker, quote}."""
    return jsonify(get_repository().random_quote())


@api.get("/quotes")
def all_quotes():
    """Retorna a lista completa de frases carregadas."""
    repository = get_repository()
    return jsonify({"total": len(repository), "quotes": repository.all()})


@api.get("/health")
def health():
    """Healthcheck usado pelo Docker e pelos testes E2E."""
    return jsonify({"status": "ok", "quotes": len(get_repository())})
