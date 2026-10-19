import React, { useMemo, useState } from 'react';
import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { CommitmentRecord } from '../types';
import { BucketCounts, countBuckets } from '../services/status';
import { BreakdownRow } from './StatusBreakdown';
import { panelSx } from './SummaryChart';

const PARTIES = ['National', 'ACT', 'NZ First'];

const deliveredShare = (counts: BucketCounts, total: number) => (total ? counts.delivered / total : 0);

interface BreakdownProps {
  data: CommitmentRecord[];
  selected: string[];
  onSelect: (value: string) => void;
}

export const PartyBreakdown = ({ data, selected, onSelect }: BreakdownProps) => {
  const rows = useMemo(() => PARTIES.map(party => ({
    party,
    counts: countBuckets(data.filter(item => item.Party.split(',').map(p => p.trim()).includes(party))),
  })), [data]);

  return (
    <Paper component="section" aria-labelledby="party-heading" sx={panelSx}>
      <Typography id="party-heading" variant="h6" component="h2" sx={{ fontWeight: 600 }}>
        Progress by Party
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Shares of each party's commitments. Shared commitments count for every party named.
      </Typography>
      <Stack spacing={0.5}>
        {rows.map(row => (
          <BreakdownRow
            key={row.party}
            label={row.party}
            counts={row.counts}
            selected={selected.includes(row.party)}
            onSelect={() => onSelect(row.party)}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export const CategoryBreakdown = ({ data, selected, onSelect }: BreakdownProps) => {
  const [sortBy, setSortBy] = useState<'size' | 'delivered'>('size');

  const rows = useMemo(() => {
    const byCategory = new Map<string, CommitmentRecord[]>();
    data.forEach(item => byCategory.set(item.Category, [...(byCategory.get(item.Category) ?? []), item]));

    return Array.from(byCategory.entries())
      .map(([category, records]) => ({ category, total: records.length, counts: countBuckets(records) }))
      .sort((a, b) => sortBy === 'size'
        ? b.total - a.total || a.category.localeCompare(b.category)
        : deliveredShare(a.counts, a.total) - deliveredShare(b.counts, b.total) || b.total - a.total);
  }, [data, sortBy]);

  return (
    <Paper component="section" aria-labelledby="category-heading" sx={panelSx}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography id="category-heading" variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Progress by Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a category to filter the commitments below.
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={sortBy}
          onChange={(e, value) => value && setSortBy(value)}
          aria-label="Order categories by"
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none', py: 0.5 } }}
        >
          <ToggleButton value="size">Most commitments</ToggleButton>
          <ToggleButton value="delivered">Least delivered</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Stack spacing={0.25} sx={{ mt: 2 }}>
        {rows.map(row => (
          <BreakdownRow
            key={row.category}
            label={row.category}
            counts={row.counts}
            selected={selected.includes(row.category)}
            onSelect={() => onSelect(row.category)}
          />
        ))}
      </Stack>
    </Paper>
  );
};
