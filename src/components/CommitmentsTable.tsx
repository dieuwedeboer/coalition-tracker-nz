import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  Close,
  ExpandLess,
  ExpandMore,
  FilterList,
  Search,
  TableRows,
  ViewModule,
  Warning,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { CommitmentRecord } from '../types';
import {
  getBucketInfo,
  getStatusBucket,
  getStatusColours,
  getStatusValue,
  STATUS_BUCKETS,
} from '../services/status';
import { formatDate, getReferenceInfo, isPastDue, parseDate } from '../services/format';
import { FilterState, hasActiveFilters, SortField, toggleValue } from '../services/filterState';
import PartyChip from './PartyChip';

interface CommitmentsTableProps {
  data: CommitmentRecord[];
  filters: FilterState;
  onFiltersChange: (changes: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Health': '🏥',
  'Education': '📚',
  'Law & Order': '👮',
  'Economy': '💰',
  'Tax': '💵',
  'Infrastructure': '🏗️',
  'Social Services': '👥',
  'Environment': '🌿',
  'Democracy': '🗳️',
  'Freedoms': '🕊️',
  'Seniors': '👴',
  'Employment': '💼',
  'Primary Industry': '🌾',
  'Natural Resources': '⛏️',
  'Firearms': '🔫',
  'Public Service': '🏢',
  'Monetary': '💲',
  'Fiscal': '📊',
  'Regulation': '⚖️',
  'Immigration': '✈️',
  'Tenancy': '🏠',
  'Climate Change': '🌍',
  'Cyclone Gabrielle': '🌀',
};

const TIER_DESCRIPTIONS: Record<number, string> = {
  1: 'Tier 1: primary record (government, Parliament, legislation or implementing agency)',
  2: 'Tier 2: independent news reporting',
  3: 'Tier 3: party, lobby group or social media claim',
};

const splitParties = (party: string) => party.split(',').map(p => p.trim()).filter(Boolean);

const ReferenceLinks = ({ references }: { references: string }) => (
  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
    {references.split(/(https?:\/\/\S+)/).map((part, idx) =>
      /^https?:\/\//.test(part) ? (
        <Link key={idx} href={part} target="_blank" rel="noopener noreferrer">
          {part.replace(/^https?:\/\/(www\.)?/, '')}
        </Link>
      ) : (
        part
      )
    )}
  </Typography>
);

const Evidence = ({ record }: { record: CommitmentRecord }) => {
  const reference = getReferenceInfo(record.References);
  const evidenceDate = formatDate(record.Updated);

  if (!reference && !evidenceDate) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 0.75, rowGap: 0.25 }}>
      {evidenceDate && (
        <Typography variant="caption" color="text.secondary">
          {evidenceDate}
        </Typography>
      )}
      {reference && (
        <>
          <Link
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            sx={{ fontWeight: 600 }}
          >
            {reference.domain}
          </Link>
          {reference.tier && (
            <Tooltip title={TIER_DESCRIPTIONS[reference.tier]}>
              <Chip
                label={`Tier ${reference.tier}`}
                size="small"
                variant="outlined"
                tabIndex={0}
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
              />
            </Tooltip>
          )}
        </>
      )}
    </Box>
  );
};

const StatusMeter = ({ status }: { status: number | boolean }) => {
  const theme = useTheme();
  const value = getStatusValue(status);
  const bucket = getStatusBucket(status);
  const colour = getStatusColours(theme.palette.mode)[bucket];

  return (
    <Box sx={{ minWidth: 120 }}>
      <Box
        role="meter"
        aria-valuemin={-1}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label="Status"
        sx={{ height: 8, borderRadius: '4px', backgroundColor: 'action.hover', overflow: 'hidden', mb: 0.5 }}
      >
        <Box sx={{ height: '100%', width: `${value < 0 ? 100 : Math.max(value, 0)}%`, backgroundColor: colour, borderRadius: '4px' }} />
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
        {value < 0 ? 'Failed' : `${value}%`}
        <Typography component="span" variant="caption" color="text.secondary">
          {' '}· {getBucketInfo(bucket).label}
        </Typography>
      </Typography>
    </Box>
  );
};

const Details = ({ record }: { record: CommitmentRecord }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    {record.Notes && (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
          Notes
        </Typography>
        <Typography variant="body2">{record.Notes}</Typography>
      </Box>
    )}
    {record.References && (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
          References
        </Typography>
        <ReferenceLinks references={record.References} />
      </Box>
    )}
    {!record.References && !record.Notes && (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No additional details available
      </Typography>
    )}
  </Box>
);

interface CommitmentItemProps {
  record: CommitmentRecord;
  expanded: boolean;
  onToggle: (commitment: string) => void;
}

const CommitmentCard = React.memo(({ record, expanded, onToggle }: CommitmentItemProps) => {
  const theme = useTheme();
  const status = getStatusValue(record.Status);
  const colour = getStatusColours(theme.palette.mode)[getStatusBucket(status)];
  const categoryIcon = CATEGORY_ICONS[record.Category] || '📋';
  const pastDue = isPastDue(record);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        borderTop: `4px solid ${colour}`,
        '@media (prefers-reduced-motion: no-preference)': {
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': { boxShadow: theme.shadows[6], transform: 'translateY(-2px)' },
        },
      }}
    >
      <CardHeader
        avatar={
          <Typography
            variant="h5"
            aria-hidden="true"
            sx={{
              backgroundColor: theme.palette.action.hover,
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            {categoryIcon}
          </Typography>
        }
        title={record.Commitment}
        titleTypographyProps={{
          variant: 'subtitle1',
          component: 'h3',
          fontWeight: 600,
          sx: { lineHeight: 1.3 },
        }}
        subheader={
          <Box component="span" sx={{ mt: 0.75, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
            {splitParties(record.Party).map(party => (
              <PartyChip key={party} party={party} />
            ))}
            <Typography component="span" variant="caption" color="text.secondary">
              • {record.Category}
            </Typography>
          </Box>
        }
        action={
          <IconButton
            onClick={() => onToggle(record.Commitment)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide notes and references' : 'Show notes and references'}
            size="small"
            sx={{ mt: 1 }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
        sx={{ pb: 1, alignItems: 'flex-start' }}
      />

      <CardContent sx={{ pt: 0 }}>
        <StatusMeter status={record.Status} />

        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
            Evidence
          </Typography>
          <Evidence record={record} />
        </Box>

        {record.Due && (
          <Typography
            variant="caption"
            color={pastDue ? 'error' : 'text.secondary'}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, fontWeight: pastDue ? 600 : 400 }}
          >
            {pastDue && <Warning fontSize="inherit" />}
            Due {formatDate(record.Due)}{pastDue && ' (past due)'}
          </Typography>
        )}

        {record.Tags && record.Tags.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            {record.Tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', borderColor: theme.palette.divider }}
              />
            ))}
          </Stack>
        )}

        <Collapse in={expanded} unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Details record={record} />
        </Collapse>
      </CardContent>
    </Card>
  );
});

const CommitmentRow = React.memo(({ record, expanded, onToggle }: CommitmentItemProps) => {
  const pastDue = isPastDue(record);

  return (
    <>
      <TableRow hover sx={{ '& > td': { borderBottom: expanded ? 0 : undefined, verticalAlign: 'top' } }}>
        <TableCell padding="checkbox" sx={{ pt: 1 }}>
          <IconButton
            onClick={() => onToggle(record.Commitment)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide notes and references' : 'Show notes and references'}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
            {record.Commitment}
          </Typography>
          <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {record.Category}
            </Typography>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5, flexWrap: 'wrap' }}>
              {splitParties(record.Party).map(party => (
                <PartyChip key={party} party={party} />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
            <StatusMeter status={record.Status} />
          </Box>
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          <Stack spacing={0.5} alignItems="flex-start">
            {splitParties(record.Party).map(party => (
              <PartyChip key={party} party={party} />
            ))}
          </Stack>
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
          <StatusMeter status={record.Status} />
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, minWidth: 160 }}>
          <Evidence record={record} />
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, whiteSpace: 'nowrap' }}>
          {record.Due && (
            <Typography
              variant="caption"
              color={pastDue ? 'error' : 'text.secondary'}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: pastDue ? 600 : 400 }}
            >
              {pastDue && <Warning fontSize="inherit" titleAccess="Past due" />}
              {formatDate(record.Due)}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell />
          <TableCell colSpan={5} sx={{ pt: 0 }}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1.5 }}>
              <Evidence record={record} />
            </Box>
            <Details record={record} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'Status', label: 'Status' },
  { value: 'Updated', label: 'Evidence date' },
  { value: 'Due', label: 'Due date' },
  { value: 'Category', label: 'Category' },
  { value: 'Party', label: 'Party' },
];

const CommitmentsTable = ({ data, filters, onFiltersChange, onClearFilters }: CommitmentsTableProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState(filters.search);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchText(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      onFiltersChange({ search: value });
    }, 150);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(data.map(item => item.Category))).sort();
  }, [data]);

  const parties = useMemo(() => {
    const allParties = new Set<string>();
    data.forEach(item => splitParties(item.Party).forEach(p => allParties.add(p)));
    return Array.from(allParties).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    const query = filters.search.toLowerCase();
    const today = new Date();

    return data.filter(item => {
      if (query) {
        const matchesSearch =
          item.Commitment.toLowerCase().includes(query) ||
          item.Category.toLowerCase().includes(query) ||
          item.Party.toLowerCase().includes(query) ||
          (item.Notes && item.Notes.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(item.Category)) {
        return false;
      }

      if (filters.parties.length > 0 && !splitParties(item.Party).some(p => filters.parties.includes(p))) {
        return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(getStatusBucket(item.Status))) {
        return false;
      }

      if (filters.pastDue && !isPastDue(item, today)) {
        return false;
      }

      return true;
    });
  }, [data, filters.search, filters.categories, filters.parties, filters.statuses, filters.pastDue]);

  const sortedData = useMemo(() => {
    const direction = filters.order === 'asc' ? 1 : -1;
    const sortValue = (item: CommitmentRecord) => {
      if (filters.sort === 'Due' || filters.sort === 'Updated') {
        return parseDate(item[filters.sort])?.getTime() ?? null;
      }
      if (filters.sort === 'Status') return getStatusValue(item.Status);
      return item[filters.sort];
    };

    return [...filteredData].sort((a, b) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);
      if (valueA === valueB) return 0;
      if (valueA === null) return 1;
      if (valueB === null) return -1;
      return direction * (valueA < valueB ? -1 : 1);
    });
  }, [filteredData, filters.sort, filters.order]);

  const toggleCardExpansion = useCallback((commitment: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(commitment)) {
        next.delete(commitment);
      } else {
        next.add(commitment);
      }
      return next;
    });
  }, []);

  const handleSortHeader = (field: SortField) => {
    if (filters.sort === field) {
      onFiltersChange({ order: filters.order === 'asc' ? 'desc' : 'asc' });
    } else {
      onFiltersChange({ sort: field, order: field === 'Category' || field === 'Party' ? 'asc' : 'desc' });
    }
  };

  const filterCount =
    filters.statuses.length + filters.parties.length + filters.categories.length + (filters.pastDue ? 1 : 0);
  const filtersActive = hasActiveFilters(filters);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const chipSx = { height: 26, fontSize: '0.75rem' };

  const sortControls = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="sort-by-label">Sort by</InputLabel>
        <Select
          labelId="sort-by-label"
          value={filters.sort}
          label="Sort by"
          onChange={(e) => onFiltersChange({ sort: e.target.value as SortField })}
          sx={{ borderRadius: 2 }}
        >
          {SORT_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <ToggleButtonGroup
        value={filters.order}
        exclusive
        onChange={(e, val) => val && onFiltersChange({ order: val })}
        size="small"
        aria-label="Sort direction"
      >
        <ToggleButton value="asc" aria-label="Ascending">
          <ArrowUpward fontSize="small" />
        </ToggleButton>
        <ToggleButton value="desc" aria-label="Descending">
          <ArrowDownward fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={filters.view}
        exclusive
        onChange={(e, val) => val && onFiltersChange({ view: val })}
        size="small"
        aria-label="Layout"
      >
        <ToggleButton value="table" aria-label="Table view">
          <TableRows fontSize="small" />
        </ToggleButton>
        <ToggleButton value="grid" aria-label="Card view">
          <ViewModule fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  const filterGroups = (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
          Categories
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {categories.map(category => {
            const selected = filters.categories.includes(category);
            return (
              <Chip
                key={category}
                label={category}
                size="small"
                aria-pressed={selected}
                onClick={() => onFiltersChange({ categories: toggleValue(filters.categories, category) })}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                sx={chipSx}
              />
            );
          })}
        </Stack>
      </Grid>

      <Grid item xs={12} md={2}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
          Parties
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {parties.map(party => (
            <PartyChip
              key={party}
              party={party}
              size="filter"
              selected={filters.parties.includes(party)}
              onClick={() => onFiltersChange({ parties: toggleValue(filters.parties, party) })}
            />
          ))}
        </Stack>
      </Grid>

      <Grid item xs={12} md={5}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
          Status
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {STATUS_BUCKETS.map(bucket => {
            const selected = filters.statuses.includes(bucket.key);
            const colour = getStatusColours(theme.palette.mode)[bucket.key];
            return (
              <Chip
                key={bucket.key}
                label={bucket.label}
                size="small"
                aria-pressed={selected}
                onClick={() => onFiltersChange({ statuses: toggleValue(filters.statuses, bucket.key) })}
                variant={selected ? 'filled' : 'outlined'}
                icon={<Box component="span" sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: colour, ml: '6px !important' }} />}
                sx={{
                  ...chipSx,
                  ...(selected && { backgroundColor: theme.palette.action.selected }),
                  borderColor: selected ? colour : undefined,
                }}
              />
            );
          })}
          <Chip
            label="Past due"
            size="small"
            aria-pressed={filters.pastDue}
            onClick={() => onFiltersChange({ pastDue: !filters.pastDue })}
            icon={<Warning sx={{ fontSize: '14px !important' }} />}
            color={filters.pastDue ? 'error' : 'default'}
            variant={filters.pastDue ? 'filled' : 'outlined'}
            sx={chipSx}
          />
        </Stack>
      </Grid>
    </Grid>
  );

  return (
    <Box component="section" aria-labelledby="commitments-heading" id="commitments" sx={{ scrollMarginTop: 72 }}>
      <Typography id="commitments-heading" variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
        Commitments
      </Typography>

      <Paper
        elevation={2}
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: theme.zIndex.appBar - 1,
          p: 1.5,
          mb: 2,
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search commitments and notes…"
            value={searchText}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'Search commitments' }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ flex: '1 1 0', minWidth: 0, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {isDesktop && sortControls}

          <Badge badgeContent={filterCount} color="primary" sx={{ flexShrink: 0, mr: filterCount ? 0.5 : 0 }}>
            <Button
              variant={isDesktop && filtersOpen ? 'contained' : 'outlined'}
              startIcon={<FilterList />}
              onClick={() => (isDesktop ? setFiltersOpen(!filtersOpen) : setDrawerOpen(true))}
              aria-expanded={isDesktop ? filtersOpen : drawerOpen}
              aria-controls={isDesktop ? 'filter-panel' : 'filter-drawer'}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Filters
            </Button>
          </Badge>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, minHeight: 30 }}>
          <Typography variant="body2" color="text.secondary" role="status">
            {sortedData.length} of {data.length} commitments
          </Typography>
          {filtersActive && (
            <Button size="small" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </Box>

      </Paper>

      {isDesktop && (
        <Collapse in={filtersOpen} id="filter-panel">
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            {filterGroups}
          </Paper>
        </Collapse>
      )}

      <Drawer
        anchor="bottom"
        open={!isDesktop && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ id: 'filter-drawer', sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85vh' } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">Filter and sort</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close filters">
              <Close />
            </IconButton>
          </Box>
          {sortControls}
          <Divider sx={{ my: 2 }} />
          {filterGroups}
          <Box sx={{ display: 'flex', gap: 1, mt: 3, position: 'sticky', bottom: 0 }}>
            <Button onClick={onClearFilters} disabled={!filtersActive}>
              Clear filters
            </Button>
            <Button variant="contained" onClick={() => setDrawerOpen(false)} sx={{ ml: 'auto' }}>
              Show {sortedData.length} commitments
            </Button>
          </Box>
        </Box>
      </Drawer>

      {sortedData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No commitments match your filters
          </Typography>
          <Button variant="outlined" onClick={onClearFilters} sx={{ mt: 2 }}>
            Clear filters
          </Button>
        </Box>
      ) : filters.view === 'table' ? (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
          <Table size="small" aria-labelledby="commitments-heading">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
                    Details
                  </Box>
                </TableCell>
                <TableCell sortDirection={filters.sort === 'Category' ? filters.order : false}>
                  <TableSortLabel
                    active={filters.sort === 'Category'}
                    direction={filters.sort === 'Category' ? filters.order : 'asc'}
                    onClick={() => handleSortHeader('Category')}
                  >
                    Commitment
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} sortDirection={filters.sort === 'Party' ? filters.order : false}>
                  <TableSortLabel
                    active={filters.sort === 'Party'}
                    direction={filters.sort === 'Party' ? filters.order : 'asc'}
                    onClick={() => handleSortHeader('Party')}
                  >
                    Party
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} sortDirection={filters.sort === 'Status' ? filters.order : false}>
                  <TableSortLabel
                    active={filters.sort === 'Status'}
                    direction={filters.sort === 'Status' ? filters.order : 'desc'}
                    onClick={() => handleSortHeader('Status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} sortDirection={filters.sort === 'Updated' ? filters.order : false}>
                  <TableSortLabel
                    active={filters.sort === 'Updated'}
                    direction={filters.sort === 'Updated' ? filters.order : 'desc'}
                    onClick={() => handleSortHeader('Updated')}
                  >
                    Evidence
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }} sortDirection={filters.sort === 'Due' ? filters.order : false}>
                  <TableSortLabel
                    active={filters.sort === 'Due'}
                    direction={filters.sort === 'Due' ? filters.order : 'desc'}
                    onClick={() => handleSortHeader('Due')}
                  >
                    Due
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map(record => (
                <CommitmentRow
                  key={`${record.Commitment}-${record.Party}-${record.Category}`}
                  record={record}
                  expanded={expandedCards.has(record.Commitment)}
                  onToggle={toggleCardExpansion}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {sortedData.map(record => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              key={`${record.Commitment}-${record.Party}-${record.Category}`}
            >
              <CommitmentCard
                record={record}
                expanded={expandedCards.has(record.Commitment)}
                onToggle={toggleCardExpansion}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {showScrollTop && (
        <Zoom in={showScrollTop}>
          <IconButton
            onClick={scrollToTop}
            aria-label="Back to top"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              boxShadow: theme.shadows[6],
              zIndex: 1000,
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Zoom>
      )}
    </Box>
  );
};

export default CommitmentsTable;
