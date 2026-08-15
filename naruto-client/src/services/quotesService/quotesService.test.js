import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { defaultHealth, defaultQuote } from '../../mocks/handlers';
import {
  API_BASE_URL,
  buildUrl,
  getHealth,
  getQuote,
  resolveBaseUrl
} from './quotesService';

describe('resolveBaseUrl', () => {
  it('mantem uma URL absoluta como esta', () => {
    expect(resolveBaseUrl('http://api.local:3333')).toBe('http://api.local:3333');
  });

  it('mantem https absoluto', () => {
    expect(resolveBaseUrl('https://api.local')).toBe('https://api.local');
  });

  it('remove a barra final', () => {
    expect(resolveBaseUrl('http://api.local:3333///')).toBe('http://api.local:3333');
  });

  it('transforma caminho relativo em absoluto usando a origem atual', () => {
    expect(resolveBaseUrl('/api')).toBe(`${window.location.origin}/api`);
  });

  it('mantem o caminho relativo quando nao existe window', () => {
    vi.stubGlobal('window', undefined);

    try {
      expect(resolveBaseUrl('/api')).toBe('/api');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('buildUrl', () => {
  it('monta a URL raiz da API', () => {
    expect(buildUrl()).toBe(`${API_BASE_URL}/`);
  });

  it('monta a URL de um recurso', () => {
    expect(buildUrl('health')).toBe(`${API_BASE_URL}/health`);
  });
});

describe('getQuote', () => {
  it('converte a resposta da API em objeto', async () => {
    await expect(getQuote()).resolves.toStrictEqual(defaultQuote);
  });

  it('lanca erro quando a API responde com falha', async () => {
    server.use(
      http.get(buildUrl(), () => new HttpResponse(null, { status: 500 }))
    );

    await expect(getQuote()).rejects.toThrow('HTTP 500');
  });

  it('lanca erro quando a rota nao existe', async () => {
    server.use(
      http.get(buildUrl(), () => new HttpResponse(null, { status: 404 }))
    );

    await expect(getQuote()).rejects.toThrow('Nao foi possivel buscar a frase');
  });
});

describe('getHealth', () => {
  it('retorna o status da API', async () => {
    await expect(getHealth()).resolves.toStrictEqual(defaultHealth);
  });

  it('lanca erro quando a API esta fora', async () => {
    server.use(
      http.get(buildUrl('health'), () => new HttpResponse(null, { status: 503 }))
    );

    await expect(getHealth()).rejects.toThrow('API indisponivel (HTTP 503).');
  });
});
