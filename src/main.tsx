import { createTheme, ThemeProvider } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

interface ExtendedTypographyOptions extends TypographyOptions {
  notoSerifTC: React.CSSProperties;
  notoSerifTC200: React.CSSProperties;
  notoSerifTC300: React.CSSProperties;
  notoSerifTC500: React.CSSProperties;
  notoSerifTC600: React.CSSProperties;
  notoSerifTC700: React.CSSProperties;
  notoSerifTC900: React.CSSProperties;
}

const theme = createTheme({
  typography: {
    notoSerifTC: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 400,
    },
    notoSerifTC200: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 200,
    },
    notoSerifTC300: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 300,
    },
    notoSerifTC500: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 500,
    },
    notoSerifTC600: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 600,
    },
    notoSerifTC700: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 700,
    },
    notoSerifTC900: {
      fontFamily: '"Noto Serif TC", sans-serif',
      fontWeight: 900,
    },
  } as ExtendedTypographyOptions,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
