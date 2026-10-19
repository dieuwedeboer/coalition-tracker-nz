import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, Button } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { CommitmentRecord } from '../types';
import { countBuckets, getStatusColours, getStatusValue, StatusBucket } from '../services/status';
import { parseDate } from '../services/format';
import { StackedStatusBar, StatusLegend } from './StatusBreakdown';

interface SummaryChartProps {
  data: CommitmentRecord[];
  selectedStatuses: StatusBucket[];
  onToggleStatus: (status: StatusBucket) => void;
  onClearStatuses: () => void;
}

export const panelSx = {
  p: { xs: 2, sm: 3 },
  borderRadius: 3,
  border: 1,
  borderColor: 'divider',
  height: '100%',
};

const SummaryChart = ({ data, selectedStatuses, onToggleStatus, onClearStatuses }: SummaryChartProps) => {
  const counts = useMemo(() => countBuckets(data), [data]);
  const total = data.length;
  const deliveredPercent = total ? Math.round((counts.delivered / total) * 100) : 0;
  const inProgress = counts.early + counts.advanced;

  return (
    <Paper component="section" aria-labelledby="summary-heading" sx={panelSx}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography id="summary-heading" variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          {counts.delivered} of {total} commitments delivered
          <Typography component="span" variant="h5" color="text.secondary" sx={{ fontWeight: 400 }}>
            {' '}({deliveredPercent}%)
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexBasis: '100%' }}>
          {inProgress} in progress, {counts['not-started']} not started, {counts.failed} failed.
          Select a status to filter the commitments below.
        </Typography>
      </Box>

      <StackedStatusBar
        counts={counts}
        height={28}
        label="All commitments by status"
        selected={selectedStatuses}
        onSegmentClick={onToggleStatus}
      />

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <StatusLegend counts={counts} selected={selectedStatuses} onToggle={onToggleStatus} />
        {selectedStatuses.length > 0 && (
          <Button size="small" onClick={onClearStatuses}>
            Show all statuses
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export const DeliveryTimeline = ({ data }: { data: CommitmentRecord[] }) => {
  const theme = useTheme();
  const colours = getStatusColours(theme.palette.mode);

  const timelineData = useMemo(() => {
    const months: Date[] = [];
    // Coalition formed 24 Nov 2023; include that month so day-one deliveries plot.
    for (let d = new Date(2023, 10, 1); d <= new Date(); d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
      months.push(d);
    }
    const monthly = months.map(() => 0);

    data.forEach(item => {
      if (getStatusValue(item.Status) !== 100) return;
      const date = parseDate(item.Updated);
      if (!date) return;
      const idx = months.findIndex(m => m.getFullYear() === date.getFullYear() && m.getMonth() === date.getMonth());
      if (idx >= 0) monthly[idx] += 1;
    });

    let sum = 0;
    const cumulative = monthly.map(count => (sum += count));
    const labels = months.map(m => m.toLocaleDateString('en-NZ', { month: 'short', year: '2-digit' }));

    return { labels, monthly, cumulative };
  }, [data]);

  const tickEvery = (value: string, index: number) => index % 3 === 0;

  return (
    <Paper component="section" aria-labelledby="timeline-heading" sx={panelSx}>
      <Typography id="timeline-heading" variant="h6" component="h2" sx={{ fontWeight: 600 }}>
        Delivery Timeline
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Commitments by the month they were delivered.
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Total delivered
      </Typography>
      <Box sx={{ height: 180 }}>
        <LineChart
          xAxis={[{ scaleType: 'point', data: timelineData.labels, tickLabelInterval: tickEvery }]}
          yAxis={[{ min: 0 }]}
          series={[{
            data: timelineData.cumulative,
            label: 'Total delivered',
            color: colours.delivered,
            area: true,
            showMark: false,
          }]}
          margin={{ top: 10, right: 16, left: 40, bottom: 24 }}
          slotProps={{ legend: { hidden: true } }}
          sx={{ '& .MuiAreaElement-root': { fillOpacity: 0.2 } }}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        Delivered each month
      </Typography>
      <Box sx={{ height: 140 }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: timelineData.labels, tickLabelInterval: tickEvery }]}
          yAxis={[{ min: 0, tickMinStep: 1 }]}
          series={[{
            data: timelineData.monthly,
            label: 'Delivered that month',
            color: colours.delivered,
          }]}
          margin={{ top: 10, right: 16, left: 40, bottom: 24 }}
          slotProps={{ legend: { hidden: true } }}
        />
      </Box>
    </Paper>
  );
};

export default SummaryChart;
