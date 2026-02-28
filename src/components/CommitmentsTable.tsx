import React, { useState, useEffect, useMemo, useTransition, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField,
  Paper,
  Stack,
  Zoom,
  Tooltip,
  Badge,
  ChipProps,
  Alert,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  ExpandLess,
  ExpandMore,
  Search,
  FilterList,
  Clear,
  ViewModule,
  ViewList,
  Warning,
  AccessTime,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { CommitmentRecord } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface CommitmentsTableProps {
  data: CommitmentRecord[];
  activeFilter: string | null;
  onClearFilter: () => void;
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

const getPartyColor = (party: string, theme: any): ChipProps['color'] => {
  if (party === 'National') return 'primary';
  if (party === 'ACT') return 'secondary';
  if (party === 'NZ First') return 'default';
  return 'default';
};

const CommitmentsTable = ({ data, activeFilter, onClearFilter }: CommitmentsTableProps) => {
  const theme = useTheme();

  const [orderBy, setOrderBy] = useState('Status');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(e.target.value);
    }, 150);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(data.map(item => item.Category))).sort();
  }, [data]);

  const parties = useMemo(() => {
    const allParties = new Set<string>();
    data.forEach(item => {
      item.Party.split(',').forEach(p => allParties.add(p.trim()));
    });
    return Array.from(allParties).sort();
  }, [data]);

  const statuses = ['Not Started', 'In Progress', 'Delivered', 'Failed'];

  const dateSortFunction = (a: CommitmentRecord, b: CommitmentRecord) => {
    const dateA = a[orderBy as keyof CommitmentRecord]
      ? new Date((a[orderBy as keyof CommitmentRecord] as string).split('/').reverse().join('/'))
      : null;
    const dateB = b[orderBy as keyof CommitmentRecord]
      ? new Date((b[orderBy as keyof CommitmentRecord] as string).split('/').reverse().join('/'))
      : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;

    return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesSearch =
          item.Commitment.toLowerCase().includes(query) ||
          item.Category.toLowerCase().includes(query) ||
          item.Party.toLowerCase().includes(query) ||
          (item.Notes && item.Notes.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(item.Category)) {
        return false;
      }

      const matchesParty = selectedParties.length === 0 ||
        selectedParties.some((p: string) => item.Party.includes(p));
      if (!matchesParty) return false;

      const status = typeof item.Status === 'boolean' ? 0 : item.Status as number;
      let itemStatus = 'Not Started';
      if (status === 100) itemStatus = 'Delivered';
      else if (status > 0 && status < 100) itemStatus = 'In Progress';
      else if (status < 0) itemStatus = 'Failed';

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(itemStatus)) {
        return false;
      }

      return true;
    });
  }, [data, debouncedSearch, selectedCategories, selectedParties, selectedStatuses]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (orderBy === 'Due' || orderBy === 'Updated') {
        return dateSortFunction(a, b);
      }
      const isAsc = order === 'asc';
      return (isAsc ? 1 : -1) * ((a[orderBy as keyof CommitmentRecord] as any) < (b[orderBy as keyof CommitmentRecord] as any) ? -1 : 1);
    });
  }, [filteredData, orderBy, order]);

  const handleSortChange = (event: any) => {
    setOrderBy(event.target.value);
  };

  const handleOrderToggle = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  const toggleCardExpansion = (commitment: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(commitment)) {
      newExpanded.delete(commitment);
    } else {
      newExpanded.add(commitment);
    }
    setExpandedCards(newExpanded);
  };

  const getStatusColor = (status: number): 'success' | 'error' | 'info' | 'default' => {
    if (status === 100) return 'success';
    if (status === 0) return 'default';
    if (status < 0) return 'error';
    return 'info';
  };

  const getProgressValue = (status: number | boolean) => {
    if (typeof status === 'boolean') return 0;
    return Math.max(0, status);
  };

  const isOverdue = (due: string, status: number) => {
    if (!due || status >= 100) return false;
    const dueDate = new Date(due.split('/').reverse().join('/'));
    const today = new Date();
    return dueDate < today;
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString.split('/').reverse().join('/'));
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CardComponent = React.memo(({ record }: { record: CommitmentRecord }) => {
    const status = typeof record.Status === 'boolean' ? 0 : record.Status;
    const categoryIcon = CATEGORY_ICONS[record.Category] || '📋';
    const overdue = record.Due && isOverdue(record.Due, status);

    return (
      <Card
        sx={{
          height: 'fit-content',
          borderRadius: 3,
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            boxShadow: theme.shadows[8],
            transform: 'translateY(-4px)',
          },
          backgroundColor:
            status === 100 ? theme.palette.success.main + '08' :
            status < 0 ? theme.palette.error.main + '08' :
            status > 0 && status < 100 ? theme.palette.info.main + '08' : 'inherit',
          borderLeft: overdue ? `4px solid ${theme.palette.error.main}` : 'none',
        }}
      >
          {overdue && (
            <Tooltip title="Overdue">
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: 12,
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme.shadows[2],
                  zIndex: 1,
                }}
              >
                <Warning fontSize="small" />
              </Box>
            </Tooltip>
          )}

          <CardHeader
            avatar={
              <Typography
                variant="h5"
                sx={{
                  backgroundColor: theme.palette.action.hover,
                  width: 48,
                  height: 48,
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
              fontWeight: 600,
              sx: { lineHeight: 1.3 },
            }}
            subheader={
              <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                {record.Party.split(',').map((party, idx) => (
                  <Chip
                    key={idx}
                    label={party.trim()}
                    size="small"
                    color={getPartyColor(party.trim(), theme)}
                    variant="filled"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                ))}
                <Typography variant="caption" color="text.secondary">
                  • {record.Category}
                </Typography>
              </Box>
            }
            action={
              <IconButton
                onClick={() => toggleCardExpansion(record.Commitment)}
                aria-expanded={expandedCards.has(record.Commitment)}
                aria-label="show more"
                size="small"
                sx={{ mt: 1 }}
              >
                {expandedCards.has(record.Commitment) ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
            sx={{ pb: 1, pt: 2 }}
          />

          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={getProgressValue(status)}
                color={status === 100 ? 'success' : status < 0 ? 'error' : 'info'}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.action.hover,
                  mb: 1,
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={`${status}%`}
                  color={getStatusColor(status)}
                  size="small"
                  sx={{ fontWeight: 600, minWidth: 60 }}
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <AccessTime fontSize="small" color="disabled" />
                  <Tooltip title={record.Updated}>
                    <Typography variant="caption" color="text.secondary">
                      {getRelativeTime(record.Updated)}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {record.Due && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color={overdue ? 'error' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Due: {record.Due}
                  {overdue && <Warning fontSize="inherit" />}
                </Typography>
              </Box>
            )}

            {record.Tags && record.Tags.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {record.Tags.map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        borderColor: theme.palette.divider,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Collapse in={expandedCards.has(record.Commitment)}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {record.References && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                      References:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {record.References}
                    </Typography>
                  </Box>
                )}
                {record.Notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                      Notes:
                    </Typography>
                    <Typography variant="body2">{record.Notes}</Typography>
                  </Box>
                )}
                {!record.References && !record.Notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No additional details available
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
    );
  });

  return (
    <Box sx={{ p: 2 }}>
      {activeFilter && (
        <Alert
          severity="info"
          action={
            <Chip
              label="Clear Filter"
              onDelete={onClearFilter}
              color="primary"
              variant="filled"
              size="small"
              onClick={onClearFilter}
            />
          }
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Showing {activeFilter} commitments only
        </Alert>
      )}

      <Paper
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
          position: 'sticky',
          top: 80,
          zIndex: 100,
          background: (theme) =>
            `rgba(${theme.palette.mode === 'light' ? '255, 255, 255' : '30, 30, 30'}, 0.95)`,
          backdropFilter: 'blur(10px)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        elevation={1}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList fontSize="small" />
              Filters
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search commitments..."
              inputRef={searchInputRef}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={orderBy}
                  label="Sort By"
                  onChange={handleSortChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Category">Category</MenuItem>
                  <MenuItem value="Party">Party</MenuItem>
                  <MenuItem value="Status">Status</MenuItem>
                  <MenuItem value="Updated">Updated</MenuItem>
                  <MenuItem value="Due">Due</MenuItem>
                </Select>
              </FormControl>

              <ToggleButtonGroup
                value={order}
                exclusive
                onChange={handleOrderToggle}
                size="small"
              >
                <ToggleButton value="asc" sx={{ borderRadius: '8px 0 0 8px !important' }}>
                  <ArrowUpward fontSize="small" />
                </ToggleButton>
                <ToggleButton value="desc" sx={{ borderRadius: '0 8px 8px 0 !important' }}>
                  <ArrowDownward fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>

              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => val && setViewMode(val)} size="small">
                  <ToggleButton value="grid">
                    <ViewModule fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                Categories
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {categories.map(category => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onClick={() => {
                      startTransition(() => {
                        if (selectedCategories.includes(category)) {
                          setSelectedCategories(prev => prev.filter(c => c !== category));
                        } else {
                          setSelectedCategories(prev => [...prev, category]);
                        }
                      });
                    }}
                    color={selectedCategories.includes(category) ? 'primary' : 'default'}
                    variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                    sx={{
                      height: 26,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                Parties
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {parties.map(party => (
                  <Chip
                    key={party}
                    label={party}
                    size="small"
                    onClick={() => {
                      startTransition(() => {
                        if (selectedParties.includes(party)) {
                          setSelectedParties(prev => prev.filter(p => p !== party));
                        } else {
                          setSelectedParties(prev => [...prev, party]);
                        }
                      });
                    }}
                    color={selectedParties.includes(party) ? 'primary' : getPartyColor(party, theme)}
                    variant={selectedParties.includes(party) ? 'filled' : 'outlined'}
                    sx={{
                      height: 26,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                Status
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {statuses.map(status => (
                  <Chip
                    key={status}
                    label={status}
                    size="small"
                    onClick={() => {
                      startTransition(() => {
                        if (selectedStatuses.includes(status)) {
                          setSelectedStatuses(prev => prev.filter(s => s !== status));
                        } else {
                          setSelectedStatuses(prev => [...prev, status]);
                        }
                      });
                    }}
                    color={
                      status === 'Delivered' ? 'success' :
                      status === 'Failed' ? 'error' :
                      status === 'In Progress' ? 'info' : 'default'
                    }
                    variant={selectedStatuses.includes(status) ? 'filled' : 'outlined'}
                    sx={{
                      height: 26,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {sortedData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No commitments match your filters
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setDebouncedSearch('');
              if (searchInputRef.current) {
                searchInputRef.current.value = '';
              }
              setSelectedCategories([]);
              setSelectedParties([]);
              setSelectedStatuses([]);
            }}
            sx={{ mt: 2 }}
          >
            Clear All Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedData.map((record, index) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'list' ? 12 : 6}
              md={viewMode === 'list' ? 12 : 6}
              lg={viewMode === 'list' ? 12 : 4}
              xl={viewMode === 'list' ? 12 : 3}
              key={`${record.Commitment}-${record.Party}-${record.Category}`}
            >
              <CardComponent record={record} />
            </Grid>
          ))}
        </Grid>
      )}

      {showScrollTop && (
        <Zoom in={showScrollTop}>
          <IconButton
            onClick={scrollToTop}
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
                transform: 'scale(1.1)',
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
