import { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';

export const GlobalContext = createContext([]);

const GlobalProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(!localStorage.lightTheme);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDarkTheme = () => {
    const value = !isDark;
    if (value) {
      delete localStorage.lightTheme;
    }
    else {
      localStorage.lightTheme = 'true';
    }
    setIsDark(value);
  };

  const loadSubjects = async () => {
    const response = await fetch('/uninter-questions/repository.json');
    const result = await response.json();
    setSubjects(result);
    setLoading(false);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        subjects,
        isDark,
        toggleDarkTheme
      }}
    >
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        {loading && (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='100vh'
          >
            <CircularProgress variant='indeterminate' />
          </Box>
        )}
        {!loading && children}
      </ThemeProvider>
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
