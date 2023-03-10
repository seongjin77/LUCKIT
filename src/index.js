import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import GlobalStyle from './styles/global/globalStyle';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <CookiesProvider>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </CookiesProvider>
  </Provider>
);
