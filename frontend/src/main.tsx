import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from '@/lib/queryClient';
import { ToastsRoot } from '@/components/ui/toast';
import { applyThemeClass, useThemeStore } from '@/stores/themeStore';
import App from './App';
import 'leaflet/dist/leaflet.css';
import './index.css';

applyThemeClass(useThemeStore.getState().theme);
useThemeStore.subscribe((s) => applyThemeClass(s.theme));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ToastsRoot>
            <App />
          </ToastsRoot>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
