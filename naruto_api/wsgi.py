"""Entrypoint de producao usado pelo gunicorn: gunicorn wsgi:app"""

from __future__ import annotations

from narutoapi import create_app

app = create_app()
