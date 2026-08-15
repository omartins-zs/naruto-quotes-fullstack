import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { defaultQuote } from '../../mocks/handlers';
import { buildUrl } from '../../services/quotesService/quotesService';
import { App } from './App';

describe('App', () => {
  it('renderiza o botao e a imagem do Naruto', () => {
    render(<App />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /naruto holding a kunai/i })).toBeInTheDocument();
  });

  it('busca a frase na API assim que abre', async () => {
    render(<App />);

    expect(await screen.findByText(new RegExp(defaultQuote.quote, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('speaker')).toHaveTextContent(defaultQuote.speaker);
  });

  it('troca a frase ao clicar no botao', async () => {
    render(<App />);
    await screen.findByText(new RegExp(defaultQuote.quote, 'i'));

    const novaFrase = {
      speaker: 'Jiraiya',
      quote: 'Um verdadeiro ninja e aquele que suporta a dor.'
    };
    server.use(http.get(buildUrl(), () => HttpResponse.json(novaFrase)));

    await userEvent.click(screen.getByRole('button', { name: /quote no jutsu/i }));

    expect(await screen.findByText(new RegExp(novaFrase.quote, 'i'))).toBeInTheDocument();
    expect(screen.getByTestId('speaker')).toHaveTextContent(novaFrase.speaker);
  });

  it('mostra o alerta quando a API esta fora do ar', async () => {
    server.use(http.get(buildUrl(), () => new HttpResponse(null, { status: 503 })));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/HTTP 503/);
  });

  it('volta a funcionar quando a API se recupera', async () => {
    server.use(http.get(buildUrl(), () => new HttpResponse(null, { status: 503 })));
    render(<App />);
    await screen.findByRole('alert');

    server.use(http.get(buildUrl(), () => HttpResponse.json(defaultQuote)));
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(screen.getByTestId('quote')).toHaveTextContent(defaultQuote.quote);
  });
});
