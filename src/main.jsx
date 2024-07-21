import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import RepositoryProvider from './providers/RepositoryProvider';
import router from './router';
import theme from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RepositoryProvider>
        <RouterProvider router={router} />
      </RepositoryProvider>
    </ThemeProvider>
  </StrictMode>
);
