import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { defaultQuote } from '../mocks/handlers';
import { buildUrl } from '../services/quotesService/quotesService';
import { INITIAL_QUOTE, STATUS, useQuote } from './useQuote';

describe('useQuote', () => {
  it('comeca em loading com a frase inicial', () => {
    const { result } = renderHook(() => useQuote());

    expect(result.current.status).toBe(STATUS.loading);
    expect(result.current.quote).toBe(INITIAL_QUOTE.quote);
    expect(result.current.speaker).toBe(INITIAL_QUOTE.speaker);
  });

  it('carrega a frase da API ao montar', async () => {
    const { result } = renderHook(() => useQuote());

    await waitFor(() => expect(result.current.status).toBe(STATUS.success));

    expect(result.current.quote).toBe(defaultQuote.quote);
    expect(result.current.speaker).toBe(defaultQuote.speaker);
    expect(result.current.error).toBeNull();
  });

  it('toca o som do jutsu quando a frase chega', async () => {
    const { result } = renderHook(() => useQuote());

    await waitFor(() => expect(result.current.status).toBe(STATUS.success));

    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('busca uma nova frase no refresh', async () => {
    const { result } = renderHook(() => useQuote());
    await waitFor(() => expect(result.current.status).toBe(STATUS.success));

    const novaFrase = { speaker: 'Itachi Uchiha', quote: 'Nao me julgue pela aparencia.' };
    server.use(http.get(buildUrl(), () => HttpResponse.json(novaFrase)));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.quote).toBe(novaFrase.quote);
    expect(result.current.speaker).toBe(novaFrase.speaker);
  });

  it('expoe o erro quando a API falha', async () => {
    server.use(http.get(buildUrl(), () => new HttpResponse(null, { status: 500 })));

    const { result } = renderHook(() => useQuote());

    await waitFor(() => expect(result.current.status).toBe(STATUS.error));
    expect(result.current.error).toMatch(/HTTP 500/);
  });

  it('mantem a ultima frase valida quando um refresh falha', async () => {
    const { result } = renderHook(() => useQuote());
    await waitFor(() => expect(result.current.status).toBe(STATUS.success));

    server.use(http.get(buildUrl(), () => new HttpResponse(null, { status: 500 })));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.status).toBe(STATUS.error);
    expect(result.current.quote).toBe(defaultQuote.quote);
  });

  it('limpa o erro anterior ao tentar de novo', async () => {
    server.use(http.get(buildUrl(), () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useQuote());
    await waitFor(() => expect(result.current.status).toBe(STATUS.error));

    server.use(http.get(buildUrl(), () => HttpResponse.json(defaultQuote)));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.status).toBe(STATUS.success);
  });

  it('nao atualiza o estado quando o refresh falha depois de desmontar', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    server.use(http.get(buildUrl(), () => new HttpResponse(null, { status: 500 })));

    const { result, unmount } = renderHook(() => useQuote());
    const pendente = result.current.refresh();
    unmount();
    await pendente;

    expect(erro).not.toHaveBeenCalled();
  });

  it('nao atualiza o estado depois de desmontar', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useQuote());

    const pendente = result.current.refresh();
    unmount();
    await pendente;

    expect(erro).not.toHaveBeenCalled();
  });
});
