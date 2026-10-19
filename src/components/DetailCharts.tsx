import React, { useMemo, useState } from 'react';
import { Box, Button, List, ListItem, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Warning, Event } from '@mui/icons-material';
import { CommitmentRecord } from '../types';
import { BucketCounts, countBuckets, getStatusValue } from '../services/status';
import { formatDate, isPastDue, parseDate } from '../services/format';
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

interface DueDatesProps {
  data: CommitmentRecord[];
  onShowPastDue: () => void;
}

const DueList = ({ items, emptyText, pastDue }: { items: CommitmentRecord[]; emptyText: string; pastDue: boolean }) => {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
        {emptyText}
      </Typography>
    );
  }

  return (
    <List dense disablePadding>
      {items.map(item => (
        <ListItem
          key={item.Commitment}
          disableGutters
          sx={{ display: 'block', py: 1, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
        >
          <Typography variant="caption" color={pastDue ? 'error' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
            {pastDue ? <Warning fontSize="inherit" /> : <Event fontSize="inherit" />}
            Due {formatDate(item.Due)} · {getStatusValue(item.Status)}% · {item.Category}
          </Typography>
          <Typography variant="body2">{item.Commitment}</Typography>
        </ListItem>
      ))}
    </List>
  );
};

export const DueDates = ({ data, onShowPastDue }: DueDatesProps) => {
  const [showAllPastDue, setShowAllPastDue] = useState(false);

  const { pastDue, upcoming } = useMemo(() => {
    const today = new Date();
    const byDue = (a: CommitmentRecord, b: CommitmentRecord) =>
      (parseDate(a.Due)?.getTime() ?? 0) - (parseDate(b.Due)?.getTime() ?? 0);

    return {
      pastDue: data.filter(item => isPastDue(item, today)).sort(byDue),
      upcoming: data.filter(item => {
        const due = parseDate(item.Due);
        return due !== null && due >= today;
      }).sort(byDue),
    };
  }, [data]);

  const visiblePastDue = showAllPastDue ? pastDue : pastDue.slice(0, 5);

  return (
    <Paper component="section" aria-labelledby="due-heading" sx={panelSx}>
      <Typography id="due-heading" variant="h6" component="h2" sx={{ fontWeight: 600 }}>
        Due Dates
      </Typography>

      <Typography variant="subtitle2" component="h3" sx={{ mt: 2 }}>
        Past due ({pastDue.length})
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Due date has passed and the commitment is neither delivered nor marked failed.
      </Typography>
      <DueList items={visiblePastDue} emptyText="Nothing is past due." pastDue />
      {pastDue.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {pastDue.length > 5 && (
            <Button size="small" onClick={() => setShowAllPastDue(!showAllPastDue)}>
              {showAllPastDue ? 'Show fewer' : `Show all ${pastDue.length}`}
            </Button>
          )}
          <Button size="small" variant="outlined" onClick={onShowPastDue}>
            Filter list to past due
          </Button>
        </Box>
      )}

      <Typography variant="subtitle2" component="h3" sx={{ mt: 3, mb: 1 }}>
        Upcoming ({upcoming.length})
      </Typography>
      <DueList items={upcoming.slice(0, 8)} emptyText="No upcoming due dates are recorded." pastDue={false} />
    </Paper>
  );
};
