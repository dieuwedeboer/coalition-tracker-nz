import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { blueGrey } from '@mui/material/colors';

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

  const percent = (value) => ((value / total) * 100).toFixed();

  return (
    <Grid container width="100%" height={360}>
      <PieChart
        series={[
          {
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            innerRadius: 7,
            paddingAngle: 3,
            cornerRadius: 5,
            data: [
              {
                value: summary.notStarted,
                label: 'Not Started (' + percent(summary.notStarted) + '%)',
                color: blueGrey[600],
              },
              {
                value: summary.inProgress,
                label: 'In Progress (' + percent(summary.inProgress) + '%)',
                color: theme.palette.info.dark,
              },
              {
                value: summary.delivered,
                label: 'Delivered (' + percent(summary.delivered) + '%)',
                color: theme.palette.success.dark,
              },
              {
                value: summary.failed,
                label: 'Failed (' + percent(summary.failed) + '%)',
                color: theme.palette.error.dark,
              },
            ],
          },
        ]}
        margin={{ bottom: 60 }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
          },
        }}
      />
    </Grid>
  );
};

export default SummaryChart;
