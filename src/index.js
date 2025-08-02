import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoggerProvider } from './context/LoggerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoggerProvider>
    <App />
  </LoggerProvider>
);
