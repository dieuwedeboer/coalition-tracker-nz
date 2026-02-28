import React from 'react';
import { Typography, Container, Link, Box, Paper, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Container component="footer" maxWidth="lg" sx={{ mt: 6, pb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              About This Project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This tracker monitors progress on coalition government commitments between National, ACT, and NZ First. The goal is to provide transparency on government promises.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Data Source
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Data is sourced from coalition agreements and publicly available information.
            </Typography>
            <Link href="https://docs.google.com/spreadsheets/d/16vWjqH_ZR0d_Dav-aQRl2zvOs7fdybLP6-Yr8dTCC_g/edit" target="_blank" rel="noopener noreferrer" variant="body2">
              View Source Data
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Created By
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Project by Dieuwe de Boer
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link href="https://github.com/dieuwedeboer" target="_blank" rel="noopener noreferrer" variant="body2">
                GitHub
              </Link>
              <Link href="https://dieuwe.nz" target="_blank" rel="noopener noreferrer" variant="body2">
                Website
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Licensed under the GNU General Public License v3.0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Code hosted on <Link href="https://github.com/dieuwedeboer/coalition-tracker-nz" target="_blank" rel="noopener noreferrer">GitHub</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Footer;
