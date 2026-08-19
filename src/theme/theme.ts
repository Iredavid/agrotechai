import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: '#2E7D32',
      light: '#43A047',
      dark: '#1B5E20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8BC34A',
      light: '#9CCC65',
      dark: '#689F38',
      contrastText: '#000000',
    },
    error: {
      main: '#E53935',
    },
    warning: {
      main: '#FF9800',
    },
    background: {
      default: mode === 'light' ? '#F8FAF8' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#1B1B1B' : '#F8FAF8',
      secondary: mode === 'light' ? '#5E5E5E' : '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      textTransform: 'none' as const,
    },
    caption: {
      fontFamily: '"Roboto Mono", monospace',
    },
    overline: {
      fontFamily: '"Roboto Mono", monospace',
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: mode === 'light' 
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.05)' 
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: '20px',
        },
      },
    },
  },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));
