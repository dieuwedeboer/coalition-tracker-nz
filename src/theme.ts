import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    partyColors: {
      National: string;
      ACT: string;
      'NZ First': string;
    };
  }
  interface ThemeOptions {
    partyColors?: {
      National?: string;
      ACT?: string;
      'NZ First'?: string;
    };
  }
}

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          main: '#ff9800',
          light: '#ffb74d',
          dark: '#f57c00',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      }
      : {
        primary: {
          main: '#90caf9',
          light: '#bbdefb',
          dark: '#42a5f5',
        },
        secondary: {
          main: '#ffab40',
          light: '#ffcc80',
          dark: '#f57c00',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0bec5',
        },
      }),
  },
  partyColors: {
    National: '#0F3460',
    ACT: '#FFA500',
    'NZ First': '#1A1A1A',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none' as 'none',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

export const createCustomTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme(getDesignTokens(mode));

export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');
