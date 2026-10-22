import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { SettingsProvider } from './lib/content.jsx';
import { LangProvider } from './lib/i18n.jsx';
import { ThemeProvider } from './lib/theme.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <LangProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </LangProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
