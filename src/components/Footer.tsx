import React from 'react';
import { Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Container component="footer" maxWidth="lg" sx={{ mt: 4, py: 2, textAlign: 'center' }}>
      <Typography variant="body1">
        Project created by Dieuwe de Boer and licensed under the GNU General Public License v3.0.
      </Typography>
      <Typography variant="body1">
        Code hosted on <Link href="https://github.com/dieuwedeboer/coalition-tracker-nz" target="_blank" rel="noopener noreferrer">GitHub</Link>.
      </Typography>
    </Container>
  );
};

export default Footer;
