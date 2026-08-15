const DEFAULT_BASE_URL = '/api';

const rawBaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  DEFAULT_BASE_URL;

const isAbsolute = (value) => /^https?:\/\//i.test(value);

/**
 * Resolve a base da API. Aceita URL absoluta (http://host:porta) ou caminho
 * relativo (/api), que e o padrao: em dev o proxy do Vite redireciona e em
 * producao o nginx faz o mesmo. Caminhos relativos viram absolutos usando a
 * origem atual, porque o fetch do Node nao aceita URL relativa nos testes.
 */
export const resolveBaseUrl = (base = rawBaseUrl) => {
  const normalized = base.replace(/\/+$/, '');

  if (isAbsolute(normalized)) {
    return normalized;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${normalized}`;
  }

  return normalized;
};

export const API_BASE_URL = resolveBaseUrl();

export const buildUrl = (path = '') => `${resolveBaseUrl()}/${path}`;

/** Busca uma frase aleatoria na API. */
export const getQuote = async () => {
  const response = await fetch(buildUrl());

  if (!response.ok) {
    throw new Error(`Nao foi possivel buscar a frase (HTTP ${response.status}).`);
  }

  return response.json();
};

/** Consulta o healthcheck da API. */
export const getHealth = async () => {
  const response = await fetch(buildUrl('health'));

  if (!response.ok) {
    throw new Error(`API indisponivel (HTTP ${response.status}).`);
  }

  return response.json();
};
