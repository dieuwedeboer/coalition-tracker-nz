import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Typography, Card, CardContent, Paper, Fade } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { CommitmentRecord } from '../types';

interface DetailChartsProps {
  data: CommitmentRecord[];
}

const DetailCharts = ({ data }: DetailChartsProps) => {
  const theme = useTheme();

  const partyData = useMemo(() => {
    const partyStats: Record<string, { delivered: number; inProgress: number; notStarted: number; failed: number }> = {
      'National': { delivered: 0, inProgress: 0, notStarted: 0, failed: 0 },
      'ACT': { delivered: 0, inProgress: 0, notStarted: 0, failed: 0 },
      'NZ First': { delivered: 0, inProgress: 0, notStarted: 0, failed: 0 },
    };

    const allParties = ['National', 'ACT', 'NZ First'];

    data.forEach(item => {
      const status = typeof item.Status === 'boolean' ? 0 : item.Status;
      const parties = item.Party.split(',').map(p => p.trim());

      allParties.forEach(party => {
        if (parties.includes(party)) {
          if (status === 100) partyStats[party].delivered += 1;
          else if (status > 0 && status < 100) partyStats[party].inProgress += 1;
          else if (status === 0) partyStats[party].notStarted += 1;
          else if (status < 0) partyStats[party].failed += 1;
        }
      });
    });

    return allParties.map(party => ({
      party,
      ...partyStats[party],
      total: partyStats[party].delivered + partyStats[party].inProgress + partyStats[party].notStarted + partyStats[party].failed,
    }));
  }, [data]);

  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};

    data.forEach(item => {
      categoryCount[item.Category] = (categoryCount[item.Category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const timelineData = useMemo(() => {
    const today = new Date();

    return data
      .filter(item => {
        if (!item.Due) return false;
        const dueDate = new Date(item.Due.split('/').reverse().join('/'));
        return dueDate >= today;
      })
      .map(item => ({
        commitment: item.Commitment,
        due: item.Due,
        status: typeof item.Status === 'boolean' ? 0 : item.Status,
        category: item.Category,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.due.split('/').reverse().join('/'));
        const dateB = new Date(b.due.split('/').reverse().join('/'));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 8);
  }, [data]);

  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Party Progress Breakdown
            </Typography>
            <Box sx={{ height: 300 }}>
              <BarChart
                dataset={partyData}
                xAxis={[{ scaleType: 'band', dataKey: 'party', label: 'Party' }]}
                yAxis={[{ min: 0, label: 'Commitments' }]}
                series={[
                  { dataKey: 'delivered', label: 'Delivered', color: theme.palette.success.main },
                  { dataKey: 'inProgress', label: 'In Progress', color: theme.palette.info.main },
                  { dataKey: 'notStarted', label: 'Not Started', color: theme.palette.grey[600] },
                  { dataKey: 'failed', label: 'Failed', color: theme.palette.error.main },
                ]}
                margin={{ top: 20, right: 20, left: 50, bottom: 60 }}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Top Categories
            </Typography>
            <Box sx={{ height: 300 }}>
              <BarChart
                dataset={categoryData}
                xAxis={[{ scaleType: 'band', dataKey: 'category', label: 'Category', tickLabelStyle: { angle: -45, textAnchor: 'end', dominantBaseline: 'hanging' } }]}
                yAxis={[{ min: 0, label: 'Count' }]}
                series={[{ dataKey: 'count', label: 'Count', color: theme.palette.primary.main }]}
                margin={{ top: 20, right: 20, left: 50, bottom: 100 }}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {timelineData.length > 0 && (
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Upcoming Due Dates
          </Typography>
          <Grid container spacing={2}>
            {timelineData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    borderLeft: `4px solid ${
                      item.status === 100 ? theme.palette.success.main :
                      item.status < 0 ? theme.palette.error.main :
                      theme.palette.info.main
                    }`,
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Due: {item.due}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.commitment.substring(0, 80)}
                      {item.commitment.length > 80 && '...'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.category}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      </Box>
    </Fade>
  );
};

export default DetailCharts;
