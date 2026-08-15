import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyle } from './components';
import { App } from './pages';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>
);
