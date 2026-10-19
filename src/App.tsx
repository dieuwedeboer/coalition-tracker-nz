import React, { useEffect, useState, useMemo } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Fade,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  FadeProps,
  useMediaQuery,
} from '@mui/material';
import {
  AccessTime,
} from '@mui/icons-material';
import { format } from 'date-fns';
import ElectionRibbon from './components/ElectionRibbon';
import Header from './components/Header';
import SummaryChart, { DeliveryTimeline } from './components/SummaryChart';
import CommitmentsTable from './components/CommitmentsTable';
import { CategoryBreakdown, PartyBreakdown } from './components/DetailCharts';
import Footer from './components/Footer';
import { CommitmentRecord } from './types';
import { fetchCommitmentData } from './services/csvDataService';
import { parseDate } from './services/format';
import { DEFAULT_FILTERS, toggleValue, useFilterState } from './services/filterState';
import { StatusBucket } from './services/status';
import { createCustomTheme } from './theme';

const MODE_STORAGE_KEY = 'colour-mode';

const readStoredMode = (): 'light' | 'dark' | null => {
  try {
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const storeMode = (mode: 'light' | 'dark') => {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Storage can be unavailable in private windows; the toggle still works for this visit.
  }
};

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      gap: 2,
    }}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      Loading commitments...
    </Typography>
  </Box>
);

const PageTransition = (props: FadeProps) => (
  <Fade {...props} timeout={{ enter: 300, exit: 200 }} />
);

const App = () => {
  const [data, setData] = useState<CommitmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const [storedMode, setStoredMode] = useState(readStoredMode);
  const mode = storedMode ?? (prefersDark ? 'dark' : 'light');
  const [filters, updateFilters] = useFilterState();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCommitmentData();
        setData(data);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleMode = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    storeMode(next);
    setStoredMode(next);
  };

  const scrollToCommitments = () => {
    document.getElementById('commitments')?.scrollIntoView({ block: 'start' });
  };

  const selectAndShow = (changes: Parameters<typeof updateFilters>[0], adding: boolean) => {
    updateFilters(changes);
    if (adding) scrollToCommitments();
  };

  const clearFilters = () => {
    updateFilters({
      search: DEFAULT_FILTERS.search,
      statuses: DEFAULT_FILTERS.statuses,
      parties: DEFAULT_FILTERS.parties,
      categories: DEFAULT_FILTERS.categories,
      pastDue: DEFAULT_FILTERS.pastDue,
    });
  };

  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  const lastUpdated = useMemo(() => {
    if (data.length === 0) return null;
    const dates = data
      .map(item => parseDate(item.Updated))
      .filter((d): d is Date => d !== null);
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates.map(d => d.getTime())));
  }, [data]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ElectionRibbon />
        <Header mode={mode} onToggleTheme={toggleMode} />
        <LoadingSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ElectionRibbon />
      <Header mode={mode} onToggleTheme={toggleMode} />
      <PageTransition in>
        <Box
          component="main"
          sx={{
            minHeight: 'calc(100vh - 64px)',
            pt: { xs: 4, md: 6 },
            pb: 4,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  textAlign: 'center',
                  mb: 1,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NZ Coalition Government Commitment Tracker
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Tracking progress on promises from National, ACT, and NZ First
              </Typography>
            </Box>

            {lastUpdated && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mb: 3, mt: -2 }}
              >
                <AccessTime sx={{ fontSize: 16 }} aria-hidden="true" />
                Most recent progress recorded {format(lastUpdated, 'd MMMM yyyy')}
              </Typography>
            )}

            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12}>
                <SummaryChart
                  data={data}
                  selectedStatuses={filters.statuses}
                  onToggleStatus={(status: StatusBucket) => updateFilters({ statuses: toggleValue(filters.statuses, status) })}
                  onClearStatuses={() => updateFilters({ statuses: [] })}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <DeliveryTimeline data={data} />
                  <PartyBreakdown
                    data={data}
                    selected={filters.parties}
                    onSelect={(party) => selectAndShow({ parties: toggleValue(filters.parties, party) }, !filters.parties.includes(party))}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <CategoryBreakdown
                  data={data}
                  selected={filters.categories}
                  onSelect={(category) => selectAndShow({ categories: toggleValue(filters.categories, category) }, !filters.categories.includes(category))}
                />
              </Grid>
            </Grid>

            <CommitmentsTable
              data={data}
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </Container>
        </Box>
      </PageTransition>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
