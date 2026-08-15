import { http, HttpResponse } from 'msw';
import { buildUrl } from '../services/quotesService/quotesService';

export const defaultQuote = {
  speaker: 'Naruto Uzumaki',
  quote: 'Eu nunca volto atras na minha palavra, esse e o meu jeito ninja!'
};

export const defaultHealth = { status: 'ok', quotes: 509 };

export const handlers = [
  http.get(buildUrl(), () => HttpResponse.json(defaultQuote)),
  http.get(buildUrl('health'), () => HttpResponse.json(defaultHealth))
];
