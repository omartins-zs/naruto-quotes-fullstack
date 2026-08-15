import jutsuSound from '../sounds/jutso.mp3';

let audio;

/** Instancia o Audio uma unica vez, sob demanda. */
export const getAudio = () => {
  if (!audio) {
    audio = new Audio(jutsuSound);
  }
  return audio;
};

/**
 * Toca o som do jutsu. Navegadores bloqueiam autoplay sem interacao do usuario,
 * entao qualquer falha aqui e silenciosa e nao pode quebrar a tela.
 */
export const playJutsuSound = async () => {
  try {
    const element = getAudio();
    element.currentTime = 0;
    await element.play();
    return true;
  } catch {
    return false;
  }
};

/** Usado nos testes para descartar a instancia memoizada. */
export const resetAudio = () => {
  audio = undefined;
};
