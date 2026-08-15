"""Fixtures compartilhadas pelos testes da API."""

from __future__ import annotations

import random
from pathlib import Path

import pytest

from narutoapi import Settings, create_app
from narutoapi.quotes import QuoteRepository

CSV_HEADER = ",0,1\n"
SAMPLE_ROWS = (
    '0,Naruto Uzumaki,"Eu nunca volto atras na minha palavra."\n'
    '1,Itachi Uchiha,"Aqueles que nao entendem o verdadeiro valor."\n'
    '2,Kakashi Hatake,"No mundo ninja, quem quebra as regras e lixo."\n'
)


@pytest.fixture
def quotes_file(tmp_path: Path) -> Path:
    path = tmp_path / "quotes.csv"
    path.write_text(CSV_HEADER + SAMPLE_ROWS, encoding="utf-8")
    return path


@pytest.fixture
def repository(quotes_file: Path) -> QuoteRepository:
    return QuoteRepository(quotes_file, rng=random.Random(42))


@pytest.fixture
def app(repository: QuoteRepository):
    application = create_app(
        settings=Settings(quotes_file=repository.source),
        repository=repository,
    )
    application.config.update(TESTING=True)
    return application


@pytest.fixture
def client(app):
    return app.test_client()
