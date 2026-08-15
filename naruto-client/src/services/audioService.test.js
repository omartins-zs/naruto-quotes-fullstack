import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAudio, playJutsuSound, resetAudio } from './audioService';

describe('audioService', () => {
  beforeEach(() => {
    resetAudio();
  });

  it('reaproveita a mesma instancia de Audio', () => {
    expect(getAudio()).toBe(getAudio());
  });

  it('cria uma nova instancia depois do reset', () => {
    const primeira = getAudio();
    resetAudio();

    expect(getAudio()).not.toBe(primeira);
  });

  it('toca o som e reinicia a faixa', async () => {
    const audio = getAudio();
    audio.currentTime = 5;

    await expect(playJutsuSound()).resolves.toBe(true);
    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalled();
  });

  it('nao quebra quando o navegador bloqueia o autoplay', async () => {
    const audio = getAudio();
    vi.spyOn(audio, 'play').mockRejectedValueOnce(new Error('NotAllowedError'));

    await expect(playJutsuSound()).resolves.toBe(false);
  });
});
