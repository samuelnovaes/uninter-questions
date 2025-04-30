import { colors, createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.grey[900]
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000'
        }
      }
    }
  }
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: colors.grey[100]
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          border: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF'
        }
      }
    }
  }
});

