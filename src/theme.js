import { colors, createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1c2b'
    },
    primary: {
      main: '#ffbe18'
    },
    white: {
      main: '#ffffff',
      contrastText: '#000000'
    },
    success: {
      main: colors.green[500],
      contrastText: '#ffffff'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c2a3a'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121b25',
          color: '#ffbe18',
          fontWeight: 'bold',
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          textTransform: 'uppercase'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#14212e'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1c2a3a'
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
    primary: {
      main: '#003d7a'
    },
    white: {
      main: '#ffffff',
      contrastText: '#000000'
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
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          textTransform: 'uppercase'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        }
      }
    }
  }
});
