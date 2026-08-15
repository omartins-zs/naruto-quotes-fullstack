"""Carregamento e sorteio das frases de Naruto."""

from __future__ import annotations

import random
from pathlib import Path

import pandas as pd

SPEAKER_COLUMN = "speaker"
QUOTE_COLUMN = "quote"

# O CSV original tem tres colunas: indice, personagem e frase, com o cabecalho ",0,1".
CSV_COLUMNS = ["source_index", SPEAKER_COLUMN, QUOTE_COLUMN]


class QuoteSourceError(RuntimeError):
    """Levantada quando o arquivo de frases nao existe ou nao tem linha valida."""


class QuoteRepository:
    """Mantem as frases em memoria e sorteia uma delas sob demanda."""

    def __init__(self, source: Path | str, rng: random.Random | None = None) -> None:
        self._source = Path(source)
        self._rng = rng or random.Random()
        self._quotes = self._load()

    @property
    def source(self) -> Path:
        return self._source

    def _load(self) -> list[dict[str, str]]:
        if not self._source.is_file():
            raise QuoteSourceError(f"Arquivo de frases nao encontrado: {self._source}")

        frame = pd.read_csv(
            self._source,
            header=0,
            names=CSV_COLUMNS,
            usecols=[SPEAKER_COLUMN, QUOTE_COLUMN],
            dtype=str,
            keep_default_na=False,
        )

        quotes: list[dict[str, str]] = []
        for speaker, quote in zip(frame[SPEAKER_COLUMN], frame[QUOTE_COLUMN]):
            speaker = str(speaker).strip()
            quote = str(quote).strip()
            if speaker and quote:
                quotes.append({SPEAKER_COLUMN: speaker, QUOTE_COLUMN: quote})

        if not quotes:
            raise QuoteSourceError(f"Nenhuma frase valida em: {self._source}")

        return quotes

    def __len__(self) -> int:
        return len(self._quotes)

    def all(self) -> list[dict[str, str]]:
        """Copia defensiva da lista completa de frases."""
        return [dict(quote) for quote in self._quotes]

    def random_quote(self) -> dict[str, str]:
        """Sorteia uma frase. Usa choice para nunca estourar o indice da lista."""
        return dict(self._rng.choice(self._quotes))
