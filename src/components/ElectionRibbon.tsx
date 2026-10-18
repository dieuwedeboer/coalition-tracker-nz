import React, { useEffect, useState } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { HowToVote } from '@mui/icons-material';

const ELECTION = new Date('2026-11-07T00:00:00+13:00');
const DAY = 86400000;

const countdownCopy = (now: Date) => {
  const ms = ELECTION.getTime() - now.getTime();
  if (ms <= -DAY) return <>Election was Saturday 7 November 2026</>;
  if (ms <= 0) return <><b>Election day</b> · Saturday 7 November</>;
  const days = Math.ceil(ms / DAY);
  const label = days === 1 ? 'day' : 'days';
  return <><b>{days} {label}</b> to Saturday 7 November</>;
};

const ElectionRibbon = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      component="aside"
      aria-label="2026 general election"
      sx={{
        backgroundColor: '#10243f',
        color: '#f4efe4',
        py: 1,
        fontSize: '0.85rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: 2,
            rowGap: 0.5,
          }}
        >
          <Typography
            component="span"
            role="timer"
            aria-live="off"
            sx={{
              fontSize: 'inherit',
              letterSpacing: '0.08em',
              '& b': { color: '#e8c547', fontWeight: 700, letterSpacing: '0.04em' },
            }}
          >
            {countdownCopy(now)}
          </Typography>
          <Link
            href="https://vote.coalitiontracker.nz"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: '#e8c547',
              fontWeight: 700,
              '&:focus-visible': { outline: '2px solid #e8c547', outlineOffset: 2 },
            }}
          >
            <HowToVote sx={{ fontSize: 18 }} aria-hidden="true" />
            Strategic voting guide
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default ElectionRibbon;
