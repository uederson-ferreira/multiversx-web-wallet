import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Buffer } from 'buffer';
window.Buffer = Buffer;


const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemento com id 'root' não foi encontrado.");
}
