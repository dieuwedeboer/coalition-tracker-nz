import React from 'react';
import { Box, ButtonBase, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BucketCounts, getStatusColours, STATUS_BUCKETS, StatusBucket } from '../services/status';

const percentOf = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0);

interface StackedStatusBarProps {
  counts: BucketCounts;
  height?: number;
  label: string;
  selected?: StatusBucket[];
  onSegmentClick?: (bucket: StatusBucket) => void;
}

export const StackedStatusBar = ({ counts, height = 12, label, selected = [], onSegmentClick }: StackedStatusBarProps) => {
  const theme = useTheme();
  const colours = getStatusColours(theme.palette.mode);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <Box
      role="img"
      aria-label={`${label}: ${STATUS_BUCKETS.filter(b => counts[b.key] > 0).map(b => `${counts[b.key]} ${b.label.toLowerCase()}`).join(', ')}`}
      sx={{ display: 'flex', gap: '2px', height, width: '100%' }}
    >
      {STATUS_BUCKETS.filter(bucket => counts[bucket.key] > 0).map(bucket => {
        const count = counts[bucket.key];
        const faded = selected.length > 0 && !selected.includes(bucket.key);
        const segment = (
          <Box
            component={onSegmentClick ? ButtonBase : 'span'}
            onClick={onSegmentClick ? () => onSegmentClick(bucket.key) : undefined}
            tabIndex={-1}
            aria-hidden="true"
            sx={{
              flex: `${count} 0 0`,
              minWidth: 4,
              height: '100%',
              backgroundColor: colours[bucket.key],
              opacity: faded ? 0.3 : 1,
              borderRadius: '4px',
              transition: 'opacity 0.2s',
              display: 'block',
            }}
          />
        );
        return (
          <Tooltip
            key={bucket.key}
            title={`${bucket.label}: ${count} of ${total} (${percentOf(count, total)}%)`}
            disableInteractive
          >
            {segment}
          </Tooltip>
        );
      })}
    </Box>
  );
};

interface StatusLegendProps {
  counts: BucketCounts;
  selected?: StatusBucket[];
  onToggle?: (bucket: StatusBucket) => void;
}

export const StatusLegend = ({ counts, selected = [], onToggle }: StatusLegendProps) => {
  const theme = useTheme();
  const colours = getStatusColours(theme.palette.mode);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <Box
      sx={{
        display: { xs: 'grid', sm: 'flex' },
        gridTemplateColumns: '1fr 1fr',
        flexWrap: 'wrap',
        gap: 1,
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      {STATUS_BUCKETS.map(bucket => {
        const active = selected.includes(bucket.key);
        return (
          <ButtonBase
            key={bucket.key}
            onClick={onToggle ? () => onToggle(bucket.key) : undefined}
            disabled={!onToggle}
            aria-pressed={onToggle ? active : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: 2,
              border: `1px solid ${active ? colours[bucket.key] : theme.palette.divider}`,
              backgroundColor: active ? theme.palette.action.selected : 'transparent',
              textAlign: 'left',
              '&:hover': { backgroundColor: theme.palette.action.hover },
              '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
            }}
          >
            <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: colours[bucket.key], flexShrink: 0 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {bucket.label}{' '}
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'inline' } }}>
                  {counts[bucket.key]} · {percentOf(counts[bucket.key], total)}%
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
                Status {bucket.range}
              </Typography>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

interface BreakdownRowProps {
  label: string;
  counts: BucketCounts;
  selected?: boolean;
  onSelect?: () => void;
}

export const BreakdownRow = ({ label, counts, selected = false, onSelect }: BreakdownRowProps) => {
  const theme = useTheme();
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <ButtonBase
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${label}: ${total} commitments, ${percentOf(counts.delivered, total)}% delivered. Filter the list to ${label}.`}
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr auto', sm: 'minmax(120px, 160px) 1fr 92px' },
        gridTemplateAreas: { xs: '"label metric" "bar bar"', sm: '"label bar metric"' },
        alignItems: 'center',
        columnGap: 1.5,
        rowGap: 0.5,
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        textAlign: 'left',
        backgroundColor: selected ? theme.palette.action.selected : 'transparent',
        '&:hover': { backgroundColor: theme.palette.action.hover },
        '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 1 },
      }}
    >
      <Typography variant="body2" sx={{ gridArea: 'label', fontWeight: selected ? 700 : 500 }} noWrap>
        {label}{' '}
        <Typography component="span" variant="caption" color="text.secondary">
          ({total})
        </Typography>
      </Typography>
      <Box sx={{ gridArea: 'bar' }}>
        <StackedStatusBar counts={counts} label={label} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ gridArea: 'metric', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {percentOf(counts.delivered, total)}% delivered
      </Typography>
    </ButtonBase>
  );
};
