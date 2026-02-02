import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
}