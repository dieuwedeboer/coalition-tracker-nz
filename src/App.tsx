import React, { useEffect, useState, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Fade,
  CircularProgress,
  Typography,
  FadeProps,
  Chip,
} from '@mui/material';
import {
  AccessTime,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Header from './components/Header';
import SummaryChart from './components/SummaryChart';
import CommitmentsTable from './components/CommitmentsTable';
import DetailCharts from './components/DetailCharts';
import Footer from './components/Footer';
import { CommitmentRecord } from './types';
import { fetchCommitmentData } from './services/csvDataService';
import { createCustomTheme } from './theme';

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
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
  };

  const theme = createCustomTheme(mode);

  const lastUpdated = useMemo(() => {
    if (data.length === 0) return null;
    const dates = data
      .map(item => {
        try {
          return new Date(item.Updated.split('/').reverse().join('/'));
        } catch {
          return null;
        }
      })
      .filter((d): d is Date => d !== null && !isNaN(d.getTime()));
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates.map(d => d.getTime())));
  }, [data]);

  const filteredData = activeFilter
    ? data.filter((item) => {
        const status = typeof item.Status === 'boolean' ? 0 : item.Status;
        if (activeFilter === 'Not Started' && status === 0) return true;
        if (activeFilter === 'In Progress' && status > 0 && status < 100) return true;
        if (activeFilter === 'Delivered' && status === 100) return true;
        if (activeFilter === 'Failed' && status < 0) return true;
        return false;
      })
    : data;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header mode={mode} onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')} />
        <LoadingSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')} />
      <PageTransition in>
        <Box
          component="main"
          sx={{
            minHeight: 'calc(100vh - 64px)',
            pt: 8,
            pb: 4,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  textAlign: 'center',
                  mb: 1,
                  fontWeight: 700,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NZ Coalition Government Commitment Tracker 2024
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Tracking progress on promises from National, ACT, and NZ First
              </Typography>
            </Box>

            <SummaryChart
              data={data}
              onFilter={handleFilterChange}
              activeFilter={activeFilter}
            />

            {lastUpdated && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Chip
                  icon={<AccessTime sx={{ fontSize: 16 }} />}
                  label={`Data last updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            )}

            <DetailCharts data={data} />

            <CommitmentsTable
              data={filteredData}
              activeFilter={activeFilter}
              onClearFilter={() => setActiveFilter(null)}
            />
          </Container>
        </Box>
      </PageTransition>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
