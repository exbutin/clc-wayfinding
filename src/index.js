import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);