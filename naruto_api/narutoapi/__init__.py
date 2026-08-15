"""Naruto Quotes API - fabrica da aplicacao Flask."""

from __future__ import annotations

from flask import Flask, jsonify
from flask_cors import CORS

from .config import Settings
from .quotes import QuoteRepository
from .routes import api

__all__ = ["create_app", "Settings", "QuoteRepository"]


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "not_found", "message": "Rota inexistente."}), 404

    @app.errorhandler(500)
    def internal_error(_error):
        return (
            jsonify({"error": "internal_error", "message": "Erro interno na API."}),
            500,
        )


def create_app(
    settings: Settings | None = None,
    repository: QuoteRepository | None = None,
) -> Flask:
    """Cria a aplicacao. O repositorio pode ser injetado para facilitar os testes."""
    settings = settings or Settings.from_env()

    app = Flask(__name__)
    app.config["SETTINGS"] = settings
    app.config["JSON_SORT_KEYS"] = False

    CORS(app, resources={r"/*": {"origins": list(settings.cors_origins)}})

    app.extensions["quotes"] = repository or QuoteRepository(settings.quotes_file)
    app.register_blueprint(api)
    register_error_handlers(app)

    return app
