import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { SettingsProvider } from './lib/content.jsx';
import { LangProvider } from './lib/i18n.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
