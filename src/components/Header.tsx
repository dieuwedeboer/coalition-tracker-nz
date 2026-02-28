import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
} from '@mui/material';
import { Brightness4, Brightness7, Flag } from '@mui/icons-material';

interface HeaderProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header = ({ mode, onToggleTheme }: HeaderProps) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: (theme) =>
          `rgba(${mode === 'light' ? '255, 255, 255' : '30, 30, 30'}, 0.95)`,
        backdropFilter: 'blur(10px)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        top: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ gap: 2 }}>
          <Flag sx={{ color: (theme) => theme.palette.primary.main, fontSize: 32 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            NZ Coalition Tracker
          </Typography>
          <IconButton
            onClick={onToggleTheme}
            color="inherit"
            sx={{
              borderRadius: 2,
              backgroundColor: (theme) => theme.palette.action.hover,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.selected,
              },
              padding: 1,
            }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
