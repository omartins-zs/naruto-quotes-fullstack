"""Entrypoint de desenvolvimento: python app.py"""

from __future__ import annotations

from narutoapi import Settings, create_app

settings = Settings.from_env()
NarutoApi = create_app(settings)

if __name__ == "__main__":
    NarutoApi.run(host=settings.host, port=settings.port, debug=settings.debug)
