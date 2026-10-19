import React from 'react';
import { Chip, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PartyChipProps {
  party: string;
  size?: 'compact' | 'filter';
  selected?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const PartyChip = ({ party, size = 'compact', selected = true, onClick, sx }: PartyChipProps) => {
  const theme = useTheme();
  const colour = theme.partyColors[party as keyof typeof theme.partyColors] ?? theme.palette.grey[600];
  const filled = selected;

  return (
    <Chip
      label={party}
      size="small"
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      variant={filled ? 'filled' : 'outlined'}
      sx={{
        height: size === 'compact' ? 20 : 26,
        fontSize: size === 'compact' ? '0.7rem' : '0.75rem',
        fontWeight: 600,
        backgroundColor: filled ? colour : 'transparent',
        color: filled ? theme.palette.getContrastText(colour) : 'text.primary',
        border: `1px solid ${filled && theme.palette.mode === 'light' ? colour : theme.palette.divider}`,
        borderLeft: `4px solid ${colour}`,
        '&&:hover': onClick ? { backgroundColor: filled ? colour : theme.palette.action.hover, filter: filled ? 'brightness(1.1)' : 'none' } : {},
        ...sx,
      }}
    />
  );
};

export default PartyChip;
