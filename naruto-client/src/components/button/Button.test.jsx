import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza o conteudo recebido', () => {
    render(<Button>Quote No Jutsu</Button>);

    expect(screen.getByRole('button', { name: 'Quote No Jutsu' })).toBeInTheDocument();
  });

  it('aplica a identidade visual laranja', () => {
    render(<Button>Jutsu</Button>);

    expect(screen.getByRole('button')).toHaveStyle({ background: '#f27137' });
  });

  it('dispara onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Jutsu</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignora clique quando desabilitado', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Jutsu
      </Button>
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('encaminha atributos nativos', () => {
    render(<Button type="submit">Jutsu</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
