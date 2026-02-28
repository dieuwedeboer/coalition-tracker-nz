import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Typography, Fade, Paper } from '@mui/material';
import { PieChart, BarChart, pieArcLabelClasses } from '@mui/x-charts';
import { blueGrey } from '@mui/material/colors';
import { CommitmentRecord } from '../types';

interface SummaryChartProps {
  data: CommitmentRecord[];
  onFilter?: (status: string | null) => void;
  activeFilter: string | null;
}

const SummaryChart = ({ data, onFilter, activeFilter }: SummaryChartProps) => {
  const theme = useTheme();

  const total = data.length;
  const summary = data.reduce((acc: any, curr: CommitmentRecord) => {
    const status = typeof curr.Status === 'boolean' ? 0 : curr.Status;
    if (status === 100) acc.delivered += 1;
    else if (status > 0 && status < 100) acc.inProgress += 1;
    else if (status === 0) acc.notStarted += 1;
    else if (status < 0) acc.failed += 1;

    return acc;
  }, { notStarted: 0, delivered: 0, inProgress: 0, failed: 0 });

  const percent = (value: number) => ((value / total) * 100).toFixed();

  const handleSegmentClick = (event: any, params: any) => {
    if (params.dataIndex !== undefined) {
      const segments = ['Not Started', 'In Progress', 'Delivered', 'Failed'];
      const segment = segments[params.dataIndex];
      if (activeFilter === segment) {
        onFilter?.(null);
      } else {
        onFilter?.(segment);
      }
    }
  };

  const chartData = [
    {
      value: summary.notStarted,
      label: 'Not Started',
      color: blueGrey[600],
      key: 'notStarted',
    },
    {
      value: summary.inProgress,
      label: 'In Progress',
      color: theme.palette.info.main,
      key: 'inProgress',
    },
    {
      value: summary.delivered,
      label: 'Delivered',
      color: theme.palette.success.main,
      key: 'delivered',
    },
    {
      value: summary.failed,
      label: 'Failed',
      color: theme.palette.error.main,
      key: 'failed',
    },
  ].filter(item => item.value > 0);

  const timelineData = useMemo(() => {
    const months: string[] = [];
    const delivered: number[] = [];
    
    for (let d = new Date(2023, 11, 1); d <= new Date(2026, 10, 1); d.setMonth(d.getMonth() + 1)) {
      months.push(d.toLocaleDateString('en-NZ', { month: 'short', year: '2-digit' }));
      delivered.push(0);
    }

    data.filter(item => {
      const status = typeof item.Status === 'boolean' ? 0 : item.Status;
      return status === 100 && item.Updated;
    }).forEach(item => {
      try {
        const [day, month, year] = item.Updated.split('/');
        const date = new Date(parseInt(year) + 2000, parseInt(month) - 1, parseInt(day));
        const monthKey = date.toLocaleDateString('en-NZ', { month: 'short', year: '2-digit' });
        const idx = months.indexOf(monthKey);
        if (idx >= 0) {
          delivered[idx]++;
        }
      } catch (e) {
        // Invalid date format, skip
      }
    });

    const cumulative: number[] = [];
    let sum = 0;
    delivered.forEach(count => {
      sum += count;
      cumulative.push(sum);
    });

    const dataset = months.map((month, i) => ({
      month,
      delivered: delivered[i],
      cumulative: cumulative[i],
    }));

    return { months, delivered, cumulative, dataset, maxCumulative: Math.max(...cumulative, 1) };
  }, [data]);

  const totalDisplay = total;
  const activeSegment = chartData.find(item => {
    if (activeFilter === 'Not Started' && item.key === 'notStarted') return true;
    if (activeFilter === 'In Progress' && item.key === 'inProgress') return true;
    if (activeFilter === 'Delivered' && item.key === 'delivered') return true;
    if (activeFilter === 'Failed' && item.key === 'failed') return true;
    return false;
  });

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          position: 'relative',
          mb: 3,
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', width: '100%', height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PieChart
                series={[
                  {
                    data: chartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 4,
                    cornerRadius: 8,
                  },
                ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: theme.palette.text.primary,
                  fontWeight: 'bold',
                  fontSize: 14,
                },
              }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  labelStyle: {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                  itemMarkWidth: 12,
                  itemMarkHeight: 12,
                  markGap: 8,
                },
              }}
              margin={{ bottom: 60, top: 20, left: 20, right: 20 }}
              onItemClick={handleSegmentClick}
            />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                height: 320,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Delivery Timeline
              </Typography>
              <Box sx={{ height: 260 }}>
                <BarChart
                  dataset={timelineData.dataset}
                  xAxis={[{ 
                    scaleType: 'band', 
                    dataKey: 'month',
                    tickLabelStyle: { angle: -45, textAnchor: 'end', dominantBaseline: 'hanging', fontSize: 10 },
                  }]}
                  yAxis={[{ min: 0, label: 'Commitments' }]}
                  series={[
                    { 
                      dataKey: 'delivered', 
                      label: 'Monthly',
                      color: theme.palette.primary.main,
                    },
                    { 
                      dataKey: 'cumulative', 
                      label: 'Cumulative',
                      color: theme.palette.success.main,
                    },
                  ]}
                  margin={{ top: 20, right: 20, left: 50, bottom: 80 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: 12 },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '25%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: 48,
              color: activeSegment ? activeSegment.color : theme.palette.primary.main,
              mb: 0.5,
            }}
          >
            {activeSegment ? activeSegment.value : totalDisplay}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {activeSegment ? activeSegment.label : 'Total'}
          </Typography>
        </Box>

        {activeFilter && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
              onClick={() => onFilter?.(null)}
            >
              Clear Filter ×
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default SummaryChart;
