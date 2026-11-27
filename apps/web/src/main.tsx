import { gespeichertesThema, wendeThemaAn } from '@immo/ui';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './router.tsx';
import './styles.css';

wendeThemaAn(gespeichertesThema());
globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (gespeichertesThema() === 'system') wendeThemaAn('system');
});

const wurzel = document.getElementById('root');
if (!wurzel) throw new Error('#root fehlt');

createRoot(wurzel).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
