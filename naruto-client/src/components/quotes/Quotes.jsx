import styled from 'styled-components';
import { Button } from '../button';
import { STATUS } from '../../hooks/useQuote';

export const Quotes = ({
  quote,
  speaker,
  status = STATUS.success,
  error = null,
  onUpdate = () => {}
}) => {
  const isLoading = status === STATUS.loading;

  return (
    <Wrapper>
      <Quote data-testid="quote">&quot;{quote}&quot;</Quote>
      <Speaker data-testid="speaker">- {speaker}</Speaker>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      <Button type="button" onClick={onUpdate} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Quote No Jutsu'}
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Quote = styled.p`
  font-size: 2em;
  text-shadow: rgba(0, 0, 0, 0.2) 1px 1px 1px;
  flex: 1;
  margin: 0;
`;

const Speaker = styled(Quote)`
  text-align: right;
  width: 100%;
  margin-bottom: 50px;
`;

const ErrorMessage = styled.p`
  background: #a40000;
  color: #fff;
  padding: 8px 16px;
  margin: 0 0 16px;
  box-shadow: #332c36 3px 3px;
`;
