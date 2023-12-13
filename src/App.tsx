import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography } from '@mui/material';
import SummaryChart from './components/SummaryChart';
import CommitmentsTable from './components/CommitmentsTable';
import { CommitmentRecord } from './types';
import { fetchCommitmentData } from './services/csvDataService';

const App = () => {
  const [data, setData] = useState<CommitmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Typography variant="h3" sx={{ m: '1rem', textAlign: 'center' }}>
          NZ Coalition Government Commitment Tracker 2024
        </Typography>
        <SummaryChart data={data} />
        <CommitmentsTable data={data} />
      </main>
    </ThemeProvider>
  );
};

export default App;
