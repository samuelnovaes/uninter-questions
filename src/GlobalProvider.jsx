import { createContext, useState } from 'react';
import repository from '../repository.json';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';

export const GlobalContext = createContext([]);

const GlobalProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(!localStorage.lightTheme);

  const toggleDarkTheme = () => {
    const value = !isDark;
    if(value) {
      delete localStorage.lightTheme;
    }
    else {
      localStorage.lightTheme = 'true';
    }
    setIsDark(value);
  };

  return (
    <GlobalContext.Provider
      value={{
        subjects: repository,
        isDark,
        toggleDarkTheme
      }}
    >
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
