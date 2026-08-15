"""Configuracao da API lida a partir de variaveis de ambiente."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_QUOTES_FILE = BASE_DIR / "finalQuotes.csv"

# Carrega o .env do projeto quando existir. Variaveis ja exportadas no ambiente
# tem prioridade, entao o docker compose continua mandando no container.
load_dotenv(BASE_DIR / ".env", override=False)

TRUTHY = {"1", "true", "yes", "on"}


def env_flag(name: str, default: bool = False) -> bool:
    """Le uma variavel de ambiente booleana aceitando 1/true/yes/on."""
    raw = os.getenv(name)
    if raw is None or not raw.strip():
        return default
    return raw.strip().lower() in TRUTHY


def env_int(name: str, default: int) -> int:
    """Le uma variavel de ambiente inteira, caindo no default quando invalida."""
    raw = os.getenv(name)
    if raw is None or not raw.strip():
        return default
    try:
        return int(raw)
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    """Parametros de execucao da API."""

    host: str = "0.0.0.0"
    port: int = 3333
    debug: bool = False
    quotes_file: Path = DEFAULT_QUOTES_FILE
    cors_origins: tuple[str, ...] = ("*",)

    @classmethod
    def from_env(cls) -> "Settings":
        origins = os.getenv("CORS_ORIGINS", "*")
        return cls(
            host=os.getenv("API_HOST", "0.0.0.0"),
            port=env_int("API_PORT", 3333),
            debug=env_flag("API_DEBUG", False),
            quotes_file=Path(os.getenv("QUOTES_FILE", str(DEFAULT_QUOTES_FILE))),
            cors_origins=tuple(
                origin.strip() for origin in origins.split(",") if origin.strip()
            )
            or ("*",),
        )
