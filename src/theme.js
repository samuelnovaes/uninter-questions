import { colors, createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.grey[900]
    }
  }
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: colors.grey[100]
    }
  }
});

