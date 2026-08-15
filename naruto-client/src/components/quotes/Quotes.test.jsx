import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { STATUS } from '../../hooks/useQuote';
import { Quotes } from './Quotes';

const props = {
  speaker: 'Kakashi Hatake',
  quote: 'Quem abandona um amigo e pior que lixo.'
};

describe('Quotes', () => {
  it('mostra a frase entre aspas e o personagem', () => {
    render(<Quotes {...props} />);

    expect(screen.getByTestId('quote')).toHaveTextContent(`"${props.quote}"`);
    expect(screen.getByTestId('speaker')).toHaveTextContent(`- ${props.speaker}`);
  });

  it('mostra o botao do jutsu', () => {
    render(<Quotes {...props} />);

    expect(screen.getByRole('button', { name: /quote no jutsu/i })).toBeEnabled();
  });

  it('chama onUpdate no clique', async () => {
    const onUpdate = vi.fn();
    render(<Quotes {...props} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('desabilita o botao e troca o texto durante o carregamento', () => {
    render(<Quotes {...props} status={STATUS.loading} />);

    const botao = screen.getByRole('button', { name: /carregando/i });
    expect(botao).toBeDisabled();
  });

  it('nao dispara onUpdate enquanto carrega', async () => {
    const onUpdate = vi.fn();
    render(<Quotes {...props} status={STATUS.loading} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('mostra a mensagem de erro como alerta', () => {
    render(<Quotes {...props} status={STATUS.error} error="API fora do ar" />);

    expect(screen.getByRole('alert')).toHaveTextContent('API fora do ar');
  });

  it('nao mostra alerta quando nao ha erro', () => {
    render(<Quotes {...props} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('funciona sem onUpdate informado', async () => {
    render(<Quotes {...props} />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('quote')).toBeInTheDocument();
  });
});
