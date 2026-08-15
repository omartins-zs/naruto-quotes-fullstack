import { useCallback, useEffect, useRef, useState } from 'react';
import { getQuote } from '../services';
import { playJutsuSound } from '../services/audioService';

export const STATUS = {
  loading: 'loading',
  success: 'success',
  error: 'error'
};

export const INITIAL_QUOTE = {
  speaker: 'Carregando personagem...',
  quote: 'Invocando uma frase...'
};

/**
 * Busca frases na API mantendo o ultimo resultado valido em tela quando ocorre erro.
 */
export const useQuote = () => {
  const isMounted = useRef(true);
  const [quote, setQuote] = useState(INITIAL_QUOTE);
  const [status, setStatus] = useState(STATUS.loading);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus(STATUS.loading);
    setError(null);

    try {
      const data = await getQuote();

      if (!isMounted.current) return;

      setQuote(data);
      setStatus(STATUS.success);
      playJutsuSound();
    } catch (requestError) {
      if (!isMounted.current) return;

      setStatus(STATUS.error);
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    refresh();

    return () => {
      isMounted.current = false;
    };
  }, [refresh]);

  return { ...quote, status, error, refresh };
};
