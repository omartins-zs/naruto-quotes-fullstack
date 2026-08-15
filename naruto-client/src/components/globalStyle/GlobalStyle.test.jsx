import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlobalStyle } from './GlobalStyle';

/**
 * O styled-components 6 injeta CSS pelo CSSOM e memoiza globalmente o que ja
 * foi injetado, entao inspecionar as regras dentro do jsdom e instavel e nao
 * agrega valor. O que importa aqui e o contrato do componente: montar sem
 * quebrar e nao emitir marcacao. A aparencia real e checada no E2E.
 */
describe('GlobalStyle', () => {
  it('exporta um componente renderizavel', () => {
    expect(GlobalStyle).toBeDefined();
    expect(() => render(<GlobalStyle />)).not.toThrow();
  });

  it('nao renderiza nenhum elemento visivel', () => {
    const { container } = render(<GlobalStyle />);

    expect(container).toBeEmptyDOMElement();
  });

  it('pode ser montado e desmontado varias vezes', () => {
    const primeira = render(<GlobalStyle />);
    primeira.unmount();

    expect(() => render(<GlobalStyle />)).not.toThrow();
  });
});
