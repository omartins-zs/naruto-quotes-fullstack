"""Testes do repositorio de frases."""

from __future__ import annotations

import random
from pathlib import Path

import pytest

from narutoapi.quotes import QuoteRepository, QuoteSourceError

from .conftest import CSV_HEADER, SAMPLE_ROWS


def test_carrega_todas_as_frases_do_arquivo(repository: QuoteRepository):
    assert len(repository) == 3


def test_descarta_a_linha_de_cabecalho_do_csv(repository: QuoteRepository):
    speakers = {quote["speaker"] for quote in repository.all()}

    assert "0" not in speakers
    assert speakers == {"Naruto Uzumaki", "Itachi Uchiha", "Kakashi Hatake"}


def test_random_quote_retorna_speaker_e_quote(repository: QuoteRepository):
    quote = repository.random_quote()

    assert set(quote) == {"speaker", "quote"}
    assert quote["speaker"]
    assert quote["quote"]


def test_random_quote_nunca_estoura_o_indice(repository: QuoteRepository):
    """Regressao do bug randint(0, len(df)), que saia do range em ~1 de N chamadas."""
    for _ in range(2000):
        assert repository.random_quote() in repository.all()


def test_random_quote_e_deterministica_com_seed(quotes_file: Path):
    primeira = QuoteRepository(quotes_file, rng=random.Random(7)).random_quote()
    segunda = QuoteRepository(quotes_file, rng=random.Random(7)).random_quote()

    assert primeira == segunda


def test_all_devolve_copia_defensiva(repository: QuoteRepository):
    frases = repository.all()
    frases[0]["speaker"] = "alterado"

    assert repository.all()[0]["speaker"] != "alterado"


def test_source_expoe_o_caminho_do_arquivo(repository: QuoteRepository, quotes_file: Path):
    assert repository.source == quotes_file


def test_usa_rng_padrao_quando_nao_informado(quotes_file: Path):
    assert QuoteRepository(quotes_file).random_quote()["speaker"]


def test_ignora_linhas_incompletas(tmp_path: Path):
    path = tmp_path / "parcial.csv"
    path.write_text(
        CSV_HEADER + SAMPLE_ROWS + '3,,"frase sem personagem"\n4,Sem Frase,\n',
        encoding="utf-8",
    )

    assert len(QuoteRepository(path)) == 3


def test_erro_quando_o_arquivo_nao_existe(tmp_path: Path):
    with pytest.raises(QuoteSourceError, match="nao encontrado"):
        QuoteRepository(tmp_path / "ausente.csv")


def test_erro_quando_nao_ha_frase_valida(tmp_path: Path):
    path = tmp_path / "vazio.csv"
    path.write_text(CSV_HEADER, encoding="utf-8")

    with pytest.raises(QuoteSourceError, match="Nenhuma frase valida"):
        QuoteRepository(path)
