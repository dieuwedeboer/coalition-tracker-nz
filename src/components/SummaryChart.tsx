import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts';

const SummaryChart = ({ data }) => {
  const theme = useTheme();

  const total = data.length;
  const summary = data.reduce((acc, curr) => {
    if (curr.Status === 100) acc.delivered += 1;
    else if (curr.Status > 0) acc.inProgress += 1;
    else if (curr.Status === 0) acc.notStarted += 1;
    else if (curr.Status < 0) acc.failed += 1;

    return acc;
  }, { notStarted: 0, delivered: 0, inProgress: 0, failed: 0 });

  return (
    <Grid container width="100%" height={300}>
      <BarChart
        xAxis={[
          {
            data: ['Summary'],
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: [summary.notStarted],
            label: (summary.notStarted / total * 100).toFixed() + '% Not Started',
          },
          {
            data: [summary.delivered],
            label: (summary.delivered / total * 100).toFixed() + '% Delivered',
            color: theme.palette.success.main
          },
          {
            data: [summary.inProgress],
            label: (summary.inProgress / total * 100).toFixed() + '% In Progress',
            color: theme.palette.warning.light
          },
          {
            data: [summary.failed],
            label: (summary.failed / total * 100).toFixed() + '% Failed',
            color: theme.palette.error.main
          }
        ]}
      />
    </Grid>
  );
};

export default SummaryChart;
