import styled from 'styled-components';
import narutoImg from '../../images/naruto.png';
import { Quotes } from '../../components';
import { useQuote } from '../../hooks/useQuote';

export function App() {
  const { quote, speaker, status, error, refresh } = useQuote();

  return (
    <Content>
      <Quotes
        quote={quote}
        speaker={speaker}
        status={status}
        error={error}
        onUpdate={refresh}
      />
      <NarutoImg alt="Naruto holding a kunai" src={narutoImg} />
    </Content>
  );
}

const Content = styled.main`
  height: 100vh;
  box-sizing: border-box;
  padding: 0 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const NarutoImg = styled.img`
  max-width: 50vw;
  align-self: flex-end;
`;
