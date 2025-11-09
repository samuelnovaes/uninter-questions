import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1c2b'
    },
    cards: {
      subjects: {
        background: '#1c2a3a',
        color: '#fff'
      }
    },
    buttons: {
      simulado: {
        main: '#ffbe18',
        contrastText: '#1f2c3a'
      },
      gabarito: {
        main: '#1f2c3a',
        contrastText: '#ffbe18',
        border: '1px solid #ffbe18'
      }
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121b25',
          color: '#ffbe18',
          fontWeight: 'bold',
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#14212e'
        }
      }
    }
  }
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#e0e6ee'
    },
    cards: {
      subjects: {
        background: '#fff',
        color: '#003d7a'
      }
    },
    buttons: {
      simulado: {
        main: '#003d7a',
        contrastText: '#fff'
      },
      gabarito: {
        main: '#fff',
        contrastText: '#003d7a',
        border: '1px solid #003d7a'
      }
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#003d7a',
          fontWeight: 'bold',
          border: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    }
  }
});
